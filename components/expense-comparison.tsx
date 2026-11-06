"use client";
import { useRef, useState } from "react";
import { Check, ExternalLink, Plus } from "lucide-react";
import type { Expense, ExpenseCandidate } from "@/lib/models";
import { compareCandidates, validateCandidateUrl } from "@/lib/comparison";
import { formatKRW, parseAmount } from "@/lib/finance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/common";
import { DeleteDialog, EditorFrame, Field, text } from "@/components/editors";

function CandidateEditor({ item, onClose, onSave }: { item?: ExpenseCandidate; onClose: () => void; onSave: (candidate: ExpenseCandidate) => void }) {
  return <EditorFrame title={item ? "비교 후보 수정" : "비교 후보 추가"} onClose={onClose} onSave={data => {
    const name = text(data, "candidate-name");
    const vendor = text(data, "candidate-vendor");
    if (!name || name.length > 100) throw new Error("상품·서비스명은 1~100자로 입력해 주세요.");
    if (!vendor || vendor.length > 100) throw new Error("업체명은 1~100자로 입력해 주세요.");
    onSave({ id: item?.id ?? crypto.randomUUID(), name, vendor, model: text(data, "candidate-model"), amount: parseAmount(text(data, "candidate-amount")), url: validateCandidateUrl(text(data, "candidate-url")), memo: text(data, "candidate-memo") });
  }}>
    <Field name="candidate-name" label="상품·서비스명 (필수)"><input id="candidate-name" name="candidate-name" maxLength={100} defaultValue={item?.name} placeholder="예: 냉장고 / 입주 청소 34평" /></Field>
    <Field name="candidate-vendor" label="업체명 (필수)"><input id="candidate-vendor" name="candidate-vendor" maxLength={100} defaultValue={item?.vendor} placeholder="판매점 또는 서비스 업체" /></Field>
    <Field name="candidate-model" label="모델명·서비스 구성"><input id="candidate-model" name="candidate-model" maxLength={200} defaultValue={item?.model} placeholder="예: 모델 번호 / 창틀·베란다 포함" /></Field>
    <Field name="candidate-amount" label="총 견적금액 (원)"><input id="candidate-amount" name="candidate-amount" inputMode="numeric" defaultValue={item?.amount ?? ""} placeholder="미정" aria-describedby="candidate-price-help" /></Field>
    <p id="candidate-price-help" className="text-xs leading-5 text-muted-foreground">배송·설치·추가 비용을 포함한 총액을 입력하면 비교하기 좋아요. 쉼표 없는 정수로 입력하고, 견적 전이면 비워 두세요.</p>
    <Field name="candidate-url" label="상품·업체 사이트 주소"><input id="candidate-url" name="candidate-url" type="url" inputMode="url" maxLength={2000} defaultValue={item?.url} placeholder="https://..." /></Field>
    <Field name="candidate-memo" label="비교 메모"><textarea id="candidate-memo" name="candidate-memo" maxLength={1000} defaultValue={item?.memo} placeholder="보증 기간, 배송일, 포함·제외 항목, 장단점 등" /></Field>
  </EditorFrame>;
}

export function ExpenseComparison({ expense, onChange }: { expense: Expense; onChange: (expense: Expense) => void }) {
  const [editor, setEditor] = useState<ExpenseCandidate | "new" | null>(null);
  const [deleting, setDeleting] = useState<ExpenseCandidate | null>(null);
  const [priceOrder, setPriceOrder] = useState(false);
  const tableViewport = useRef<HTMLDivElement>(null);
  const candidates = expense.candidates ?? [];
  const { lowest, sorted } = compareCandidates(candidates);
  const visible = priceOrder ? sorted : candidates;
  const selected = candidates.find(candidate => candidate.id === expense.selectedCandidateId);
  return <section aria-label={`${expense.title} 상품·업체 비교`} className="mt-5 min-w-0 border-t border-border pt-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold">상품·업체 비교 <span className="text-primary">{candidates.length}</span></h3><Button variant="outline" onClick={() => setEditor("new")}><Plus />후보 추가</Button></div>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">후보 견적은 지출 합계에 포함되지 않아요. 선택 후 계획액은 지출 수정에서 직접 반영해 주세요.</p>
    <p role="status" className="mt-2 break-words text-sm font-semibold text-primary">{selected ? `선택한 후보: ${selected.name} · ${selected.vendor}` : "아직 선택한 후보가 없어요."}</p>
    {visible.length ? <>
      <div className="my-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-muted-foreground">좌우로 밀어 같은 항목끼리 비교하세요.</p><Button variant="ghost" aria-pressed={priceOrder} onClick={() => { setPriceOrder(!priceOrder); if (tableViewport.current) tableViewport.current.scrollLeft = 0; }}>{priceOrder ? "등록순으로 보기" : "낮은 견적순 보기"}</Button></div>
      <div ref={tableViewport} role="region" aria-label={`${expense.title} 후보 비교표`} tabIndex={0} className="max-w-full overflow-x-auto rounded-xl border border-border focus-visible:outline-2 focus-visible:outline-primary">
        <table className="w-full table-fixed border-collapse text-left text-sm" style={{ minWidth: 100 + visible.length * 210 }}>
          <caption className="sr-only">{expense.title} 후보별 상품, 업체, 견적, 조건 비교</caption>
          <thead><tr className="bg-muted"><th scope="col" className="sticky left-0 z-10 w-[100px] bg-muted p-3">비교 항목</th>{visible.map(candidate => <th key={candidate.id} scope="col" className="w-[210px] break-words p-3 align-top"><p>{candidate.name}</p>{candidate.id === selected?.id && <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary"><Check size={14} />선택됨</span>}</th>)}</tr></thead>
          <tbody>
            {([
              ["업체", (candidate: ExpenseCandidate) => candidate.vendor],
              ["모델·구성", (candidate: ExpenseCandidate) => candidate.model || "미입력"],
              ["총 견적", (candidate: ExpenseCandidate) => <><p className="font-bold">{formatKRW(candidate.amount)}</p>{candidate.amount !== null && candidate.amount === lowest && <Badge>최저 견적</Badge>}</>],
              ["최저가 차이", (candidate: ExpenseCandidate) => candidate.amount === null || lowest === null ? "비교 불가" : candidate.amount === lowest ? "동일" : `+${formatKRW(candidate.amount - lowest)}`],
              ["비교 메모", (candidate: ExpenseCandidate) => <span className="whitespace-pre-wrap">{candidate.memo || "미입력"}</span>],
              ["사이트", (candidate: ExpenseCandidate) => candidate.url ? <a href={candidate.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-primary underline" aria-label={`${candidate.name} 사이트 열기 (새 탭)`}>사이트 열기<ExternalLink size={14} /></a> : "주소 미입력"],
              ["관리", (candidate: ExpenseCandidate) => <div className="flex flex-col gap-2"><Button variant={selected?.id === candidate.id ? "default" : "outline"} aria-pressed={selected?.id === candidate.id} aria-label={`${candidate.name} ${selected?.id === candidate.id ? "선택 해제" : "선택"}`} onClick={() => onChange({ ...expense, selectedCandidateId: selected?.id === candidate.id ? null : candidate.id })}>{selected?.id === candidate.id ? "선택 해제" : "이 후보 선택"}</Button><Button variant="ghost" aria-label={`${candidate.name} 후보 수정`} onClick={() => setEditor(candidate)}>수정</Button><Button variant="ghost" aria-label={`${candidate.name} 후보 삭제`} onClick={() => setDeleting(candidate)}>삭제</Button></div>],
            ] as const).map(([label, render]) => <tr key={label} className="border-t border-border"><th scope="row" className="sticky left-0 z-10 bg-card p-3 align-top text-xs font-medium text-muted-foreground">{label}</th>{visible.map(candidate => <td key={candidate.id} className={`break-words border-l border-border p-3 align-top ${candidate.id === selected?.id ? "bg-primary/5" : ""}`}>{render(candidate)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">최저 견적은 입력된 총액 기준이에요. 서비스 범위와 추가 비용도 함께 확인해 주세요.</p>
    </> : <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm leading-6 text-muted-foreground">비교할 상품이나 업체를 추가해 보세요. 가격과 조건을 나란히 볼 수 있어요.</p>}
    {editor && <CandidateEditor item={editor === "new" ? undefined : editor} onClose={() => setEditor(null)} onSave={candidate => onChange({ ...expense, candidates: candidates.some(item => item.id === candidate.id) ? candidates.map(item => item.id === candidate.id ? candidate : item) : [...candidates, candidate] })} />}
    {deleting && <DeleteDialog title={`${deleting.name} 비교 후보`} onClose={() => setDeleting(null)} onDelete={() => onChange({ ...expense, candidates: candidates.filter(candidate => candidate.id !== deleting.id), selectedCandidateId: expense.selectedCandidateId === deleting.id ? null : expense.selectedCandidateId })} />}
  </section>;
}
