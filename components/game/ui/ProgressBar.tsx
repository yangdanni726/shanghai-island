import { gameColors, gameTransition } from "@/styles/game-theme";

interface ProgressBarProps {
  value: number;       // 当前值
  max: number;         // 最大值
  variant?: "exp" | "mission" | "coins";
  showLabel?: boolean;
  height?: number;
  label?: string;
}

// 进度条 — 等级/任务进度
export default function ProgressBar({
  value,
  max,
  variant = "exp",
  showLabel = false,
  height = 6,
  label,
}: ProgressBarProps) {
  const percent = Math.min(100, (value / max) * 100);
  const colors = {
    exp: { fill: gameColors.ocean, bg: "#e8e8e8", text: gameColors.ocean },
    mission: { fill: gameColors.purple, bg: "#e8e8e8", text: gameColors.purple },
    coins: { fill: gameColors.gold, bg: "#e8e8e8", text: gameColors.gold },
  };
  const c = colors[variant];

  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 600, color: gameColors.inkSoft }}>
            {label || ""}
          </span>
          <span style={{ fontSize: "9px", color: c.text, fontWeight: 700 }}>
            {value}/{max}
          </span>
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: `${height}px`,
          background: c.bg,
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: c.fill,
            borderRadius: "999px",
            transition: `width 0.6s ${gameTransition.spring}`,
          }}
        />
      </div>
    </div>
  );
}
