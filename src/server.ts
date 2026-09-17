import { AIChatAgent, type OnChatMessageOptions } from "@cloudflare/ai-chat";
import { createOpenAI } from "@ai-sdk/openai";
import { AgentWorkflow, type AgentWorkflowEvent, type AgentWorkflowStep } from "agents/workflows";
import { routeAgentRequest } from "agents";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import { investigateNorthstar, money, type Investigation } from "./billing";

type InvestigationStatus = "idle" | "investigating" | "complete" | "failed";

export type LedgerLensState = {
  status: InvestigationStatus;
  investigation?: Investigation;
  customerDraft?: string;
  error?: string;
};

type InvestigationPayload = {
  accountName: "Northstar Analytics";
  question: string;
};

const systemPrompt = `You are LedgerLens, a billing investigation copilot for human support agents. You work only with fictional, read-only account data. Do not promise refunds, make changes, or claim evidence that is not in the investigation. For a question about an invoice difference, call investigateInvoiceVariance before answering. After an investigation is complete, explain computed facts in plain language, cite evidence IDs, label uncertainty, and offer a customer-ready draft that a human must review before sending.`;

export class LedgerLensAgent extends AIChatAgent<Env, LedgerLensState> {
  initialState: LedgerLensState = { status: "idle" };
  maxPersistedMessages = 50;
  chatRecovery = true;

  async onChatMessage(_onFinish: unknown, options?: OnChatMessageOptions) {
    const openai = createOpenAI({ apiKey: this.env.OPENAI_API_KEY });

    const result = streamText({
      model: openai("gpt-5.6-luna"),
      system: systemPrompt,
      messages: await convertToModelMessages(this.messages),
      tools: {
        investigateInvoiceVariance: tool({
          description:
            "Start a durable, read-only investigation of the Northstar Analytics invoice variance. Use for questions about invoice changes, usage, credits, or charge explanations.",
          inputSchema: z.object({
            question: z.string().min(1).describe("The support agent's billing question")
          }),
          execute: async ({ question }) => {
            await this.setState({ status: "investigating" });
            const instanceId = await this.runWorkflow("BILLING_INVESTIGATION", {
              accountName: "Northstar Analytics",
              question
            } satisfies InvestigationPayload);
            return {
              status: "started",
              instanceId,
              message: "The evidence-backed investigation is running."
            };
          }
        })
      },
      stopWhen: stepCountIs(4),
      abortSignal: options?.abortSignal
    });

    return result.toUIMessageStreamResponse();
  }

  async saveInvestigation(investigation: Investigation, customerDraft: string) {
    await this.setState({
      status: "complete",
      investigation,
      customerDraft
    });
  }

  async failInvestigation(message: string) {
    await this.setState({ status: "failed", error: message });
  }
}

export class BillingInvestigationWorkflow extends AgentWorkflow<
  LedgerLensAgent,
  InvestigationPayload
> {
  async run(
    event: AgentWorkflowEvent<InvestigationPayload>,
    step: AgentWorkflowStep
  ) {
    await step.updateAgentState({ status: "investigating" });

    const investigation = await step.do("retrieve-fixture-evidence", async () =>
      investigateNorthstar(event.payload.question)
    );

    await this.reportProgress({
      step: "evidence",
      status: "complete",
      percent: 0.45,
      message: "Retrieved account-scoped invoice, usage, and credit evidence."
    });

    const customerDraft = await step.do("draft-customer-explanation", async () => {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-5.6-luna",
          reasoning: { effort: "low" },
          max_output_tokens: 350,
          store: false,
          instructions:
            "Draft a short, empathetic customer-facing explanation. State only supplied facts, name the dollar difference, and end by inviting questions. Do not promise action or a refund.",
          input: JSON.stringify({
            question: investigation.question,
            priorInvoice: money(investigation.priorInvoiceCents),
            currentInvoice: money(investigation.currentInvoiceCents),
            change: money(investigation.changeCents),
            evidence: investigation.evidence
          })
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as {
        output?: Array<{
          type?: string;
          content?: Array<{ type?: string; text?: string }>;
        }>;
      };
      const customerDraft = payload.output
        ?.flatMap((item) => item.content ?? [])
        .find((item) => item.type === "output_text")?.text;
      if (!customerDraft) throw new Error("OpenAI returned no text output");
      return customerDraft;
    });

    await step.do("persist-investigation", async () => {
      await this.agent.saveInvestigation(investigation, customerDraft);
    });
    await step.mergeAgentState({ status: "complete", investigation, customerDraft });
    await step.reportComplete({ investigation, customerDraft });
    return { investigation, customerDraft };
  }
}

export default {
  async fetch(request: Request, env: Env) {
    return (await routeAgentRequest(request, env)) || new Response("Not found", { status: 404 });
  }
} satisfies ExportedHandler<Env>;
