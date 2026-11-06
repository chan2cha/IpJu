import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import manifest from "../app/manifest";

describe("설치용 앱 메타데이터", () => {
  it("안정적인 앱 ID와 standalone 시작 경로를 제공한다", () => {
    expect(manifest()).toMatchObject({ id: "/", name: "우리집 입주노트", start_url: "/dashboard", scope: "/", display: "standalone", lang: "ko-KR" });
  });
  it("192/512 PNG 및 마스크 아이콘을 제공한다", () => {
    const icons = manifest().icons!;
    expect(icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ sizes: "192x192", type: "image/png", purpose: "any" }),
      expect.objectContaining({ sizes: "512x512", type: "image/png", purpose: "any" }),
      expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
    ]));
    for (const [file, size] of [["icon-192", 192], ["icon-512", 512], ["apple-touch-icon", 180]] as const) {
      const data = readFileSync(`public/icons/${file}.png`);
      expect(data.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(data.readUInt32BE(16)).toBe(size);
      expect(data.readUInt32BE(20)).toBe(size);
    }
  });
});
