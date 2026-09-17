import { expect, test } from "@playwright/test";

const supportQuestion =
  "Why is the September invoice higher than August? Draft a reply I can send.";

test("live support investigation meets functional and timing requirements", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page.getByRole("heading", { name: "LedgerLens" })).toBeVisible();

  await page.getByLabel("Billing question").fill(supportQuestion);
  const submittedAt = performance.now();
  await page.getByRole("button", { name: "Investigate" }).click();

  await expect(page.getByText("Finding account-scoped evidence…")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence-backed result" })).toBeVisible({
    timeout: 10_000
  });
  expect(performance.now() - submittedAt).toBeLessThan(10_000);

  await expect(page.getByText("$1,750.00 vs. $1,240.00", { exact: true })).toBeVisible();
  await expect(page.getByText("Difference:").locator("..")).toContainText("$510.00");

  for (const evidenceId of [
    "inv-aug-1042",
    "usage-sep-api-18",
    "credit-aug-77",
    "inv-sep-1091"
  ]) {
    await expect(page.getByText(evidenceId, { exact: true })).toBeVisible();
  }

  await expect(page.getByRole("heading", { name: "Customer-ready draft" })).toBeVisible();
  await expect(page.getByText("Human review required before sending.")).toBeVisible();
});
