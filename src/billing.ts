export type BillingEvidence = { id: string; period: string; kind: "usage" | "credit" | "invoice"; label: string; amountCents: number; note: string };
export type Invoice = { id: string; period: string; totalCents: number; items: Array<{ label: string; amountCents: number; note: string }> };
export type Account = { id: string; name: string; industry: string; invoices: Invoice[] };
export type Investigation = { accountName: string; question: string; priorInvoiceCents: number; currentInvoiceCents: number; changeCents: number; evidence: BillingEvidence[] };
const invoice = (id: string, period: string, totalCents: number, items: Invoice["items"]): Invoice => ({ id, period, totalCents, items });

export const accounts: Account[] = [
  { id: "northstar", name: "Northstar Analytics", industry: "B2B analytics", invoices: [
    invoice("inv-aug-1042", "August 2026", 124000, [{ label: "Workers requests and CPU", amountCents: 64000, note: "Production API workload." }, { label: "R2 storage and operations", amountCents: 45000, note: "Object storage and reads." }, { label: "One-time launch credit", amountCents: -15000, note: "August-only promotional credit." }, { label: "Argo Smart Routing", amountCents: 30000, note: "Accelerated traffic." }]),
    invoice("inv-sep-1091", "September 2026", 175000, [{ label: "Workers requests and CPU", amountCents: 76000, note: "Higher API traffic." }, { label: "R2 storage and operations", amountCents: 48000, note: "More stored analytics exports." }, { label: "Workers usage overage", amountCents: 36000, note: "Usage increased after product launch." }, { label: "Argo Smart Routing", amountCents: 15000, note: "Accelerated traffic." }]),
    invoice("inv-oct-1128", "October 2026", 162000, [{ label: "Workers requests and CPU", amountCents: 81000, note: "Sustained API traffic." }, { label: "R2 storage and operations", amountCents: 51000, note: "Monthly storage and reads." }, { label: "Argo Smart Routing", amountCents: 30000, note: "Accelerated traffic." }]) ] },
  { id: "harbor", name: "Harbor Media", industry: "Video publisher", invoices: [
    invoice("inv-aug-2088", "August 2026", 218000, [{ label: "Stream video stored", amountCents: 58000, note: "Library storage." }, { label: "Stream video delivery", amountCents: 124000, note: "Viewer minutes delivered." }, { label: "Images transformations", amountCents: 36000, note: "Publishing image optimization." }]),
    invoice("inv-sep-2144", "September 2026", 296000, [{ label: "Stream video stored", amountCents: 62000, note: "Expanded catalogue." }, { label: "Stream video delivery", amountCents: 198000, note: "Live-event viewing spike." }, { label: "Images transformations", amountCents: 36000, note: "Publishing image optimization." }]),
    invoice("inv-oct-2210", "October 2026", 244000, [{ label: "Stream video stored", amountCents: 65000, note: "Catalogue storage." }, { label: "Stream video delivery", amountCents: 143000, note: "Post-event viewing." }, { label: "Images transformations", amountCents: 36000, note: "Publishing image optimization." }]) ] },
  { id: "sundial", name: "Sundial Commerce", industry: "Online retail", invoices: [
    invoice("inv-aug-3017", "August 2026", 184000, [{ label: "Workers requests and CPU", amountCents: 79000, note: "Storefront edge logic." }, { label: "R2 storage and operations", amountCents: 31000, note: "Product assets." }, { label: "Bot Management", amountCents: 74000, note: "Automated traffic protection." }]),
    invoice("inv-sep-3099", "September 2026", 231000, [{ label: "Workers requests and CPU", amountCents: 98000, note: "Seasonal storefront traffic." }, { label: "R2 storage and operations", amountCents: 34000, note: "Product assets." }, { label: "Bot Management", amountCents: 74000, note: "Automated traffic protection." }, { label: "Rate Limiting usage", amountCents: 25000, note: "Checkout protection during promotion." }]),
    invoice("inv-oct-3152", "October 2026", 207000, [{ label: "Workers requests and CPU", amountCents: 86000, note: "Storefront edge logic." }, { label: "R2 storage and operations", amountCents: 35000, note: "Product assets." }, { label: "Bot Management", amountCents: 74000, note: "Automated traffic protection." }, { label: "Rate Limiting usage", amountCents: 12000, note: "Checkout protection." }]) ] }
];

const addFiveInvoices = (accountId: string, prefix: string, totals: number[], labels: [string, string, string]) => {
  const account = accounts.find((item) => item.id === accountId)!;
  ["November 2026", "December 2026", "January 2027", "February 2027", "March 2027"].forEach((period, index) => {
    const total = totals[index]; const first = Math.round(total * 0.5); const second = Math.round(total * 0.3);
    account.invoices.push(invoice(`inv-${prefix}-${index + 1}`, period, total, [
      { label: labels[0], amountCents: first, note: `${period} metered service usage.` },
      { label: labels[1], amountCents: second, note: `${period} consumption and operations.` },
      { label: labels[2], amountCents: total - first - second, note: `${period} account service usage.` }
    ]));
  });
};
addFiveInvoices("northstar", "n", [168000, 181000, 176000, 194000, 188000], ["Workers requests and CPU", "R2 storage and operations", "Argo Smart Routing"]);
addFiveInvoices("harbor", "h", [258000, 322000, 281000, 304000, 337000], ["Stream video delivery", "Stream video stored", "Images transformations"]);
addFiveInvoices("sundial", "s", [226000, 289000, 241000, 276000, 318000], ["Workers requests and CPU", "R2 storage and operations", "Bot Management and Rate Limiting"]);
export function getAccount(id: string) { const account = accounts.find((item) => item.id === id); if (!account) throw new Error("Unknown fictional account"); return account; }
export function compareInvoices(accountId: string, priorId: string, currentId: string, question: string): Investigation {
  const account = getAccount(accountId); const prior = account.invoices.find((item) => item.id === priorId); const current = account.invoices.find((item) => item.id === currentId); if (!prior || !current) throw new Error("Invoices must belong to the selected account");
  const before = new Map(prior.items.map((item) => [item.label, item])); const after = new Map(current.items.map((item) => [item.label, item]));
  const changes = [...new Set([...before.keys(), ...after.keys()])].map((label) => { const a = before.get(label); const b = after.get(label); return { label, amountCents: (b?.amountCents ?? 0) - (a?.amountCents ?? 0), note: b?.note ?? a?.note ?? "Invoice line item." }; }).filter((item) => item.amountCents !== 0);
  return { accountName: account.name, question, priorInvoiceCents: prior.totalCents, currentInvoiceCents: current.totalCents, changeCents: current.totalCents - prior.totalCents, evidence: [{ id: prior.id, period: prior.period, kind: "invoice", label: `${prior.period} invoice total`, amountCents: prior.totalCents, note: "Selected baseline invoice." }, ...changes.map((item, index) => ({ id: `${current.id}-change-${index + 1}`, period: current.period, kind: item.amountCents < 0 ? "credit" as const : "usage" as const, ...item })), { id: current.id, period: current.period, kind: "invoice", label: `${current.period} invoice total`, amountCents: current.totalCents, note: "Selected comparison invoice." }] };
}
export function investigateNorthstar(question: string) { return compareInvoices("northstar", "inv-aug-1042", "inv-sep-1091", question); }
export function money(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100); }
