import type { District } from "@/types";

// 游戏世界区域 — 5 个独立子岛，水道分隔，桥梁连接
export const DISTRICTS: District[] = [
  {
    id: "jingan",
    name: "静安森林岛",
    description: "梧桐咖啡·静安古寺",
    position: { x: 175, y: 135 },
    theme: "nature",
    color: "#d5f0c5",
    colorDeep: "#b8e0a8",
    icon: "🌳",
    spots: ["静安寺", "武康路咖啡"],
    // 静安森林岛 — 左上子岛
    path: "M115 85 Q85 95 90 130 Q80 165 110 185 Q145 200 175 190 Q210 195 235 170 Q250 140 240 105 Q220 78 185 72 Q150 68 115 85 Z",
    labelX: 175,
    labelY: 135,
  },
  {
    id: "huangpu",
    name: "黄浦中心岛",
    description: "外滩万国·城隍豫园",
    position: { x: 425, y: 135 },
    theme: "culture",
    color: "#ffe5c0",
    colorDeep: "#ffd098",
    icon: "🏙️",
    spots: ["外滩", "南京路", "城隍庙", "豫园"],
    // 黄浦中心岛 — 右上子岛
    path: "M365 85 Q335 95 340 130 Q330 165 360 185 Q395 200 425 190 Q460 195 485 170 Q500 140 490 105 Q470 78 435 72 Q400 68 365 85 Z",
    labelX: 425,
    labelY: 135,
  },
  {
    id: "xuhui",
    name: "徐汇生活岛",
    description: "武康路·西岸艺术",
    position: { x: 300, y: 255 },
    theme: "art",
    color: "#d5c8f0",
    colorDeep: "#c0aee8",
    icon: "🎨",
    spots: ["武康大楼", "西岸美术馆"],
    // 徐汇生活岛 — 中央枢纽岛
    path: "M255 215 Q225 225 230 255 Q220 285 250 305 Q280 320 300 315 Q320 320 350 305 Q380 285 370 255 Q380 225 350 215 Q320 205 255 215 Z",
    labelX: 300,
    labelY: 255,
  },
  {
    id: "yangpu",
    name: "杨浦创意岛",
    description: "大学路·五角场",
    position: { x: 175, y: 365 },
    theme: "education",
    color: "#f0c8d5",
    colorDeep: "#e8b0c5",
    icon: "🎸",
    spots: ["大学路"],
    // 杨浦创意岛 — 左下子岛
    path: "M115 315 Q85 325 90 360 Q80 395 110 415 Q145 430 175 420 Q210 425 235 400 Q250 370 240 335 Q220 308 185 302 Q150 298 115 315 Z",
    labelX: 175,
    labelY: 365,
  },
  {
    id: "pudong",
    name: "浦东未来岛",
    description: "陆家嘴·世纪公园",
    position: { x: 425, y: 365 },
    theme: "business",
    color: "#c5d8f0",
    colorDeep: "#a8c4e8",
    icon: "🌆",
    spots: ["陆家嘴", "世纪公园"],
    // 浦东未来岛 — 右下子岛
    path: "M365 315 Q335 325 340 360 Q330 395 360 415 Q395 430 425 420 Q460 425 485 400 Q500 370 490 335 Q470 308 435 302 Q400 298 365 315 Z",
    labelX: 425,
    labelY: 365,
  },
];

// 按 ID 查找区域
export const getDistrictById = (id: string): District | undefined =>
  DISTRICTS.find((d) => d.id === id);

// 桥梁连接 — 子岛间的卡通桥
export const BRIDGES = [
  { x1: 240, y1: 135, x2: 340, y2: 135, label: "静安→黄浦" },   // 上方横桥
  { x1: 200, y1: 185, x2: 255, y2: 225, label: "静安→徐汇" },   // 左上斜桥
  { x1: 400, y1: 185, x2: 345, y2: 225, label: "黄浦→徐汇" },   // 右上斜桥
  { x1: 255, y1: 285, x2: 210, y2: 320, label: "徐汇→杨浦" },   // 左下斜桥
  { x1: 345, y1: 285, x2: 390, y2: 320, label: "徐汇→浦东" },   // 右下斜桥
  { x1: 240, y1: 365, x2: 340, y2: 365, label: "杨浦→浦东" },   // 下方横桥
];

// 地标点缀
export const LANDMARK_PINS = [
  { x: 420, y: 110, label: "东方明珠" },
  { x: 430, y: 100, label: "上海中心" },
  { x: 165, y: 115, label: "静安寺" },
  { x: 295, y: 240, label: "武康大楼" },
];
