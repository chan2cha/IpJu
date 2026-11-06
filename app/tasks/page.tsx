"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { PageHeading, Card, Badge, EmptyState } from "@/components/common";
import { TaskEditor, DeleteDialog } from "@/components/editors";
import { Button } from "@/components/ui/button";
import { categories, type Task } from "@/lib/models";
import { displayDate } from "@/lib/dates";
export default function TasksPage() { return <Suspense fallback={<p>할 일을 불러오는 중이에요…</p>}><TaskList /></Suspense>; }
function TaskList() {
  const { tasks, setTasks, setActivity } = useDemo();
  const search = useSearchParams(); const router = useRouter();
  const [editor, setEditor] = useState<Task | "new" | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [filter, setFilter] = useState("전체"); const [category, setCategory] = useState("전체");
  const isNew = search.get("new") === "1";
  const close = () => { setEditor(null); if (isNew) router.replace("/tasks", { scroll: false }); };
  const visible = tasks.filter(task => (category === "전체" || task.category === category) && (filter === "전체" || (filter === "내 담당" && task.assignee === "나") || (filter === "미완료" && task.status !== "done") || (filter === "완료" && task.status === "done")));
  const completed = tasks.filter(task => task.status === "done").length;
  return <><PageHeading eyebrow="하나씩, 차근차근" title="우리집 체크리스트" description="함께 나누면 입주 준비도 조금 가벼워져요." action={<Button onClick={() => setEditor("new")}><Plus />할 일 추가</Button>} />
    <Card><div className="flex justify-between text-sm"><span>우리의 준비 현황</span><strong>{completed} / {tasks.length} 완료</strong></div><progress aria-label="할 일 완료 현황" className="mt-4 h-2 w-full accent-primary" max={tasks.length || 1} value={completed} /></Card>
    <div className="space-y-3"><div className="flex flex-wrap gap-2" aria-label="할 일 필터">{["전체", "내 담당", "미완료", "완료"].map(value => <Button key={value} variant={filter === value ? "default" : "outline"} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</Button>)}</div><label htmlFor="category-filter" className="sr-only">카테고리 필터</label><select id="category-filter" value={category} onChange={event => setCategory(event.target.value)}><option value="전체">모든 카테고리</option>{categories.map(value => <option key={value}>{value}</option>)}</select></div>
    <div className="space-y-3">{visible.length ? visible.map(task => <Card key={task.id}><div className="flex gap-3"><label className="flex min-h-11 min-w-11 items-center justify-center self-start"><input type="checkbox" checked={task.status === "done"} aria-label={`${task.title} 완료`} onChange={event => { setTasks(tasks.map(item => item.id === task.id ? { ...item, status: event.target.checked ? "done" : "todo" } : item)); setActivity(`${task.title} · 상태 변경`); }} /></label><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap gap-1.5"><Badge>{task.category}</Badge><Badge>{{ todo: "예정", in_progress: "진행 중", done: "완료" }[task.status]}</Badge>{task.priority === "high" && <Badge>중요</Badge>}</div><h2 className={`break-words font-bold ${task.status === "done" ? "text-muted-foreground line-through" : ""}`}>{task.title}</h2><p className="mt-2 text-xs text-muted-foreground">{task.assignee} · {displayDate(task.dueDate)}</p>{task.description && <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{task.description}</p>}</div></div><div className="mt-3 flex justify-end gap-1"><Button variant="ghost" aria-label={`${task.title} 수정`} onClick={() => setEditor(task)}><Pencil />수정</Button><Button variant="ghost" aria-label={`${task.title} 삭제`} onClick={() => setDeleting(task)}><Trash2 />삭제</Button></div></Card>) : <EmptyState text="조건에 맞는 할 일이 없어요." />}</div>
    {(editor || isNew) && <TaskEditor item={editor && editor !== "new" ? editor : undefined} onClose={close} onSave={item => { setTasks(tasks.some(task => task.id === item.id) ? tasks.map(task => task.id === item.id ? item : task) : [...tasks, item]); setActivity(`${item.title} · 할 일 저장`); }} />}
    {deleting && <DeleteDialog title={deleting.title} onClose={() => setDeleting(null)} onDelete={() => { setTasks(tasks.filter(task => task.id !== deleting.id)); setActivity(`${deleting.title} · 삭제`); }} />}
  </>;
}
