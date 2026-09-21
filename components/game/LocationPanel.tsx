"use client";

import { useState } from "react";
import type { Location } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";
import { useQuests } from "@/contexts/QuestContext";

interface LocationPanelProps {
  location: Location;
  onClose: () => void;
}

type PanelState = "intro" | "exploring" | "result";

export default function LocationPanel({ location, onClose }: LocationPanelProps) {
  const { exploreLocation, isExplored } = usePlayer();
  const { onLocationExplored } = useQuests();
  const [panelState, setPanelState] = useState<PanelState>("intro");
  const [result, setResult] = useState<{ exp: number; coins: number; isFirst: boolean } | null>(null);

  const alreadyExplored = isExplored(location.id);

  const handleExplore = () => {
    setPanelState("exploring");
    // 模拟探索过程 1.2s
    setTimeout(() => {
      const r = exploreLocation(location.id);
      // 触发任务进度更新
      onLocationExplored(location.id, location.category, location.districtId);
      setResult({ exp: r.expGained, coins: r.coinsGained, isFirst: r.isFirstTime });
      setPanelState("result");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* 弹窗内容 */}
      <div
        className="hud-panel w-[85%] max-w-sm p-5 relative z-10 spring-transition"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[var(--ink-faint)] text-sm"
        >
          ✕
        </button>

        {/* Intro 状态 */}
        {panelState === "intro" && (
          <div className="text-center">
            {/* 地点图标 */}
            <div className="text-5xl mb-2">{location.emoji}</div>
            <h2 className="text-lg font-bold text-[var(--ink)]">{location.name}</h2>
            <div className="inline-block px-2 py-0.5 rounded-full bg-[var(--ocean)]/10 text-[10px] text-[var(--ocean)] mt-1">
              {location.tag} · {location.distance}
            </div>
            <p className="text-xs text-[var(--ink-soft)] mt-3 leading-relaxed px-2">
              {location.description}
            </p>

            {/* 奖励预览 */}
            <div className="mt-3 p-3 rounded-xl bg-gray-50 flex justify-around">
              <div className="text-center">
                <div className="text-xs text-[var(--ink-faint)]">经验奖励</div>
                <div className="text-sm font-bold text-[var(--ocean)]">+{location.reward.exp} EXP</div>
              </div>
              <div className="w-px bg-black/5" />
              <div className="text-center">
                <div className="text-xs text-[var(--ink-faint)]">金币奖励</div>
                <div className="text-sm font-bold text-[var(--gold)]">+{location.reward.coins} 🪙</div>
              </div>
            </div>

            {/* 已探索标记 */}
            {alreadyExplored && (
              <div className="mt-2 text-[10px] text-[var(--ink-faint)]">
                ✓ 已探索 · 重复探索仅获得 20% 经验
              </div>
            )}

            {/* 探索按钮 */}
            <button
              onClick={handleExplore}
              className="w-full mt-4 py-3 rounded-xl bg-[var(--ocean)] text-white font-bold text-sm spring-transition hover:brightness-110 active:scale-95"
            >
              {alreadyExplored ? "再次探索" : "进入探索"}
            </button>
          </div>
        )}

        {/* Exploring 状态 */}
        {panelState === "exploring" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-3 animate-bounce">{location.emoji}</div>
            <div className="text-sm font-bold text-[var(--ink)]">探索中...</div>
            <div className="text-[10px] text-[var(--ink-faint)] mt-1">{location.name}</div>
            {/* 进度条 */}
            <div className="mt-3 w-3/4 mx-auto h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--ocean)] rounded-full" style={{ width: "60%", animation: "player-pulse 1s ease-in-out" }} />
            </div>
          </div>
        )}

        {/* Result 状态 */}
        {panelState === "result" && result && (
          <div className="text-center">
            <div className="text-4xl mb-2">{result.isFirst ? "🎉" : "📍"}</div>
            <h2 className="text-base font-bold text-[var(--ink)]">
              {result.isFirst ? "发现新地点！" : "探索完成"}
            </h2>
            <div className="text-xs text-[var(--ink-soft)] mt-1">{location.name}</div>

            {/* 获得奖励 */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-[var(--ocean)] font-bold">+{result.exp}</span>
                <span className="text-xs text-[var(--ink-faint)]">EXP</span>
              </div>
              {result.coins > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-[var(--gold)] font-bold">+{result.coins}</span>
                  <span className="text-xs text-[var(--ink-faint)]">🪙 金币</span>
                </div>
              )}
            </div>

            {/* 首次探索徽章提示 */}
            {result.isFirst && (
              <div className="mt-3 p-2 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20">
                <div className="text-[10px] text-[var(--gold)] font-bold">
                  🏆 探索数 +1
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 py-3 rounded-xl bg-[var(--ocean)] text-white font-bold text-sm spring-transition hover:brightness-110 active:scale-95"
            >
              继续探索
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
