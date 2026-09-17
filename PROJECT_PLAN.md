# LedgerLens — Billing Investigation Copilot

## Assignment progress

| Step | Status | Outcome |
| --- | --- | --- |
| 1. Choose a project | Complete | **LedgerLens Support Copilot**: a chat-first, human-in-the-loop billing investigation tool for support agents. |
| 2. Structure workspace and delivery team | In progress | Local Cloudflare/OpenAI access is ready. React + TypeScript, an Agent/SQLite Durable Object, and a Workflow are approved; define the delivery roles and confirm the Worker name/model before application files are created. |
| 3. Validate the design | Not started | Verify every assignment component and acceptance criterion. |
| 4. Implement and test | Not started | Build, test locally, deploy, and exercise the primary demo. |
| 5. Submit | Not started | Package the repository, demo URL, architecture notes, and prompt history with the application. |

> **Status:** The project and chat-first scope are approved. Voice input is a later enhancement, after the chat path works.

## Problem

Support agents need to answer questions such as *Why is my invoice higher than last month?* and *Which usage records explain this charge?* quickly, accurately, and in language a customer can understand. The information is fragmented across invoices, entitlements, usage, credits, and adjustments. A generic AI answer risks inventing a financial explanation; a manual reconciliation is slow and hard to audit.

## Proposed application

**LedgerLens Support Copilot** is an AI-assisted billing investigation workspace for support agents. A human agent selects a seeded customer account and asks a question or starts an investigation. The application produces:

1. a concise, evidence-backed explanation;
2. the invoice/usage/credit records used to reach it;
3. a customer-ready response draft, clearly distinct from the evidence and requiring the agent's review;
4. an explicit investigation trail and confidence/limitations; and
5. a durable progress view while an investigation runs.

The demo uses fictional billing data only. It does not initiate payments, change entitlements, or make accounting decisions.

## Why this is the right size

- **Relevant:** Maps directly to the role's focus on usage-based billing, reconciliation, auditability, observability, and customer transparency.
- **Non-trivial:** Requires structured tool use, provenance, durable state, retry-safe orchestration, and a live chat UI.
- **Bounded:** A curated local data set and read-only tools give a compelling end-to-end demo without third-party billing credentials or a full ledger product.

## Support-agent workflow

1. A customer reaches support through chat or voice and asks about an unexpected charge.
2. The support agent opens LedgerLens with the relevant account context and asks the copilot to investigate.
3. LedgerLens gathers only account-scoped, read-only evidence; it calculates the invoice difference before asking the LLM to explain it.
4. The copilot shows the source records and a plain-language explanation, then drafts an empathetic, customer-safe reply.
5. The human agent reviews, edits, and sends the reply through the existing support channel. LedgerLens records the investigation, not the external send.

This is intentionally **human-in-the-loop**: the application never autonomously contacts a customer or changes a financial record.

## Interaction options to evaluate before implementation

| Mode | What the support agent experiences | What it demonstrates | Scope/risk |
| --- | --- | --- | --- |
| Text copilot | A chat pane with account context, investigation progress, evidence cards, and an editable response draft. | Chat, streaming state, citations, durable workflow. | Lowest complexity; strongest core demo. |
| Voice-assisted support | The agent speaks the investigation request; transcription populates the same structured chat workflow. Results are shown as evidence cards and may be read aloud. | Voice input plus real-time interaction. | Requires audio/transcription design and higher testing effort. |
| Guided investigation canvas | A visual timeline compares billing periods; clicking a variance opens the supporting records and proposed customer wording. | Rich stateful UI and explainability. | Complements text; likely valuable but needs careful scope control. |
| AI-agent handoff | An existing support bot calls a narrowly scoped `investigate_invoice_variance` tool and receives the same evidence bundle plus a proposed response. | Interoperability and explicit tool contracts. | Requires clear authorization and input/output boundaries; should use the same core investigation, not a second system. |
| Customer co-browse handoff | A support agent can share a sanitized explanation view with a customer. | Role-aware views and collaborative state. | Significant authorization/privacy work; out of scope unless explicitly selected. |

**Approved scope:** build the text copilot first. Speech-to-text is a logical next enhancement only after the chat path works. The guided evidence/timeline and AI-agent handoff remain decisions for later scope review.

## Intended Cloudflare architecture

```text
Support-agent browser workspace (React + Pages/Worker)
        │ WebSocket / streaming updates
        ▼
LedgerLens Support Agent (Durable Object)
  - support conversation and investigation state
  - immutable audit timeline
  - tool policy and request validation
        │ starts / observes
        ▼
Investigation Workflow
  1. classify question
  2. retrieve scoped billing evidence
  3. reconcile totals / flag anomalies
  4. ask OpenAI Responses API for explanation
  5. persist cited result and update progress
        │
        ├── fixture ledger data (D1 or bundled seed data)
        └── OpenAI Responses API (secret held only in Workers)
```

The Agent supplies the real-time support chat and durable per-investigation state; the Workflow makes the multi-step investigation retryable and reports durable progress back to the Agent. This division matches Cloudflare's current guidance: Agents manage interactive communication/state, while Workflows provide durable multi-step work with retries.

## Explicit assignment mapping

| Requested component | LedgerLens implementation |
| --- | --- |
| LLM | OpenAI Responses API, called server-side from the Worker using an `OPENAI_API_KEY` Worker secret. |
| Workflow / coordination | Cloudflare Workflow runs the investigation steps; an Agent coordinates the chat session and UI updates. |
| User input | Browser-based support-agent text chat and investigation controls. Voice is an optional enhancement pending approval. |
| Memory / state | Durable Object state/SQLite holds the support session, job status, audit timeline, cited findings, and response draft. |

## Primary demo script

1. A support agent opens the seeded account **Northstar Analytics** after receiving a billing question.
2. They ask: “Why is the September invoice higher than August? Draft a reply I can send.”
3. Watch the durable investigation progress through evidence retrieval, calculation, and explanation.
4. Review the computed variance, exact records, customer-safe explanation, and editable response draft.
5. Refresh the browser: the investigation, evidence, and audit trail remain available.

## Definition of success

- The primary demo works locally and on a deployed Cloudflare URL.
- A support agent can arrive at a correct, evidence-backed, customer-readable response faster than by manually reviewing the fixture records.
- No browser client receives the OpenAI API key.
- Every response distinguishes computed facts from model-written prose and lists its evidence IDs.
- The UI makes the human-review boundary explicit; no customer communication or billing change happens automatically.
- Reloading preserves the active/completed investigation state.
- An automated test covers reconciliation arithmetic and an end-to-end happy path covers a chat investigation.
- The repository contains a concise architecture explanation, setup/deploy instructions, limitations, and complete AI prompt history.

## Deliberate non-goals

- Real payment processing, production customer data, authentication/authorization, tax calculation, or changing billing records.
- Voice input, multi-agent delegation, vector search, or a generic autonomous financial agent.

## Sources consulted

- The [job posting](https://job-boards.greenhouse.io/cloudflare/jobs/8152825) emphasizes billing correctness, auditability, reconciliation, observability, and customer billing transparency.
- Cloudflare's [Agents + Workflows guidance](https://developers.cloudflare.com/agents/concepts/workflows/) distinguishes real-time Agent interactions from durable, retryable Workflow steps and documents durable state updates back to the Agent.
- The official OpenAI [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create) documents server-side response creation, instructions, structured inputs/outputs, tools, and conversation linkage.
