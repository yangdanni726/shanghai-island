"use client";
import dynamic from 'next/dynamic';
const HomeScene=dynamic(()=>import('@/components/home/HomeScene'),{ssr:false,loading:()=> <div className="min-h-[430px] rounded-3xl bg-[#dcebea] flex items-center justify-center text-sm">正在准备3D小屋…</div>});
export default function HomeRoom({homeLevel,trophies}:{homeLevel:number;trophies:string[]}) {
 return <HomeScene homeLevel={homeLevel} trophies={trophies}/>;
}
