"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { HomeState, FurnitureItem } from "@/game/home";
import { createDefaultHome, getHomeLevelInfo, HOME_LEVELS, UNLOCKABLE_FURNITURE } from "@/game/home";
import { usePlayer } from "@/contexts/PlayerContext";

const STORAGE_KEY = "shanghai_island_home";

interface HomeContextType {
  home: HomeState;
  // 升级小屋
  upgradeHome: () => boolean;
  // 添加家具到槽位
  placeFurniture: (item: FurnitureItem, slot: number) => void;
  // 移除家具
  removeFurniture: (slot: number) => void;
  // 添加装饰
  addDecoration: (id: string, name: string, emoji: string) => void;
  // 获取当前等级配置
  getHomeLevel: () => { level: number; name: string; slots: number; upgradeCost: number };
  // 获取已解锁但未放置的家具
  getAvailableFurniture: () => FurnitureItem[];
}

const HomeContext = createContext<HomeContextType | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { state, addCoins } = usePlayer();
  const [home, setHome] = useState<HomeState>(createDefaultHome());

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHome({
          homeLevel: parsed.homeLevel ?? 1,
          furniture: parsed.furniture ?? [],
          decorations: parsed.decorations ?? [],
          trophies: parsed.trophies ?? [],
          collectedPlaces: parsed.collectedPlaces ?? [],
        });
      }
    } catch {}
  }, []);

  // 同步探索地点到 collectedPlaces
  useEffect(() => {
    if (state.exploredLocations.length > 0) {
      setHome((prev) => {
        if (prev.collectedPlaces.length === state.exploredLocations.length) return prev;
        const newHome = { ...prev, collectedPlaces: [...state.exploredLocations] };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newHome)); } catch {}
        return newHome;
      });
    }
  }, [state.exploredLocations]);

  // 同步已完成徽章到 trophies
  useEffect(() => {
    const claimedQuests = state.completedMissions;
    if (claimedQuests.length > 0) {
      setHome((prev) => {
        if (prev.trophies.length === claimedQuests.length) return prev;
        const newHome = { ...prev, trophies: [...claimedQuests] };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newHome)); } catch {}
        return newHome;
      });
    }
  }, [state.completedMissions]);

  const save = useCallback((newHome: HomeState) => {
    setHome(newHome);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newHome)); } catch {}
  }, []);

  // 升级小屋
  const upgradeHome = useCallback(() => {
    const currentLevel = HOME_LEVELS.find((h) => h.level === home.homeLevel);
    if (!currentLevel || currentLevel.upgradeCost === 0) return false;
    if (state.coins < currentLevel.upgradeCost) return false;

    addCoins(-currentLevel.upgradeCost);
    const newHome: HomeState = {
      ...home,
      homeLevel: home.homeLevel + 1,
    };
    save(newHome);
    return true;
  }, [home, state.coins, addCoins, save]);

  // 放置家具到槽位
  const placeFurniture = useCallback((item: FurnitureItem, slot: number) => {
    setHome((prev) => {
      // 移除该槽位已有家具
      const filtered = prev.furniture.filter((f) => f.slot !== slot);
      // 添加新家具
      const newFurniture = [...filtered, { ...item, slot }];
      const newHome = { ...prev, furniture: newFurniture };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newHome)); } catch {}
      return newHome;
    });
  }, []);

  // 移除家具
  const removeFurniture = useCallback((slot: number) => {
    setHome((prev) => {
      const newFurniture = prev.furniture.filter((f) => f.slot !== slot);
      const newHome = { ...prev, furniture: newFurniture };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newHome)); } catch {}
      return newHome;
    });
  }, []);

  // 添加装饰
  const addDecoration = useCallback((id: string, name: string, emoji: string) => {
    setHome((prev) => {
      if (prev.decorations.some((d) => d.id === id)) return prev;
      const newHome = {
        ...prev,
        decorations: [...prev.decorations, { id, name, emoji, position: "wall" as const }],
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newHome)); } catch {}
      return newHome;
    });
  }, []);

  // 获取当前等级配置
  const getHomeLevel = useCallback(() => {
    const info = getHomeLevelInfo(home.homeLevel);
    return {
      level: info.level,
      name: info.name,
      slots: info.slots,
      upgradeCost: info.upgradeCost,
    };
  }, [home.homeLevel]);

  // 获取已解锁但未放置的家具
  const getAvailableFurniture = useCallback(() => {
    const placed = new Set(home.furniture.map((f) => f.id));
    return UNLOCKABLE_FURNITURE.filter((f) => !placed.has(f.id));
  }, [home.furniture]);

  return (
    <HomeContext.Provider value={{
      home,
      upgradeHome,
      placeFurniture,
      removeFurniture,
      addDecoration,
      getHomeLevel,
      getAvailableFurniture,
    }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHome must be used within HomeProvider");
  return ctx;
}
