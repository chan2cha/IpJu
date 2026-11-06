"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
export const Dialog = DialogPrimitive.Root;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export function DialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  // 시트가 닫히면 열기 버튼으로 돌아가 키보드 탐색 위치를 유지한다.
  const previousFocus = React.useRef(typeof document === "undefined" ? null : document.activeElement as HTMLElement | null);
  return <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40" />
    <DialogPrimitive.Content onCloseAutoFocus={event => { event.preventDefault(); if (previousFocus.current?.isConnected) previousFocus.current.focus(); else document.getElementById("main")?.focus(); }} className={cn("fixed bottom-0 left-1/2 z-50 max-h-[90dvh] w-full max-w-lg -translate-x-1/2 overflow-y-auto rounded-t-3xl bg-card p-6 pb-8 shadow-xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl", className)} {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-xl hover:bg-muted focus-visible:outline-2"><X size={20} /><span className="sr-only">닫기</span></DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>;
}
