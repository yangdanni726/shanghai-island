import { gameColors, gameRadius, gameShadow } from "@/styles/game-theme";

interface BadgeProps {
  emoji: string;
  name: string;
  description?: string;
  unlocked?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

// 徽章组件 — 成就展示
export default function Badge({
  emoji,
  name,
  description,
  unlocked = false,
  size = "md",
  onClick,
}: BadgeProps) {
  const sizes = {
    sm: { emoji: "20px", card: "60px", radius: 12, padding: "6px" },
    md: { emoji: "28px", card: "80px", radius: 16, padding: "10px" },
    lg: { emoji: "40px", card: "100px", radius: 20, padding: "14px" },
  };
  const s = sizes[size];

  return (
    <div
      onClick={onClick}
      style={{
        width: s.card,
        textAlign: "center",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {/* 徽章图标 */}
      <div
        style={{
          width: s.card,
          height: s.card,
          borderRadius: s.radius,
          background: unlocked ? `linear-gradient(135deg, ${gameColors.goldLight}, ${gameColors.sand})` : "#f0f0f0",
          border: unlocked ? `2px solid ${gameColors.gold}40` : "2px solid transparent",
          boxShadow: unlocked ? gameShadow.glow : gameShadow.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: s.emoji,
          filter: unlocked ? "none" : "grayscale(1) opacity(0.4)",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {unlocked ? emoji : "🔒"}
      </div>
      {/* 名称 */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: unlocked ? gameColors.ink : gameColors.inkFaint,
          marginTop: "4px",
          lineHeight: 1.2,
        }}
      >
        {name}
      </div>
      {description && (
        <div
          style={{
            fontSize: "8px",
            color: gameColors.inkFaint,
            marginTop: "2px",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
