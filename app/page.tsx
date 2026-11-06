"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import JourneyLink from '@/components/JourneyLink';
import type {CitySession} from '@/lib/city-session';
import IslandMap from "@/components/IslandMap";
import LocationPanel from "@/components/game/LocationPanel";
import { usePlayer } from "@/contexts/PlayerContext";
import { getLocationById } from "@/data/locations";
import { getDistrictById } from "@/data/districts";
import "@/components/city/city.css";
import { CITY_DESTINATIONS, getCityDestination } from '@/data/city-destinations';
import { useQuests } from '@/contexts/QuestContext';
import { clampView } from '@/lib/city-zoom';
import TravelPanel, {type ArrivalResult} from '@/components/city/TravelPanel';
import SocialPanel from '@/components/city/SocialPanel';
import type {TravelRequest} from '@/components/city/CityScene';
const CityScene=dynamic(()=>import('@/components/city/CityScene'),{ssr:false,loading:()=> <div className="city-loading">正在准备 3D 城市…</div>});
export default function Home(){
 const router=useRouter();const {state,isLoaded,moveToArea,getLevel,exploreLocation}=usePlayer();
 const {onLocationExplored}=useQuests();
 const [resetKey,setResetKey]=useState(0);const [socialPlace,setSocialPlace]=useState<string|null>(null);
 const [mode,setMode]=useState<'loading'|'intro'|'street'|'overview'>('loading');
 const [ready,setReady]=useState(false);const [wide,setWide]=useState(false);const [selected,setSelected]=useState<string|null>(null);
 const [view,setView]=useState(13);const [routeId,setRouteId]=useState<string|null>(null);const [travel,setTravel]=useState<TravelRequest|null>(null);const [result,setResult]=useState<ArrivalResult|null>(null);const requestNumber=useRef(0);const travelLock=useRef(false);
 const selectRoute=useCallback((id:string)=>{setResult(null);setRouteId(id);},[]);
 const closeRoute=()=>{if(!travelLock.current){setRouteId(null);setResult(null);}};
 const confirmTravel=()=>{if(!routeId||travelLock.current)return;travelLock.current=true;setTravel({id:routeId,nonce:++requestNumber.current});};
 const arrive=useCallback((request:TravelRequest,success:boolean)=>{
  if(!travelLock.current||request.nonce!==requestNumber.current)return;
  travelLock.current=false;setTravel(null);
  const place=getLocationById(request.id);if(!success||!place){setResult({success:false});return;}
  const reward=exploreLocation(place.id);if(reward.success){moveToArea(place.districtId);if(reward.isFirstTime)onLocationExplored(place.id,place.category,place.districtId);}
  setResult({success:reward.success,first:reward.isFirstTime,exp:reward.expGained,coins:reward.coinsGained});setWide(false);
 },[exploreLocation,moveToArea,onLocationExplored]);
 const onReady=useCallback((saved:CitySession|null)=>{setReady(true);if(saved){setView(saved.view);setWide(saved.wide);setMode('street');}else if(new URLSearchParams(window.location.search).get('from')==='home'){setMode('street');}else{setMode('intro');}},[]);
 useEffect(()=>{if(isLoaded&&!state.isCreated)router.replace('/onboarding');},[isLoaded,state.isCreated,router]);
 useEffect(()=>{if(mode!=='intro'||!ready||selected)return;const timer=setTimeout(()=>setMode('street'),4200);return()=>clearTimeout(timer);},[mode,ready,selected]);
 if(!isLoaded||!state.isCreated)return <div className="city-loading">正在读取岛民身份…</div>;
 const player=state.player;const level=getLevel();const location=selected?getLocationById(selected):null;
 return <div className="city-shell">
  <JourneyLink className="city-home-entry" href="/island">🏠 回家</JourneyLink>
  <CityScene resetKey={resetKey} paused={mode!=='street'||!!selected||!!routeId||!!socialPlace} wide={wide||mode!=='street'} view={mode!=='street'?32:view} travel={travel} onZoom={setView} onSelect={selectRoute} onArrive={arrive} onReady={onReady}/>
  <header className="city-header"><div className="city-brand"><span className="city-mark">岛</span><div><strong>上海岛</strong><small>一座城市，许多种生活</small></div></div><div className="city-profile"><span>{player.avatar}</span><div><strong>{player.nickname}</strong><small>Lv.{level.level} · {level.title}</small></div><b>{state.coins} <small>金币</small></b></div></header>
  {mode==='street'&&<>
   <aside className="city-title"><span className="city-eyebrow">CITY WALK / 01</span><h1>从一个街角<br/>认识这座城。</h1><p>上海样本街区 · 自由漫步</p><div className="city-chip">☀ 晴日 · 演示场景</div></aside>
   <div className="city-tools"><button onClick={()=>setMode('overview')}>◉ 五岛总览</button><button onClick={()=>{setWide(v=>!v);setView(wide?13:32);}}>{wide?'↙ 回到身边':'↗ 看看全城'}</button><div className="city-zoom"><button aria-label="放大城市" onClick={()=>setView(v=>clampView(v/1.2))}>＋</button><span aria-label="当前缩放">{Math.round(13/view*100)}%</span><button aria-label="缩小城市" onClick={()=>setView(v=>clampView(v*1.2))}>−</button></div><button onClick={()=>{setView(13);setWide(false);setResetKey(v=>v+1);}}>回到角色</button></div>
   <aside className="city-destinations"><strong>下一站，去哪里？</strong><small>双击场景标记，或点击下方地点</small>{CITY_DESTINATIONS.map(d=><button key={d.id} disabled={!ready} onClick={()=>selectRoute(d.id)}>{d.emoji} {d.name}<span>查看交通 →</span></button>)}</aside>
   <div className="city-controls"><div><kbd>↑</kbd><div><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></div></div><p><strong>用方向键，逛逛街角</strong><br/><span>方向键移动 · 触控板双指平移 · 捏合缩放</span></p></div>
   <button className="city-social-entry" onClick={()=>setSocialPlace('wukang-coffee')}>✉ 地点留言 · 同校发现</button>
   <div className="city-status"><span className="city-dot"/>{ready?'城市已就绪':'场景加载中'}<span>探索足迹 {state.exploredCount}</span></div>
  </>}
  {(mode==='intro'||mode==='overview')&&<section className={`city-overview ${mode==='intro'?'city-intro':''}`} aria-label="五岛总览">
    <div className="city-overview-copy"><span className="city-eyebrow">FIVE ISLANDS · ONE CITY</span><h1>每座岛，都有你的生活。</h1><p>{mode==='intro'?'从五岛出发，走进一个真实可漫步的 3D 街角。':'选择岛屿查看原有探索内容，或回到 3D 样本街区。'}</p></div>
    <div className="city-map"><IslandMap playerX={player.positionX} playerY={player.positionY} playerAvatar={player.avatar} playerNickname={player.nickname} playerLevel={level.level} onAreaClick={moveToArea} onLocationClick={setSelected} exploredLocations={state.exploredLocations}/></div>
    <footer><div><strong>{getDistrictById(player.currentArea)?.name||'上海岛'}</strong><p>五岛内容总览 · 当前仅有一个 3D 样本街区</p></div><button onClick={()=>setMode('street')}>{mode==='intro'?'跳过开场，进入街道':'回到 3D 街道'} →</button></footer>
  </section>}
  {routeId&&getCityDestination(routeId)&&<TravelPanel key={routeId} destination={getCityDestination(routeId)!} busy={!!travel} result={result} onSocial={()=>{if(!travelLock.current){setSocialPlace(routeId);setRouteId(null);setResult(null);}}} onConfirm={confirmTravel} onClose={closeRoute}/>}
  {socialPlace&&<SocialPanel initialPlace={socialPlace} onClose={()=>setSocialPlace(null)}/>}
  {location&&<LocationPanel location={location} onClose={()=>setSelected(null)}/>}
 </div>;
}
