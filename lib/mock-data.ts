import type { Expense, Funding, Task } from "./models";
export const mockTasks: Task[] = [
  { id: "t1", title: "대출 제출 서류 준비", category: "대출·금융", assignee: "나", dueDate: "2026-11-08", status: "in_progress", priority: "high", description: "재직증명서와 소득 증빙 서류 확인하기" },
  { id: "t2", title: "이사업체 비교견적 받기", category: "이사", assignee: "함께", dueDate: "2026-11-10", status: "todo", priority: "normal", description: "세 곳의 견적을 비교해요." },
  { id: "t3", title: "냉장고·세탁기 크기 확인", category: "가전", assignee: "배우자", dueDate: "2026-11-12", status: "todo", priority: "normal", description: "설치 공간과 문 너비 확인하기" },
  { id: "t4", title: "사전점검 예약", category: "입주·등기·세금", assignee: "함께", dueDate: "2026-11-04", status: "done", priority: "normal", description: "예약 완료" }
];
export const mockExpenses: Expense[] = [
  { id: "e1", title: "입주 잔금", category: "입주·등기·세금", estimatedAmount: 1500000, confirmedAmount: 1500000, dueDate: "2026-12-20", memo: "계산 검증용 예시 금액입니다.", payments: [] },
  { id: "e2", title: "가전 구매", category: "가전", estimatedAmount: 2000000, confirmedAmount: null, dueDate: "2026-12-12", memo: "냉장고와 세탁기", payments: [{ id: "p1", amount: 500000, paidOn: "2026-11-04", memo: "계약금" }] },
  { id: "e3", title: "입주 청소", category: "이사", estimatedAmount: null, confirmedAmount: null, dueDate: "2026-12-19", memo: "견적 확인 예정", payments: [] }
];
export const mockFunding: Funding[] = [
  { id: "f1", name: "우리집 입주 저축", sourceType: "cash", amount: 1000000, availableOn: "2026-11-01", status: "received", memo: "준비된 자기자금" },
  { id: "f2", name: "입주 대출", sourceType: "loan", amount: 2000000, availableOn: "2026-12-20", status: "planned", memo: "승인 전 예시 금액" }
];
