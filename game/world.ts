import type { WorldState } from "@/types";

// 游戏世界状态 — 初始 mock，Task 3 后接入 Supabase
export const WORLD: WorldState = {
  currentArea: "xuhui",
  timeOfDay: "afternoon",
  weather: "晴 26°C",
};

// 时段显示
export const TIME_LABELS: Record<WorldState["timeOfDay"], string> = {
  morning: "☀️ 上午",
  afternoon: "🌤 下午",
  evening: "🌆 傍晚",
  night: "🌙 夜晚",
};

// 时段背景色
export const TIME_BG_COLORS: Record<WorldState["timeOfDay"], string> = {
  morning: "#fef9e7",
  afternoon: "#e8f4f8",
  evening: "#f8e8e0",
  night: "#2a2a3e",
};
