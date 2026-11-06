"use client";
import { useState, type ReactNode, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { categories, type Expense, type Funding, type Task } from "@/lib/models";
import { parseAmount } from "@/lib/finance";
import { dateNumber } from "@/lib/dates";
export function Field({ name, label, children }: { name: string; label: string; children: ReactNode }) { return <div className="field"><label htmlFor={name}>{label}</label>{children}</div>; }
export function text(data: FormData, name: string): string { return String(data.get(name) ?? "").trim(); }
function validTitle(value: string) { if (!value || value.length > 100) throw new Error("이름은 공백을 제외하고 1~100자로 입력해 주세요."); return value; }
function validDate(value: string) { if (value) dateNumber(value); return value; }
function CategoryField({ value }: { value?: string }) { return <Field name="category" label="카테고리"><select id="category" name="category" defaultValue={value ?? "기타"}>{categories.map(category => <option key={category}>{category}</option>)}</select></Field>; }
function MoneyField({ name, label, value }: { name: string; label: string; value: number | null | undefined }) { return <Field name={name} label={label}><input id={name} name={name} inputMode="numeric" placeholder="미정" defaultValue={value ?? ""} aria-describedby="money-help" /></Field>; }
export function EditorFrame({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: (data: FormData) => void; children: ReactNode }) {
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { onSave(new FormData(event.currentTarget)); onClose(); } catch (error) { setError(error instanceof Error ? error.message : "입력 내용을 확인해 주세요."); }
  }
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent><DialogTitle className="pr-9 text-xl font-bold">{title}</DialogTitle><DialogDescription className="mb-5 mt-2 text-sm text-muted-foreground">가상 데이터에 반영되며 새로고침하면 초기화돼요.</DialogDescription><form onSubmit={submit} noValidate className="space-y-4">{children}{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-destructive">{error}</p>}<div className="flex gap-2 pt-2"><Button type="button" variant="outline" onClick={onClose} className="flex-1">취소</Button><Button type="submit" className="flex-1">저장</Button></div></form></DialogContent></Dialog>;
}
export function TaskEditor({ item, onClose, onSave }: { item?: Task; onClose: () => void; onSave: (item: Task) => void }) {
  return <EditorFrame title={item ? "할 일 수정" : "할 일 추가"} onClose={onClose} onSave={data => onSave({ id: item?.id ?? crypto.randomUUID(), title: validTitle(text(data, "title")), category: text(data, "category") as Task["category"], status: text(data, "status") as Task["status"], assignee: text(data, "assignee") as Task["assignee"], dueDate: validDate(text(data, "dueDate")), description: text(data, "description"), priority: text(data, "priority") as Task["priority"] })}>
    <Field name="title" label="할 일 이름 (필수)"><input id="title" name="title" maxLength={100} defaultValue={item?.title} placeholder="예: 입주 청소 예약하기" /></Field><CategoryField value={item?.category} />
    <div className="grid grid-cols-2 gap-3"><Field name="assignee" label="담당자"><select id="assignee" name="assignee" defaultValue={item?.assignee ?? "함께"}><option>함께</option><option>나</option><option>배우자</option></select></Field><Field name="dueDate" label="마감일"><input id="dueDate" name="dueDate" type="date" defaultValue={item?.dueDate} /></Field></div>
    <div className="grid grid-cols-2 gap-3"><Field name="status" label="상태"><select id="status" name="status" defaultValue={item?.status ?? "todo"}><option value="todo">예정</option><option value="in_progress">진행 중</option><option value="done">완료</option></select></Field><Field name="priority" label="우선순위"><select id="priority" name="priority" defaultValue={item?.priority ?? "normal"}><option value="normal">보통</option><option value="high">중요</option></select></Field></div>
    <Field name="description" label="설명"><textarea id="description" name="description" maxLength={1000} defaultValue={item?.description} /></Field>
  </EditorFrame>;
}
export function ExpenseEditor({ item, onClose, onSave }: { item?: Expense; onClose: () => void; onSave: (item: Expense) => void }) {
  return <EditorFrame title={item ? "지출 수정" : "지출 추가"} onClose={onClose} onSave={data => onSave({ id: item?.id ?? crypto.randomUUID(), title: validTitle(text(data, "title")), category: text(data, "category") as Expense["category"], estimatedAmount: parseAmount(text(data, "estimated")), confirmedAmount: parseAmount(text(data, "confirmed")), dueDate: validDate(text(data, "dueDate")), memo: text(data, "memo"), payments: item?.payments ?? [], candidates: item?.candidates, selectedCandidateId: item?.selectedCandidateId })}>
    <Field name="title" label="지출 이름 (필수)"><input id="title" name="title" maxLength={100} defaultValue={item?.title} placeholder="예: 거실 소파" /></Field><CategoryField value={item?.category} />
    <MoneyField name="estimated" label="예상금액 (원)" value={item?.estimatedAmount} /><MoneyField name="confirmed" label="확정금액 (원)" value={item?.confirmedAmount} /><p id="money-help" className="text-xs leading-5 text-muted-foreground">쉼표 없이 정수로 입력해 주세요. 빈칸은 미정, 0은 0원이에요. 확정금액을 우선 계산해요.</p>
    <Field name="dueDate" label="결제 예정일"><input id="dueDate" name="dueDate" type="date" defaultValue={item?.dueDate} /></Field><Field name="memo" label="메모"><textarea id="memo" name="memo" maxLength={1000} defaultValue={item?.memo} /></Field>
  </EditorFrame>;
}
export function FundingEditor({ item, onClose, onSave }: { item?: Funding; onClose: () => void; onSave: (item: Funding) => void }) {
  return <EditorFrame title={item ? "자금 수정" : "자금 추가"} onClose={onClose} onSave={data => {
    const amount = parseAmount(text(data, "amount")); if (amount === null) throw new Error("자금 금액을 입력해 주세요.");
    onSave({ id: item?.id ?? crypto.randomUUID(), name: validTitle(text(data, "name")), amount, sourceType: text(data, "sourceType") as Funding["sourceType"], status: text(data, "status") as Funding["status"], availableOn: validDate(text(data, "availableOn")), memo: text(data, "memo") });
  }}><Field name="name" label="자금 이름 (필수)"><input id="name" name="name" maxLength={100} defaultValue={item?.name} placeholder="예: 입주 저축" /></Field><MoneyField name="amount" label="금액 (원, 필수)" value={item?.amount} /><p id="money-help" className="text-xs text-muted-foreground">쉼표 없이 0 이상의 정수로 입력해 주세요.</p>
    <div className="grid grid-cols-2 gap-3"><Field name="sourceType" label="유형"><select id="sourceType" name="sourceType" defaultValue={item?.sourceType ?? "cash"}><option value="cash">자기자금</option><option value="loan">대출</option><option value="other">기타</option></select></Field><Field name="status" label="상태"><select id="status" name="status" defaultValue={item?.status ?? "planned"}><option value="planned">예정</option><option value="confirmed">확정</option><option value="received">수령</option></select></Field></div>
    <Field name="availableOn" label="사용 가능 예정일"><input id="availableOn" name="availableOn" type="date" defaultValue={item?.availableOn} /></Field><Field name="memo" label="메모"><textarea id="memo" name="memo" maxLength={1000} defaultValue={item?.memo} /></Field>
  </EditorFrame>;
}
export function DeleteDialog({ title, onClose, onDelete }: { title: string; onClose: () => void; onDelete: () => void }) {
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent><DialogTitle className="pr-8 text-xl font-bold">항목을 삭제할까요?</DialogTitle><DialogDescription className="my-5 break-words text-sm leading-6">‘{title}’ 항목과 연결된 예시 기록이 삭제돼요. 새로고침하면 최초 가상 데이터로 돌아와요.</DialogDescription><div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>취소</Button><Button variant="destructive" onClick={() => { onDelete(); onClose(); }}>삭제 확인</Button></div></DialogContent></Dialog>;
}
