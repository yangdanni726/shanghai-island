"use client";

interface PlayerAvatarProps {
  avatar: string;
  nickname: string;
  level: number;
  x: number;
  y: number;
  showName?: boolean;
}

// 卡通岛民角色 — SVG 绘制的小人，带待机呼吸动画
export default function PlayerAvatar({
  avatar,
  nickname,
  level,
  x,
  y,
  showName = true,
}: PlayerAvatarProps) {
  // 根据 avatar emoji 决定角色色调
  const skinTone = "#f4d4a8";
  const hairColor = avatar === "👧" ? "#5a3a2a" : avatar === "🧑" ? "#3a3a3a" : "#4a3a6a";
  const bodyColor = avatar === "👧" ? "#ff9999" : avatar === "🧑" ? "#5bb4e8" : "#9b7ec8";
  const hasPigtails = avatar === "👧";

  return (
    <g pointerEvents="none" style={{ transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      {/* 地面阴影 */}
      <ellipse cx={x} cy={y + 16} rx="10" ry="3" fill="#1a1a2e" opacity="0.15" />

      {/* 等级光圈 */}
      <circle cx={x} cy={y} r="18" fill="none" stroke="#f0a500" strokeWidth="1.5" opacity="0.15" className="poi-breathe" />
      <circle cx={x} cy={y} r="14" fill="none" stroke="#f0a500" strokeWidth="0.8" opacity="0.1" />

      {/* 角色组 — 待机呼吸 */}
      <g className="player-idle" style={{ transformOrigin: `${x}px ${y}px` }}>
        {/* 身体 — 圆角矩形 */}
        <rect
          x={x - 6}
          y={y + 2}
          width="12"
          height="12"
          rx="5"
          fill={bodyColor}
          stroke="#1a1a2e"
          strokeWidth="0.5"
          strokeOpacity="0.15"
        />
        {/* 手臂 */}
        <circle cx={x - 7} cy={y + 8} r="2.5" fill={skinTone} />
        <circle cx={x + 7} cy={y + 8} r="2.5" fill={skinTone} />
        {/* 头部 */}
        <circle
          cx={x}
          cy={y - 4}
          r="7"
          fill={skinTone}
          stroke="#1a1a2e"
          strokeWidth="0.5"
          strokeOpacity="0.12"
        />
        {/* 头发 */}
        {hasPigtails ? (
          <>
            <ellipse cx={x - 6} cy={y - 6} rx="3" ry="4" fill={hairColor} />
            <ellipse cx={x + 6} cy={y - 6} rx="3" ry="4" fill={hairColor} />
            <path d={`M${x - 6} ${y - 8} Q${x} ${y - 14} ${x + 6} ${y - 8} L${x + 6} ${y - 6} L${x - 6} ${y - 6} Z`} fill={hairColor} />
          </>
        ) : (
          <path d={`M${x - 6} ${y - 6} Q${x} ${y - 12} ${x + 6} ${y - 6} L${x + 6} ${y - 5} L${x - 6} ${y - 5} Z`} fill={hairColor} />
        )}
        {/* 眼睛 */}
        <circle cx={x - 2.5} cy={y - 4} r="0.8" fill="#1a1a2e" />
        <circle cx={x + 2.5} cy={y - 4} r="0.8" fill="#1a1a2e" />
        {/* 嘴巴 — 微笑 */}
        <path d={`M${x - 1.5} ${y - 1.5} Q${x} ${y - 0.5} ${x + 1.5} ${y - 1.5}`} fill="none" stroke="#1a1a2e" strokeWidth="0.6" strokeLinecap="round" />
        {/* 腮红 */}
        <circle cx={x - 4} cy={y - 2} r="1" fill="#ff9999" opacity="0.4" />
        <circle cx={x + 4} cy={y - 2} r="1" fill="#ff9999" opacity="0.4" />
      </g>

      {/* 名牌 */}
      {showName && (
        <g>
          <rect x={x - 24} y={y - 24} width="48" height="12" rx="6" fill="white" opacity="0.9" stroke="#1a1a2e" strokeWidth="0.3" strokeOpacity="0.06" />
          <text x={x} y={y - 15} textAnchor="middle" fontSize="8" fill="#1a1a2e" fontWeight="600">
            {nickname} Lv.{level}
          </text>
        </g>
      )}
    </g>
  );
}
