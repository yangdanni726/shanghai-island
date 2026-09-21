"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/contexts/PlayerContext";
import { DISTRICTS } from "@/data/districts";

const AVATAR_OPTIONS = ["👧", "👦", "🧑", "👩", "👨", "🧒"];
const BIRTH_AREAS = DISTRICTS.map((d) => ({ id: d.id, name: d.name, icon: d.icon, desc: d.spots.join(" · ") }));

export default function OnboardingPage() {
  const router = useRouter();
  const { createIslander } = usePlayer();
  const [step, setStep] = useState(0); // 0:欢迎 1:昵称 2:头像 3:出生区域 4:完成
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [area, setArea] = useState("");

  const handleComplete = () => {
    createIslander(nickname || "小沪", avatar || "🧑", area || "xuhui");
    router.push("/");
  };

  const canNext = () => {
    if (step === 1) return nickname.trim().length > 0;
    if (step === 2) return avatar !== "";
    if (step === 3) return area !== "";
    return true;
  };

  return (
    <div className="game-scene flex flex-col items-center justify-center bg-gradient-to-b from-[#e8f4f8] to-[#f5f1ea]">
      {/* 顶部装饰 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#a8d5e8]/30 to-transparent" />
      <div className="absolute top-8 text-center w-full">
        <div className="text-3xl mb-1">🌊</div>
        <div className="text-[10px] text-[var(--ink-faint)] tracking-widest">SHANGHAI ISLAND</div>
      </div>

      {/* 主卡片 */}
      <div className="hud-panel w-[88%] max-w-sm p-6 relative z-10 mt-8">
        {/* Step 0: 欢迎 */}
        {step === 0 && (
          <div className="text-center">
            <div className="text-5xl mb-3">🏝</div>
            <h1 className="text-xl font-bold text-[var(--ink)] mb-2">欢迎来到上海岛</h1>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed mb-4">
              你生活的城市是一座岛。<br/>
              成为岛民，开始探索真实的上海。
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 rounded-xl bg-[var(--ocean)] text-white font-bold text-sm spring-transition hover:brightness-110 active:scale-95"
            >
              创建岛民身份
            </button>
          </div>
        )}

        {/* Step 1: 昵称 */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-bold text-[var(--ink)] mb-1">选择昵称</h2>
            <p className="text-[10px] text-[var(--ink-faint)] mb-3">这是你在上海岛的名字</p>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 8))}
              placeholder="输入昵称（最多8字）"
              maxLength={8}
              className="w-full px-4 py-3 rounded-xl border border-[var(--game-border)] bg-white text-sm focus:outline-none focus:border-[var(--ocean)]"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(0)} className="px-4 py-2 rounded-xl text-xs text-[var(--ink-faint)]">返回</button>
              <button
                disabled={!canNext()}
                onClick={() => setStep(2)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm spring-transition ${
                  canNext() ? "bg-[var(--ocean)] text-white hover:brightness-110 active:scale-95" : "bg-gray-200 text-gray-400"
                }`}
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 头像 */}
        {step === 2 && (
          <div>
            <h2 className="text-base font-bold text-[var(--ink)] mb-1">选择头像</h2>
            <p className="text-[10px] text-[var(--ink-faint)] mb-3">选择你的岛民形象</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`aspect-square rounded-xl text-2xl flex items-center justify-center spring-transition ${
                    avatar === a ? "bg-[var(--ocean)]/15 border-2 border-[var(--ocean)]" : "bg-gray-50 border border-transparent hover:bg-gray-100"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl text-xs text-[var(--ink-faint)]">返回</button>
              <button
                disabled={!canNext()}
                onClick={() => setStep(3)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm spring-transition ${
                  canNext() ? "bg-[var(--ocean)] text-white hover:brightness-110 active:scale-95" : "bg-gray-200 text-gray-400"
                }`}
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 出生区域 */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-bold text-[var(--ink)] mb-1">选择出生区域</h2>
            <p className="text-[10px] text-[var(--ink-faint)] mb-3">你的岛民将从这里开始探索</p>
            <div className="space-y-2">
              {BIRTH_AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setArea(a.id)}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 spring-transition ${
                    area === a.id ? "bg-[var(--ocean)]/10 border-2 border-[var(--ocean)]" : "bg-gray-50 border border-transparent hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div className="text-left flex-1">
                    <div className="text-sm font-bold text-[var(--ink)]">{a.name}</div>
                    <div className="text-[10px] text-[var(--ink-faint)]">{a.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl text-xs text-[var(--ink-faint)]">返回</button>
              <button
                disabled={!canNext()}
                onClick={() => setStep(4)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm spring-transition ${
                  canNext() ? "bg-[var(--ocean)] text-white hover:brightness-110 active:scale-95" : "bg-gray-200 text-gray-400"
                }`}
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 确认 */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-5xl mb-2">{avatar || "🧑"}</div>
            <h2 className="text-lg font-bold text-[var(--ink)]">{nickname || "小沪"}</h2>
            <div className="text-xs text-[var(--ink-soft)] mt-1">Lv.1 城市新手</div>
            <div className="mt-3 p-3 rounded-xl bg-gray-50 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--ink-faint)]">出生地</span>
                <span className="font-bold text-[var(--ocean)]">{BIRTH_AREAS.find(a => a.id === area)?.name || "徐汇岛"}</span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-[var(--ink-faint)]">初始金币</span>
                <span className="font-bold text-[var(--gold)]">🪙 100</span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-[var(--ink-faint)]">探索地点</span>
                <span className="font-bold">0</span>
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="w-full mt-4 py-3 rounded-xl bg-[var(--ocean)] text-white font-bold text-sm spring-transition hover:brightness-110 active:scale-95"
            >
              进入上海岛 🌊
            </button>
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#a8d5e8]/20 to-transparent" />
      <div className="absolute bottom-6 text-[10px] text-[var(--ink-faint)]">
        步骤 {step + 1} / 5
      </div>
    </div>
  );
}
