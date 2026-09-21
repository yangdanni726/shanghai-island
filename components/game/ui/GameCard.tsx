import { ReactNode } from "react";
import { gameColors, gameRadius, gameShadow, gameTransition } from "@/styles/game-theme";

interface GameCardProps {
  emoji?: string;
  title?: string;
  subtitle?: string;
  tag?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  variant?: "default" | "highlight" | "explored";
  className?: string;
}

// 游戏卡片 — 地点卡/任务卡/岛民卡通用
export default function GameCard({
  emoji,
  title,
  subtitle,
  tag,
  children,
  footer,
  onClick,
  variant = "default",
  className = "",
}: GameCardProps) {
  const bgColors = {
    default: "#fff",
    highlight: gameColors.goldLight,
    explored: gameColors.islandLight,
  };

  return (
    <div
      onClick={onClick}
      className={`spring-transition ${className}`}
      style={{
        background: bgColors[variant],
        borderRadius: gameRadius.card,
        border: "1px solid rgba(28, 28, 46, 0.05)",
        boxShadow: gameShadow.card,
        padding: "14px",
        cursor: onClick ? "pointer" : "default",
        transition: `all 0.4s ${gameTransition.spring}`,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
          e.currentTarget.style.boxShadow = gameShadow.popup;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = gameShadow.card;
        }
      }}
    >
      {/* 头部：emoji + 标签 */}
      {(emoji || tag) && (
        <div className="flex items-center justify-between mb-2">
          {emoji && <span style={{ fontSize: "24px" }}>{emoji}</span>}
          {tag && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: gameColors.ocean,
                background: `${gameColors.ocean}15`,
                padding: "2px 8px",
                borderRadius: gameRadius.tag,
              }}
            >
              {tag}
            </span>
          )}
        </div>
      )}

      {/* 标题 */}
      {title && (
        <div style={{ fontSize: "14px", fontWeight: 700, color: gameColors.ink }}>
          {title}
        </div>
      )}
      {subtitle && (
        <div style={{ fontSize: "11px", color: gameColors.inkFaint, marginTop: "2px" }}>
          {subtitle}
        </div>
      )}

      {/* 自由内容区 */}
      {children && <div style={{ marginTop: "8px" }}>{children}</div>}

      {/* 底部 */}
      {footer && (
        <div style={{ marginTop: "10px" }}>{footer}</div>
      )}
    </div>
  );
}
