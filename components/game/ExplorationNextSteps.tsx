"use client";
import Link from "next/link";
import { useQuests } from "@/contexts/QuestContext";
import { ALL_QUESTS } from "@/game/quests";

export default function ExplorationNextSteps({inHome=false}:{inHome?:boolean}) {
 const {getQuestProgress}=useQuests();
 const count=ALL_QUESTS.filter(q=>getQuestProgress(q.id).status==='completed').length;
 return <nav aria-label="探索后的下一步" className="mt-3 rounded-xl bg-white p-3 text-center text-xs text-[var(--ink)]">
  <p className="mb-2">{count?`有 ${count} 项任务奖励可以领取`:'继续探索新地点，积累任务进度'}</p>
  <div className="flex justify-center gap-4"><Link className="font-bold underline" href="/missions">{count?'去领取奖励':'查看探索任务'}</Link>{!inHome&&<Link className="font-bold underline" href="/island">回小屋看足迹</Link>}</div>
 </nav>;
}
