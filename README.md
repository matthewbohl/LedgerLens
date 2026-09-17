# LedgerLens Support Copilot

LedgerLens is a fictional, human-in-the-loop billing investigation demo for support agents. An agent signs in with demo credentials, selects a customer account, selects two invoices within that account, and asks for an explanation. The application calculates the variance from read-only fixture data, displays the supporting evidence, and produces a customer-ready draft that requires human review.

This is an application-process demonstration, not a production billing system. It contains no real customer data, payment capability, or real authentication.

## Demo flow

1. Sign in with `demo@ledgerlens.local` / `ledgerlens-demo`.
2. Select Northstar Analytics, Harbor Media, or Sundial Commerce.
3. Choose any two invoices for that account. Controls cannot select invoices from another account.
4. Ask LedgerLens to explain the difference.
5. Review the evidence-backed result and rendered Markdown customer draft; copy the draft only after human review.

Each account uses a distinct Agent/Durable Object identity, so its chat history, investigation state, and drafts remain separate from other accounts.

## Technologies

- **React + Vite** — browser support-agent workspace, demo sign-in, account drill-down, invoice selectors, rendered Markdown, and copy control.
- **OpenAI Responses API / GPT-5.6 Luna** — server-side drafting only. The browser never receives `OPENAI_API_KEY`.
- **Cloudflare Workers** — serves the application and executes the server-side OpenAI integration.
- **Cloudflare Agents SDK and `AIChatAgent`** — provides WebSocket chat, persisted message history, state synchronization, and per-account real-time sessions.
- **Cloudflare Durable Objects (SQLite-backed)** — the persistence layer behind each account-scoped Agent session. It retains messages, investigation state, and the completed draft across reloads.
- **Cloudflare Workflows** — runs the durable, multi-step investigation: retrieve scoped fixture evidence, calculate reconciliation data, draft the customer explanation, and write the result back to the Agent.
- **Workers secrets** — stores `OPENAI_API_KEY` as an encrypted Worker secret in deployed environments; `.dev.vars` is used only for ignored local development configuration.
- **Vitest + Playwright** — deterministic reconciliation tests plus a public-browser requirements test.

The fixtures use plausible Cloudflare consumption concepts such as Workers requests/CPU, R2 storage and operations, Stream video storage/delivery, Argo Smart Routing, Images, Bot Management, and Rate Limiting. Fixture amounts are invented and are not Cloudflare price quotes.

## Local development

```sh
npm install
npm run dev
npm test
```

For a deployed browser check, run `npm run test:live`. It targets `https://ledgerlens.matthewbohl.workers.dev` by default; set `LEDGERLENS_LIVE_URL` to target another deployment.

## Deployment

1. Authenticate with Wrangler.
2. Configure `OPENAI_API_KEY` as a Worker secret (`npx wrangler secret put OPENAI_API_KEY`).
3. Run `npm run deploy`.

See [skills/cloudflare-integration/references/account-and-deploy-setup.md](skills/cloudflare-integration/references/account-and-deploy-setup.md) for the project-specific setup and security guide.
