import type { MapInteraction } from "@/types";
import { LOCATIONS } from "@/data/locations";

// 生成地图上的交互对象 — 从真实地点数据生成
export function getMapInteractions(): MapInteraction[] {
  return LOCATIONS.map((loc) => ({
    id: loc.id,
    name: loc.name,
    type: "location" as const,
    positionX: loc.position.x,
    positionY: loc.position.y,
    emoji: loc.emoji,
    interaction: `探索 ${loc.name}`,
  }));
}

// 任务点 — 固定位置（未来从任务数据生成）
export function getMissionPoints(): MapInteraction[] {
  return [
    {
      id: "mission-daily",
      name: "每日打卡",
      type: "mission",
      positionX: 300,
      positionY: 95,
      emoji: "⭐",
      interaction: "领取每日任务",
    },
    {
      id: "mission-weekly",
      name: "周末挑战",
      type: "mission",
      positionX: 500,
      positionY: 380,
      emoji: "📜",
      interaction: "查看本周挑战",
    },
  ];
}
