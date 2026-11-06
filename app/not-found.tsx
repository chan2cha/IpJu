import Link from "next/link";
export default function NotFound() { return <div className="space-y-4"><h1 className="text-xl font-bold">페이지를 찾을 수 없어요.</h1><Link href="/dashboard" className="inline-block min-h-11 text-primary underline">홈으로 돌아가기</Link></div>; }
