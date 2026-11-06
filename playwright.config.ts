import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure", ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) },
  projects: [
    { name: "mobile-360", use: { browserName: "chromium", viewport: { width: 360, height: 800 } } },
    { name: "mobile-390", use: { browserName: "chromium", viewport: { width: 390, height: 844 } } }
  ],
  webServer: { command: "npm run dev", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI, timeout: 120000 }
});
