// 任务卡片 — 显示每日探索任务
interface MissionCardProps {
  title: string;
  reward: number;
  completed: boolean;
}

export default function MissionCard({ title, reward, completed }: MissionCardProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border spring-transition ${
        completed
          ? "bg-[var(--island-green)]/8 border-[var(--island-green)]/20"
          : "bg-white border-black/5"
      }`}
    >
      {/* 复选框 */}
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
          completed
            ? "bg-[var(--island-green)] border-[var(--island-green)]"
            : "border-gray-300"
        }`}
      >
        {completed && (
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {/* 任务信息 */}
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-medium ${
            completed
              ? "text-[var(--ink-faint)] line-through"
              : "text-[var(--ink)]"
          }`}
        >
          {title}
        </span>
      </div>
      {/* 奖励 */}
      <span className="text-xs font-bold text-[var(--gold)] shrink-0">
        +{reward} 经验
      </span>
    </div>
  );
}
