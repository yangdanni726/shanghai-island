import type { Quest, Badge } from "@/types";

// 每日任务
export const DAILY_QUESTS: Quest[] = [
  {
    id: "daily-explore-1",
    title: "初次探索",
    description: "探索 1 个新地点",
    type: "exploration",
    frequency: "daily",
    target: { type: "count", value: 1 },
    targetCount: 1,
    reward: { exp: 30, coins: 10 },
    icon: "🗺️",
  },
  {
    id: "daily-coffee",
    title: "咖啡时间",
    description: "探访一家咖啡馆",
    type: "checkin",
    frequency: "daily",
    target: { type: "category", value: "coffee" },
    targetCount: 1,
    reward: { exp: 20, coins: 15 },
    icon: "☕",
  },
  {
    id: "daily-explore-3",
    title: "城市漫步",
    description: "探索 3 个不同地点",
    type: "collection",
    frequency: "daily",
    target: { type: "count", value: 3 },
    targetCount: 3,
    reward: { exp: 50, coins: 20 },
    icon: "🚶",
  },
  {
    id: "daily-food",
    title: "寻味上海",
    description: "探访一家美食地点",
    type: "checkin",
    frequency: "daily",
    target: { type: "category", value: "food" },
    targetCount: 1,
    reward: { exp: 20, coins: 15 },
    icon: "🍜",
  },
  {
    id: "daily-culture",
    title: "文化探索",
    description: "探访一个展览/文化地点",
    type: "checkin",
    frequency: "daily",
    target: { type: "category", value: "culture" },
    targetCount: 1,
    reward: { exp: 25, coins: 15 },
    icon: "🎨",
  },
];

// 每周任务
export const WEEKLY_QUESTS: Quest[] = [
  {
    id: "weekly-all-districts",
    title: "环岛旅行",
    description: "探索全部 5 个子岛",
    type: "exploration",
    frequency: "weekly",
    target: { type: "district", value: "all" },
    targetCount: 5,
    reward: { exp: 100, coins: 50 },
    icon: "🏝️",
  },
  {
    id: "weekly-5-locations",
    title: "深度探索",
    description: "探索 5 个不同地点",
    type: "collection",
    frequency: "weekly",
    target: { type: "count", value: 5 },
    targetCount: 5,
    reward: { exp: 80, coins: 40 },
    icon: "⭐",
  },
  {
    id: "weekly-park",
    title: "公园时光",
    description: "探访 2 个公园",
    type: "collection",
    frequency: "weekly",
    target: { type: "category", value: "park" },
    targetCount: 2,
    reward: { exp: 60, coins: 30 },
    icon: "🌳",
  },
];

// 成就徽章
export const ACHIEVEMENT_QUESTS: Quest[] = [
  {
    id: "badge-coffee-3",
    title: "咖啡探索者",
    description: "探访 3 家咖啡店",
    type: "collection",
    frequency: "achievement",
    target: { type: "category", value: "coffee" },
    targetCount: 3,
    reward: { exp: 50, coins: 30, badge: "☕ 咖啡探索者" },
    icon: "☕",
  },
  {
    id: "badge-food-5",
    title: "美食猎人",
    description: "探访 5 家美食地点",
    type: "collection",
    frequency: "achievement",
    target: { type: "category", value: "food" },
    targetCount: 5,
    reward: { exp: 80, coins: 50, badge: "🍜 美食猎人" },
    icon: "🍜",
  },
  {
    id: "badge-culture-3",
    title: "艺术漫游者",
    description: "探访 3 个展览/文化地点",
    type: "collection",
    frequency: "achievement",
    target: { type: "category", value: "culture" },
    targetCount: 3,
    reward: { exp: 60, coins: 40, badge: "🎨 艺术漫游者" },
    icon: "🎨",
  },
  {
    id: "badge-explore-10",
    title: "城市冒险家",
    description: "探索 10 个不同地点",
    type: "collection",
    frequency: "achievement",
    target: { type: "count", value: 10 },
    targetCount: 10,
    reward: { exp: 100, coins: 80, badge: "🗺️ 城市冒险家" },
    icon: "🗺️",
  },
  {
    id: "badge-alldistricts",
    title: "环岛达人",
    description: "探索全部 5 个子岛",
    type: "exploration",
    frequency: "achievement",
    target: { type: "district", value: "all" },
    targetCount: 5,
    reward: { exp: 120, coins: 100, badge: "🏝️ 环岛达人" },
    icon: "🏝️",
  },
];

// 徽章列表
export const BADGES: Badge[] = [
  { id: "badge-coffee-3", name: "咖啡探索者", description: "探访3家咖啡店", emoji: "☕", unlocked: false },
  { id: "badge-food-5", name: "美食猎人", description: "探访5家美食地点", emoji: "🍜", unlocked: false },
  { id: "badge-culture-3", name: "艺术漫游者", description: "探访3个展览", emoji: "🎨", unlocked: false },
  { id: "badge-explore-10", name: "城市冒险家", description: "探索10个地点", emoji: "🗺️", unlocked: false },
  { id: "badge-alldistricts", name: "环岛达人", description: "探索全部5岛", emoji: "🏝️", unlocked: false },
];

// 全部任务
export const ALL_QUESTS: Quest[] = [...DAILY_QUESTS, ...WEEKLY_QUESTS, ...ACHIEVEMENT_QUESTS];

// 按 ID 查找任务
export const getQuestById = (id: string): Quest | undefined =>
  ALL_QUESTS.find((q) => q.id === id);

// 获取每日任务
export const getDailyQuests = (): Quest[] => DAILY_QUESTS;

// 获取每周任务
export const getWeeklyQuests = (): Quest[] => WEEKLY_QUESTS;

// 获取成就任务
export const getAchievementQuests = (): Quest[] => ACHIEVEMENT_QUESTS;
