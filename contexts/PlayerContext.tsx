"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Player, PlayerDirection } from "@/types";
import { getDistrictById } from "@/data/districts";
import { getLocationById } from "@/data/locations";

// 等级配置
const LEVEL_CONFIG = [
  { level: 1, title: "城市新手", minExp: 0, maxExp: 100 },
  { level: 2, title: "城市探索家", minExp: 100, maxExp: 300 },
  { level: 3, title: "城市冒险家", minExp: 300, maxExp: 600 },
  { level: 4, title: "城市猎手", minExp: 600, maxExp: 1000 },
  { level: 5, title: "岛屿开拓者", minExp: 1000, maxExp: 1500 },
];

// 经验来源
export const EXP_REWARDS = {
  explore: 10,    // 探索地点
  mission: 30,    // 完成任务
  post: 5,        // 发布动态
  like: 5,        // 获得点赞
};

const STORAGE_KEY = "shanghai_island_player";

// 默认初始玩家（未创建）
function createDefaultPlayer(): Player {
  return {
    id: "",
    nickname: "",
    avatar: "",
    positionX: 0,
    positionY: 0,
    direction: "down" as PlayerDirection,
    currentArea: "",
    level: 0,
  };
}

// 根据经验获取等级信息
function getLevelInfo(exp: number) {
  let config = LEVEL_CONFIG[0];
  for (const c of LEVEL_CONFIG) {
    if (exp >= c.minExp) config = c;
  }
  return {
    level: config.level,
    title: config.title,
    maxExp: config.maxExp,
    nextLevelExp: config.maxExp - exp,
  };
}

// 玩家完整状态（含游戏数据）
interface PlayerState {
  player: Player;                 // 游戏世界状态
  experience: number;
  coins: number;
  exploredCount: number;
  exploredLocations: string[];     // 已探索地点ID列表
  completedMissions: string[];     // 任务ID列表
  islanderTitle: string;
  isCreated: boolean;              // 是否已创建角色
}

// 探索结果
interface ExploreResult {
  success: boolean;
  isFirstTime: boolean;
  expGained: number;
  coinsGained: number;
}

interface PlayerContextType {
  state: PlayerState;
  isLoaded: boolean;
  createIslander: (nickname: string, avatar: string, areaId: string) => void;
  moveToArea: (areaId: string) => void;
  addExperience: (amount: number) => void;
  addCoins: (amount: number) => void;
  completeMission: (missionId: string) => void;
  exploreLocation: (locationId: string) => ExploreResult;   // 探索地点
  isExplored: (locationId: string) => boolean;               // 是否已探索
  getLevel: () => { level: number; title: string; maxExp: number; nextLevelExp: number };
  resetPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    player: createDefaultPlayer(),
    experience: 0,
    coins: 100,
    exploredCount: 0,
    exploredLocations: [],
    completedMissions: [],
    islanderTitle: "城市新手",
    isCreated: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载（兼容旧数据）
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 兼容旧数据 — 确保所有字段存在
        setState({
          player: parsed.player || createDefaultPlayer(),
          experience: parsed.experience ?? 0,
          coins: parsed.coins ?? 100,
          exploredCount: parsed.exploredCount ?? 0,
          exploredLocations: parsed.exploredLocations ?? [],
          completedMissions: parsed.completedMissions ?? [],
          islanderTitle: parsed.islanderTitle ?? "城市新手",
          isCreated: parsed.isCreated ?? false,
        });
      }
    } catch {
      // 解析失败，使用默认值
    }
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  const save = useCallback((newState: PlayerState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // 存储失败，忽略
    }
  }, []);

  // 创建新岛民
  const createIslander = useCallback((nickname: string, avatar: string, areaId: string) => {
    const district = getDistrictById(areaId);
    const newPlayer: Player = {
      id: `islander-${Date.now()}`,
      nickname,
      avatar,
      positionX: district?.labelX ?? 290,
      positionY: district?.labelY ?? 260,
      direction: "down",
      currentArea: areaId,
      level: 1,
    };
    save({
      player: newPlayer,
      experience: 0,
      coins: 100,
      exploredCount: 0,
      exploredLocations: [],
      completedMissions: [],
      islanderTitle: "城市新手",
      isCreated: true,
    });
  }, [save]);

  // 移动到区域
  const moveToArea = useCallback((areaId: string) => {
    const district = getDistrictById(areaId);
    if (!district) return;
    setState((prev) => {
      const newState = {
        ...prev,
        player: {
          ...prev.player,
          positionX: district.labelX,
          positionY: district.labelY,
          currentArea: areaId,
        },
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch {}
      return newState;
    });
  }, []);

  // 增加经验
  const addExperience = useCallback((amount: number) => {
    setState((prev) => {
      const newExp = prev.experience + amount;
      const levelInfo = getLevelInfo(newExp);
      const newState = {
        ...prev,
        experience: newExp,
        player: { ...prev.player, level: levelInfo.level },
        islanderTitle: levelInfo.title,
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch {}
      return newState;
    });
  }, []);

  // 增加金币
  const addCoins = useCallback((amount: number) => {
    setState((prev) => {
      const newState = { ...prev, coins: prev.coins + amount };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch {}
      return newState;
    });
  }, []);

  // 标记任务完成
  const completeMission = useCallback((missionId: string) => {
    setState((prev) => {
      if (prev.completedMissions.includes(missionId)) return prev;
      const newState = {
        ...prev,
        completedMissions: [...prev.completedMissions, missionId],
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch {}
      return newState;
    });
  }, []);

  // 获取等级信息
  const getLevel = useCallback(() => getLevelInfo(state.experience), [state.experience]);

  // 重置
  const resetPlayer = useCallback(() => {
    const def = {
      player: createDefaultPlayer(),
      experience: 0,
      coins: 100,
      exploredCount: 0,
      exploredLocations: [],
      completedMissions: [],
      islanderTitle: "城市新手",
      isCreated: false,
    };
    save(def);
  }, [save]);

  // 探索地点 — 核心游戏循环
  const exploreLocation = useCallback((locationId: string): ExploreResult => {
    const loc = getLocationById(locationId);
    if (!loc) return { success: false, isFirstTime: false, expGained: 0, coinsGained: 0 };

    const isFirstTime = !state.exploredLocations.includes(locationId);
    const expGain = isFirstTime ? loc.reward.exp : Math.floor(loc.reward.exp * 0.2);
    const coinGain = isFirstTime ? loc.reward.coins : 0;

    setState((prev) => {
      const newExp = prev.experience + expGain;
      const levelInfo = getLevelInfo(newExp);
      const newExploredList = isFirstTime
        ? [...prev.exploredLocations, locationId]
        : prev.exploredLocations;
      const newExploredCount = isFirstTime ? prev.exploredCount + 1 : prev.exploredCount;

      const newState = {
        ...prev,
        experience: newExp,
        coins: prev.coins + coinGain,
        exploredCount: newExploredCount,
        exploredLocations: newExploredList,
        player: { ...prev.player, level: levelInfo.level },
        islanderTitle: levelInfo.title,
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch {}
      return newState;
    });

    return {
      success: true,
      isFirstTime,
      expGained: expGain,
      coinsGained: coinGain,
    };
  }, [state.exploredLocations]);

  // 是否已探索
  const isExplored = useCallback((locationId: string) => state.exploredLocations.includes(locationId), [state.exploredLocations]);

  return (
    <PlayerContext.Provider value={{
      state,
      isLoaded,
      createIslander,
      moveToArea,
      addExperience,
      addCoins,
      completeMission,
      exploreLocation,
      isExplored,
      getLevel,
      resetPlayer,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
