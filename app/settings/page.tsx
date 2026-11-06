"use client";
import { useState, type FormEvent } from "react";
import { useDemo } from "@/components/demo-provider";
import { PageHeading, Card, Badge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { dateNumber } from "@/lib/dates";
export default function SettingsPage() {
  const { moveInDate, setMoveInDate, setActivity } = useDemo();
  const [message, setMessage] = useState(""); const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage(""); setError(""); try { const date = String(new FormData(event.currentTarget).get("moveInDate")); dateNumber(date); setMoveInDate(date); setActivity("입주 예정일 변경"); setMessage("입주 예정일을 변경했어요. 새로고침하면 초기화돼요."); } catch { setError("올바른 입주 예정일을 입력해 주세요."); } }
  return <><PageHeading eyebrow="우리집의 기본 정보" title="설정" description="입주 예정일과 시제품 안내를 확인해요." /><Card><h2 className="mb-4 font-bold">입주 예정일</h2><form onSubmit={submit} noValidate className="space-y-4"><label htmlFor="moveInDate">입주할 날짜</label><input id="moveInDate" name="moveInDate" type="date" defaultValue={moveInDate} /><Button type="submit">날짜 저장</Button>{message && <p role="status" className="text-sm text-primary">{message}</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</form></Card><Card><h2 className="mb-3 font-bold">함께 준비하는 사람</h2><div className="flex gap-2"><Badge>나 · 예시 구성원</Badge><Badge>배우자 · 예시 구성원</Badge></div><p className="mt-4 text-sm leading-6 text-muted-foreground">현재는 가상 데이터 화면이에요. 로그인, 초대 및 실제 공유는 이후 단계에서 제공돼요.</p></Card><Card><h2 className="mb-3 font-bold">시제품 사용 안내</h2><p className="text-sm leading-7 text-muted-foreground">입력 내용은 현재 열린 앱 안에서만 유지돼요. 새로고침하면 예시 데이터로 초기화됩니다. 실제 금융 정보는 입력하지 마세요.</p><p className="mt-3 text-sm leading-7 text-muted-foreground">앱 설치와 오프라인 기능은 아직 제공하지 않아요. 홈 화면 설치 검증은 Milestone 4에서 진행합니다.</p></Card></>;
}
