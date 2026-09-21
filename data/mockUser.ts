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

// 等级配置
export const LEVEL_CONFIG = [
  { level: 1, title: "城市新手", minExp: 0, maxExp: 100 },
  { level: 2, title: "城市探索家", minExp: 100, maxExp: 300 },
  { level: 3, title: "城市冒险家", minExp: 300, maxExp: 600 },
  { level: 4, title: "城市猎手", minExp: 600, maxExp: 1000 },
  { level: 5, title: "岛屿开拓者", minExp: 1000, maxExp: 1500 },
];

// 根据经验获取等级信息
export function getLevelInfo(exp: number) {
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
