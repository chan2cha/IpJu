"use client";
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
type InstallState = { available: boolean; installed: boolean; pending: boolean; message: string; install: () => Promise<void> };
const InstallContext = createContext<InstallState | null>(null);

function subscribeDisplay(callback: () => void) {
  const query = window.matchMedia("(display-mode: standalone)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function InstallProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const standalone = useSyncExternalStore(subscribeDisplay, isStandalone, () => false);

  // 앱 전체에서 이벤트를 보관해야 홈에서 설정으로 이동해도 설치 기회를 잃지 않는다.
  useEffect(() => {
    const onPrompt = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); setMessage(""); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); setMessage("홈 화면에 설치했어요. 입주노트 아이콘으로 실행해 보세요."); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  async function install() {
    if (!prompt || pending) return;
    setPending(true);
    setMessage("");
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      setMessage(result.outcome === "accepted" ? "설치 요청을 보냈어요. 홈 화면에 아이콘이 생겼는지 확인해 주세요." : "설치를 취소했어요. 나중에 브라우저 메뉴에서 다시 설치할 수 있어요.");
    } catch { setMessage("설치 창을 열지 못했어요. 아래 브라우저별 안내를 따라 설치해 주세요."); }
    finally { setPrompt(null); setPending(false); }
  }
  return <InstallContext.Provider value={{ available: prompt !== null, installed: installed || standalone, pending, message, install }}>{children}</InstallContext.Provider>;
}

export function useInstall() {
  const state = useContext(InstallContext);
  if (!state) throw new Error("InstallProvider가 필요합니다.");
  return state;
}
