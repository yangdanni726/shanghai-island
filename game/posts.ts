// 广场动态数据系统

export interface IslandPost {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  level: number;
  locationId: string;       // 关联地点 ID
  locationName: string;     // 地点名称
  districtId: string;       // 区域 ID（用于筛选）
  content: string;
  emoji: string;            // 动态表情/图标
  imagePlaceholder?: string; // 图片占位 emoji
  likes: number;
  comments: number;
  liked: boolean;           // 当前用户是否已点赞
  saved: boolean;           // 当前用户是否已收藏
  createdAt: string;        // 相对时间 "刚刚"/"3分钟前"
}

// Mock 动态数据 — 岛民广场初始内容
export const INITIAL_POSTS: IslandPost[] = [
  {
    id: "post-001",
    userId: "islander-mocha",
    nickname: "摩卡岛民",
    avatar: "👧",
    level: 3,
    locationId: "wukang-coffee",
    locationName: "武康路咖啡街",
    districtId: "jingan",
    content: "在武康路发现了一家超有氛围的咖啡馆！梧桐树下的座位太惬意了 ☕️",
    emoji: "☕",
    imagePlaceholder: "🌳",
    likes: 28,
    comments: 5,
    liked: false,
    saved: false,
    createdAt: "5分钟前",
  },
  {
    id: "post-002",
    userId: "islander-bund",
    nickname: "外滩夜行侠",
    avatar: "🧑",
    level: 5,
    locationId: "bund-view",
    locationName: "外滩观景台",
    districtId: "huangpu",
    content: "傍晚的外滩太美了！万国建筑群亮灯的瞬间，感觉自己穿越了 🌃",
    emoji: "🌃",
    imagePlaceholder: "🏙️",
    likes: 56,
    comments: 12,
    liked: false,
    saved: false,
    createdAt: "15分钟前",
  },
  {
    id: "post-003",
    userId: "islander-art",
    nickname: "艺术流浪者",
    avatar: "👩",
    level: 4,
    locationId: "west-bund",
    locationName: "西岸美术馆",
    districtId: "xuhui",
    content: "西岸的展览太震撼了！沿江走走停停，每一家美术馆都有惊喜 🎨",
    emoji: "🎨",
    imagePlaceholder: "🖼️",
    likes: 42,
    comments: 8,
    liked: false,
    saved: false,
    createdAt: "1小时前",
  },
  {
    id: "post-004",
    userId: "islander-foodie",
    nickname: "吃货小队",
    avatar: "🧒",
    level: 2,
    locationId: "chenghuang-food",
    locationName: "城隍庙小吃",
    districtId: "huangpu",
    content: "城隍庙的南翔小笼还是那个味！皮薄馅大，一口一个满足 🥟",
    emoji: "🍜",
    imagePlaceholder: "🥢",
    likes: 35,
    comments: 6,
    liked: false,
    saved: false,
    createdAt: "2小时前",
  },
  {
    id: "post-005",
    userId: "islander-park",
    nickname: "公园散步家",
    avatar: "👨",
    level: 3,
    locationId: "century-park",
    locationName: "世纪公园",
    districtId: "pudong",
    content: "周末在世纪公园野餐！阳光、草地、风筝，这就是上海岛的慢生活 🌳",
    emoji: "🌳",
    imagePlaceholder: "🌞",
    likes: 48,
    comments: 10,
    liked: false,
    saved: false,
    createdAt: "3小时前",
  },
  {
    id: "post-006",
    userId: "islander-music",
    nickname: "大学路吉他手",
    avatar: "👦",
    level: 2,
    locationId: "daxue-road",
    locationName: "大学路",
    districtId: "yangpu",
    content: "大学路的夜晚属于音乐！街边酒吧传出吉他声，太有氛围了 🎸",
    emoji: "🎸",
    imagePlaceholder: "🎵",
    likes: 31,
    comments: 7,
    liked: false,
    saved: false,
    createdAt: "5小时前",
  },
  {
    id: "post-007",
    userId: "islander-temple",
    nickname: "古寺探访者",
    avatar: "🧑",
    level: 4,
    locationId: "jingan-temple",
    locationName: "静安寺",
    districtId: "jingan",
    content: "静安寺的金顶在阳光下太庄严了。闹市中的一片净土 🛕",
    emoji: "🛕",
    imagePlaceholder: "✨",
    likes: 22,
    comments: 3,
    liked: false,
    saved: false,
    createdAt: "昨天",
  },
];

// 获取全部动态
export const getAllPosts = (): IslandPost[] => INITIAL_POSTS;

// 按区域筛选
export const getPostsByDistrict = (districtId: string): IslandPost[] =>
  INITIAL_POSTS.filter((p) => p.districtId === districtId);

// 按 ID 查找
export const getPostById = (id: string): IslandPost | undefined =>
  INITIAL_POSTS.find((p) => p.id === id);
