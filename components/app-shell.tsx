"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ListChecks, Wallet, Landmark, Settings, Sprout } from "lucide-react";
import type { ReactNode } from "react";
const tabs = [{ href: "/dashboard", label: "홈", icon: House }, { href: "/tasks", label: "할 일", icon: ListChecks }, { href: "/expenses", label: "지출", icon: Wallet }, { href: "/funding", label: "자금", icon: Landmark }];
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="mx-auto min-h-dvh max-w-4xl">
    <a href="#main" className="sr-only focus:not-sr-only focus:block focus:p-4">본문으로 건너뛰기</a>
    <header className="flex items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/dashboard" className="flex min-h-11 items-center gap-2.5 font-bold"><span className="rounded-xl bg-primary p-2 text-white"><Sprout size={22} /></span>우리집 입주노트</Link>
      <Link href="/settings" aria-label="설정" className="flex size-11 items-center justify-center rounded-full border border-border bg-card"><Settings size={19} /></Link>
    </header>
    <div className="mx-5 rounded-xl bg-muted px-3 py-2 text-center text-xs leading-5 text-muted-foreground sm:mx-8">가상 데이터 체험 · 변경 내용은 새로고침하면 초기화돼요</div>
    <main id="main" tabIndex={-1} className="space-y-6 px-5 pb-32 pt-7 sm:px-8">{children}</main>
    <nav aria-label="주요 메뉴" className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-4xl grid-cols-4 border-t border-border bg-card/95 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 backdrop-blur">
      {tabs.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold ${pathname === href ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}><Icon size={22} strokeWidth={pathname === href ? 2.4 : 1.7} />{label}</Link>)}
    </nav>
  </div>;
}
