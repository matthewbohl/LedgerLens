# AI prompt history

This file records material prompts and AI-assisted decisions used to build LedgerLens, as requested by the application assignment. It will be updated throughout implementation; secrets, access tokens, and personally identifying data must never be added.

## 2026-09-17 — Initial assignment prompt

**User prompt (verbatim)**

> As part of the application process for [https://job-boards.greenhouse.io/cloudflare/jobs/8152825](https://job-boards.greenhouse.io/cloudflare/jobs/8152825) there is an optional assignment to build an AI powered application on Cloudflare. The assignment lists heuristics but does not list requirements. From the application:
>
> We plan to fast track candidates who complete an assignment to build a type of [AI-powered application](https://agents.cloudflare.com/) on Cloudflare. An AI-powered application should include the following components:
>
> - LLM (recommend using Llama 3.3 on Workers AI), or an external LLM of your choice
> - Workflow / coordination (recommend using Workflows, Workers or Durable Objects)
> - User input via chat or voice (recommend using Pages or Realtime)
> - Memory or state
>
> Find additional documentation [here](https://developers.cloudflare.com/agents/).
>
> *Note: AI-assisted coding is encouraged, but you have to submit prompt history.*
>
> Step one should be identifying a project that is interesting - useful but not trivial or too complicated. Step two should be to structure the workspace, identifying appropriate agents (this is the planning agent, we'll also want a coding agent that, a validation agent and we'll also want a set of skills that will focus on specific implementation pieces or technologies. Step three will be to validate the proposed solution meets the success criteria, step 4 implement and test, and step 5 submit with the resume. Lets keep a track of the steps and progress, and make sure we're always aware of where we are at, and get started with step one. The external LLM will be ChatGPT, we can create a project and generate access via a API key.

**AI response/action summary**

> Reviewed the role posting and Cloudflare/OpenAI documentation, then proposed LedgerLens as a possible project without first receiving approval. The proposal is not adopted; project selection is returned to pending.

## 2026-09-17 — Correction to decision process

**User prompt (verbatim)**

> ok, lets fix a few things first. The prompt history is great, but its a summary - I'd prefer it be a copy of the prompt. Second, while the suggested project is interesting, it's not very exciting, and for future prompts, you shouldn't make any assumptions, you should always ask for clarification or approval for any significant decisions. Since this decision is the entire basis of the project, its is significant. Implementation details may or may not be significant.. once again, if in doubt, ask.

**AI response/action summary**

> Replaced the summary with the complete original prompt, marked project selection as pending, and adopted the requested approval-first decision rule for significant or uncertain choices.

## 2026-09-17 — Support-agent proposal augmentation

**User prompt (verbatim)**

> Ok, the proposed LedgerLens is interesting as it should make it easier for customers to understand differences in their bills, but it would also be a natural extension of this solution to explain the same details to customer service agents (agents being human or otherwise) in a natural language way. Let's augment the proposal to focus primarily on how a tool like this could help support agents and in what ways we could include it in a text or voice chat, or any other rich interaction with the system.

**AI response/action summary**

> Reframed LedgerLens as a support-agent copilot. Documented the human-in-the-loop support workflow and compared text chat, voice-assisted support, a guided evidence/timeline canvas, and customer handoff. Recommended—but did not select—the text copilot plus guided evidence/timeline as the core, with voice as a later optional differentiator.

## 2026-09-17 — Chat-first scope and Cloudflare skill

**User prompt (verbatim)**

> Lets focus on chat based first, if we can get that working, speech to text is a logical and straightforward next steps. As we start expanding to coding agents, make sure the same rules apply - don't make assumptions, ask me for clarification if needed. We should also have a cloudflare skill which should be used to provide guildelines for integrations with the cloudflare systems as well as give me readable instructions on what configuration steps I should take, including account creation, token generation, etc.

**AI response/action summary**

> Marked LedgerLens Support Copilot and its chat-first scope as approved. Deferred speech-to-text. Began creation of a Cloudflare integration skill; its installation location requires the user's approval because it determines whether the skill is reusable across all future tasks or is limited to this repository.

## 2026-09-17 — Project-local skill and repository remote

**User prompt (verbatim)**

> Lets keep everything for this project self-contained. I will manually retrieve it if needed. Also, lets get the repository up and running. I've created the private repo [https://github.com/matthewbohl/LedgerLens](https://github.com/matthewbohl/LedgerLens) (we'll make it public later). Please start persisting and tracking files there. Remind me if we ever get 5 commits ahead of a push, and since I'm the only developer, sync/pull regularly but not too frequently.

**AI response/action summary**

> Created a repository-local Cloudflare integration skill and human-readable account/token/secret/deployment guide. Added repository instructions requiring approval for consequential decisions and Cloudflare changes, a low-frequency sync approach, and notice at five commits ahead. Repository remote setup and initial synchronization are in progress.

## 2026-09-17 — GitHub SSH authentication

**User prompt (verbatim)**

> Use the command line git and my existing .ssh identity.

**AI response/action summary**

> Changed the GitHub remote to its SSH URL, fetched it with the existing SSH identity, pushed the initial project commit, and set `main` to track `origin/main`.

## 2026-09-17 — Consolidated environment prerequisites

**User prompt (verbatim)**

> node LTS (24) is installed now. Are there any other dependencies that must be met that I can take care of? I don't want to go back and forth one step at a time.

**AI response/action summary**

> Checked the local environment and Cloudflare/OpenAI prerequisites. Found Node 24 installed through Homebrew but not in the shell PATH because the versioned formula is keg-only. Added a consolidated prerequisite section to the Cloudflare setup guide and will provide the remaining one-time account, authentication, and API-key checklist.

## 2026-09-17 — Cloudflare and OpenAI development access

**User prompt (verbatim)**

> ok, I fixed the environment issue, I used npx wrangler login for my matthewbohl\@gmail.com cloudflare account. The OpenAI API key is also available in .dev.vars.

**AI response/action summary**

> Began local readiness verification without displaying secrets. Node 24 is installed but must be explicitly included in non-interactive command PATHs. Found `.dev.vars` present with a single key named `OPEN_API_KEY`; added a Git ignore rule before scaffolding so the local secret cannot be committed. The application configuration must either standardize the local key name to `OPENAI_API_KEY` or explicitly use `OPEN_API_KEY`; this has not yet been chosen.

## 2026-09-17 — Initial application scaffold approval

**User prompt (verbatim)**

> Yes for both.

**AI response/action summary**

> Standardized the ignored local secret binding to `OPENAI_API_KEY` without reading its value. Reviewed Cloudflare's current Agents starter and generated it only in an isolated temporary directory for inspection. Chose not to copy its unrelated Workers AI demo features into LedgerLens; the approved implementation will use a focused React/TypeScript chat UI, Agent-backed SQLite state, a Workflow, and the external OpenAI API. No Cloudflare resource was created or deployed.

## 2026-09-17 — Worker and model choice

**User prompt (verbatim)**

> 1 yes, 2, we'll use GPT-5.6 Luna

**AI response/action summary**

> Confirmed `ledgerlens` as the Worker name and `gpt-5.6-luna` as the API model identifier through official OpenAI documentation. Created the initial local React/TypeScript scaffold with a Cloudflare AIChatAgent using SQLite-backed Durable Object state, a Workflow for invoice-variance investigation, fictional Northstar Analytics evidence, and server-side-only OpenAI calls. Installed dependencies, generated Wrangler binding types, and passed the TypeScript check and production build. No OpenAI request, Cloudflare resource creation, or deployment occurred.

## 2026-09-17 — Local end-to-end validation approval

**User prompt (verbatim)**

> ok, lets move forward

**AI response/action summary**

> Proceeding with one local end-to-end investigation against the configured OpenAI API key. This will validate the chat-first prototype without deploying or changing Cloudflare account resources.

**Validation outcome**

> The OpenAI Responses request completed successfully with GPT-5.6 Luna and `store: false`. Validation found that the raw response provides text in `output[].content[]`; the Workflow parser was corrected accordingly. TypeScript validation and the production build passed afterward. Browser access to the isolated local Worker process could not be exercised from this environment, and no Cloudflare deployment occurred.
