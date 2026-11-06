import type { Islander } from "@/types";

// 当前登录岛民的 mock 数据 — Task 3 集成 Supabase 后替换为真实数据
export const MOCK_USER: Islander = {
  id: "u-001",
  nickname: "岛民小沪",
  avatar: "",
  city: "上海",
  districtId: "xuhui",
  level: 1,
  experience: 20,
  islandAge: "3天",
  islanderTitle: "城市新手",
  coins: 200,
  currentLocation: "xuhui",
  exploredCount: 15,
};

// Shared configuration; no second level table.
export { LEVEL_CONFIG, getLevelFromExp as getLevelInfo } from "@/game/levels";
