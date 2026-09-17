---
name: cloudflare-integration
description: Plan, build, validate, and deploy Cloudflare Workers, Durable Objects, Workflows, and related bindings for LedgerLens; use when a task touches Cloudflare configuration or services.
---

# Cloudflare integration — LedgerLens

Use this project-local skill for Cloudflare work. It is not an authorization to create Cloudflare resources, deploy, change account settings, create tokens, or reveal/configure secrets.

## Approval boundary

Before an external Cloudflare action, confirm the user has explicitly approved the exact action and target. This includes login, token creation, resource provisioning, secret changes, deployments, custom domains, and deleting or migrating Durable Object state. If the correct integration or permission is uncertain, pause and ask.

Keep all credentials out of Git, source files, browser clients, screenshots, and prompt history. Use a Worker secret for `OPENAI_API_KEY`; do not use a Wrangler `vars` value for it.

## Architecture choices for this project

- Use a Worker for HTTP entry points and server-side calls to OpenAI.
- Use a SQLite-backed Durable Object for a support conversation, investigation status, and audit state. Keep billing data read-only and scoped to the selected fixture account.
- Use a Workflow only for the durable multi-step investigation. Make every externally visible state transition idempotent and report status back to the Durable Object.
- Keep the initial UI text-chat based. Voice, customer handoff, and autonomous support-bot integration require a separate scope decision.

## Before coding or changing configuration

1. Read [the setup guide](references/account-and-deploy-setup.md) for any account, token, secret, or deployment work.
2. Identify the smallest Cloudflare permission and resource scope that will support the approved action. Do not guess permission names; verify current official documentation.
3. State which configuration files and Cloudflare resources would change. Ask for approval if that was not already included in the request.
4. Prefer local validation before deployment. Do not run a production deploy merely to test code.

## Before deploy or resource lifecycle changes

- Review `wrangler.jsonc` for bindings, required secret names, Durable Object exports, and Workflow definitions.
- Generate bindings types and run the project's test/typecheck commands.
- Confirm the target Cloudflare account and Worker name with the user when not already unambiguous.
- Explain production impact and get explicit approval for the deploy.

## References

- For the user’s account and token actions, secrets, and initial deploy path, read [account-and-deploy-setup.md](references/account-and-deploy-setup.md).
- For framework-specific work, verify the current official Cloudflare documentation before implementing. Cloudflare configuration and permissions evolve.
