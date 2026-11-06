"use client";
import Link from "next/link";
import { ArrowUpRight, Plus, CalendarDays, CheckCheck } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { Card, Badge, Metric, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { calculateFinance, formatKRW } from "@/lib/finance";
import { dayLabel, daysUntil, displayDate } from "@/lib/dates";
import { useEffect, useState } from "react";
export default function DashboardPage() {
  const { tasks, expenses, funding, moveInDate, activity } = useDemo();
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => { import("@/lib/dates").then(({ seoulToday }) => setToday(seoulToday())); }, []);
  const summary = calculateFinance(expenses, funding);
  const incomplete = tasks.filter(task => task.status !== "done");
  const upcoming = incomplete.filter(task => task.dueDate && today && daysUntil(task.dueDate, today) >= 0 && daysUntil(task.dueDate, today) <= 7).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return <>
    <section className="relative overflow-hidden rounded-3xl bg-[#e5eddf] p-6 sm:p-8">
      <p className="text-sm font-medium text-primary">둘이 함께, 차근차근</p><h1 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">우리의 새로운 시작을<br />준비하고 있어요.</h1>
      <div className="mt-6 flex flex-wrap items-center gap-3"><span className="rounded-full bg-primary px-4 py-2 text-lg font-bold text-white">{today ? dayLabel(daysUntil(moveInDate, today)) : "입주 준비"}</span><p className="text-sm">{displayDate(moveInDate)} 입주 예정</p></div>
      <div aria-hidden="true" className="absolute -right-5 -top-3 size-24 rounded-full border-[18px] border-white/35 sm:size-36" />
    </section>
    <Link href="/settings#install" className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary">홈 화면에 입주노트 설치하기<ArrowUpRight size={18} className="shrink-0" /></Link>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="font-bold">한눈에 보는 입주 자금</h2><Link href="/funding" className="flex min-h-11 items-center gap-1 text-xs text-primary">자세히 <ArrowUpRight size={15} /></Link></div>
      <Card><p className="text-sm text-muted-foreground">예상 {summary.expectedDifference < 0 ? "부족액" : "여유액"}</p><p data-testid="expected-gap" className="mt-2 break-words text-3xl font-bold tracking-tight text-primary">{formatKRW(Math.abs(summary.expectedDifference))}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">예상 총자금과 총 계획 지출의 차이예요.</p>
        <dl className="mt-5 grid grid-cols-1 gap-5 border-t border-border pt-5 min-[380px]:grid-cols-2"><Metric label="총 계획 지출" value={formatKRW(summary.totalPlanned)} /><Metric label="예상 총자금" value={formatKRW(summary.totalFunding)} /><Metric label="현재까지 결제액" value={formatKRW(summary.totalPaid)} /><Metric label="남은 결제 예정액" value={formatKRW(summary.remainingPayments)} /></dl>
        <p className="mt-4 rounded-lg bg-muted p-3 text-xs leading-5">금액 미정 {summary.unknownCount}건은 합계에서 제외돼요. 총 계획 지출에는 이미 결제한 금액이 포함돼요.</p>
        {summary.overspentCount > 0 && <p role="status" className="mt-3 text-sm text-destructive">계획보다 초과 결제한 지출 {summary.overspentCount}건을 확인해 주세요.</p>}
      </Card>
    </section>
    <div className="grid grid-cols-2 gap-3"><Button asChild><Link href="/tasks?new=1"><Plus />할 일 추가</Link></Button><Button asChild variant="outline"><Link href="/expenses?new=1"><Plus />지출 추가</Link></Button></div>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><CalendarDays size={18} />7일 안에 할 일</h2><Badge>미완료 {incomplete.length}건</Badge></div>{upcoming.length ? <Card className="divide-y divide-border">{upcoming.map(task => <Link key={task.id} href="/tasks" className="flex min-h-16 items-center justify-between gap-3 py-3"><div><p className="text-sm font-semibold">{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{task.assignee} · {displayDate(task.dueDate)}</p></div><ArrowUpRight size={16} className="shrink-0" /></Link>)}</Card> : <EmptyState text="7일 안에 마감하는 할 일이 없어요." />}</section>
    <Card><h2 className="flex items-center gap-2 text-sm font-bold"><CheckCheck size={18} />최근 변경</h2><p aria-live="polite" className="mt-3 text-sm text-muted-foreground">{activity}</p></Card>
  </>;
}
