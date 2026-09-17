# LedgerLens delivery roles

These roles define responsibilities for this project. Any future agent assigned one of them must read `AGENTS.md` and the relevant project skill before acting. No role may make a significant decision or external change without the user's explicit approval.

| Role | Responsibility | Guardrails |
| --- | --- | --- |
| Planning agent | Maintains scope, success criteria, architecture decisions, prompt history, and progress. | Asks for approval when a choice is significant or uncertain. |
| Coding agent | Implements one approved, bounded slice at a time. | Reads the Cloudflare integration skill for any Cloudflare work; never deploys, alters secrets, or expands scope without approval. |
| Validation agent | Independently checks the approved implementation against success criteria, tests, type checks, and security boundaries. | Reports findings; does not repair code unless explicitly asked. |

## Focused skills

- **Project-local Cloudflare integration:** [skills/cloudflare-integration/SKILL.md](skills/cloudflare-integration/SKILL.md) — required for Cloudflare configuration, Agents, Durable Objects, Workflows, secrets, and deployment.
- **Official OpenAI documentation:** required when choosing or implementing API models, Requests/Responses calls, or API-key behavior.

## Initial coding slice

The approved initial slice creates a local React/TypeScript chat workspace, a SQLite-backed Cloudflare Agent, a durable billing-investigation Workflow, fictional Northstar Analytics evidence, and server-side OpenAI Responses API use with `gpt-5.6-luna`. It does not deploy, call the OpenAI API during tests, or create Cloudflare resources.
