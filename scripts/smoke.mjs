// 의존성을 설치할 수 없는 환경에서도 순수 계산을 점검하기 위한 보조 검사.
// Vitest, TypeScript 검사 또는 브라우저 E2E를 대체하지 않는다. Node 22.18+ 필요.
import assert from "node:assert/strict";
import { calculateFinance, expenseSummary, parseAmount, formatKRW } from "../lib/finance.ts";
import { mockExpenses, mockFunding } from "../lib/mock-data.ts";
import { dateNumber, daysUntil, seoulToday } from "../lib/dates.ts";
const cases = [
  ["예시 총액과 부족액", () => assert.deepEqual(calculateFinance(mockExpenses, mockFunding), { totalPlanned: 3500000, totalFunding: 3000000, securedFunding: 1000000, totalPaid: 500000, remainingPayments: 3000000, expectedDifference: -500000, securedDifference: -2500000, unknownCount: 1, overspentCount: 0 })],
  ["결제 중복 차감 방지", () => assert.equal(calculateFinance(mockExpenses.map(item => ({ ...item, payments: [] })), mockFunding).expectedDifference, -500000)],
  ["0원과 미정 구분", () => { assert.equal(parseAmount(""), null); assert.equal(parseAmount("0"), 0); assert.equal(expenseSummary({ ...mockExpenses[0], confirmedAmount: 0 }).planned, 0); }],
  ["음수·소수·범위 초과 거절", () => { for (const value of ["-1", "1.5", "9007199254740992", "1e3"]) assert.throws(() => parseAmount(value)); }],
  ["합계 오버플로 거절", () => assert.throws(() => calculateFinance([], [{ ...mockFunding[0], amount: Number.MAX_SAFE_INTEGER }, { ...mockFunding[1], amount: 1 }]))],
  ["초과 결제 항목별 처리", () => { const item = { ...mockExpenses[0], confirmedAmount: 100, payments: [{ id: "p", amount: 150, paidOn: "", memo: "" }] }; assert.deepEqual(expenseSummary(item), { planned: 100, paid: 150, remaining: 0, overspent: true }); }],
  ["원화 포맷", () => { assert.equal(formatKRW(3500000), "3,500,000원"); assert.equal(formatKRW(null), "미정"); }],
  ["서울 날짜 경계", () => { assert.equal(seoulToday(new Date("2026-11-05T15:00:00Z")), "2026-11-06"); assert.equal(daysUntil("2026-12-20", "2026-11-05"), 45); }],
  ["잘못된 날짜 거절", () => assert.throws(() => dateNumber("2026-02-29"))],
  ["빈 목록", () => assert.equal(calculateFinance([], []).totalPlanned, 0)],
];
for (const [name, run] of cases) { run(); console.log(`PASS ${name}`); }
console.log(`${cases.length} smoke checks passed`);
