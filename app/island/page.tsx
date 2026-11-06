"use client";

import JourneyLink from '@/components/JourneyLink';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ExplorationNextSteps from "@/components/game/ExplorationNextSteps";
import { Suspense, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useQuests } from "@/contexts/QuestContext";
import { useHome } from "@/contexts/HomeContext";
import { LOCATIONS } from "@/data/locations";
import { BADGES } from "@/game/quests";
import HomeRoom from "@/components/game/HomeRoom";
import GamePanel from "@/components/game/ui/GamePanel";
import GameButton from "@/components/game/ui/GameButton";
import ProgressBar from "@/components/game/ui/ProgressBar";
import { gameColors } from "@/styles/game-theme";

type Tab = "footprints" | "collections" | "badges" | "decorations";

function IslandContent() {
  const params = useSearchParams();
  const { state, getLevel } = usePlayer();
  const { getQuestProgress } = useQuests();
  const { home, upgradeHome, getHomeLevel } = useHome();
  const [upgradeMessage,setUpgradeMessage]=useState("");
  const [tab, setTab] = useState<Tab>(params.get("tab") === "badges" ? "badges" : "footprints");

  const levelInfo = getLevel();
  const homeLevel = getHomeLevel();

  // 已探索地点详情
  const exploredLocations = state.exploredLocations
    .map((id) => LOCATIONS.find((l) => l.id === id))
    .filter(Boolean)
    .reverse();

  // 已解锁徽章
  const unlockedBadges = BADGES.map((badge) => {
    const progress = getQuestProgress(badge.id);
    return { ...badge, unlocked: progress.status === "claimed" };
  });

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "footprints", label: "足迹", icon: "📍" },
    { id: "collections", label: "地点图鉴", icon: "📚" },
    { id: "badges", label: "徽章", icon: "🏆" },
    { id: "decorations", label: "装饰", icon: "🎨" },
  ];

  const handleUpgrade = () => {
    const success = upgradeHome();
    setUpgradeMessage(success ? "小屋升级成功，家园等级与容量已更新。" : "金币不足，先探索地点或领取任务奖励。");
  };

  return (
    <div className="min-h-screen pb-4">
      <div className="home-return-bar"><strong>🏠 我的小屋</strong><JourneyLink href="/?from=home">← 返回城市</JourneyLink></div>
      {/* 顶部 — 岛民信息 */}
      <div className="px-4 pt-6 pb-3">
        <GamePanel variant="floating" className="p-4 panel-enter">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{state.player.avatar}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--ink)]">{state.player.nickname}</span>
                <span className="text-[10px] text-[var(--ink-faint)]">
                  Lv.{levelInfo.level} {levelInfo.title}
                </span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={levelInfo.levelExp} max={levelInfo.levelSpan} label={levelInfo.isMaxLevel ? "已达最高等级" : "本级经验"} variant="exp" height={6} showLabel />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base font-bold" style={{ color: gameColors.gold }}>{state.coins}</span>
              <span className="text-[9px] text-[var(--ink-faint)]">🪙 金币</span>
            </div>
          </div>
        </GamePanel>
      </div>

      <div className="px-4 mb-4"><h1 className="text-xl font-bold text-[var(--ink)]">把城市里的发现，带回家。</h1><p className="text-xs mt-2 text-[var(--ink-soft)]">足迹成为图鉴，成就点亮徽章。这里记录你的探索成果。</p></div>
      {/* 中间 — 个人小屋房间 */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-[var(--ink)]">🏠 {homeLevel.name}</span>
          {homeLevel.upgradeCost > 0 && (
            <GameButton variant="secondary" size="sm" onClick={handleUpgrade}>
              ⬆️ 升级 ({homeLevel.upgradeCost}🪙)
            </GameButton>
          )}
        </div>
        <p role="status" className="text-xs mb-2">{upgradeMessage}</p>
        <HomeRoom homeLevel={home.homeLevel} trophies={home.trophies} />
        <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="小屋荣誉架">
          {unlockedBadges.filter(b=>b.unlocked).map(b=><button key={b.id} onClick={()=>setTab("badges")} className="rounded-full bg-[#fff0be] text-[#795216] px-3 py-2 text-xs font-bold">{b.emoji} {b.name}</button>)}
          {!unlockedBadges.some(b=>b.unlocked)&&<Link className="text-xs text-[var(--ocean)]" href="/missions">荣誉架等你点亮 · 查看徽章任务 →</Link>}
        </div>
        <div className="flex justify-center gap-4 mt-2 text-[10px] text-[var(--ink-faint)]">
          <span>V5 固定样板布置</span>
          <span>等级 Lv.{home.homeLevel}</span>
          <span>家园容量 {homeLevel.slots}</span>
        </div>
      </div>

      <div id="home-memories" className="scroll-mt-8" />
      {/* 数据概览 */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "探索足迹", value: state.exploredCount, icon: "📍", color: gameColors.ocean },
            { label: "金币", value: state.coins, icon: "🪙", color: gameColors.gold },
            { label: "徽章", value: unlockedBadges.filter((b) => b.unlocked).length, icon: "🏆", color: gameColors.purple },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "10px 4px",
                textAlign: "center",
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div className="text-base">{item.icon}</div>
              <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
              <div className="text-[9px] text-[var(--ink-faint)] mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-4"><ExplorationNextSteps inHome /><Link href="/map" className="block text-center text-xs font-bold mt-3">探索下一个地点 →</Link></div>

      {/* 底部 Tab 切换 */}
      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold spring-transition whitespace-nowrap ${
                tab === t.id
                  ? "bg-[var(--ocean)] text-white"
                  : "bg-white text-[var(--ink-soft)] border border-black/5"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 内容 */}
      <div className="px-4">
        {/* 足迹 */}
        {tab === "footprints" && (
          <div className="space-y-2 panel-enter">
            {exploredLocations.length === 0 ? (
              <div className="text-center py-8 text-xs text-[var(--ink-faint)]">
                还没有探索记录，去地图上探索地点吧！
              </div>
            ) : (
              exploredLocations.map((loc) => (
                <div
                  key={loc!.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: "#fff",
                    borderRadius: "14px",
                    border: "1px solid rgba(0,0,0,0.04)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                  className="hover:-translate-y-0.5 spring-transition"
                >
                  <span className="text-xl">{loc!.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[var(--ink)]">{loc!.name}</div>
                    <div className="text-[9px] text-[var(--ink-faint)]">{loc!.tag} · 示例距离 {loc!.distance}</div>
                  </div>
                  <span className="text-[9px] text-[var(--island)] font-semibold">✓ 已探索</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* 收藏 */}
        {tab === "collections" && (
          <div className="grid grid-cols-2 gap-2 panel-enter">
            {exploredLocations.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-xs text-[var(--ink-faint)]">
                首次探索后会收入地点图鉴
              </div>
            ) : (
              exploredLocations.map((loc) => (
                <div
                  key={loc!.id}
                  style={{
                    textAlign: "center",
                    padding: "12px 8px",
                    background: "#fff",
                    borderRadius: "14px",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                  className="hover:-translate-y-1 spring-transition"
                >
                  <div className="text-2xl">{loc!.emoji}</div>
                  <div className="text-[10px] font-semibold text-[var(--ink)] mt-1 truncate">{loc!.name}</div>
                  <div className="text-[8px] text-[var(--ink-faint)]">{loc!.tag}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 徽章 */}
        {tab === "badges" && (
          <div className="grid grid-cols-3 gap-3 panel-enter">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                style={{
                  textAlign: "center",
                  padding: "10px 4px",
                  borderRadius: "14px",
                  background: badge.unlocked ? "rgba(240, 165, 0, 0.06)" : "#f5f5f5",
                  filter: badge.unlocked ? "none" : "grayscale(1) opacity(0.4)",
                  border: badge.unlocked ? "1px solid rgba(240, 165, 0, 0.15)" : "1px solid transparent",
                }}
                className="hover:-translate-y-1 spring-transition"
              >
                <div className="text-2xl">{badge.unlocked ? badge.emoji : "🔒"}</div>
                <div className="text-[9px] font-semibold text-[var(--ink)] mt-1">{badge.name}</div>
                <div className="text-[8px] text-[var(--ink-faint)] mt-0.5">{badge.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* 装饰 */}
        {tab === "decorations" && (
          <div className="panel-enter">
            <div className="text-center py-8 text-xs text-[var(--ink-faint)]">
              🎨 当前3D小屋为固定样板布置，自由装修与家具商店尚未开放
            </div>
            <div className="grid grid-cols-4 gap-2 opacity-50">
              {["📚", "🪴", "🟫", "🖼️", "🏆", "🎸", "🌺", "🪞"].map((emoji, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: "10px 4px",
                    background: "#f5f5f5",
                    borderRadius: "12px",
                    filter: "grayscale(1)",
                  }}
                >
                  <div className="text-xl">{emoji}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IslandPage() {
 return <Suspense fallback={<div>正在打开小屋…</div>}><IslandContent /></Suspense>;
}
