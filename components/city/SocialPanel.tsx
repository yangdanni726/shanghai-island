"use client";
import JourneyLink from "@/components/JourneyLink";
import "./city.css";
import {useEffect,useRef,useState} from 'react';
import {usePlayer} from '@/contexts/PlayerContext';
import {createPersistentStore} from '@/lib/persistent-store';
import {usePersistentStore} from '@/hooks/usePersistentStore';
import {SCHOOLS,INITIAL_SOCIAL,normalizeSocial,selectNotes,SAMPLE_NOTES,validSchool} from '@/lib/city-social';
import {CITY_DESTINATIONS,getCityDestination} from '@/data/city-destinations';
const store=createPersistentStore('shanghai_island_social_v1',INITIAL_SOCIAL,normalizeSocial);
export default function SocialPanel({initialPlace,initialTab="place",onClose}:{initialPlace:string;initialTab?:"place"|"school";onClose:()=>void}) {
 const {state}=usePlayer();const [saved,setSaved]=usePersistentStore(store);const player=state.player;
 const [tab,setTab]=useState<'place'|'school'>(initialTab);const [place,setPlace]=useState(initialPlace);const [text,setText]=useState('');const [notice,setNotice]=useState('');const dialog=useRef<HTMLDialogElement>(null);const draft=useRef<HTMLTextAreaElement>(null);
 const school=saved.schools[player.id]??'';
 useEffect(()=>{const el=dialog.current;const previous=document.activeElement;el?.showModal();return()=>{el?.close();if(previous instanceof HTMLElement)previous.focus();};},[]);
 const own=selectNotes(saved.notes,tab==='place'?place:null,tab==='school'?school:null);
 const samples=selectNotes(SAMPLE_NOTES,tab==='place'?place:null,tab==='school'?school:null);
 const changeSchool=(value:string)=>{if(!validSchool(value))return;setSaved(p=>({...p,schools:{...p.schools,[player.id]:value}}));setNotice(value?'已保存学校选择；这是自选信息，未经认证。':'已清除学校选择。');};
 const submit=(e:React.FormEvent)=>{e.preventDefault();const value=draft.current?.value.trim();if(!value||!state.isCreated)return;const note={id:crypto.randomUUID(),authorId:player.id,author:player.nickname,school,placeId:place,text:value.slice(0,200),createdAt:Date.now()};setSaved(p=>({...p,notes:[note,...p.notes].slice(0,200)}));if(draft.current)draft.current.value='';setText('');setNotice('留言已保存到本机，没有发送给其他用户。');};
 return <dialog ref={dialog} className="travel-dialog social-dialog" onCancel={e=>{e.preventDefault();onClose();}} aria-labelledby="social-title">
  <div className="modal-home-link"><JourneyLink href="/island">🏠 回家</JourneyLink></div>
  <div className="travel-top"><span className="city-eyebrow">MEET THROUGH A PLACE</span><button aria-label="关闭留言与同校" onClick={onClose}>×</button></div>
  <h2 id="social-title">把城市，聊得近一点。</h2><p className="travel-sub">地点是话题，同校是共同背景。这里是本机演示社区。</p>
  <div className="social-tabs" aria-label="社交视图"><button aria-pressed={tab==='place'} onClick={()=>setTab('place')}>地点留言</button><button aria-pressed={tab==='school'} onClick={()=>setTab('school')}>同校发现</button></div>
  <div className="school-picker"><label htmlFor="school-select">我的学校 <small>自选 · 未认证</small></label><select id="school-select" value={school} onChange={e=>changeSchool(e.target.value)}><option value="">暂不选择／不公开学校</option>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select><small>仅保存在当前浏览器。选择学校后，新留言会附上学校；历史留言保持发布时的信息。</small></div>
  {tab==='place'?<label className="place-picker">当前地点<select value={place} onChange={e=>{setPlace(e.target.value);setNotice('');}} aria-label="留言地点">{CITY_DESTINATIONS.map(d=><option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}</select></label>:<div className="school-heading"><strong>{school||'先选择学校，发现共同话题'}</strong><p>{school?'以下仅筛选所选学校的本机留言与示例内容，不代表已认证校友或在线用户。':'无需填写姓名、学号或联系方式，也可以不选学校直接留言。'}</p></div>}
  <section className="social-feed" aria-label={tab==='place'?'地点留言列表':'同校留言列表'}>
   {own.length===0&&<p className="social-empty">{tab==='school'&&!school?'选好学校后，这里会展示匹配内容。':'还没有符合条件的本机留言。可以从一个小发现开始。'}</p>}
   {[...own,...samples].map(n=><article key={n.id} className="social-note"><header><strong>{n.author}{n.authorId===player.id?' · 我':''}</strong><span>{n.authorId==='demo'?'示例内容':'本机留言'}</span></header><small>{n.school||'未公开学校'} · {getCityDestination(n.placeId)?.name}</small><p>{n.text}</p></article>)}
  </section>
  <form onSubmit={submit} className="note-composer"><label htmlFor="city-note">给{getCityDestination(place)?.name}留句话</label><textarea ref={draft} id="city-note" value={text} onChange={e=>setText(e.target.value)} maxLength={200} placeholder="一个发现、一条建议，或下一次想去的理由…"/><footer><small>{text.length}/200 · 仅本机保存</small><button type="submit" disabled={!text.trim()}>保存留言</button></footer></form>
  <p className="social-notice" role="status">{notice||'演示人物与内容均为虚构；未连接真实社交服务。'}</p>
 </dialog>;
}
