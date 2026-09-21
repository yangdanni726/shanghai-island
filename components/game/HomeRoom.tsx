"use client";

import { getRoomTheme, getHomeLevelInfo } from "@/game/home";
import { gameColors, gameRadius, gameShadow } from "@/styles/game-theme";

interface HomeRoomProps {
  homeLevel: number;
  furniture: { id: string; name: string; emoji: string; slot: number }[];
  trophies: string[];
}

// 岛屋房间 — SVG 绘制的温馨小房间，等距视角
export default function HomeRoom({ homeLevel, furniture, trophies }: HomeRoomProps) {
  const theme = getRoomTheme(homeLevel);
  const levelInfo = getHomeLevelInfo(homeLevel);
  const slots = levelInfo.slots;

  // 槽位坐标 — 底部一排
  const slotPositions = [
    { x: 80, y: 170 },
    { x: 140, y: 170 },
    { x: 200, y: 170 },
    { x: 260, y: 170 },
    { x: 320, y: 170 },
    { x: 380, y: 170 },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        borderRadius: gameRadius.popup,
        overflow: "hidden",
        boxShadow: gameShadow.card,
      }}
    >
      <svg viewBox="0 0 440 220" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.wallColor} />
            <stop offset="100%" stopColor={theme.wallColor} stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.floorColor} />
            <stop offset="100%" stopColor={theme.floorColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* 墙壁 */}
        <rect x="0" y="0" width="440" height="160" fill="url(#wallGrad)" />

        {/* 地板 */}
        <rect x="0" y="160" width="440" height="60" fill="url(#floorGrad)" />

        {/* 地板纹理 — 木纹线 */}
        <g opacity="0.15" pointerEvents="none">
          <line x1="0" y1="175" x2="440" y2="175" stroke="#8c7a5a" strokeWidth="0.5" />
          <line x1="0" y1="190" x2="440" y2="190" stroke="#8c7a5a" strokeWidth="0.5" />
          <line x1="0" y1="205" x2="440" y2="205" stroke="#8c7a5a" strokeWidth="0.5" />
        </g>

        {/* 窗户 */}
        <g transform="translate(30, 30)" opacity="0.7">
          <rect x="0" y="0" width="50" height="40" rx="4" fill="#c5e8f5" stroke="#8c7a5a" strokeWidth="1.5" />
          <line x1="25" y1="0" x2="25" y2="40" stroke="#8c7a5a" strokeWidth="1" />
          <line x1="0" y1="20" x2="50" y2="20" stroke="#8c7a5a" strokeWidth="1" />
          {/* 窗外景色 — 太阳 */}
          <circle cx="38" cy="12" r="5" fill="#ffd700" opacity="0.5" />
        </g>

        {/* 墙上画框 */}
        <g transform="translate(320, 30)" opacity="0.6">
          <rect x="0" y="0" width="40" height="30" rx="2" fill="#fff" stroke="#8c7a5a" strokeWidth="1.5" />
          <rect x="4" y="4" width="32" height="22" rx="1" fill="#e8e0f0" />
        </g>

        {/* 奖杯展示架 */}
        {trophies.length > 0 && (
          <g transform="translate(200, 25)" opacity="0.8">
            {trophies.slice(0, 5).map((_, i) => (
              <g key={i} transform={`translate(${i * 20}, 0)`}>
                <text x="10" y="20" textAnchor="middle" fontSize="16">🏆</text>
              </g>
            ))}
          </g>
        )}

        {/* 家具槽位 — 占用位 */}
        {Array.from({ length: slots }).map((_, i) => {
          const pos = slotPositions[i] || slotPositions[5];
          const item = furniture.find((f) => f.slot === i);
          return (
            <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
              {/* 槽位底圈 */}
              <ellipse cx="0" cy="0" rx="22" ry="8" fill="#1a1a2e" opacity="0.05" />
              <ellipse cx="0" cy="0" rx="18" ry="6" fill="none" stroke="#1a1a2e" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="2 2" />
              {/* 家具 */}
              {item ? (
                <text x="0" y="4" textAnchor="middle" fontSize="24" className="poi-breathe">{item.emoji}</text>
              ) : (
                <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#1a1a2e" opacity="0.2">＋</text>
              )}
              {/* 家具名称 */}
              {item && (
                <text x="0" y="22" textAnchor="middle" fontSize="8" fill="#1a1a2e" opacity="0.4">{item.name}</text>
              )}
            </g>
          );
        })}

        {/* 角色小人在房间内 */}
        <g transform="translate(220, 145)" className="player-idle">
          <ellipse cx="0" cy="20" rx="10" ry="3" fill="#1a1a2e" opacity="0.1" />
          <rect x="-6" y="2" width="12" height="12" rx="5" fill="#5bb4e8" stroke="#1a1a2e" strokeWidth="0.3" strokeOpacity="0.1" />
          <circle cx="0" cy="-4" r="7" fill="#f4d4a8" stroke="#1a1a2e" strokeWidth="0.3" strokeOpacity="0.1" />
          <path d="M-6 -6 Q0 -12 6 -6 L6 -5 L-6 -5 Z" fill="#3a3a3a" />
          <circle cx="-2.5" cy="-4" r="0.8" fill="#1a1a2e" />
          <circle cx="2.5" cy="-4" r="0.8" fill="#1a1a2e" />
          <path d="M-1.5 -1.5 Q0 -0.5 1.5 -1.5" fill="none" stroke="#1a1a2e" strokeWidth="0.6" strokeLinecap="round" />
        </g>

        {/* 房间名 */}
        <text x="220" y="215" textAnchor="middle" fontSize="9" fill="#1a1a2e" opacity="0.3" fontWeight="600">
          {levelInfo.name}
        </text>
      </svg>
    </div>
  );
}
