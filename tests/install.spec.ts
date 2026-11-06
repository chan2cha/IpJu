import { expect, test } from "@playwright/test";

test("manifest와 아이콘을 제공하고 설치 안내로 이동한다", async ({ page, request }) => {
  await page.goto("/dashboard");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({ display: "standalone", start_url: "/dashboard" });
  for (const name of ["icon-192", "icon-512", "apple-touch-icon"]) {
    const icon = await request.get(`/icons/${name}.png`);
    expect(icon.ok()).toBe(true);
    expect(icon.headers()["content-type"]).toContain("image/png");
  }
  await page.getByRole("link", { name: "홈 화면에 입주노트 설치하기" }).click();
  await expect(page.getByRole("heading", { name: "홈 화면에 앱 설치" })).toBeVisible();
  await expect(page.getByText("iPhone · iPad", { exact: true })).toBeVisible();
  await expect(page.getByText("Android", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("홈에서 받은 설치 이벤트를 보관하고 취소·실패·완료를 처리한다", async ({ page }) => {
  await page.goto("/dashboard");
  // hydration 이후 구독이 연결됐는지 실제 앱 라우팅으로 확인한다.
  await page.getByRole("link", { name: "홈 화면에 입주노트 설치하기" }).click();
  await expect(page.getByRole("heading", { name: "홈 화면에 앱 설치" })).toBeVisible();
  await page.getByRole("navigation").getByRole("link", { name: "홈", exact: true }).click();
  async function sendPrompt(outcome: "dismissed" | "accepted" | "error") {
    await page.evaluate(value => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      Object.assign(event, { prompt: async () => { if (value === "error") throw new Error("unavailable"); }, userChoice: Promise.resolve({ outcome: value }) });
      window.dispatchEvent(event);
    }, outcome);
  }
  await sendPrompt("dismissed");
  await page.getByRole("link", { name: "홈 화면에 입주노트 설치하기" }).click();
  await page.getByRole("button", { name: "입주노트 설치", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("설치를 취소했어요");
  await expect(page.getByRole("button", { name: "입주노트 설치", exact: true })).toHaveCount(0);
  await sendPrompt("error");
  await page.getByRole("button", { name: "입주노트 설치", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("설치 창을 열지 못했어요");
  await sendPrompt("accepted");
  await page.getByRole("button", { name: "입주노트 설치", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("설치 요청을 보냈어요");
  await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
  await expect(page.getByText("입주노트가 앱으로 실행 중이거나 설치되었어요.")).toBeVisible();
  await expect(page.getByRole("button", { name: "입주노트 설치", exact: true })).toHaveCount(0);
});

test("standalone에서는 설치 안내 대신 실행 상태를 표시한다", async ({ page }) => {
  await page.addInitScript(() => {
    const original = window.matchMedia.bind(window);
    window.matchMedia = query => query === "(display-mode: standalone)" ? { ...original(query), matches: true, addEventListener() {}, removeEventListener() {} } : original(query);
  });
  await page.goto("/settings");
  await expect(page.getByText("입주노트가 앱으로 실행 중이거나 설치되었어요.")).toBeVisible();
  await expect(page.getByRole("button", { name: "입주노트 설치", exact: true })).toHaveCount(0);
});
