import { describe, expect, it } from "vitest";
import { dateNumber, dayLabel, daysUntil, seoulToday } from "./dates";
describe("서울 달력 기준 날짜", () => {
  it("서울 자정에서 날짜가 바뀐다", () => {
    expect(seoulToday(new Date("2026-11-05T14:59:59Z"))).toBe("2026-11-05");
    expect(seoulToday(new Date("2026-11-05T15:00:00Z"))).toBe("2026-11-06");
  });
  it("입주 전·당일·지난 날짜를 표시한다", () => {
    expect(dayLabel(daysUntil("2026-12-20", "2026-11-05"))).toBe("D-45");
    expect(dayLabel(daysUntil("2026-11-05", "2026-11-05"))).toBe("D-Day");
    expect(dayLabel(daysUntil("2026-11-04", "2026-11-05"))).toBe("D+1");
  });
  it("윤년과 연도 경계를 처리한다", () => { expect(daysUntil("2028-03-01", "2028-02-28")).toBe(2); expect(daysUntil("2027-01-01", "2026-12-31")).toBe(1); });
  it.each(["", "2026-02-29", "2026-13-01", "2026-04-31", "2026-1-1", "invalid"])("잘못된 날짜 %s를 거절한다", value => expect(() => dateNumber(value)).toThrow());
});
