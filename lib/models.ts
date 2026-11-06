export const categories = ["대출·금융", "입주·등기·세금", "가전", "가구·인테리어", "이사", "생활·행정", "기타"] as const;
export type Category = typeof categories[number];
export interface Task {
  id: string; title: string; category: Category; status: "todo" | "in_progress" | "done";
  assignee: "나" | "배우자" | "함께"; dueDate: string; description: string; priority: "normal" | "high";
}
export interface Payment { id: string; amount: number; paidOn: string; memo: string }
export interface ExpenseCandidate {
  id: string; name: string; model: string; vendor: string;
  amount: number | null; url: string; memo: string;
}
export interface Expense {
  id: string; title: string; category: Category; estimatedAmount: number | null;
  confirmedAmount: number | null; dueDate: string; memo: string; payments: Payment[];
  candidates?: ExpenseCandidate[];
  selectedCandidateId?: string | null;
}
export interface Funding {
  id: string; name: string; sourceType: "cash" | "loan" | "other"; amount: number;
  availableOn: string; status: "planned" | "confirmed" | "received"; memo: string;
}
