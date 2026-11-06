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
      name: "探索任务",
      type: "mission",
      positionX: 300,
      positionY: 95,
      emoji: "⭐",
      interaction: "查看探索任务",
    },
    {
      id: "mission-weekly",
      name: "进阶挑战",
      type: "mission",
      positionX: 500,
      positionY: 380,
      emoji: "📜",
      interaction: "查看进阶挑战",
    },
  ];
}
