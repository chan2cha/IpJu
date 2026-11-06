"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Landmark, Wallet, CircleDollarSign } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { PageHeading, Card, Badge, EmptyState, Metric } from "@/components/common";
import { FundingEditor, DeleteDialog } from "@/components/editors";
import { Button } from "@/components/ui/button";
import type { Funding } from "@/lib/models";
import { displayDate } from "@/lib/dates";
import { calculateFinance, formatKRW } from "@/lib/finance";
export default function FundingPage() {
  const { expenses, funding, setFunding, setActivity } = useDemo();
  const [editor, setEditor] = useState<Funding | "new" | null>(null); const [deleting, setDeleting] = useState<Funding | null>(null);
  const summary = calculateFinance(expenses, funding);
  return <><PageHeading eyebrow="준비된 돈, 들어올 돈" title="자금계획" description="예정 자금과 확정된 자금을 따로 확인해요." action={<Button onClick={() => setEditor("new")}><Plus />자금 추가</Button>} />
    <Card><p className="text-sm text-muted-foreground">예상 총자금</p><p className="mt-2 break-words text-3xl font-bold text-primary">{formatKRW(summary.totalFunding)}</p><dl className="mt-5 space-y-4"><Metric label="확정·수령 자금" value={formatKRW(summary.securedFunding)} /><Metric label={`예상 ${summary.expectedDifference < 0 ? "부족액" : "여유액"}`} value={formatKRW(Math.abs(summary.expectedDifference))} /><Metric label={`확정 기준 ${summary.securedDifference < 0 ? "부족액" : "여유액"}`} value={formatKRW(Math.abs(summary.securedDifference))} /></dl><p className="mt-4 text-xs leading-5 text-muted-foreground">금액 미정 지출 {summary.unknownCount}건은 제외한 계산이에요. 확정 기준은 보수적인 참고치예요.</p></Card>
    <p className="rounded-xl bg-[#f1ecd9] p-4 text-sm leading-6 text-[#665327]">이 화면은 입주 계획 계산표예요. 실제 계좌잔액을 조회하지 않으며, 예정 대출도 예상 총자금에 포함돼요.</p>
    <section className="space-y-3"><h2 className="font-bold">자금 조달원 <span className="text-primary">{funding.length}</span></h2>{funding.length ? funding.map(item => { const Icon = { cash: Wallet, loan: Landmark, other: CircleDollarSign }[item.sourceType]; return <Card key={item.id}><div className="flex items-start gap-3"><span className="rounded-xl bg-muted p-3 text-primary"><Icon size={22} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-1.5"><Badge>{{ cash: "자기자금", loan: "대출", other: "기타" }[item.sourceType]}</Badge><Badge>{{ planned: "예정", confirmed: "확정", received: "수령" }[item.status]}</Badge></div><h3 className="mt-2 break-words font-bold">{item.name}</h3><p className="mt-2 break-words text-xl font-bold">{formatKRW(item.amount)}</p></div></div><p className="mt-4 text-xs text-muted-foreground">사용 가능일 · {displayDate(item.availableOn)}</p>{item.memo && <p className="mt-2 break-words text-sm text-muted-foreground">{item.memo}</p>}<div className="mt-3 flex justify-end"><Button variant="ghost" aria-label={`${item.name} 수정`} onClick={() => setEditor(item)}><Pencil />수정</Button><Button variant="ghost" aria-label={`${item.name} 삭제`} onClick={() => setDeleting(item)}><Trash2 />삭제</Button></div></Card>; }) : <EmptyState />}</section>
    {editor && <FundingEditor item={editor === "new" ? undefined : editor} onClose={() => setEditor(null)} onSave={item => { const next = funding.some(source => source.id === item.id) ? funding.map(source => source.id === item.id ? item : source) : [...funding, item]; calculateFinance(expenses, next); setFunding(next); setActivity(`${item.name} · 자금 저장`); }} />}
    {deleting && <DeleteDialog title={deleting.name} onClose={() => setDeleting(null)} onDelete={() => { setFunding(funding.filter(item => item.id !== deleting.id)); setActivity(`${deleting.name} · 삭제`); }} />}
  </>;
}
