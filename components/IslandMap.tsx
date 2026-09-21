"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DISTRICTS, BRIDGES, LANDMARK_PINS } from "@/data/districts";
import { getMapInteractions, getMissionPoints } from "@/game/interaction";
import PlayerAvatar from "@/components/game/PlayerAvatar";

interface IslandMapProps {
  playerX?: number;
  playerY?: number;
  playerAvatar?: string;
  playerNickname?: string;
  playerLevel?: number;
  onAreaClick?: (districtId: string) => void;
  onLocationClick?: (locationId: string) => void;
  exploredLocations?: string[];
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string }> = {
  coffee: { bg: "#fff3d6", border: "#f0a500" },
  food: { bg: "#ffe5e5", border: "#ff6b6b" },
  culture: { bg: "#e8e0f5", border: "#9b7ec8" },
  park: { bg: "#d5f0d0", border: "#6ab04c" },
  activity: { bg: "#d5e8f5", border: "#5bb4e8" },
};

export default function IslandMap({
  playerX = 290,
  playerY = 260,
  playerAvatar = "🧑",
  playerNickname = "岛民",
  playerLevel = 1,
  onAreaClick,
  onLocationClick,
  exploredLocations = [],
}: IslandMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();
  const interactions = getMapInteractions();
  const missionPoints = getMissionPoints();

  const handleAreaClick = (districtId: string) => {
    if (onAreaClick) onAreaClick(districtId);
    else router.push(`/map?district=${districtId}`);
  };

  const handleLocationClick = (locationId: string) => {
    if (onLocationClick) onLocationClick(locationId);
    else router.push("/map");
  };

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 600 500" className="w-full h-full" role="img" aria-label="上海岛世界地图" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="oceanGrad" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#c5e8f5" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8cc8e8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#5bb4e8" stopOpacity="0.15" />
          </radialGradient>
          <linearGradient id="sandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#faf0dc" />
            <stop offset="100%" stopColor="#f0e0c8" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* 海洋背景 */}
        <rect width="600" height="500" fill="url(#oceanGrad)" rx="16" />

        {/* 水面波光 */}
        <g className="water-shimmer" pointerEvents="none">
          <ellipse cx="50" cy="250" rx="18" ry="2" fill="white" opacity="0.2" />
          <ellipse cx="555" cy="250" rx="18" ry="2" fill="white" opacity="0.2" />
          <ellipse cx="300" cy="200" rx="15" ry="2" fill="white" opacity="0.15" />
          <ellipse cx="300" cy="320" rx="15" ry="2" fill="white" opacity="0.15" />
        </g>

        {/* 波浪 */}
        <path d="M0 430 Q75 415 150 430 T300 430 T450 430 T600 430 L600 500 L0 500 Z" fill="#a8d5e8" opacity="0.12" className="wave-bg" />
        <path d="M0 455 Q75 445 150 455 T300 455 T450 455 T600 455 L600 500 L0 500 Z" fill="#7dc4e8" opacity="0.1" />
        <path d="M0 60 Q75 50 150 60 T300 60 T450 60 T600 60" fill="none" stroke="#a8d5e8" strokeWidth="1.5" opacity="0.15" className="wave-bg" />

        {/* === 5 个子岛 === */}
        {DISTRICTS.map((d) => {
          const isHovered = hovered === d.id;
          const isDimmed = hovered !== null && !isHovered;
          const scaleVal = isHovered ? 1.06 : 1;
          const transformStr = `translate(${d.labelX} ${d.labelY}) scale(${scaleVal}) translate(${-d.labelX} ${-d.labelY})`;
          return (
            <g key={d.id} className="cursor-pointer" onMouseEnter={() => setHovered(d.id)} onMouseLeave={() => setHovered(null)} onClick={() => handleAreaClick(d.id)} transform={transformStr} style={{ opacity: isDimmed ? 0.5 : 1, transition: "opacity 0.3s ease" }}>
              {/* 岛屿沙滩 */}
              <path d={d.path} fill="url(#sandGrad)" stroke="#d4b896" strokeWidth="1.5" strokeOpacity="0.3" />
              {/* 区域色块覆盖 */}
              <path d={d.path} fill={isHovered ? d.colorDeep : d.color} stroke="#1a1a2e" strokeWidth={isHovered ? 2 : 1.2} strokeOpacity="0.1" filter={isHovered ? "url(#glow)" : undefined} />
              {/* 区域名 */}
              <text x={d.labelX} y={d.labelY - 8} textAnchor="middle" fontSize="13" pointerEvents="none">{d.icon}</text>
              <text x={d.labelX} y={d.labelY + 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1a1a2e" opacity="0.65" pointerEvents="none">{d.name}</text>
            </g>
          );
        })}

        {/* === 子岛专属装饰 === */}

        {/* 静安森林岛 — 梧桐树+咖啡 */}
        <g pointerEvents="none">
          <g transform="translate(140, 100)" className="sway" style={{ transformOrigin: "140px 105px" }}>
            <rect x="-1" y="0" width="2" height="8" fill="#8c7a5a" rx="1" />
            <ellipse cx="-4" cy="-1" rx="5" ry="2.5" fill="#6ab04c" opacity="0.7" transform="rotate(-25 -4 -1)" />
            <ellipse cx="4" cy="-1" rx="5" ry="2.5" fill="#6ab04c" opacity="0.7" transform="rotate(25 4 -1)" />
            <ellipse cx="0" cy="-4" rx="4" ry="2.5" fill="#6ab04c" opacity="0.8" />
          </g>
          <g transform="translate(220, 165)" className="sway" style={{ transformOrigin: "220px 170px", animationDelay: "2s" }}>
            <rect x="-1" y="0" width="2" height="8" fill="#8c7a5a" rx="1" />
            <ellipse cx="-4" cy="-1" rx="5" ry="2.5" fill="#6ab04c" opacity="0.7" transform="rotate(-25 -4 -1)" />
            <ellipse cx="4" cy="-1" rx="5" ry="2.5" fill="#6ab04c" opacity="0.7" transform="rotate(25 4 -1)" />
            <ellipse cx="0" cy="-4" rx="4" ry="2.5" fill="#6ab04c" opacity="0.8" />
          </g>
          {/* 咖啡杯装饰 */}
          <g transform="translate(155, 165)" opacity="0.3">
            <rect x="-4" y="-4" width="8" height="8" rx="1" fill="#8c5a2a" />
            <path d="M4 -2 Q7 -2 7 1 Q7 3 4 3" fill="none" stroke="#8c5a2a" strokeWidth="1" />
          </g>
        </g>

        {/* 黄浦中心岛 — 建筑剪影+灯塔 */}
        <g pointerEvents="none">
          {/* 东方明珠剪影 */}
          <g transform="translate(420, 100)" opacity="0.25">
            <circle cx="0" cy="-8" r="3" fill="#9b7ec8" />
            <line x1="0" y1="-5" x2="0" y2="10" stroke="#9b7ec8" strokeWidth="2" />
            <circle cx="0" cy="3" r="4" fill="none" stroke="#9b7ec8" strokeWidth="1.5" />
          </g>
          {/* 建筑剪影 */}
          <g transform="translate(390, 95)" opacity="0.2">
            <rect x="0" y="0" width="4" height="12" fill="#3a3a3a" rx="1" />
            <rect x="6" y="-3" width="4" height="15" fill="#3a3a3a" rx="1" />
            <rect x="12" y="1" width="4" height="11" fill="#3a3a3a" rx="1" />
          </g>
          {/* 灯塔 */}
          <g transform="translate(460, 160)" opacity="0.25">
            <rect x="-2" y="0" width="4" height="10" fill="#ff6b6b" rx="1" />
            <circle cx="0" cy="-2" r="2" fill="#f0a500" />
          </g>
        </g>

        {/* 徐汇生活岛 — 画架+彩虹 */}
        <g pointerEvents="none">
          {/* 画架 */}
          <g transform="translate(270, 230)" opacity="0.3">
            <rect x="-1" y="0" width="2" height="8" fill="#8c5a2a" />
            <rect x="-5" y="2" width="10" height="6" fill="#9b7ec8" opacity="0.6" />
          </g>
          {/* 彩虹 */}
          <g transform="translate(330, 270)" opacity="0.15" className="poi-breathe">
            <path d="M-8 0 A8 8 0 0 1 8 0" fill="none" stroke="#ff6b6b" strokeWidth="1.5" />
            <path d="M-6 0 A6 6 0 0 1 6 0" fill="none" stroke="#f0a500" strokeWidth="1.5" />
            <path d="M-4 0 A4 4 0 0 1 4 0" fill="none" stroke="#6ab04c" strokeWidth="1.5" />
          </g>
        </g>

        {/* 杨浦创意岛 — 喷泉+吉他 */}
        <g pointerEvents="none">
          {/* 喷泉 */}
          <g transform="translate(150, 340)" opacity="0.25">
            <ellipse cx="0" cy="2" rx="6" ry="2" fill="#5bb4e8" />
            <path d="M-2 0 Q-3 -5 0 -8 Q3 -5 2 0" fill="#5bb4e8" opacity="0.6" />
            <path d="M0 0 Q-2 -4 -3 -6" fill="none" stroke="#5bb4e8" strokeWidth="0.8" />
            <path d="M0 0 Q2 -4 3 -6" fill="none" stroke="#5bb4e8" strokeWidth="0.8" />
          </g>
          {/* 书本 */}
          <g transform="translate(210, 380)" opacity="0.25">
            <rect x="-4" y="0" width="8" height="5" fill="#9b7ec8" rx="0.5" />
            <line x1="0" y1="0" x2="0" y2="5" stroke="#fff" strokeWidth="0.5" />
          </g>
        </g>

        {/* 浦东未来岛 — 高楼+火箭 */}
        <g pointerEvents="none">
          {/* 高楼剪影 */}
          <g transform="translate(410, 330)" opacity="0.25">
            <rect x="0" y="0" width="4" height="15" fill="#5a8acc" rx="1" />
            <rect x="6" y="-3" width="4" height="18" fill="#5a8acc" rx="1" />
            <rect x="12" y="2" width="3" height="13" fill="#5a8acc" rx="1" />
            <rect x="17" y="-1" width="4" height="16" fill="#5a8acc" rx="1" />
          </g>
          {/* 火箭 */}
          <g transform="translate(455, 390)" opacity="0.25" className="float-bounce">
            <path d="M0 -6 L2 0 L1 4 L-1 4 L-2 0 Z" fill="#ff6b6b" />
            <path d="M-1 4 L0 6 L1 4" fill="#f0a500" />
          </g>
        </g>

        {/* === 桥梁 === */}
        {BRIDGES.map((b, i) => (
          <g key={i} pointerEvents="none">
            {/* 桥面 */}
            <line x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke="#d4b896" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
            <line x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke="#c0a070" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            {/* 桥栏 */}
            <line x1={b.x1} y1={b.y1 - 2} x2={b.x2} y2={b.y2 - 2} stroke="#8c7a5a" strokeWidth="0.5" opacity="0.2" />
            <line x1={b.x1} y1={b.y1 + 2} x2={b.x2} y2={b.y2 + 2} stroke="#8c7a5a" strokeWidth="0.5" opacity="0.2" />
          </g>
        ))}

        {/* 地标红点 */}
        {LANDMARK_PINS.map((pin) => (
          <g key={pin.label} pointerEvents="none">
            <circle cx={pin.x} cy={pin.y} r="2.5" fill="#ff6b6b" opacity="0.6" />
            <circle cx={pin.x} cy={pin.y} r="5" fill="none" stroke="#ff6b6b" strokeWidth="0.8" opacity="0.25" />
          </g>
        ))}

        {/* === 地点标记 POI === */}
        {interactions.map((obj) => {
          const isExplored = exploredLocations.includes(obj.id);
          const colors = CATEGORY_COLORS[obj.type] || CATEGORY_COLORS.culture;
          return (
            <g key={obj.id} pointerEvents="none">
              {isExplored && (
                <circle cx={obj.positionX} cy={obj.positionY} r="16" fill="#6ab04c" opacity="0.15" />
              )}
              <ellipse cx={obj.positionX} cy={obj.positionY + 10} rx="8" ry="2.5" fill="#1a1a2e" opacity="0.1" />
              <circle cx={obj.positionX} cy={obj.positionY} r="13" fill={isExplored ? "#d5f0d0" : colors.bg} stroke={isExplored ? "#6ab04c" : colors.border} strokeWidth="1.5" strokeOpacity="0.3" className="poi-breathe" />
              <circle cx={obj.positionX} cy={obj.positionY} r="9" fill="white" opacity="0.9" />
              <text x={obj.positionX} y={obj.positionY + 4} textAnchor="middle" fontSize="11" className="marker-bob" pointerEvents="none">{obj.emoji}</text>
              {isExplored && (
                <>
                  <circle cx={obj.positionX + 9} cy={obj.positionY - 9} r="5" fill="#6ab04c" stroke="white" strokeWidth="1" />
                  <text x={obj.positionX + 9} y={obj.positionY - 6} textAnchor="middle" fontSize="7" fill="white" fontWeight="700">✓</text>
                </>
              )}
            </g>
          );
        })}

        {/* 任务点 */}
        {missionPoints.map((obj) => (
          <g key={obj.id} pointerEvents="none">
            <ellipse cx={obj.positionX} cy={obj.positionY + 10} rx="8" ry="2.5" fill="#1a1a2e" opacity="0.1" />
            <circle cx={obj.positionX} cy={obj.positionY} r="14" fill="#fff3d6" stroke="#f0a500" strokeWidth="1.5" strokeOpacity="0.3" className="mission-glow" />
            <text x={obj.positionX} y={obj.positionY + 5} textAnchor="middle" fontSize="14" className="marker-bob">{obj.emoji}</text>
          </g>
        ))}

        {/* 玩家角色 */}
        <PlayerAvatar
          avatar={playerAvatar}
          nickname={playerNickname}
          level={playerLevel}
          x={playerX}
          y={playerY}
        />

        {/* === 通用装饰 === */}
        {/* 闪烁星星 */}
        <g pointerEvents="none">
          <text x="50" y="150" fontSize="8" className="sparkle" style={{ animationDelay: "0s" }}>✨</text>
          <text x="560" y="400" fontSize="8" className="sparkle" style={{ animationDelay: "1s" }}>✨</text>
          <text x="300" y="180" fontSize="6" className="sparkle" style={{ animationDelay: "0.5s" }}>✨</text>
        </g>

        {/* 浮云 */}
        <g opacity="0.2" transform="translate(50, 50)" className="cloud-drift" pointerEvents="none">
          <ellipse cx="0" cy="0" rx="20" ry="9" fill="#fff" />
          <ellipse cx="12" cy="-3" rx="14" ry="8" fill="#fff" />
        </g>
        <g opacity="0.15" transform="translate(520, 60)" className="cloud-drift" pointerEvents="none" style={{ animationDelay: "3s" }}>
          <ellipse cx="0" cy="0" rx="16" ry="7" fill="#fff" />
          <ellipse cx="10" cy="-3" rx="10" ry="6" fill="#fff" />
        </g>

        {/* 小鱼 */}
        <g transform="translate(45, 250)" opacity="0.2" pointerEvents="none">
          <path d="M0 0 Q5 -4 10 -2 Q12 -3 14 -1 Q12 1 10 2 Q5 4 0 0 Z" fill="#5bb4e8" />
          <circle cx="3" cy="-1" r="0.5" fill="#1a1a2e" />
        </g>
        <g transform="translate(555, 255)" opacity="0.2" pointerEvents="none">
          <path d="M0 0 Q5 -4 10 -2 Q12 -3 14 -1 Q12 1 10 2 Q5 4 0 0 Z" fill="#5bb4e8" />
          <circle cx="3" cy="-1" r="0.5" fill="#1a1a2e" />
        </g>

        {/* 小船 */}
        <g transform="translate(490, 70)" opacity="0.25" className="float-bounce" pointerEvents="none">
          <path d="M0 0 L-16 0 L-9 8 L9 8 L16 0 Z" fill="#8c7a5a" />
          <line x1="0" y1="0" x2="0" y2="-12" stroke="#8c7a5a" strokeWidth="1.5" />
          <path d="M0 -12 L8 -8 L0 -6 Z" fill="#ff9999" opacity="0.7" />
        </g>

        {/* 罗盘 */}
        <g transform="translate(550, 450)" opacity="0.2" pointerEvents="none">
          <circle r="14" fill="none" stroke="#1a1a2e" strokeWidth="1.2" />
          <path d="M0 -10 L2.5 0 L0 10 L-2.5 0 Z" fill="#1a1a2e" />
          <text y="-16" textAnchor="middle" fontSize="7" fill="#1a1a2e" fontWeight="600">N</text>
        </g>
      </svg>

      {/* hover 气泡 */}
      {hovered && (
        <div className="absolute pointer-events-none z-20 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-black/5 px-3 py-2 panel-enter"
          style={{
            left: `${((DISTRICTS.find((d) => d.id === hovered)!.labelX) / 600) * 100}%`,
            top: `${((DISTRICTS.find((d) => d.id === hovered)!.labelY - 50) / 500) * 100}%`,
            transform: "translate(-50%, -100%)",
          }}>
          <div className="text-xs font-bold text-[var(--ink)]">{DISTRICTS.find((d) => d.id === hovered)!.name}</div>
          <div className="text-[10px] text-[var(--ink-faint)] mt-0.5">{DISTRICTS.find((d) => d.id === hovered)!.spots.join(" · ")}</div>
        </div>
      )}

      {/* HTML 覆盖层 — 地点点击按钮 */}
      {interactions.map((obj) => (
        <button
          key={obj.id}
          onClick={() => handleLocationClick(obj.id)}
          className="absolute z-15 flex items-center justify-center rounded-full hover:scale-125 spring-transition"
          style={{
            left: `${(obj.positionX / 600) * 100}%`,
            top: `${(obj.positionY / 500) * 100}%`,
            transform: "translate(-50%, -50%)",
            width: "36px",
            height: "36px",
            cursor: "pointer",
          }}
          title={obj.name}
        />
      ))}

      {/* HTML 覆盖层 — 任务点点击按钮 */}
      {missionPoints.map((obj) => (
        <button
          key={obj.id}
          onClick={() => router.push("/missions")}
          className="absolute z-15 flex items-center justify-center rounded-full hover:scale-125 spring-transition"
          style={{
            left: `${(obj.positionX / 600) * 100}%`,
            top: `${(obj.positionY / 500) * 100}%`,
            transform: "translate(-50%, -50%)",
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
          title={obj.name}
        />
      ))}
    </div>
  );
}
