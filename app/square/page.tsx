"use client";

import SocialPanel from "@/components/city/SocialPanel";
import { useState } from "react";
import { createPersistentStore, isRecord } from "@/lib/persistent-store";
import { usePersistentStore } from "@/hooks/usePersistentStore";
import { usePlayer } from "@/contexts/PlayerContext";
import { INITIAL_POSTS, type IslandPost } from "@/game/posts";
import { LOCATIONS } from "@/data/locations";
import { DISTRICTS } from "@/data/districts";
import PostCard from "@/components/game/PostCard";
import PublishPost from "@/components/game/PublishPost";
import GamePanel from "@/components/game/ui/GamePanel";
import { gameColors } from "@/styles/game-theme";

const postsStore = createPersistentStore("shanghai_island_posts", INITIAL_POSTS, (value): IslandPost[] => {
  if (!Array.isArray(value)) return INITIAL_POSTS;
  return value.filter((post): post is IslandPost => isRecord(post)
    && ["id", "userId", "nickname", "avatar", "locationId", "locationName", "districtId", "content", "createdAt"].every((key) => typeof post[key] === "string")
    && typeof post.likes === "number" && typeof post.comments === "number");
});

type Tab = "all" | "following" | "nearby" | "saved";

export default function SquarePage() {
  const { state } = usePlayer();
  const [socialTab,setSocialTab]=useState<"place"|"school"|null>(null);
  const [posts, setPosts, isLoaded] = usePersistentStore(postsStore);
  const [tab, setTab] = useState<Tab>("all");
  const [nearbyDistrict, setNearbyDistrict] = useState<string>("all");
  const [showPublish, setShowPublish] = useState(false);
  // 点赞
  const handleLike = (postId: string) => {
    setPosts((previous) => previous.map((p) =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  // 收藏
  const handleSave = (postId: string) => {
    setPosts((previous) => previous.map((p) =>
      p.id === postId ? { ...p, saved: !p.saved } : p
    ));
  };

  // 发布动态
  const handlePublish = (content: string, locationId: string) => {
    const loc = LOCATIONS.find((l) => l.id === locationId);
    if (!loc) return;

    const newPost: IslandPost = {
      id: `post-${crypto.randomUUID()}`,
      userId: state.player.id,
      nickname: state.player.nickname,
      avatar: state.player.avatar,
      level: state.player.level || 1,
      locationId: loc.id,
      locationName: loc.name,
      districtId: loc.districtId,
      content,
      emoji: loc.emoji,
      imagePlaceholder: loc.emoji,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
      createdAt: "刚刚",
    };
    setPosts((previous) => [newPost, ...previous]);
  };

  // 筛选动态
  const filteredPosts = (() => {
    if (tab === "all") return posts;
    if (tab === "following") return posts.filter((p) => INITIAL_POSTS.some(seed=>seed.id===p.id)).slice(0, 5);
    if (tab === "nearby") {
      if (nearbyDistrict === "all") return posts;
      return posts.filter((p) => p.districtId === nearbyDistrict);
    }
    if (tab === "saved") return posts.filter((p) => p.saved);
    return posts;
  })();

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "following", label: "精选示例" },
    { id: "nearby", label: "按岛筛选" },
    { id: "saved", label: "想去" },
  ];

  if (!isLoaded) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen pb-4">
      {/* 顶部标题 */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[var(--ink)]">🏝️ 岛民广场</h1>
            <p className="text-[10px] text-[var(--ink-faint)] mt-0.5">
              {posts.length} 条岛民动态 · 探索上海岛
            </p>
          </div>
          <GamePanel variant="floating" className="px-2.5 py-1.5">
            <span className="text-[10px] text-[var(--ink-soft)]">演示社区 · 本机保存</span>
          </GamePanel>
        </div>
      </div>

      <section className="mx-4 mb-5 grid grid-cols-2 gap-3" aria-label="街区社交入口">
        <button onClick={()=>setSocialTab("place")} className="rounded-2xl bg-[#d6f3ee] p-5 text-left text-[#155d59]"><span className="text-2xl">✉️</span><strong className="block mt-2">地点留言</strong><span className="text-xs">接着聊聊街角的新发现</span></button>
        <button onClick={()=>setSocialTab("school")} className="rounded-2xl bg-[#fff0be] p-5 text-left text-[#795216]"><span className="text-2xl">🎓</span><strong className="block mt-2">同校发现</strong><span className="text-xs">自选学校，发现共同话题</span></button>
      </section>
      <p className="px-4 mb-3 text-xs text-[var(--ink-soft)]">下方为岛民动态；地点留言与城市街道使用同一份本机记录。</p>
      {socialTab&&<SocialPanel initialPlace="wukang-coffee" initialTab={socialTab} onClose={()=>setSocialTab(null)} />}
      {/* Tab 切换 */}
      <div className="px-4 mb-3">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold spring-transition whitespace-nowrap"
              style={{
                background: tab === t.id ? `${gameColors.ocean}` : "#fff",
                color: tab === t.id ? "#fff" : "var(--ink-soft)",
                border: tab === t.id ? "none" : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 附近区域筛选 */}
      {tab === "nearby" && (
        <div className="px-4 mb-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setNearbyDistrict("all")}
            className="px-2.5 py-1 rounded-full text-[10px] font-semibold spring-transition whitespace-nowrap"
            style={{
              background: nearbyDistrict === "all" ? `${gameColors.island}15` : "#f5f5f5",
              color: nearbyDistrict === "all" ? gameColors.island : "var(--ink-faint)",
            }}
          >
            全部区域
          </button>
          {DISTRICTS.map((d) => (
            <button
              key={d.id}
              onClick={() => setNearbyDistrict(d.id)}
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold spring-transition whitespace-nowrap"
              style={{
                background: nearbyDistrict === d.id ? `${gameColors.island}15` : "#f5f5f5",
                color: nearbyDistrict === d.id ? gameColors.island : "var(--ink-faint)",
              }}
            >
              {d.icon} {d.name}
            </button>
          ))}
        </div>
      )}

      {/* 动态流 */}
      <div className="px-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-xs text-[var(--ink-faint)]">
            {tab === "saved" ? "还没有收藏的动态" : "暂无动态"}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />
          ))
        )}
      </div>

      {/* 浮动发布按钮 */}
      <button
        aria-label="发布本机动态"
        onClick={() => setShowPublish(true)}
        className="fixed bottom-20 right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center spring-transition hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${gameColors.ocean}, ${gameColors.oceanDeep})`,
          boxShadow: `0 4px 16px ${gameColors.ocean}40`,
          fontSize: "20px",
        }}
      >
        <span style={{ color: "#fff" }}>✏️</span>
      </button>

      {/* 发布弹窗 */}
      {showPublish && (
        <PublishPost onPublish={handlePublish} onClose={() => setShowPublish(false)} />
      )}
    </div>
  );
}
