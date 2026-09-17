# LedgerLens agent rules

## Decision authority

- Do not make a significant decision without the user's explicit approval. Significant decisions include project direction, product scope, architecture, data sources, third-party services, authentication, permissions, deployment targets, spending, and external writes.
- If whether a decision is significant is unclear, ask the user before proceeding.
- Treat implementation details as potentially significant when they affect the user experience, security, cost, deployment, or future extensibility.
- Record material user prompts verbatim in `PROMPT_HISTORY.md` and summarize the resulting action separately.

## Cloudflare work

- Before planning, changing, validating, or deploying Cloudflare integrations, read [skills/cloudflare-integration/SKILL.md](skills/cloudflare-integration/SKILL.md).
- Follow its approval boundary and read its configuration reference when account setup, API tokens, secrets, bindings, or deployment are involved.

## Git and remote coordination

- Work only in this repository and retain its history.
- Fetch at most once per active work session, and again immediately before a push or after a meaningful pause. Do not poll unnecessarily.
- Pull only when the working tree is clean and the user has authorized synchronization; otherwise report the remote state and ask before resolving divergence.
- After each commit, compare the current branch with its upstream when one exists. If it is five or more commits ahead, tell the user before continuing. If no upstream exists, establish one only after the remote has been confirmed and the user has authorized the first push.
