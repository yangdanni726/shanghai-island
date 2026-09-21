"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { QuestProgress, QuestStatus } from "@/types";
import { ALL_QUESTS, getQuestById } from "@/game/quests";
import { LOCATIONS } from "@/data/locations";
import { usePlayer } from "@/contexts/PlayerContext";

const STORAGE_KEY = "shanghai_island_quests";

interface QuestContextType {
  progress: Record<string, QuestProgress>;  // questId → progress
  // 根据探索行为更新任务进度
  onLocationExplored: (locationId: string, category: string, districtId: string) => void;
  // 领取奖励
  claimReward: (questId: string) => { exp: number; coins: number; badge?: string } | null;
  // 获取任务进度
  getQuestProgress: (questId: string) => QuestProgress;
  // 重置每日任务
  resetDaily: () => void;
}

const QuestContext = createContext<QuestContextType | null>(null);

// 创建初始进度
function createInitialProgress(): Record<string, QuestProgress> {
  const result: Record<string, QuestProgress> = {};
  for (const q of ALL_QUESTS) {
    result[q.id] = {
      questId: q.id,
      status: "active",
      progress: 0,
    };
  }
  return result;
}

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const { addExperience, addCoins, state } = usePlayer();
  const [progress, setProgress] = useState<Record<string, QuestProgress>>(createInitialProgress());

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 兼容新任务 — 确保所有任务都有进度
        const merged = createInitialProgress();
        for (const q of ALL_QUESTS) {
          if (parsed[q.id]) {
            merged[q.id] = parsed[q.id];
          }
        }
        setProgress(merged);
      }
    } catch {}
  }, []);

  // 保存到 localStorage
  const save = useCallback((newProgress: Record<string, QuestProgress>) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch {}
  }, []);

  // 根据探索行为更新任务进度
  const onLocationExplored = useCallback((locationId: string, category: string, districtId: string) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      let changed = false;

      for (const quest of ALL_QUESTS) {
        const qp = newProgress[quest.id];
        if (!qp || qp.status === "completed" || qp.status === "claimed") continue;
        if (qp.progress >= quest.targetCount) continue;

        let matched = false;

        // 检查任务目标是否匹配
        if (quest.target.type === "category" && quest.target.value === category) {
          matched = true;
        } else if (quest.target.type === "district") {
          // 检查是否探索了新的区域
          const exploredDistricts = new Set(
            state.exploredLocations
              .map((id) => LOCATIONS.find((l) => l.id === id)?.districtId)
              .filter(Boolean)
          );
          exploredDistricts.add(districtId);
          const count = exploredDistricts.size;
          if (count >= quest.targetCount) {
            newProgress[quest.id] = { ...qp, progress: quest.targetCount, status: "completed" };
            changed = true;
            continue;
          }
          newProgress[quest.id] = { ...qp, progress: count };
          changed = true;
          continue;
        } else if (quest.target.type === "count") {
          // 通用计数任务 — 任何探索都算
          matched = true;
        }

        if (matched) {
          const newProg = Math.min(qp.progress + 1, quest.targetCount);
          const newStatus: QuestStatus = newProg >= quest.targetCount ? "completed" : "active";
          newProgress[quest.id] = { ...qp, progress: newProg, status: newStatus };
          changed = true;
        }
      }

      if (changed) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress)); } catch {}
      }
      return changed ? newProgress : prev;
    });
  }, [state.exploredLocations]);

  // 领取奖励
  const claimReward = useCallback((questId: string) => {
    const quest = getQuestById(questId);
    if (!quest) return null;

    const qp = progress[questId];
    if (!qp || qp.status !== "completed") return null;

    // 更新状态为已领取
    const newProgress: Record<string, QuestProgress> = {
      ...progress,
      [questId]: { ...qp, status: "claimed" as const },
    };
    save(newProgress);

    // 发放奖励
    addExperience(quest.reward.exp);
    addCoins(quest.reward.coins);

    return {
      exp: quest.reward.exp,
      coins: quest.reward.coins,
      badge: quest.reward.badge,
    };
  }, [progress, save, addExperience, addCoins]);

  // 获取任务进度
  const getQuestProgress = useCallback((questId: string): QuestProgress => {
    return progress[questId] || { questId, status: "active" as const, progress: 0 };
  }, [progress]);

  // 重置每日任务
  const resetDaily = useCallback(() => {
    const newProgress: Record<string, QuestProgress> = { ...progress };
    for (const q of ALL_QUESTS) {
      if (q.frequency === "daily") {
        newProgress[q.id] = { questId: q.id, status: "active" as const, progress: 0 };
      }
    }
    save(newProgress);
  }, [progress, save]);

  return (
    <QuestContext.Provider value={{
      progress,
      onLocationExplored,
      claimReward,
      getQuestProgress,
      resetDaily,
    }}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuests() {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuests must be used within QuestProvider");
  return ctx;
}
