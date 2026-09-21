import { ReactNode } from "react";
import { gameColors, gameRadius, gameTransition } from "@/styles/game-theme";

interface GameButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "reward" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// 游戏按钮 — 统一弹跳过冲动画
export default function GameButton({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  fullWidth = false,
  className = "",
  style,
}: GameButtonProps) {
  const sizes = {
    sm: { padding: "8px 14px", fontSize: "12px", borderRadius: gameRadius.button },
    md: { padding: "10px 18px", fontSize: "14px", borderRadius: gameRadius.button },
    lg: { padding: "14px 24px", fontSize: "15px", borderRadius: gameRadius.button },
  };

  const variants = {
    primary: {
      background: gameColors.ocean,
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: gameColors.sand,
      color: gameColors.ink,
      border: `1px solid ${gameColors.sandDeep}`,
    },
    reward: {
      background: gameColors.goldLight,
      color: gameColors.gold,
      border: `1px solid ${gameColors.gold}40`,
    },
    ghost: {
      background: "transparent",
      color: gameColors.inkSoft,
      border: "1px solid transparent",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-bold ${fullWidth ? "w-full" : ""} ${className}`}
      style={{
        ...sizes[size],
        ...variants[variant],
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: `all 0.3s ${gameTransition.spring}`,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(1.04)";
          if (variant === "primary") e.currentTarget.style.filter = "brightness(1.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.filter = "none";
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1.04)";
      }}
    >
      {children}
    </button>
  );
}
