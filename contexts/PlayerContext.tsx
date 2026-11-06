"use client";

import { createContext, useContext, useCallback } from "react";
import type { Player } from "@/types";
import { getDistrictById } from "@/data/districts";
import { getLocationById } from "@/data/locations";
import { getLevelFromExp } from "@/game/player";
import { createPersistentStore, isRecord, stringArray } from "@/lib/persistent-store";
import { usePersistentStore } from "@/hooks/usePersistentStore";

export { EXP_REWARDS } from "@/game/player";

function createDefaultPlayer(): Player {
  return { id: "", nickname: "", avatar: "", positionX: 0, positionY: 0, direction: "down", currentArea: "", level: 0 };
}

interface PlayerState {
  player: Player;
  experience: number;
  coins: number;
  exploredCount: number;
  exploredLocations: string[];
  completedMissions: string[];
  islanderTitle: string;
  isCreated: boolean;
}

function createInitialState(): PlayerState {
  return {
    player: createDefaultPlayer(), experience: 0, coins: 100,
    exploredCount: 0, exploredLocations: [], completedMissions: [],
    islanderTitle: "城市新手", isCreated: false,
  };
}

function normalizePlayer(value: unknown): PlayerState {
  if (!isRecord(value)) return createInitialState();
  const initial = createInitialState();
  const rawPlayer = isRecord(value.player) ? value.player : {};
  const number = (input: unknown, fallback: number) => typeof input === "number" && Number.isFinite(input) ? input : fallback;
  const text = (input: unknown) => typeof input === "string" ? input : "";
  const experience = Math.max(0, number(value.experience, 0));
  const level = getLevelFromExp(experience);
  const locations = stringArray(value.exploredLocations);
  return {
    ...initial,
    player: {
      ...initial.player,
      id: text(rawPlayer.id), nickname: text(rawPlayer.nickname), avatar: text(rawPlayer.avatar),
      positionX: number(rawPlayer.positionX, 0), positionY: number(rawPlayer.positionY, 0),
      direction: ["up", "down", "left", "right"].includes(text(rawPlayer.direction)) ? rawPlayer.direction as Player["direction"] : "down",
      currentArea: text(rawPlayer.currentArea), level: level.level,
    },
    experience, coins: Math.max(0, number(value.coins, 100)),
    exploredLocations: locations, exploredCount: locations.length,
    completedMissions: stringArray(value.completedMissions),
    islanderTitle: level.title,
    isCreated: value.isCreated === true && Boolean(rawPlayer.id),
  };
}

const playerStore = createPersistentStore("shanghai_island_player", createInitialState(), normalizePlayer);

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
  spendCoins: (amount: number) => boolean;
  completeMission: (missionId: string) => void;
  exploreLocation: (locationId: string) => ExploreResult;
  isExplored: (locationId: string) => boolean;
  getLevel: () => ReturnType<typeof getLevelFromExp>;
  resetPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState, isLoaded] = usePersistentStore(playerStore);

  const createIslander = useCallback((nickname: string, avatar: string, areaId: string) => {
    const district = getDistrictById(areaId) ?? getDistrictById("xuhui")!;
    setState({
      ...createInitialState(), isCreated: true,
      player: {
        id: crypto.randomUUID(), nickname, avatar,
        positionX: district.labelX, positionY: district.labelY,
        direction: "down", currentArea: district.id, level: 1,
      },
    });
  }, [setState]);

  const moveToArea = useCallback((areaId: string) => {
    const district = getDistrictById(areaId);
    if (!district) return;
    setState((previous) => ({
      ...previous,
      player: { ...previous.player, positionX: district.labelX, positionY: district.labelY, currentArea: areaId },
    }));
  }, [setState]);

  const addExperience = useCallback((amount: number) => {
    if (!Number.isFinite(amount)) return;
    setState((previous) => {
      const experience = Math.max(0, previous.experience + amount);
      const level = getLevelFromExp(experience);
      return { ...previous, experience, player: { ...previous.player, level: level.level }, islanderTitle: level.title };
    });
  }, [setState]);

  const addCoins = useCallback((amount: number) => {
    if (Number.isFinite(amount)) setState((previous) => ({ ...previous, coins: Math.max(0, previous.coins + amount) }));
  }, [setState]);

  const spendCoins = useCallback((amount: number) => {
    const current = playerStore.getSnapshot();
    if (!Number.isFinite(amount) || amount < 0 || current.coins < amount) return false;
    setState({ ...current, coins: current.coins - amount });
    return true;
  }, [setState]);

  const completeMission = useCallback((missionId: string) => {
    setState((previous) => previous.completedMissions.includes(missionId) ? previous : {
      ...previous, completedMissions: [...previous.completedMissions, missionId],
    });
  }, [setState]);

  const exploreLocation = useCallback((locationId: string): ExploreResult => {
    const location = getLocationById(locationId);
    const previous = playerStore.getSnapshot();
    if (!location || !previous.isCreated) return { success: false, isFirstTime: false, expGained: 0, coinsGained: 0 };
    // Read the latest store, not a render closure: consecutive events cannot award two first visits.
    const isFirstTime = !previous.exploredLocations.includes(locationId);
    const expGained = isFirstTime ? location.reward.exp : Math.floor(location.reward.exp * 0.2);
    const coinsGained = isFirstTime ? location.reward.coins : 0;
    const experience = previous.experience + expGained;
    const level = getLevelFromExp(experience);
    const exploredLocations = isFirstTime ? [...previous.exploredLocations, locationId] : previous.exploredLocations;
    setState({
      ...previous, experience, coins: previous.coins + coinsGained,
      exploredLocations, exploredCount: exploredLocations.length,
      player: { ...previous.player, level: level.level }, islanderTitle: level.title,
    });
    return { success: true, isFirstTime, expGained, coinsGained };
  }, [setState]);

  const getLevel = useCallback(() => getLevelFromExp(state.experience), [state.experience]);
  const isExplored = useCallback((id: string) => state.exploredLocations.includes(id), [state.exploredLocations]);
  const resetPlayer = useCallback(() => { setState(createInitialState()); }, [setState]);

  return <PlayerContext.Provider value={{
    state, isLoaded, createIslander, moveToArea, addExperience, addCoins, spendCoins,
    completeMission, exploreLocation, isExplored, getLevel, resetPlayer,
  }}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}
