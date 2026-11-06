import type { ExpenseCandidate } from "./models";

export function validateCandidateUrl(input: string): string {
  const value = input.trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    // 저장된 링크가 스크립트 실행이나 자격 증명 노출 경로가 되지 않도록 제한한다.
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || value.length > 2000) throw new Error();
    return url.href;
  } catch { throw new Error("사이트 주소는 http:// 또는 https://로 시작하는 올바른 주소로 입력해 주세요. 계정 정보가 포함된 주소는 사용할 수 없어요."); }
}

export function compareCandidates(candidates: ExpenseCandidate[]) {
  const known = candidates.filter(candidate => candidate.amount !== null);
  const lowest = known.length ? Math.min(...known.map(candidate => candidate.amount!)) : null;
  // 가격 미정은 0원이 아니므로 알려진 견적 뒤에 배치한다.
  const sorted = [...candidates].sort((a, b) => a.amount === null ? (b.amount === null ? 0 : 1) : b.amount === null ? -1 : a.amount - b.amount);
  return { lowest, sorted };
}
