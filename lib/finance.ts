import type { Expense, Funding } from "./models";

export function validateAmount(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("금액은 안전한 정수 범위의 0원 이상으로 입력해 주세요.");
  return value;
}

export function parseAmount(value: string): number | null {
  if (value.trim() === "") return null;
  if (!/^\d+$/.test(value.trim())) throw new Error("금액은 쉼표 없이 0 이상의 정수로 입력해 주세요.");
  return validateAmount(Number(value.trim()));
}

function sum(values: number[]): number {
  // 개별 값이 안전하더라도 합계에서 정수 정밀도를 잃을 수 있다.
  return values.reduce((total, value) => validateAmount(total + validateAmount(value)), 0);
}

export function plannedExpense(expense: Pick<Expense, "estimatedAmount" | "confirmedAmount">): number | null {
  for (const value of [expense.estimatedAmount, expense.confirmedAmount]) if (value !== null) validateAmount(value);
  return expense.confirmedAmount ?? expense.estimatedAmount;
}

export function expenseSummary(expense: Expense) {
  const planned = plannedExpense(expense);
  const paid = sum(expense.payments.map(payment => {
    if (payment.amount === 0) throw new Error("결제 금액은 0원보다 커야 합니다.");
    return validateAmount(payment.amount);
  }));
  return { planned, paid, remaining: planned === null ? null : Math.max(planned - paid, 0), overspent: planned !== null && paid > planned };
}

export function calculateFinance(expenses: Expense[], funding: Funding[]) {
  const items = expenses.map(expenseSummary);
  const totalPlanned = sum(items.map(item => item.planned ?? 0));
  const totalFunding = sum(funding.map(source => source.amount));
  const securedFunding = sum(funding.filter(source => source.status !== "planned").map(source => source.amount));
  // 결제분은 이미 계획 지출에 포함되므로 자금 차이에서 다시 차감하지 않는다.
  return {
    totalPlanned, totalFunding, securedFunding,
    totalPaid: sum(items.map(item => item.paid)),
    remainingPayments: sum(items.map(item => item.remaining ?? 0)),
    expectedDifference: totalFunding - totalPlanned,
    securedDifference: securedFunding - totalPlanned,
    unknownCount: items.filter(item => item.planned === null).length,
    overspentCount: items.filter(item => item.overspent).length,
  };
}

export function formatKRW(value: number | null): string {
  if (value === null) return "미정";
  if (!Number.isSafeInteger(value)) throw new Error("안전한 정수 금액이 아닙니다.");
  return `${value.toLocaleString("ko-KR")}원`;
}
