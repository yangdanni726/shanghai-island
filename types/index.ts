// 上海岛核心类型定义

// 区域主题
export type DistrictTheme = "art" | "culture" | "business" | "food" | "nature" | "education";

// 城市区域
export interface District {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  theme: DistrictTheme;
  color: string;
  colorDeep: string;
  icon: string;
  spots: string[];
  // SVG 有机路径
  path: string;
  labelX: number;
  labelY: number;
}

// 地点分类
export type LocationCategory = "food" | "coffee" | "culture" | "park" | "activity";

// 地点奖励
export interface LocationReward {
  exp: number;
  coins: number;
}

// 城市地点
export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  districtId: string;
  description: string;
  emoji: string;
  distance: string;
  recommendCount: number;
  tag: string;
  position: { x: number; y: number };   // 地图坐标
  reward: LocationReward;              // 探索奖励
}

// 岛民
export interface Islander {
  id: string;
  nickname: string;
  avatar: string;
  city: string;
  districtId: string;
  level: number;
  experience: number;
  islandAge: string;
  islanderTitle: string;    // 岛民头衔
  coins: number;            // 金币
  currentLocation: string; // 当前区域ID
  exploredCount: number;   // 已探索地点数
}

// 动态
export interface Post {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  content: string;
  location: string;
  time: string;
  likes: number;
}

// 任务
export type MissionType = "daily" | "weekly";

export interface Mission {
  id: string;
  title: string;
  reward: number;
  type: MissionType;
  completed: boolean;
}

// ============ 任务系统 ============

export type QuestType = "exploration" | "checkin" | "collection";
export type QuestFrequency = "daily" | "weekly" | "achievement";
export type QuestStatus = "available" | "active" | "completed" | "claimed";

export interface QuestTarget {
  type: "location" | "district" | "category" | "count";
  value: string | number;  // locationId / districtId / category name / count
}

export interface QuestReward {
  exp: number;
  coins: number;
  badge?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  frequency: QuestFrequency;
  target: QuestTarget;
  targetCount: number;       // 需要完成多少次
  reward: QuestReward;
  icon: string;
}

export interface QuestProgress {
  questId: string;
  status: QuestStatus;
  progress: number;          // 当前进度
}

// 徽章
export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

// ============ 游戏实体 ============

// 玩家方向
export type PlayerDirection = "up" | "down" | "left" | "right";

// 游戏玩家
export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  positionX: number;
  positionY: number;
  direction: PlayerDirection;
  currentArea: string;
  level: number;
}

// 交互点类型
export type InteractionType = "location" | "mission" | "npc" | "portal";

// 地图交互对象
export interface MapInteraction {
  id: string;
  name: string;
  type: InteractionType;
  positionX: number;
  positionY: number;
  emoji: string;
  interaction?: string;
}

// 世界状态
export interface WorldState {
  currentArea: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  weather: string;
}
