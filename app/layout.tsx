import type { Metadata, Viewport } from "next";
import { DemoProvider } from "@/components/demo-provider";
import { AppShell } from "@/components/app-shell";
import { InstallProvider } from "@/components/install-provider";
import "./globals.css";
export const metadata: Metadata = {
  title: "우리집 입주노트", description: "함께 준비하는 새로운 시작, 입주 준비 시제품",
  applicationName: "우리집 입주노트",
  appleWebApp: { capable: true, title: "입주노트", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f8f4" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><InstallProvider><DemoProvider><AppShell>{children}</AppShell></DemoProvider></InstallProvider></body></html>;
}
