export function dateNumber(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("날짜를 YYYY-MM-DD 형식으로 입력해 주세요.");
  const parsed = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed) || new Date(parsed).toISOString().slice(0, 10) !== value) throw new Error("올바른 날짜를 입력해 주세요.");
  return parsed;
}
export function seoulToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (key: string) => parts.find(item => item.type === key)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function daysUntil(date: string, today = seoulToday()): number {
  return Math.round((dateNumber(date) - dateNumber(today)) / 86400000);
}
export function dayLabel(days: number): string { return days === 0 ? "D-Day" : days > 0 ? `D-${days}` : `D+${Math.abs(days)}`; }
export function displayDate(value: string): string { return value ? value.replaceAll("-", ". ") : "날짜 미정"; }
