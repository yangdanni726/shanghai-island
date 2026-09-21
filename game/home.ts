// 家园系统数据模型

export interface FurnitureItem {
  id: string;
  name: string;
  emoji: string;
  slot: number;          // 槽位编号 0-5
  category: "basic" | "reward" | "shop";
}

export interface DecorationItem {
  id: string;
  name: string;
  emoji: string;
  position: "wall" | "floor" | "ceiling";
}

export interface HomeState {
  homeLevel: number;
  furniture: FurnitureItem[];
  decorations: DecorationItem[];
  trophies: string[];          // 徽章ID列表
  collectedPlaces: string[];  // 已收集地点ID
}

// 家园等级配置
export const HOME_LEVELS = [
  { level: 1, name: "温馨小屋", slots: 3, upgradeCost: 200 },
  { level: 2, name: "舒适公寓", slots: 4, upgradeCost: 500 },
  { level: 3, name: "豪华别墅", slots: 5, upgradeCost: 1000 },
  { level: 4, name: "岛屿庄园", slots: 6, upgradeCost: 0 },
];

// 默认家具 — Lv.1 初始配置
export const DEFAULT_FURNITURE: FurnitureItem[] = [
  { id: "bed", name: "小床", emoji: "🛏️", slot: 0, category: "basic" },
  { id: "table", name: "木桌", emoji: "🪑", slot: 1, category: "basic" },
  { id: "lamp", name: "台灯", emoji: "💡", slot: 2, category: "basic" },
];

// 可解锁家具 — 随等级/成就解锁
export const UNLOCKABLE_FURNITURE: FurnitureItem[] = [
  { id: "bookshelf", name: "书架", emoji: "📚", slot: -1, category: "reward" },
  { id: "plant", name: "盆栽", emoji: "🪴", slot: -1, category: "reward" },
  { id: "rug", name: "地毯", emoji: "🟫", slot: -1, category: "shop" },
  { id: "painting", name: "画框", emoji: "🖼️", slot: -1, category: "reward" },
  { id: "trophy", name: "奖杯", emoji: "🏆", slot: -1, category: "reward" },
  { id: "guitar", name: "吉他", emoji: "🎸", slot: -1, category: "shop" },
];

// 房间背景主题
export const ROOM_THEMES = [
  { level: 1, wallColor: "#f5e8d0", floorColor: "#e8d5b8", name: "原木小屋" },
  { level: 2, wallColor: "#e8e0f0", floorColor: "#d5c8e8", name: "艺术公寓" },
  { level: 3, wallColor: "#d5e8f0", floorColor: "#c5d8e8", name: "海景别墅" },
  { level: 4, wallColor: "#d5f0d0", floorColor: "#c5e8b8", name: "花园庄园" },
];

// 创建初始家园状态
export function createDefaultHome(): HomeState {
  return {
    homeLevel: 1,
    furniture: [...DEFAULT_FURNITURE],
    decorations: [],
    trophies: [],
    collectedPlaces: [],
  };
}

// 获取当前等级配置
export function getHomeLevelInfo(level: number) {
  return HOME_LEVELS.find((h) => h.level === level) || HOME_LEVELS[0];
}

// 获取房间主题
export function getRoomTheme(level: number) {
  return ROOM_THEMES.find((t) => t.level === level) || ROOM_THEMES[0];
}
