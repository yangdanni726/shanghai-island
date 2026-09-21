"use client";

import { useState, useEffect, useCallback } from "react";

interface Hint {
  emoji: string;
  text: string;
  variant: "info" | "discovery" | "mission" | "progress";
}

interface HintBubbleProps {
  hints: Hint[];
  interval?: number;     // 切换间隔 ms
}

// 浮动提示系统 — 在地图上轮播显示上下文提示
export default function HintBubble({ hints, interval = 4000 }: HintBubbleProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const nextHint = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % hints.length);
      setVisible(true);
    }, 300);
  }, [hints.length]);

  useEffect(() => {
    if (hints.length <= 1) return;
    const timer = setInterval(nextHint, interval);
    return () => clearInterval(timer);
  }, [nextHint, interval, hints.length]);

  if (!hints.length) return null;
  const hint = hints[index];

  const bgColors = {
    info: "rgba(91, 180, 232, 0.12)",
    discovery: "rgba(240, 165, 0, 0.12)",
    mission: "rgba(155, 126, 200, 0.12)",
    progress: "rgba(106, 176, 76, 0.12)",
  };

  const textColors = {
    info: "#5bb4e8",
    discovery: "#f0a500",
    mission: "#9b7ec8",
    progress: "#6ab04c",
  };

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md spring-transition"
      style={{
        background: bgColors[hint.variant],
        border: `1px solid ${textColors[hint.variant]}20`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <span style={{ fontSize: "12px" }}>{hint.emoji}</span>
      <span
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: textColors[hint.variant],
          whiteSpace: "nowrap",
        }}
      >
        {hint.text}
      </span>
    </div>
  );
}
