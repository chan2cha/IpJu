import { describe, expect, it } from "vitest";
import { compareCandidates, validateCandidateUrl } from "./comparison";
import { calculateFinance } from "./finance";
import { mockExpenses, mockFunding } from "./mock-data";
import type { ExpenseCandidate } from "./models";
const candidate = (id: string, amount: number | null): ExpenseCandidate => ({ id, amount, name: id, vendor: "업체", model: "", memo: "", url: "" });
describe("비교 후보", () => {
  it("미정과 0원을 구분해 정렬하고 원본 순서를 유지한다", () => {
    const input = [candidate("unknown", null), candidate("paid", 100), candidate("free", 0)];
    expect(compareCandidates(input)).toEqual({ lowest: 0, sorted: [input[2], input[1], input[0]] });
    expect(input[0].id).toBe("unknown");
  });
  it("미정만 있거나 빈 목록이면 최저가는 미정이다", () => { expect(compareCandidates([]).lowest).toBeNull(); expect(compareCandidates([candidate("x", null)]).lowest).toBeNull(); });
  it("동률이면 등록순을 보존한다", () => { const input = [candidate("a", 10), candidate("b", 10)]; expect(compareCandidates(input)).toEqual({ lowest: 10, sorted: input }); });
  it("후보와 선택 여부가 자금 계산에 영향을 주지 않는다", () => {
    const withCandidates = mockExpenses.map(expense => ({ ...expense, candidates: [candidate("a", 999999), candidate("b", 100000)], selectedCandidateId: "a" }));
    expect(calculateFinance(withCandidates, mockFunding)).toEqual(calculateFinance(mockExpenses, mockFunding));
  });
});
describe("사이트 주소", () => {
  it("빈 주소를 허용한다", () => expect(validateCandidateUrl(" ")).toBe(""));
  it("http/https 주소와 쿼리를 보존한다", () => { expect(validateCandidateUrl(" https://example.com/product?id=1 ")).toBe("https://example.com/product?id=1"); expect(validateCandidateUrl("http://example.com")).toBe("http://example.com/"); });
  it.each(["javascript:alert(1)", "data:text/html,test", "file:///tmp/test", "ftp://example.com", "//example.com", "example.com", "https://", "https://user:password@example.com", `https://example.com/${"a".repeat(2000)}`])("잘못되거나 위험한 주소 %s를 거절한다", value => expect(() => validateCandidateUrl(value)).toThrow());
});
