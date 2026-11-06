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

export { getLevelFromExp } from "@/game/levels";

// 当前展示版发布、点赞不奖励经验。探索和任务以各自数据表 reward 为准。
export const EXP_REWARDS = { post: 0, like: 0 };

// ====== Supabase 预留接口 ======
// 未来实现：
// export async function fetchPlayerFromDB(userId: string): Promise<Player> { ... }
// export async function savePlayerToDB(player: Player): Promise<void> { ... }
