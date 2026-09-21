"use client";

import { useRouter } from "next/navigation";
import type { IslandPost } from "@/game/posts";
import { gameColors, gameRadius, gameShadow } from "@/styles/game-theme";

interface PostCardProps {
  post: IslandPost;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
}

// 岛民广场动态卡片 — 游戏化风格
export default function PostCard({ post, onLike, onSave }: PostCardProps) {
  const router = useRouter();

  const handleLocationClick = () => {
    router.push(`/map?district=${post.districtId}`);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: gameRadius.card,
        boxShadow: gameShadow.card,
        padding: "14px 16px",
        marginBottom: "10px",
        border: "1px solid rgba(0,0,0,0.03)",
      }}
      className="hover:-translate-y-0.5 spring-transition"
    >
      {/* 头部 — 岛民信息 */}
      <div className="flex items-center gap-2.5">
        {/* 头像 + 等级 */}
        <div className="relative">
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: gameColors.goldLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              border: `2px solid ${gameColors.gold}30`,
            }}
          >
            {post.avatar}
          </div>
          {/* 等级徽章 */}
          <div
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              background: gameColors.ocean,
              color: "#fff",
              fontSize: "8px",
              fontWeight: 700,
              padding: "1px 5px",
              borderRadius: "8px",
              lineHeight: 1,
            }}
          >
            Lv.{post.level}
          </div>
        </div>
        {/* 昵称 + 时间 */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-[var(--ink)] truncate">{post.nickname}</div>
          <div className="text-[10px] text-[var(--ink-faint)]">{post.createdAt}</div>
        </div>
      </div>

      {/* 位置标签 */}
      <button
        onClick={handleLocationClick}
        className="flex items-center gap-1 mt-2.5 px-2.5 py-1 rounded-full spring-transition"
        style={{
          background: `${gameColors.ocean}10`,
          border: `1px solid ${gameColors.ocean}20`,
        }}
      >
        <span className="text-[10px]">📍</span>
        <span className="text-[10px] font-semibold" style={{ color: gameColors.ocean }}>
          {post.locationName}
        </span>
      </button>

      {/* 内容 */}
      <p className="text-xs text-[var(--ink-soft)] mt-2.5 leading-relaxed">
        {post.content}
      </p>

      {/* 图片占位 */}
      {post.imagePlaceholder && (
        <div
          style={{
            marginTop: "10px",
            borderRadius: gameRadius.button,
            background: `linear-gradient(135deg, ${gameColors.sand}, ${gameColors.goldLight})`,
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
          }}
          className="hover:scale-[1.02] spring-transition"
        >
          {post.imagePlaceholder}
        </div>
      )}

      {/* 交互栏 */}
      <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-black/5">
        {/* 点赞 */}
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center gap-1.5 spring-transition"
        >
          <span
            className="text-base"
            style={{ filter: post.liked ? "none" : "grayscale(0.3)" }}
          >
            {post.liked ? "❤️" : "🤍"}
          </span>
          <span
            className="text-[11px] font-semibold"
            style={{ color: post.liked ? gameColors.coral : gameColors.inkFaint }}
          >
            {post.likes}
          </span>
        </button>

        {/* 评论 */}
        <button className="flex items-center gap-1.5">
          <span className="text-base opacity-60">💬</span>
          <span className="text-[11px] font-semibold text-[var(--ink-faint)]">{post.comments}</span>
        </button>

        {/* 收藏 */}
        <button
          onClick={() => onSave(post.id)}
          className="flex items-center gap-1.5 ml-auto spring-transition"
        >
          <span className="text-base opacity-60">{post.saved ? "⭐" : "☆"}</span>
          <span
            className="text-[11px] font-semibold"
            style={{ color: post.saved ? gameColors.gold : gameColors.inkFaint }}
          >
            {post.saved ? "已收藏" : "想去"}
          </span>
        </button>
      </div>
    </div>
  );
}
