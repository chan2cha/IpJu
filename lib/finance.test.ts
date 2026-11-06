import { describe, expect, it } from "vitest";
import { calculateFinance, expenseSummary, formatKRW, parseAmount, plannedExpense, validateAmount } from "./finance";
import { mockExpenses, mockFunding } from "./mock-data";
import type { Expense, Funding } from "./models";
const expense = (overrides: Partial<Expense> = {}): Expense => ({ id: "e", title: "예시", category: "기타", estimatedAmount: 100, confirmedAmount: null, dueDate: "", memo: "", payments: [], ...overrides });
const source = (status: Funding["status"], amount: number): Funding => ({ id: status, name: status, sourceType: "cash", amount, status, availableOn: "", memo: "" });
describe("계획 지출", () => {
  it("확정금액을 예상금액보다 우선한다", () => expect(plannedExpense(expense({ confirmedAmount: 80 }))).toBe(80));
  it("확정 0원을 예상금액으로 대체하지 않는다", () => expect(plannedExpense(expense({ confirmedAmount: 0 }))).toBe(0));
  it("예상금액 0원과 미정을 구분한다", () => {
    expect(plannedExpense(expense({ estimatedAmount: 0 }))).toBe(0);
    expect(plannedExpense(expense({ estimatedAmount: null }))).toBeNull();
  });
  it("미정 항목의 결제는 총 결제액에 포함하되 남은 금액은 미정이다", () => {
    const item = expense({ estimatedAmount: null, payments: [{ id: "p", amount: 20, paidOn: "", memo: "" }] });
    expect(expenseSummary(item)).toEqual({ planned: null, paid: 20, remaining: null, overspent: false });
    expect(calculateFinance([item], []).unknownCount).toBe(1);
  });
});
describe("자금 합계", () => {
  it("기획서 예시: 결제 전후 모두 부족액 50만원", () => {
    const before = calculateFinance(mockExpenses.map(item => ({ ...item, payments: [] })), mockFunding);
    const after = calculateFinance(mockExpenses, mockFunding);
    expect(before.expectedDifference).toBe(-500000);
    expect(after).toEqual({ totalPlanned: 3500000, totalFunding: 3000000, securedFunding: 1000000, totalPaid: 500000, remainingPayments: 3000000, expectedDifference: -500000, securedDifference: -2500000, unknownCount: 1, overspentCount: 0 });
  });
  it("분할 결제를 누적하고 초과 결제를 다른 항목의 잔액에서 빼지 않는다", () => {
    const first = expense({ payments: [{ id: "p1", amount: 60, paidOn: "", memo: "" }, { id: "p2", amount: 70, paidOn: "", memo: "" }] });
    expect(expenseSummary(first)).toEqual({ planned: 100, paid: 130, remaining: 0, overspent: true });
    expect(calculateFinance([first, expense({ id: "e2" })], [])).toMatchObject({ remainingPayments: 100, overspentCount: 1, totalPaid: 130 });
  });
  it("예정·확정·수령 자금을 구분한다", () => {
    expect(calculateFinance([], [source("planned", 100), source("confirmed", 200), source("received", 300)])).toMatchObject({ totalFunding: 600, securedFunding: 500, expectedDifference: 600 });
  });
  it("빈 목록은 합계 0이다", () => expect(calculateFinance([], [])).toEqual({ totalPlanned: 0, totalFunding: 0, securedFunding: 0, totalPaid: 0, remainingPayments: 0, expectedDifference: 0, securedDifference: 0, unknownCount: 0, overspentCount: 0 }));
  it("동일한 입력을 변경하지 않는다", () => {
    const before = JSON.stringify([mockExpenses, mockFunding]);
    calculateFinance(mockExpenses, mockFunding);
    expect(JSON.stringify([mockExpenses, mockFunding])).toBe(before);
  });
});
describe("원화 검증과 포맷", () => {
  it.each([-1, 1.1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])("유효하지 않은 금액 %s를 거절한다", value => expect(() => validateAmount(value)).toThrow());
  it.each(["-1", "1.5", "1e3", "1,000", "가", "9007199254740992"])("잘못된 입력 %s를 거절한다", value => expect(() => parseAmount(value)).toThrow());
  it("빈 입력, 0, 정수 최댓값을 구분한다", () => { expect(parseAmount(" ")).toBeNull(); expect(parseAmount("0")).toBe(0); expect(parseAmount(String(Number.MAX_SAFE_INTEGER))).toBe(Number.MAX_SAFE_INTEGER); });
  it("확정금액이 있어도 잘못된 예상금액을 거절한다", () => expect(() => plannedExpense(expense({ estimatedAmount: -1, confirmedAmount: 100 }))).toThrow());
  it("0원 결제 기록을 거절한다", () => expect(() => expenseSummary(expense({ payments: [{ id: "p", amount: 0, paidOn: "", memo: "" }] }))).toThrow());
  it("지출 합계의 안전 정수 초과를 거절한다", () => expect(() => calculateFinance([expense({ estimatedAmount: Number.MAX_SAFE_INTEGER }), expense()], [])).toThrow());
  it("자금 합계의 안전 정수 초과를 거절한다", () => expect(() => calculateFinance([], [source("planned", Number.MAX_SAFE_INTEGER), source("received", 1)])).toThrow());
  it("결제 합계의 안전 정수 초과를 거절한다", () => expect(() => expenseSummary(expense({ payments: [{ id: "p1", amount: Number.MAX_SAFE_INTEGER, paidOn: "", memo: "" }, { id: "p2", amount: 1, paidOn: "", memo: "" }] }))).toThrow());
  it("천 단위, 원, 미정, 음수 차액을 표시한다", () => { expect(formatKRW(3500000)).toBe("3,500,000원"); expect(formatKRW(0)).toBe("0원"); expect(formatKRW(null)).toBe("미정"); expect(formatKRW(-500000)).toBe("-500,000원"); expect(() => formatKRW(Infinity)).toThrow(); });
});
