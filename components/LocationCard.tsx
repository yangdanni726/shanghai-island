// 地点卡片 — 用于区域详情页
interface LocationCardProps {
  name: string;
  tag: string;
  distance: string;
  recommendCount: number;
  emoji: string;
  onExplore?: () => void;
}

export default function LocationCard({
  name,
  tag,
  distance,
  recommendCount,
  emoji,
  onExplore,
}: LocationCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 spring-transition hover:shadow-md hover:-translate-y-1">
      {/* 图片占位 */}
      <div className="h-32 bg-gradient-to-br from-[var(--sand)] to-[var(--ocean-light)]/30 flex items-center justify-center">
        <span className="text-4xl opacity-40">{emoji}</span>
      </div>
      {/* 信息 */}
      <div className="p-3">
        <div className="font-bold text-sm text-[var(--ink)] mb-1">{name}</div>
        <div className="flex items-center gap-2 text-[10px] text-[var(--ink-faint)] mb-2">
          <span className="bg-[var(--ocean)]/8 text-[var(--ocean)] px-1.5 py-0.5 rounded">
            {tag}
          </span>
          <span>📍 示例距离 {distance}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--ink-faint)]">
            👥 示例热度 {recommendCount}
          </span>
          <button onClick={onExplore} aria-label={`探索${name}`} className="text-[10px] font-bold text-white bg-[var(--ocean)] px-3 py-1 rounded-full hover:bg-[var(--ocean-deep)] transition-colors">
            去探索
          </button>
        </div>
      </div>
    </div>
  );
}
