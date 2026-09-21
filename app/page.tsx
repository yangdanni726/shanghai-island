"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import IslandMap from "@/components/IslandMap";
import LocationPanel from "@/components/game/LocationPanel";
import HintBubble from "@/components/game/HintBubble";
import GamePanel from "@/components/game/ui/GamePanel";
import ProgressBar from "@/components/game/ui/ProgressBar";
import { usePlayer } from "@/contexts/PlayerContext";
import { WORLD, TIME_LABELS } from "@/game/world";
import { getDistrictById } from "@/data/districts";
import { getLocationById, LOCATIONS } from "@/data/locations";
import { gameColors } from "@/styles/game-theme";

const DAILY_GOAL = 10; // 每日探索目标

export default function Home() {
  const router = useRouter();
  const { state, isLoaded, moveToArea, getLevel } = usePlayer();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !state.isCreated) {
      router.replace("/onboarding");
    }
  }, [isLoaded, state.isCreated, router]);

  // 上下文提示 — 必须在条件 return 之前调用
  const hints = useMemo(() => {
    if (!state.isCreated) return [];
    const list = [];
    const unexplored = LOCATIONS.filter((l) => !state.exploredLocations.includes(l.id));
    const nearby = unexplored.filter((l) => l.districtId === state.player.currentArea);

    if (nearby.length > 0) {
      list.push({
        emoji: "🗺️",
        text: `附近有 ${nearby.length} 个未探索地点`,
        variant: "discovery" as const,
      });
    } else if (unexplored.length > 0) {
      list.push({
        emoji: "✨",
        text: `还有 ${unexplored.length} 个地点等待发现`,
        variant: "discovery" as const,
      });
    }

    list.push({
      emoji: "📋",
      text: `今日探索进度 ${state.exploredCount}/${DAILY_GOAL}`,
      variant: "progress" as const,
    });

    list.push({
      emoji: "⭐",
      text: "点击 ⭐ 领取今日任务",
      variant: "mission" as const,
    });

    if (state.coins < 50) {
      list.push({
        emoji: "🪙",
        text: "金币不足，去探索赚金币吧！",
        variant: "info" as const,
      });
    }

    return list;
  }, [state.isCreated, state.exploredLocations, state.exploredCount, state.coins, state.player.currentArea]);

  if (!isLoaded || !state.isCreated) {
    return (
      <div className="game-scene flex items-center justify-center">
        <div className="text-[var(--ink-faint)] text-sm">加载中...</div>
      </div>
    );
  }

  const levelInfo = getLevel();
  const district = getDistrictById(state.player.currentArea);
  const player = state.player;
  const selectedLocation = selectedLocationId ? getLocationById(selectedLocationId) : null;

  return (
    <div className="game-scene">
      {/* Layer 0: 全屏游戏地图 */}
      <div className="absolute inset-0">
        <IslandMap
          playerX={player.positionX}
          playerY={player.positionY}
          playerAvatar={player.avatar}
          playerNickname={player.nickname}
          playerLevel={levelInfo.level}
          onAreaClick={moveToArea}
          onLocationClick={setSelectedLocationId}
          exploredLocations={state.exploredLocations}
        />
      </div>

      {/* Layer 3: HUD 浮层 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between p-3 pointer-events-none">
        {/* 左上 — 岛民状态 */}
        <GamePanel variant="floating" className="px-3 py-2 pointer-events-auto panel-enter" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2">
            <span className="text-base">{player.avatar}</span>
            <div>
              <div className="text-xs font-bold text-[var(--ink)] leading-tight">
                {player.nickname}
              </div>
              <div className="text-[9px] text-[var(--ink-faint)]">
                Lv.{levelInfo.level} {levelInfo.title}
              </div>
            </div>
          </div>
          <div className="mt-1.5 w-20">
            <ProgressBar
              value={state.experience}
              max={levelInfo.maxExp}
              variant="exp"
              height={5}
              showLabel
            />
          </div>
        </GamePanel>

        {/* 右上 — 天气时间 */}
        <GamePanel variant="floating" className="px-3 py-2 pointer-events-auto panel-enter" style={{ animationDelay: "0.2s" }}>
          <div className="text-[10px] text-[var(--ink-soft)]">{WORLD.weather}</div>
          <div className="text-[10px] text-[var(--ink-faint)]">{TIME_LABELS[WORLD.timeOfDay]}</div>
        </GamePanel>
      </div>

      {/* 顶部居中 — 浮动提示 */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <HintBubble hints={hints} />
      </div>

      {/* 左下 — 游戏数据 */}
      <div className="absolute bottom-20 left-3 z-10 pointer-events-none">
        <GamePanel variant="floating" className="px-3 py-2 flex items-center gap-3 panel-enter" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-1 text-xs">
            <span>📍</span>
            <span className="text-[var(--ink-soft)]">探索</span>
            <b className="text-[var(--ink)]">{state.exploredCount}</b>
          </div>
          <div className="w-px h-4 bg-black/10" />
          <div className="flex items-center gap-1 text-xs">
            <span>🪙</span>
            <b style={{ color: gameColors.gold }}>{state.coins}</b>
          </div>
        </GamePanel>
      </div>

      {/* 右下 — 当前位置 */}
      <div className="absolute bottom-20 right-3 z-10 pointer-events-none">
        <GamePanel variant="floating" className="px-3 py-2 panel-enter" style={{ animationDelay: "0.4s" }}>
          <div className="text-[9px] text-[var(--ink-faint)]">当前位置</div>
          <div className="text-xs font-bold" style={{ color: gameColors.ocean }}>
            {district?.name || "上海岛"}
          </div>
        </GamePanel>
      </div>

      {/* 底部居中 — 每日进度条 */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-32">
        <GamePanel variant="glass" className="px-2.5 py-1.5 panel-enter" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-semibold text-[var(--ink-soft)]">今日探索</span>
            <span className="text-[8px] font-bold" style={{ color: gameColors.island }}>
              {state.exploredCount}/{DAILY_GOAL}
            </span>
          </div>
          <ProgressBar
            value={state.exploredCount}
            max={DAILY_GOAL}
            variant="mission"
            height={4}
          />
        </GamePanel>
      </div>

      {/* 底部操作提示 */}
      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="text-[9px] text-[var(--ink-faint)]">
          点击区域移动 · 点击地点探索
        </div>
      </div>

      {/* 地点探索弹窗 */}
      {selectedLocation && (
        <LocationPanel
          location={selectedLocation}
          onClose={() => setSelectedLocationId(null)}
        />
      )}
    </div>
  );
}
