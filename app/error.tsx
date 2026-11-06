"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div role="alert" className="space-y-4 rounded-2xl bg-card p-6"><h1 className="text-xl font-bold">화면을 불러오지 못했어요.</h1><p>다시 시도해 주세요. 계속되면 페이지를 새로고침해 주세요.</p><Button onClick={reset}>다시 시도</Button></div>; }
