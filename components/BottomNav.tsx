"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { href: "/", label: "世界", emoji: "🏝" },
  { href: "/map", label: "背包", emoji: "🎒" },
  { href: "/square", label: "岛民", emoji: "👥" },
  { href: "/missions", label: "任务", emoji: "📜" },
  { href: "/island", label: "小屋", emoji: "🏠" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 game-menu">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {MENU_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl ${
                isActive ? "text-[var(--ocean)] bg-[var(--ocean)]/8" : "text-[var(--ink-faint)] hover:text-[var(--ink-soft)]"
              }`}
              style={{
                transform: isActive ? "scale(1.12)" : "scale(1)",
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s, background-color 0.2s",
              }}
            >
              <span className="text-xl leading-none">{item.emoji}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
