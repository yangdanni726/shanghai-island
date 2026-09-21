// 岛民广场动态卡片
interface PostCardProps {
  nickname: string;
  avatar: string;
  location: string;
  time: string;
  content: string;
  likes: number;
}

export default function PostCard({
  nickname,
  avatar,
  location,
  time,
  content,
  likes,
}: PostCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 spring-transition hover:shadow-md hover:-translate-y-1">
      {/* 头部 */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--coral)] to-[var(--gold)] flex items-center justify-center text-white font-bold shrink-0">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-[var(--ink)]">{nickname}</div>
          <div className="text-[10px] text-[var(--ink-faint)]">
            📍 {location} · {time}
          </div>
        </div>
      </div>
      {/* 内容 */}
      <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">
        {content}
      </p>
      {/* 图片占位 */}
      <div className="w-full h-40 rounded-xl bg-gradient-to-br from-[var(--ocean-light)]/40 to-[var(--sand)] flex items-center justify-center mb-3">
        <span className="text-3xl opacity-30">🌊</span>
      </div>
      {/* 交互栏 */}
      <div className="flex items-center gap-4 pt-2 border-t border-black/5">
        <button className="flex items-center gap-1 text-xs text-[var(--ink-faint)] hover:text-[var(--coral)] transition-colors">
          <span>❤️</span> {likes}
        </button>
        <button className="flex items-center gap-1 text-xs text-[var(--ink-faint)] hover:text-[var(--ocean)] transition-colors">
          👋 想一起去
        </button>
        <button className="ml-auto text-xs text-[var(--ink-faint)] hover:text-[var(--gold)] transition-colors">
          ⭐ 收藏
        </button>
      </div>
    </div>
  );
}
