'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
export default function JourneyLink({href,children,className=''}:{href:string;children:React.ReactNode;className?:string}){
 const pathname=usePathname();
 const lock=useRef(false);const [busy,setBusy]=useState(false);const [slow,setSlow]=useState(false);
 useEffect(()=>{if(!busy)return;const timer=setTimeout(()=>{lock.current=false;setBusy(false);setSlow(true);},12000);return()=>clearTimeout(timer);},[busy]);
 return <span className={`journey-wrap ${className}`}><Link href={href} aria-disabled={busy} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;if(href.split('?')[0]===pathname){e.preventDefault();return;}if(lock.current){e.preventDefault();return;}lock.current=true;setBusy(true);setSlow(false);window.dispatchEvent(new Event('shanghai-island:save-city'));}}>{busy?'正在切换…':children}</Link>{busy&&<span role="status" className="journey-hint">正在准备场景，请稍候</span>}{slow&&<span role="alert" className="journey-hint">切换较慢，请再次点击重试</span>}</span>;
}
