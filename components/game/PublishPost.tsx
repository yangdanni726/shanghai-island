"use client";

import { useState } from "react";
import { LOCATIONS } from "@/data/locations";
import { DISTRICTS } from "@/data/districts";
import { usePlayer } from "@/contexts/PlayerContext";
import { gameColors, gameRadius, gameShadow } from "@/styles/game-theme";
import GameButton from "@/components/game/ui/GameButton";

interface PublishPostProps {
  onPublish: (content: string, locationId: string) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ["☕", "🍜", "🎨", "🌳", "🌃", "🛕", "🛍️", "🎸"];

// 发布动态弹窗 — 游戏化风格
export default function PublishPost({ onPublish, onClose }: PublishPostProps) {
  const { state } = usePlayer();
  const [content, setContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("☕");

  const handlePublish = () => {
    if (!content.trim() || !selectedLocation) return;
    onPublish(content.trim(), selectedLocation);
    onClose();
  };

  // 按区域分组地点
  const locationsByDistrict = DISTRICTS.map((d) => ({
    district: d,
    locations: LOCATIONS.filter((l) => l.districtId === d.id),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* 底部弹出面板 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-white rounded-t-3xl p-5 spring-transition"
        style={{
          borderRadius: "24px 24px 0 0",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* 拖拽条 */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[var(--ink)]">📝 发布动态</h2>
          <button onClick={onClose} className="text-[var(--ink-faint)] text-sm">✕</button>
        </div>

        {/* 用户信息 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{state.player.avatar}</span>
          <div>
            <div className="text-xs font-bold text-[var(--ink)]">{state.player.nickname}</div>
            <div className="text-[9px] text-[var(--ink-faint)]">Lv.{state.player.level || 1}</div>
          </div>
        </div>

        {/* 文字输入 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你的上海岛探索故事..."
          maxLength={200}
          className="w-full p-3 rounded-xl border border-black/5 bg-[var(--bg)] text-xs text-[var(--ink)] resize-none focus:outline-none focus:border-[var(--ocean)]/30 spring-transition"
          rows={3}
        />
        <div className="text-right text-[9px] text-[var(--ink-faint)] mt-1">{content.length}/200</div>

        {/* 表情选择 */}
        <div className="mb-3">
          <div className="text-[10px] font-semibold text-[var(--ink-soft)] mb-1.5">选择图标</div>
          <div className="flex gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className="w-9 h-9 rounded-xl flex items-center justify-center spring-transition"
                style={{
                  background: selectedEmoji === emoji ? `${gameColors.ocean}15` : "#f5f5f5",
                  border: selectedEmoji === emoji ? `2px solid ${gameColors.ocean}30` : "2px solid transparent",
                  fontSize: "16px",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 地点选择 */}
        <div className="mb-4">
          <div className="text-[10px] font-semibold text-[var(--ink-soft)] mb-1.5">选择地点</div>
          <div className="space-y-2">
            {locationsByDistrict.map(({ district, locations }) => (
              <div key={district.id}>
                <div className="text-[9px] text-[var(--ink-faint)] mb-1">{district.icon} {district.name}</div>
                <div className="flex flex-wrap gap-1.5">
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc.id)}
                      className="px-2.5 py-1 rounded-full text-[10px] spring-transition"
                      style={{
                        background: selectedLocation === loc.id ? `${gameColors.ocean}15` : "#f5f5f5",
                        border: selectedLocation === loc.id ? `1px solid ${gameColors.ocean}40` : "1px solid transparent",
                        color: selectedLocation === loc.id ? gameColors.ocean : "var(--ink-soft)",
                        fontWeight: selectedLocation === loc.id ? 600 : 400,
                      }}
                    >
                      {loc.emoji} {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 发布按钮 */}
        <GameButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={handlePublish}
          disabled={!content.trim() || !selectedLocation}
        >
          📮 发布到岛民广场
        </GameButton>
      </div>
    </div>
  );
}
