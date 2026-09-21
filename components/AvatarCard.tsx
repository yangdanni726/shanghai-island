import type { Islander } from "@/types";
import { getDistrictById } from "@/data/districts";

interface AvatarCardProps {
  user: Islander;
  maxExp: number;
}

export default function AvatarCard({ user, maxExp }: AvatarCardProps) {
  const expPct = Math.round((user.experience / maxExp) * 100);
  const district = user.currentLocation
    ? getDistrictById(user.currentLocation)
    : null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
      <div className="flex items-center gap-4">
        {/* 头像 */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean-deep)] flex items-center justify-center text-white text-xl font-bold shrink-0">
          {user.nickname.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--ink)] text-base truncate">
              {user.nickname}
            </span>
            <span className="text-[10px] bg-[var(--gold)]/15 text-[var(--gold)] px-1.5 py-0.5 rounded-full font-medium shrink-0">
              Lv.{user.level} {user.islanderTitle}
            </span>
          </div>
          <div className="text-[11px] text-[var(--ink-faint)] mt-0.5">
            岛龄 {user.islandAge} · {district ? `当前位置: ${district.name}` : "上海岛民"}
          </div>
          {/* 经验条 */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--ocean-light)] to-[var(--ocean)] rounded-full transition-all duration-700"
                style={{ width: `${expPct}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--ink-faint)] shrink-0">
              {user.experience}/{maxExp}
            </span>
          </div>
        </div>
      </div>
      {/* 游戏化数据条 */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-black/5">
        <div className="flex items-center gap-1 text-xs text-[var(--ink-soft)]">
          <span>📍</span> 探索 <b className="text-[var(--ink)]">{user.exploredCount}</b>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--ink-soft)]">
          <span>🪙</span> 金币 <b className="text-[var(--gold)]">{user.coins}</b>
        </div>
      </div>
    </div>
  );
}
