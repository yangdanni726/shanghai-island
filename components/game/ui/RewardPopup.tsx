import { ReactNode, useEffect, useState } from "react";
import { gameColors, gameRadius, gameShadow, gameFont, gameTransition } from "@/styles/game-theme";
import GameButton from "./GameButton";

interface Reward {
  exp?: number;
  coins?: number;
  badge?: string;
}

interface RewardPopupProps {
  emoji?: string;
  title?: string;
  subtitle?: string;
  rewards: Reward;
  onClose: () => void;
  buttonText?: string;
  children?: ReactNode;
}

// 奖励弹窗 — 经验/金币/徽章获得
export default function RewardPopup({
  emoji = "🎉",
  title = "探索成功！",
  subtitle,
  rewards,
  onClose,
  buttonText = "继续探索",
  children,
}: RewardPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
      />

      {/* 弹窗内容 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: gameRadius.popup,
          boxShadow: gameShadow.popup,
          padding: "24px 20px 16px",
          width: "85%",
          maxWidth: "340px",
          transform: show ? "scale(1)" : "scale(0.8)",
          opacity: show ? 1 : 0,
          transition: `all 0.4s ${gameTransition.spring}`,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* emoji 动画 */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "48px",
              display: "inline-block",
              animation: show ? "float-bounce 2s ease-in-out infinite" : "none",
            }}
          >
            {emoji}
          </span>
        </div>

        {/* 标题 */}
        <div style={{ ...gameFont.title, textAlign: "center", color: gameColors.ink }}>
          {title}
        </div>

        {/* 副标题 */}
        {subtitle && (
          <div style={{ ...gameFont.body, textAlign: "center", color: gameColors.inkSoft, marginTop: "4px" }}>
            {subtitle}
          </div>
        )}

        {/* 自由内容 */}
        {children}

        {/* 奖励列表 */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: gameColors.goldLight,
            borderRadius: gameRadius.card,
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {rewards.exp !== undefined && rewards.exp > 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ ...gameFont.caption, color: gameColors.inkFaint }}>经验值</div>
              <div style={{ ...gameFont.reward, color: gameColors.ocean }}>+{rewards.exp}</div>
            </div>
          )}
          {rewards.coins !== undefined && rewards.coins > 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ ...gameFont.caption, color: gameColors.inkFaint }}>金币</div>
              <div style={{ ...gameFont.reward, color: gameColors.gold }}>+{rewards.coins} 🪙</div>
            </div>
          )}
          {rewards.badge && (
            <div style={{ textAlign: "center" }}>
              <div style={{ ...gameFont.caption, color: gameColors.inkFaint }}>新徽章</div>
              <div style={{ ...gameFont.reward, color: gameColors.purple }}>{rewards.badge} 🏆</div>
            </div>
          )}
        </div>

        {/* 按钮 */}
        <div style={{ marginTop: "16px" }}>
          <GameButton variant="primary" size="lg" fullWidth onClick={onClose}>
            {buttonText}
          </GameButton>
        </div>
      </div>
    </div>
  );
}
