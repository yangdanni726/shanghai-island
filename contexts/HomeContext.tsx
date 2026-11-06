"use client";

import { createContext, useContext, useCallback } from "react";
import type { HomeState, FurnitureItem, DecorationItem } from "@/game/home";
import { createDefaultHome, getHomeLevelInfo, HOME_LEVELS, UNLOCKABLE_FURNITURE } from "@/game/home";
import { usePlayer } from "@/contexts/PlayerContext";
import { useQuests } from "@/contexts/QuestContext";
import { BADGES } from "@/game/quests";
import { createPersistentStore, isRecord } from "@/lib/persistent-store";
import { usePersistentStore } from "@/hooks/usePersistentStore";

function normalizeHome(value: unknown): HomeState {
  const initial = createDefaultHome();
  if (!isRecord(value)) return initial;
  return {
    ...initial,
    homeLevel: HOME_LEVELS.some((level) => level.level === value.homeLevel) ? value.homeLevel as number : 1,
    furniture: Array.isArray(value.furniture) ? value.furniture.filter((item): item is FurnitureItem =>
      isRecord(item) && typeof item.id === "string" && typeof item.name === "string" && typeof item.emoji === "string" && Number.isInteger(item.slot)
    ) : initial.furniture,
    decorations: Array.isArray(value.decorations) ? value.decorations.filter((item): item is DecorationItem =>
      isRecord(item) && typeof item.id === "string" && typeof item.name === "string" && typeof item.emoji === "string"
    ) : [],
  };
}
const homeStore = createPersistentStore("shanghai_island_home", createDefaultHome(), normalizeHome);

interface HomeContextType {
  home: HomeState;
  upgradeHome: () => boolean;
  placeFurniture: (item: FurnitureItem, slot: number) => void;
  removeFurniture: (slot: number) => void;
  addDecoration: (id: string, name: string, emoji: string) => void;
  getHomeLevel: () => { level: number; name: string; slots: number; upgradeCost: number };
  getAvailableFurniture: () => FurnitureItem[];
}
const HomeContext = createContext<HomeContextType | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { state, spendCoins } = usePlayer();
  const { progress } = useQuests();
  const [savedHome, setHome] = usePersistentStore(homeStore);
  // These are views of the authoritative stores, not duplicated data synchronized in Effects.
  const home: HomeState = {
    ...savedHome, collectedPlaces: state.exploredLocations,
    trophies: BADGES.filter((badge) => progress[badge.id]?.status === "claimed").map((badge) => badge.id),
  };

  const upgradeHome = useCallback(() => {
    const current = homeStore.getSnapshot();
    const level = getHomeLevelInfo(current.homeLevel);
    if (level.upgradeCost <= 0 || !spendCoins(level.upgradeCost)) return false;
    setHome({ ...current, homeLevel: current.homeLevel + 1 });
    return true;
  }, [setHome, spendCoins]);

  const placeFurniture = useCallback((item: FurnitureItem, slot: number) => {
    setHome((previous) => {
      if (!Number.isInteger(slot) || slot < 0 || slot >= getHomeLevelInfo(previous.homeLevel).slots) return previous;
      return { ...previous, furniture: [...previous.furniture.filter((entry) => entry.slot !== slot && entry.id !== item.id), { ...item, slot }] };
    });
  }, [setHome]);
  const removeFurniture = useCallback((slot: number) => {
    setHome((previous) => ({ ...previous, furniture: previous.furniture.filter((item) => item.slot !== slot) }));
  }, [setHome]);
  const addDecoration = useCallback((id: string, name: string, emoji: string) => {
    setHome((previous) => previous.decorations.some((item) => item.id === id) ? previous : {
      ...previous, decorations: [...previous.decorations, { id, name, emoji, position: "wall" }],
    });
  }, [setHome]);
  const getHomeLevel = useCallback(() => getHomeLevelInfo(savedHome.homeLevel), [savedHome.homeLevel]);
  const getAvailableFurniture = useCallback(() => {
    const placed = new Set(savedHome.furniture.map((item) => item.id));
    return UNLOCKABLE_FURNITURE.filter((item) => !placed.has(item.id));
  }, [savedHome.furniture]);

  return <HomeContext.Provider value={{ home, upgradeHome, placeFurniture, removeFurniture, addDecoration, getHomeLevel, getAvailableFurniture }}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const context = useContext(HomeContext);
  if (!context) throw new Error("useHome must be used within HomeProvider");
  return context;
}
