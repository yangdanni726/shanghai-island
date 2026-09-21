// Shanghai Island 游戏设计令牌
// 参考：奥比岛、动森、cozy city adventure 风格

export const gameColors = {
  // 主色板
  ocean: "#5bb4e8",          // 海洋蓝 — 主品牌色
  oceanDeep: "#3a9ad8",      // 深海蓝 — 悬停态
  oceanLight: "#a8d5e8",     // 浅海蓝 — 背景装饰
  island: "#6ab04c",         // 岛屿绿 — 成功/探索
  islandDeep: "#4a8c2c",     // 深岛绿
  islandLight: "#c5e8b7",    // 浅岛绿 — 背景
  sand: "#f0e6d3",            // 沙滩黄 — 卡片底色
  sandDeep: "#e8d4a8",       // 深沙黄
  gold: "#f0a500",           // 奖励金 — 金币/成就
  goldLight: "#fff3d6",      // 浅金 — 背景高亮
  coral: "#ff6b6b",          // 珊瑚红 — 警告/重点
  coralLight: "#ffd5d5",     // 浅珊瑚 — 背景
  purple: "#9b7ec8",         // 任务紫 — 任务系统
  purpleLight: "#e0d4f0",    // 浅紫 — 背景

  // 中性色
  ink: "#1a1a2e",            // 主文字
  inkSoft: "#555",           // 次要文字
  inkFaint: "#999",          // 辅助文字
  panel: "rgba(255, 255, 255, 0.88)",    // 面板白（半透明）
  panelSolid: "#ffffff",     // 纯白
  cream: "#fbfaf7",          // 奶油白 — 页面底色

  // 场景色
  bg: "#f5f1ea",             // 页面背景
  oceanBg: "#e8f4f8",        // 海洋背景渐变
} as const;

export const gameRadius = {
  card: 20,       // 卡片圆角
  button: 14,     // 按钮圆角
  popup: 24,      // 弹窗圆角
  pill: 999,      // 胶囊形
  tag: 8,         // 标签圆角
} as const;

export const gameShadow = {
  soft: "0 4px 20px rgba(0, 0, 0, 0.06)",         // 柔和阴影
  card: "0 2px 12px rgba(0, 0, 0, 0.05)",          // 卡片阴影
  popup: "0 8px 32px rgba(0, 0, 0, 0.12)",          // 弹窗阴影
  glow: "0 0 16px rgba(91, 180, 232, 0.3)",        // 发光阴影
  none: "none",
} as const;

export const gameFont = {
  title: { fontSize: "18px", fontWeight: 700, lineHeight: 1.3 },
  subtitle: { fontSize: "14px", fontWeight: 600, lineHeight: 1.4 },
  body: { fontSize: "13px", fontWeight: 400, lineHeight: 1.6 },
  caption: { fontSize: "11px", fontWeight: 400, lineHeight: 1.4 },
  reward: { fontSize: "16px", fontWeight: 700, lineHeight: 1.2 },
  label: { fontSize: "10px", fontWeight: 600, lineHeight: 1.2 },
} as const;

// 弹簧动画曲线
export const gameTransition = {
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

// 类名快捷引用
export const gameClassName = {
  panel: "backdrop-blur-xl bg-white/88 rounded-20 border border-black/5 shadow-soft",
  card: "bg-white rounded-20 border border-black/5 shadow-card",
  button: "rounded-14 font-bold transition-all duration-300 active:scale-95",
} as const;
