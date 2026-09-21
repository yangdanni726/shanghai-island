-- Shanghai Island 数据库 Schema
-- Task 3 中集成 Supabase 时执行

-- 用户表
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nickname varchar(50) not null,
  avatar varchar(500),
  city varchar(50) default '上海',
  district varchar(50),
  level int default 1,
  experience int default 0,
  islander_title varchar(50) default '城市新手',     -- 岛民头衔：城市新手/城市探索家/城市冒险家...
  coins int default 0,                              -- 金币：完成任务/打卡获得
  current_location varchar(50),                     -- 当前所在区域ID
  explored_count int default 0,                     -- 已探索地点数量
  created_at timestamptz default now()
);

-- 动态表
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  content text not null,
  image_url varchar(500),
  location_id uuid,
  likes int default 0,
  created_at timestamptz default now()
);

-- 地点表
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  category varchar(20) not null, -- food, coffee, culture, park, activity
  district varchar(50) not null,
  description text,
  image varchar(500),
  latitude float8,
  longitude float8
);

-- 任务表
create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  title varchar(100) not null,
  description text,
  reward int not null,
  type varchar(20) not null -- daily, weekly
);

-- 用户任务关联表
create table if not exists user_missions (
  user_id uuid references users(id),
  mission_id uuid references missions(id),
  status varchar(20) default 'pending', -- pending, completed
  completed_time timestamptz,
  primary key (user_id, mission_id)
);

-- 徽章表
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null,
  description text,
  icon varchar(200) not null
);
