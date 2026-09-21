"use client";

import { useState, useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useHome } from "@/contexts/HomeContext";
import { INITIAL_POSTS, type IslandPost } from "@/game/posts";
import { LOCATIONS } from "@/data/locations";
import { DISTRICTS } from "@/data/districts";
import PostCard from "@/components/game/PostCard";
import PublishPost from "@/components/game/PublishPost";
import GamePanel from "@/components/game/ui/GamePanel";
import { gameColors } from "@/styles/game-theme";

const STORAGE_KEY = "shanghai_island_posts";

type Tab = "all" | "following" | "nearby" | "saved";

export default function SquarePage() {
  const { state } = usePlayer();
  const { home } = useHome();
  const [posts, setPosts] = useState<IslandPost[]>(INITIAL_POSTS);
  const [tab, setTab] = useState<Tab>("all");
  const [nearbyDistrict, setNearbyDistrict] = useState<string>("all");
  const [showPublish, setShowPublish] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        }
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  const savePosts = (newPosts: IslandPost[]) => {
    setPosts(newPosts);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts)); } catch {}
  };

  // 点赞
  const handleLike = (postId: string) => {
    const newPosts = posts.map((p) =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    );
    savePosts(newPosts);
  };

  // 收藏
  const handleSave = (postId: string) => {
    const newPosts = posts.map((p) =>
      p.id === postId ? { ...p, saved: !p.saved } : p
    );
    savePosts(newPosts);
  };

  // 发布动态
  const handlePublish = (content: string, locationId: string) => {
    const loc = LOCATIONS.find((l) => l.id === locationId);
    if (!loc) return;

    const newPost: IslandPost = {
      id: `post-${Date.now()}`,
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
    savePosts([newPost, ...posts]);
  };

  // 筛选动态
  const filteredPosts = (() => {
    if (tab === "all") return posts;
    if (tab === "following") return posts.filter((p) => p.userId !== state.player.id).slice(0, 5);
    if (tab === "nearby") {
      if (nearbyDistrict === "all") return posts;
      return posts.filter((p) => p.districtId === nearbyDistrict);
    }
    if (tab === "saved") return posts.filter((p) => p.saved);
    return posts;
  })();

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "following", label: "关注" },
    { id: "nearby", label: "附近" },
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
            <span className="text-[10px] text-[var(--ink-soft)]">🟢 {posts.filter(p => p.createdAt === "刚刚" || p.createdAt.includes("分钟")).length} 人在线</span>
          </GamePanel>
        </div>
      </div>

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
