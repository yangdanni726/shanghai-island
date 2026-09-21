import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { QuestProvider } from "@/contexts/QuestContext";
import { HomeProvider } from "@/contexts/HomeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "上海岛 | Shanghai Island",
  description: "城市生活游戏化社区 — 成为城市岛民，探索真实世界",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg)]">
        <PlayerProvider>
          <QuestProvider>
            <HomeProvider>
              <main className="flex-1 pb-16">{children}</main>
              <BottomNav />
            </HomeProvider>
          </QuestProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
