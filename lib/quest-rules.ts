import type {Quest,QuestProgress,Location} from '@/types';
// Showcase tasks are lifetime unique-location goals; legacy daily/weekly IDs stay stable.
export function reconcileQuests(quests:Quest[],locations:Location[],ids:string[],saved:Record<string,QuestProgress>):Record<string,QuestProgress> {
 const visited=new Set(ids);const places=locations.filter(l=>visited.has(l.id));
 return Object.fromEntries(quests.map(q=>{
  let count=0;
  if(q.target.type==='count')count=places.length;
  if(q.target.type==='category')count=places.filter(l=>l.category===q.target.value).length;
  if(q.target.type==='location')count=places.filter(l=>l.id===q.target.value).length;
  if(q.target.type==='district')count=q.target.value==='all'?new Set(places.map(l=>l.districtId)).size:Number(places.some(l=>l.districtId===q.target.value));
  const claimed=saved[q.id]?.status==='claimed';
  const progress=claimed?q.targetCount:Math.min(count,q.targetCount);
  return [q.id,{questId:q.id,progress,status:claimed?'claimed':progress>=q.targetCount?'completed':'active'}];
 }));
}

// Choose a new place that advances this quest, including an unvisited district.
export function suggestQuestLocation(quest:Quest,locations:Location[],ids:string[]):Location|undefined {
 const visited=new Set(ids);
 const districts=new Set(locations.filter(l=>visited.has(l.id)).map(l=>l.districtId));
 return locations.find(l=>!visited.has(l.id)&&(
  quest.target.type==='count'||
  (quest.target.type==='category'&&l.category===quest.target.value)||
  (quest.target.type==='location'&&l.id===quest.target.value)||
  (quest.target.type==='district'&&(quest.target.value==='all'?!districts.has(l.districtId):l.districtId===quest.target.value))
 ));
}
