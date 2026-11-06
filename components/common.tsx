import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div><p className="mb-2 text-xs font-bold tracking-widest text-primary">{eyebrow}</p><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold tracking-tight">{title}</h1>{action}</div><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></div>;
}
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`rounded-2xl border border-border bg-card p-5 ${className}`}>{children}</section>; }
export function Badge({ children }: { children: ReactNode }) { return <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{children}</span>; }
export function EmptyState({ text = "아직 등록된 항목이 없어요." }: { text?: string }) { return <div className="rounded-2xl border border-dashed border-border p-8 text-center"><Inbox className="mx-auto mb-3 text-primary" /><p className="text-sm font-semibold">{text}</p><p className="mt-2 text-xs text-muted-foreground">새 항목을 추가하거나 필터를 변경해 보세요.</p></div>; }
export function Metric({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-lg font-bold tabular-nums">{value}</dd></div>; }
