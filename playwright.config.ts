import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.pw.ts",
  fullyParallel: false,
  timeout: 20_000,
  reporter: "list",
  use: {
    baseURL: process.env.LEDGERLENS_LIVE_URL ?? "https://ledgerlens.matthewbohl.workers.dev",
    headless: true,
    trace: "retain-on-failure"
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }]
});
