import { ReactNode } from "react";
import { gameShadow, gameRadius } from "@/styles/game-theme";

interface GamePanelProps {
  children: ReactNode;
  variant?: "floating" | "solid" | "glass";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

// 游戏浮动面板 — HUD/弹窗/信息卡通用容器
export default function GamePanel({
  children,
  variant = "floating",
  className = "",
  onClick,
  style,
}: GamePanelProps) {
  const variants = {
    floating: {
      background: "rgba(255, 255, 255, 0.88)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(28, 28, 46, 0.06)",
      borderRadius: gameRadius.card,
      boxShadow: gameShadow.soft,
    },
    solid: {
      background: "#fff",
      border: "1px solid rgba(28, 28, 46, 0.06)",
      borderRadius: gameRadius.card,
      boxShadow: gameShadow.card,
    },
    glass: {
      background: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      borderRadius: gameRadius.card,
      boxShadow: gameShadow.soft,
    },
  };

  return (
    <div
      onClick={onClick}
      className={`spring-transition ${className}`}
      style={{ ...variants[variant], ...style }}
    >
      {children}
    </div>
  );
}
