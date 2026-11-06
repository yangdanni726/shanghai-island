"use client";

import Link from "next/link";
import { LOCATIONS } from "@/data/locations";
import { suggestQuestLocation } from "@/lib/quest-rules";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/contexts/PlayerContext";
import { useQuests } from "@/contexts/QuestContext";
import { getDailyQuests, getWeeklyQuests, getAchievementQuests, BADGES } from "@/game/quests";
import GamePanel from "@/components/game/ui/GamePanel";
import GameButton from "@/components/game/ui/GameButton";
import ProgressBar from "@/components/game/ui/ProgressBar";
import RewardPopup from "@/components/game/ui/RewardPopup";
import { gameColors } from "@/styles/game-theme";

export default function QuestPanel() {
  const router = useRouter();
  const { state, getLevel } = usePlayer();
  const { getQuestProgress, claimReward } = useQuests();
  const [reward, setReward] = useState<{ exp: number; coins: number; badge?: string } | null>(null);
  const [rewardIcon, setRewardIcon] = useState("🎉");
  const [rewardTitle, setRewardTitle] = useState("任务完成！");

  const levelInfo = getLevel();
  const dailyQuests = getDailyQuests();
  const weeklyQuests = getWeeklyQuests();
  const achievementQuests = getAchievementQuests();

  const handleClaim = (questId: string, icon: string, title: string) => {
    const r = claimReward(questId);
    if (r) {
      setReward(r);
      setRewardIcon(icon);
      setRewardTitle(title);
    }
  };

  const renderQuestCard = (quest: typeof dailyQuests[0]) => {
    const suggested = suggestQuestLocation(quest, LOCATIONS, state.exploredLocations);
    const progress = getQuestProgress(quest.id);
    const isCompleted = progress.status === "completed";
    const isClaimed = progress.status === "claimed";
    const displayProgress = Math.min(progress.progress, quest.targetCount);

    return (
      <div
        key={quest.id}
        style={{
          background: isClaimed ? "#f5f5f5" : isCompleted ? "rgba(240, 165, 0, 0.08)" : "#fff",
          borderRadius: "14px",
          padding: "12px 14px",
          border: `1px solid ${isCompleted ? "rgba(240, 165, 0, 0.2)" : "rgba(0,0,0,0.04)"}`,
          opacity: isClaimed ? 0.5 : 1,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{quest.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--ink)] truncate">{quest.title}</span>
              {isCompleted && <span className="text-[9px] text-[var(--gold)]">✓ 可领取</span>}
              {isClaimed && <span className="text-[9px] text-[var(--ink-faint)]">已领取</span>}
            </div>
            <div className="text-[10px] text-[var(--ink-faint)] truncate">{quest.description}</div>
          </div>
          {/* 奖励预览 */}
          <div className="flex items-center gap-1.5 text-[9px]">
            <span className="text-[var(--ocean)] font-bold">+{quest.reward.exp}</span>
            <span className="text-[var(--ink-faint)]">EXP</span>
            <span className="text-[var(--gold)] font-bold">+{quest.reward.coins}🪙</span>
          </div>
        </div>

        {/* 进度条 */}
        {!isClaimed && (
          <div className="mt-2">
            <ProgressBar
              value={displayProgress}
              max={quest.targetCount}
              variant="mission"
              height={5}
              showLabel
            />
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-2 flex gap-2">
          {!isCompleted && !isClaimed && (
            <GameButton
              variant="secondary"
              size="sm"
              onClick={() => router.push(suggested ? `/map?district=${suggested.districtId}&location=${suggested.id}` : "/map")}
            >
              {suggested ? `去探索 · ${suggested.name}` : "查看地点"}
            </GameButton>
          )}
          {isCompleted && (
            <GameButton
              variant="reward"
              size="sm"
              onClick={() => handleClaim(quest.id, quest.icon, quest.title)}
            >
              🎁 领取奖励
            </GameButton>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-4">
      {/* 等级进度卡 */}
      <div className="px-4 pt-6 pb-3">
        <GamePanel variant="floating" className="p-4 panel-enter">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{state.player.avatar}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--ink)]">{state.player.nickname}</span>
                <span className="text-[10px] text-[var(--ink-faint)]">Lv.{levelInfo.level} {levelInfo.title}</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar
                  value={levelInfo.levelExp}
                  max={levelInfo.levelSpan}
                  label={levelInfo.isMaxLevel ? "已达最高等级" : "本级经验"} variant="exp"
                  height={6}
                  showLabel
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base font-bold" style={{ color: gameColors.gold }}>{state.coins}</span>
              <span className="text-[9px] text-[var(--ink-faint)]">🪙 金币</span>
            </div>
          </div>
        </GamePanel>
      </div>

      {/* 每日任务 */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-[var(--ink)]">📋 探索任务</span>
          <span className="text-[9px] text-[var(--ink-faint)]">本机记录 · 展示版</span>
        </div>
        <div className="space-y-2">
          {dailyQuests.map(renderQuestCard)}
        </div>
      </div>

      {/* 每周挑战 */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-[var(--ink)]">🗓️ 进阶挑战</span>
          <span className="text-[9px] text-[var(--ink-faint)]">本机累计</span>
        </div>
        <div className="space-y-2">
          {weeklyQuests.map(renderQuestCard)}
        </div>
      </div>

      {/* 成就徽章 */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-[var(--ink)]">🏆 成就徽章</span>
        </div>
        <div className="space-y-2">
          {achievementQuests.map(renderQuestCard)}
        </div>
      </div>

      {/* 徽章墙 */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-[var(--ink)]">🎖️ 徽章墙</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {BADGES.map((badge) => {
            const questProgress = getQuestProgress(badge.id);
            const unlocked = questProgress.status === "claimed";
            return (
              <div
                key={badge.id}
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  borderRadius: "12px",
                  background: unlocked ? "rgba(106, 176, 76, 0.08)" : "#f5f5f5",
                  filter: unlocked ? "none" : "grayscale(1) opacity(0.4)",
                }}
              >
                <div className="text-xl">{badge.emoji}</div>
                <div className="text-[8px] text-[var(--ink-soft)] mt-0.5 truncate">{badge.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 奖励弹窗 */}
      {reward && (
        <RewardPopup
          emoji={rewardIcon}
          title={rewardTitle}
          subtitle="任务奖励已发放！"
          rewards={reward}
          onClose={() => setReward(null)}
          buttonText="继续查看任务"
        >
          <Link className="block my-3 text-sm font-bold underline" href={reward.badge ? "/island?tab=badges" : "/island"}>{reward.badge ? "去小屋查看新徽章 →" : "回小屋使用金币 →"}</Link>
        </RewardPopup>
      )}
    </div>
  );
}
