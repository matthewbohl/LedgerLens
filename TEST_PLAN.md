# LedgerLens test suite

## Scope

The automated suite distinguishes deterministic fixture checks from a real browser run against the deployed Cloudflare Worker. The live run uses only the fictional Northstar Analytics account and deliberately creates a read-only investigation plus one model-generated customer draft.

Run the suite with:

```sh
npm test
npm run test:live
```

Set `LEDGERLENS_LIVE_URL` to test a different deployed environment. The default is the public LedgerLens Worker URL.

## Requirements and coverage

| ID | Requirement | Type | Automated coverage |
| --- | --- | --- | --- |
| FR-01 | A support agent can open the chat-first LedgerLens workspace. | Functional | Live browser test loads the public Worker and finds the LedgerLens heading. |
| FR-02 | A support agent can submit a billing-difference question. | Functional | Live browser test fills and submits the chat input, then observes the durable investigation state. |
| FR-03 | The result explains the difference between August and September invoices. | Functional | Fixture unit test reconciles the totals; live browser test asserts $1,750.00 vs. $1,240.00 and the $510.00 difference. |
| FR-04 | The result shows the exact invoice, usage, and credit evidence used. | Functional | Fixture unit test asserts the evidence set; live browser test asserts every evidence ID is visible. |
| FR-05 | A customer-ready draft is clearly subject to human review. | Functional | Live browser test requires both the draft heading and the review-boundary text. |
| NFR-01 | A completed evidence-backed result is displayed within 10 seconds of submission. | Non-functional | Live browser test measures from click to completed evidence heading and fails at 10 seconds. |
| NFR-02 | Reconciliation arithmetic is deterministic. | Non-functional | Vitest fixture test asserts the exact invoice totals, variance, and evidence identifiers without an LLM call. |

## Interpretation

The 10-second requirement measures user-visible completion of the current fictional demonstration. It is not a production SLO: real billing-system latency, model selection, account size, and retry policy must be measured separately before accepting production traffic.
