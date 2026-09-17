# Cloudflare setup and deployment guide

This is a user-facing checklist for LedgerLens. Complete only the steps you choose to authorize. Share neither Cloudflare nor OpenAI secrets in chat or in this repository.

## 1. Create or select a Cloudflare account

1. Sign in to [Cloudflare](https://dash.cloudflare.com/sign-up) or create an account.
2. Select the account that should own LedgerLens. Record its account name locally; do not put its account ID into this repository unless the project needs a non-secret identifier in configuration.
3. Confirm that the account can use Workers, Durable Objects, and Workflows. Durable Objects are available on Free and Paid plans; confirm current product limits before a production-like deployment.

## 2. Create a least-privilege deployment token

Create this only when we are ready to deploy or use Wrangler against your account.

1. In the Cloudflare dashboard, open **Manage Account → API Tokens** for an account-owned token, or **My Profile → API Tokens** for a user token.
2. Choose **Create Token** and give it a specific name, such as `LedgerLens local deploy`.
3. Grant only the product permissions that the approved deployment needs. A first deploy that creates a Worker requires a Workers product-level Admin role; later deployments can be narrowed to the LedgerLens Worker where Cloudflare supports it. Add permissions for Durable Objects or Workflows only if Wrangler reports they are required for the approved configuration.
4. Scope the token to the LedgerLens Cloudflare account. Set a TTL and IP restriction if compatible with your workflow.
5. Create the token and store it in your password manager. Cloudflare displays the token secret only once.

For details, use Cloudflare's [token creation guide](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) and [Workers roles and permissions](https://developers.cloudflare.com/workers/authorization/workers/). Do not use the powerful “Create additional tokens” permission for ordinary deployment.

## 3. Authenticate the local project

Choose one approach after approval:

- **Interactive local development:** `npx wrangler login` opens a browser-based OAuth flow.
- **Scoped automation/local token:** Set `CLOUDFLARE_API_TOKEN` in your shell session or secret manager; never add it to a `.env` file that Git could track.

We will verify identity and account selection before a deploy. The current [Workers authorization documentation](https://developers.cloudflare.com/workers/authorization/) explains the distinction between members and API tokens.

## 4. Configure OpenAI safely

1. Create/select an OpenAI API project in the OpenAI dashboard and generate an API key there.
2. Keep the key in a local `.dev.vars` file for local Worker development, with `OPENAI_API_KEY="..."`; ensure `.dev.vars` is ignored by Git.
3. Before a Cloudflare deployment, set the same name as a Worker secret using `npx wrangler secret put OPENAI_API_KEY`. This action changes the deployed Worker and may create a deployment version, so do it only with approval.
4. Never call OpenAI directly from the browser. The Worker makes the server-side request.

Cloudflare documents that `.dev.vars`/`.env` must not be committed and that secrets are encrypted bindings rather than ordinary `vars`: [Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/).

## 5. First deployment checklist

Only after local tests pass and you approve the production action:

1. Confirm the Worker name and Cloudflare account.
2. Confirm `OPENAI_API_KEY` is present as a deployed Worker secret.
3. Review Durable Object exports/bindings and Workflow binding/class names in `wrangler.jsonc`. New Durable Objects should use the SQLite backend.
4. Run generated type checks and the project test suite.
5. Run `npx wrangler deploy`.
6. Exercise the deployed chat using fictional data only and inspect Workflow status/logs.

Authoritative implementation references: [Durable Objects setup](https://developers.cloudflare.com/durable-objects/get-started/), [Durable Object SQLite exports](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/), and [Workflows setup](https://developers.cloudflare.com/workflows/get-started/guide/).

## 6. What I need from you before a deployment

- Explicit approval to deploy.
- The intended Cloudflare account and Worker name.
- Confirmation that the OpenAI key has been created, without sharing its value.
- Any desired budget, plan, custom-domain, or access-control constraints.
