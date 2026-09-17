import { describe, expect, it } from "vitest";
import { compareInvoices, investigateNorthstar } from "./billing";

describe("Northstar invoice investigation", () => {
  it("reconciles the September variance to evidence-backed drivers", () => {
    const result = investigateNorthstar("Why is September higher?");

    expect(result.priorInvoiceCents).toBe(124_000);
    expect(result.currentInvoiceCents).toBe(175_000);
    expect(result.changeCents).toBe(51_000);
    expect(result.evidence.at(0)?.id).toBe("inv-aug-1042");
    expect(result.evidence.at(-1)?.id).toBe("inv-sep-1091");
    expect(result.evidence.some((item) => item.label === "Workers usage overage")).toBe(true);
  });

  it("rejects an invoice selected from another account", () => {
    expect(() => compareInvoices("northstar", "inv-aug-1042", "inv-sep-2144", "Compare invoices")).toThrow(
      "Invoices must belong to the selected account"
    );
  });
});
