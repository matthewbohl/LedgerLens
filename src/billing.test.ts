import { describe, expect, it } from "vitest";
import { investigateNorthstar } from "./billing";

describe("Northstar invoice investigation", () => {
  it("reconciles the September variance to evidence-backed drivers", () => {
    const result = investigateNorthstar("Why is September higher?");

    expect(result.priorInvoiceCents).toBe(124_000);
    expect(result.currentInvoiceCents).toBe(175_000);
    expect(result.changeCents).toBe(51_000);
    expect(result.evidence.map((item) => item.id)).toEqual([
      "inv-aug-1042",
      "usage-sep-api-18",
      "credit-aug-77",
      "inv-sep-1091"
    ]);
  });
});
