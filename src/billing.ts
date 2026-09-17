export type BillingEvidence = {
  id: string;
  period: string;
  kind: "usage" | "credit" | "invoice";
  label: string;
  amountCents: number;
  note: string;
};

export type Investigation = {
  accountName: string;
  question: string;
  priorInvoiceCents: number;
  currentInvoiceCents: number;
  changeCents: number;
  evidence: BillingEvidence[];
};

const northstarEvidence: BillingEvidence[] = [
  {
    id: "inv-aug-1042",
    period: "August 2026",
    kind: "invoice",
    label: "August invoice total",
    amountCents: 124000,
    note: "Baseline invoice for comparison."
  },
  {
    id: "usage-sep-api-18",
    period: "September 2026",
    kind: "usage",
    label: "API request overage",
    amountCents: 36000,
    note: "Usage increased after the Northstar Analytics product launch."
  },
  {
    id: "credit-aug-77",
    period: "August 2026",
    kind: "credit",
    label: "One-time launch credit",
    amountCents: -15000,
    note: "The launch credit applied in August did not recur."
  },
  {
    id: "inv-sep-1091",
    period: "September 2026",
    kind: "invoice",
    label: "September invoice total",
    amountCents: 175000,
    note: "September billed total."
  }
];

export function investigateNorthstar(question: string): Investigation {
  const priorInvoiceCents = 124000;
  const currentInvoiceCents = 175000;

  return {
    accountName: "Northstar Analytics",
    question,
    priorInvoiceCents,
    currentInvoiceCents,
    changeCents: currentInvoiceCents - priorInvoiceCents,
    evidence: northstarEvidence
  };
}

export function money(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}
