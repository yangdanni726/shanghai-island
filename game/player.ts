import type { Player } from "@/types";
import { getDistrictById } from "@/data/districts";

// ====== 玩家工具函数 ======
// 当前阶段：数据来自 PlayerContext + localStorage
// 未来阶段：替换为 Supabase queries，游戏逻辑不变

// 玩家移动到指定区域 — 返回新位置
export function calcPosition(districtId: string): { x: number; y: number } {
  const district = getDistrictById(districtId);
  if (!district) return { x: 300, y: 250 };
  return { x: district.labelX, y: district.labelY };
}

// 计算等级（经验 → 等级配置）
const LEVELS = [
  { level: 1, title: "城市新手", minExp: 0, maxExp: 100 },
  { level: 2, title: "城市探索家", minExp: 100, maxExp: 300 },
  { level: 3, title: "城市冒险家", minExp: 300, maxExp: 600 },
  { level: 4, title: "城市猎手", minExp: 600, maxExp: 1000 },
  { level: 5, title: "岛屿开拓者", minExp: 1000, maxExp: 1500 },
];

export function getLevelFromExp(exp: number) {
  let config = LEVELS[0];
  for (const c of LEVELS) {
    if (exp >= c.minExp) config = c;
  }
  return {
    level: config.level,
    title: config.title,
    maxExp: config.maxExp,
    nextLevelExp: config.maxExp - exp,
    progress: ((exp - config.minExp) / (config.maxExp - config.minExp)) * 100,
  };
}

// 经验奖励配置
export const EXP_REWARDS = {
  explore: 10,    // 探索地点
  mission: 30,    // 完成任务
  post: 5,        // 发布动态
  like: 5,        // 获得点赞
};

// ====== Supabase 预留接口 ======
// 未来实现：
// export async function fetchPlayerFromDB(userId: string): Promise<Player> { ... }
// export async function savePlayerToDB(player: Player): Promise<void> { ... }
