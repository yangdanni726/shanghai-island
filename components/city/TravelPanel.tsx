"use client";
import JourneyLink from "@/components/JourneyLink";
import {useEffect,useRef,useState} from 'react';
import ExplorationNextSteps from "@/components/game/ExplorationNextSteps";
import type {CityDestination} from '@/data/city-destinations';
export interface ArrivalResult {success:boolean;first?:boolean;exp?:number;coins?:number}
export default function TravelPanel({destination,busy,result,onConfirm,onClose,onSocial}:{destination:CityDestination;busy:boolean;result:ArrivalResult|null;onConfirm:()=>void;onClose:()=>void;onSocial:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);const [choice,setChoice]=useState(0);
 useEffect(()=>{const el=dialog.current;const previous=document.activeElement;el?.showModal();return()=>{el?.close();if(previous instanceof HTMLElement)previous.focus();};},[]);
 return <dialog ref={dialog} className="travel-dialog" onCancel={e=>{e.preventDefault();if(!busy)onClose();}} aria-labelledby="travel-title">
  <div className="modal-home-link">{busy?<span role="status">正在确认到达…</span>:<JourneyLink href="/island">🏠 回家</JourneyLink>}</div>
  <div className="travel-top"><span className="city-eyebrow">PLAN A LITTLE ADVENTURE</span><button onClick={onClose} disabled={busy} aria-label="关闭交通方案">×</button></div>
  <h2 id="travel-title">{destination.emoji} {destination.name}</h2><button className="travel-social-link" disabled={busy} onClick={onSocial}>看看这个地点的留言 ↗</button>
  <p className="travel-sub">场景映射：{destination.label} · 风格化展示</p>
  {!result&&<><div className="travel-notice">演示交通方案 · 非实时导航<br/><small>示例起点：城市入口。时间与费用仅用于展示比较功能，不代表真实路程。</small></div>
   <fieldset disabled={busy}><legend>选择一种出发方式</legend>{['🚶 步行','🚲 骑行','🚇 公共交通'].map((name,i)=><label key={name} className={choice===i?'route-choice selected':'route-choice'}><input type="radio" name="travel-mode" checked={choice===i} onChange={()=>setChoice(i)}/><div><strong>{name}</strong><small>{['慢慢逛，发现沿途街角','适合短途城市探索','适合跨街区出行'][i]}</small></div><div><b>{destination.minutes[i]} 分钟</b><small>{['¥0','¥2（示例）','¥4 · 换乘 1 次（示例）'][i]}</small></div></label>)}</fieldset>
   <p className="travel-note">确认后角色将在游戏中到达目的地，并记录探索足迹。无需付款，也不代表现实到访。</p>
   <button className="travel-confirm" disabled={busy} onClick={onConfirm}>{busy?'正在进入目的地…':`确认${['步行','骑行','乘坐公共交通'][choice]}并在游戏中到达 →`}</button></>}
  {result&&<div className="arrival-result" role="status"><span>{result.success?'✦':'!'}</span><h3>{result.success?'已在游戏中到达':'暂时无法到达'}</h3><p>{result.success?(result.first?'新地点已收入足迹，相关任务已同步。':'再次来到熟悉的街角，不重复增加不同地点任务。'):'目的地未通过场景安全检查，请关闭后重试。'}</p>{result.success&&<div className="arrival-rewards">+{result.exp} 经验　·　+{result.coins} 金币</div>}{result.success&&<ExplorationNextSteps />}<button className="travel-confirm" onClick={onClose}>继续漫步</button></div>}
 </dialog>;
}
