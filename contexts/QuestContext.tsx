"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import type { QuestProgress } from "@/types";
import { ALL_QUESTS, getQuestById } from "@/game/quests";
import { LOCATIONS } from "@/data/locations";
import { usePlayer } from "@/contexts/PlayerContext";
import { createPersistentStore, isRecord } from "@/lib/persistent-store";
import { usePersistentStore } from "@/hooks/usePersistentStore";

import { reconcileQuests } from "@/lib/quest-rules";

interface QuestContextType {
  progress: Record<string, QuestProgress>;
  onLocationExplored: (locationId: string, category: string, districtId: string) => void;
  claimReward: (questId: string) => { exp: number; coins: number; badge?: string } | null;
  getQuestProgress: (questId: string) => QuestProgress;
}
const QuestContext = createContext<QuestContextType | null>(null);

function createInitialProgress(): Record<string, QuestProgress> {
  return Object.fromEntries(ALL_QUESTS.map((quest) => [quest.id, { questId: quest.id, status: "active", progress: 0 }]));
}
function normalizeProgress(value: unknown): Record<string, QuestProgress> {
  const result = createInitialProgress();
  if (!isRecord(value)) return result;
  for (const quest of ALL_QUESTS) {
    const saved = value[quest.id];
    if (!isRecord(saved)) continue;
    const count = typeof saved.progress === "number" && Number.isFinite(saved.progress)
      ? Math.max(0, Math.min(quest.targetCount, Math.floor(saved.progress))) : 0;
    result[quest.id] = {
      questId: quest.id,
      progress: saved.status === "claimed" ? quest.targetCount : count,
      status: saved.status === "claimed" ? "claimed" : count >= quest.targetCount ? "completed" : "active",
    };
  }
  return result;
}
const questStore = createPersistentStore("shanghai_island_quests", createInitialProgress(), normalizeProgress);

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const { addExperience, addCoins, completeMission, state } = usePlayer();
  const [savedProgress, setProgress] = usePersistentStore(questStore);

  const progress=useMemo(()=>reconcileQuests(ALL_QUESTS,LOCATIONS,state.exploredLocations,savedProgress),[state.exploredLocations,savedProgress]);

  // Called only after a successful first exploration; revisits cannot count as distinct places.
  const onLocationExplored = useCallback((locationId: string) => {
    if (!LOCATIONS.some((location) => location.id === locationId)) return;
    setProgress(previous=>reconcileQuests(ALL_QUESTS,LOCATIONS,[...state.exploredLocations,locationId],previous));
  }, [state.exploredLocations, setProgress]);

  const claimReward = useCallback((questId: string) => {
    const quest = getQuestById(questId);
    const current = reconcileQuests(ALL_QUESTS, LOCATIONS, state.exploredLocations, questStore.getSnapshot());
    if (!quest || current[questId]?.status !== "completed") return null;
    // Persist the claim synchronously before granting rewards; a second click sees "claimed".
    setProgress({ ...current, [questId]: { ...current[questId], status: "claimed" } });
    addExperience(quest.reward.exp);
    addCoins(quest.reward.coins);
    completeMission(questId);
    return quest.reward;
  }, [setProgress, addExperience, addCoins, completeMission, state.exploredLocations]);

  const getQuestProgress = useCallback((questId: string): QuestProgress => progress[questId] ?? { questId, status: "active", progress: 0 }, [progress]);

  return <QuestContext.Provider value={{ progress, onLocationExplored, claimReward, getQuestProgress }}>{children}</QuestContext.Provider>;
}

export function useQuests() {
  const context = useContext(QuestContext);
  if (!context) throw new Error("useQuests must be used within QuestProvider");
  return context;
}
