"use client";
import JourneyLink from '@/components/JourneyLink';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,type ReactNode} from "react";

export default function Modal({children,onClose,label}:{children:ReactNode;onClose:()=>void;label:string}) {
 const pathname=usePathname();
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;const previous=document.activeElement;dialog?.showModal();return()=>{dialog?.close();if(previous instanceof HTMLElement&&previous.isConnected)previous.focus();};},[]);
 return <dialog ref={ref} aria-label={label} className="game-modal" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>{pathname==='/'&&<div className="modal-home-link"><JourneyLink href="/island">🏠 回家</JourneyLink></div>}{children}</dialog>;
}
