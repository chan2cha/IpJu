"use client";
import { Download, Smartphone } from "lucide-react";
import { useInstall } from "@/components/install-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/common";

export function InstallCard() {
  const { available, installed, pending, message, install } = useInstall();
  return <div id="install" className="scroll-mt-6"><Card>
    <h2 className="flex items-center gap-2 font-bold"><Smartphone size={20} />홈 화면에 앱 설치</h2>
    {installed ? <p className="mt-3 text-sm text-primary">입주노트가 앱으로 실행 중이거나 설치되었어요.</p> : <>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">홈 화면에 추가하면 입주노트 아이콘으로 바로 열 수 있어요.</p>
      {available && <Button className="mt-4 w-full" disabled={pending} onClick={() => void install()}><Download />{pending ? "설치 창 확인 중…" : "입주노트 설치"}</Button>}
      <div className="mt-4 space-y-4 text-sm leading-6">
        <div><h3 className="font-semibold">iPhone · iPad</h3><p className="mt-1 text-muted-foreground">Safari에서 이 사이트를 열고 <strong>공유 → 홈 화면에 추가 → 추가</strong>를 선택하세요. ‘웹 앱으로 열기’ 옵션이 보이면 켜 주세요.</p></div>
        <div><h3 className="font-semibold">Android</h3><p className="mt-1 text-muted-foreground">Chrome에서 <strong>메뉴(⋮) → 앱 설치</strong> 또는 <strong>홈 화면에 추가</strong>를 선택하세요. 설치 버튼이 보이면 버튼으로도 설치할 수 있어요.</p></div>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">카카오톡 등 앱 내부 브라우저에서는 Safari나 Chrome으로 열어 주세요. 설치 메뉴가 없으면 HTTPS 주소인지 확인해 주세요. 브라우저에 따라 메뉴 이름이 달라요.</p>
    </>}
    {message && <p role="status" className="mt-3 text-sm leading-6 text-primary">{message}</p>}
    <p className="mt-4 rounded-lg bg-muted p-3 text-xs leading-5 text-muted-foreground">인터넷 연결이 필요해요. 현재 시제품은 설치해도 입력 내용을 영구 저장하지 않으며, 새로고침하거나 앱을 다시 실행하면 초기화될 수 있어요.</p>
  </Card></div>;
}
