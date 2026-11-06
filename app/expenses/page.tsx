"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { PageHeading, Card, Badge, EmptyState, Metric } from "@/components/common";
import { ExpenseEditor, DeleteDialog } from "@/components/editors";
import { Button } from "@/components/ui/button";
import { ExpenseComparison } from "@/components/expense-comparison";
import { categories, type Expense } from "@/lib/models";
import { displayDate } from "@/lib/dates";
import { calculateFinance, expenseSummary, formatKRW } from "@/lib/finance";
export default function ExpensesPage() { return <Suspense fallback={<p>지출을 불러오는 중이에요…</p>}><ExpenseList /></Suspense>; }
function ExpenseList() {
  const { expenses, setExpenses, funding, setActivity } = useDemo();
  const search = useSearchParams(); const router = useRouter();
  const [editor, setEditor] = useState<Expense | "new" | null>(null); const [deleting, setDeleting] = useState<Expense | null>(null); const [category, setCategory] = useState("전체");
  const isNew = search.get("new") === "1";
  const close = () => { setEditor(null); if (isNew) router.replace("/expenses", { scroll: false }); };
  const summary = calculateFinance(expenses, funding);
  const visible = expenses.filter(item => category === "전체" || item.category === category).sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"));
  return <><PageHeading eyebrow="쓸 돈을 미리 살펴요" title="지출관리" description="계획한 돈과 이미 결제한 돈을 구분해요." action={<Button onClick={() => setEditor("new")}><Plus />지출 추가</Button>} />
    <Card><p className="text-sm text-muted-foreground">총 계획 지출</p><p className="mt-2 break-words text-3xl font-bold">{formatKRW(summary.totalPlanned)}</p><dl className="mt-5 grid gap-4 min-[380px]:grid-cols-2"><Metric label="누적 결제액" value={formatKRW(summary.totalPaid)} /><Metric label="남은 결제 예정액" value={formatKRW(summary.remainingPayments)} /></dl><p className="mt-4 text-xs leading-5 text-muted-foreground">금액 미정 {summary.unknownCount}건 제외 · 남은 결제 예정액은 자금 부족액과 달라요.</p></Card>
    <div><label htmlFor="expense-category" className="mb-2 block">카테고리</label><select id="expense-category" value={category} onChange={event => setCategory(event.target.value)}><option value="전체">모든 카테고리</option>{categories.map(value => <option key={value}>{value}</option>)}</select><p className="mt-2 text-xs text-muted-foreground">결제 예정일 순 · {visible.length}건</p></div>
    <div className="space-y-3">{visible.length ? visible.map(item => { const result = expenseSummary(item); return <Card key={item.id}><div className="flex flex-wrap items-center justify-between gap-2"><Badge>{item.category}</Badge><span className="text-xs text-muted-foreground">{displayDate(item.dueDate)}</span></div><h2 className="mt-3 break-words font-bold">{item.title}</h2><p className="mt-2 break-words text-2xl font-bold text-primary">{formatKRW(result.planned)}</p><p className="mt-1 text-xs text-muted-foreground">{item.confirmedAmount !== null ? "확정금액 기준" : item.estimatedAmount !== null ? "예상금액 기준 · 확정금액 미정" : "예상·확정금액 모두 미정"}</p><dl className="mt-4 grid gap-3 min-[380px]:grid-cols-2"><Metric label="결제액" value={formatKRW(result.paid)} /><Metric label="남은 결제액" value={formatKRW(result.remaining)} /></dl>{result.overspent && <p role="status" className="mt-3 text-sm font-semibold text-destructive">초과 지출 · 계획보다 {formatKRW(result.paid - result.planned!)} 더 결제했어요.</p>}{item.memo && <p className="mt-3 break-words text-sm text-muted-foreground">{item.memo}</p>}{item.payments.length > 0 && <details className="mt-4 text-sm"><summary className="min-h-11 cursor-pointer py-3">예시 결제 기록 {item.payments.length}건</summary>{item.payments.map(payment => <p key={payment.id} className="border-t border-border py-3 text-xs leading-6">{displayDate(payment.paidOn)} · {payment.memo}<br /><strong>{formatKRW(payment.amount)}</strong></p>)}</details>}<ExpenseComparison expense={item} onChange={updated => { setExpenses(current => current.map(expense => expense.id === updated.id ? updated : expense)); setActivity(`${updated.title} · 비교 후보 변경`); }} /><div className="mt-3 flex justify-end"><Button variant="ghost" aria-label={`${item.title} 수정`} onClick={() => setEditor(item)}><Pencil />수정</Button><Button variant="ghost" aria-label={`${item.title} 삭제`} onClick={() => setDeleting(item)}><Trash2 />삭제</Button></div></Card>; }) : <EmptyState text="조건에 맞는 지출이 없어요." />}</div>
    {(editor || isNew) && <ExpenseEditor item={editor && editor !== "new" ? editor : undefined} onClose={close} onSave={item => { const next = expenses.some(expense => expense.id === item.id) ? expenses.map(expense => expense.id === item.id ? item : expense) : [...expenses, item]; calculateFinance(next, funding); setExpenses(next); setActivity(`${item.title} · 지출 저장`); }} />}
    {deleting && <DeleteDialog title={deleting.title} onClose={() => setDeleting(null)} onDelete={() => { setExpenses(expenses.filter(item => item.id !== deleting.id)); setActivity(`${deleting.title} · 삭제`); }} />}
  </>;
}
