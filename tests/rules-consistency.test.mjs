import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LOCATIONS} from '../data/locations.ts';
import {DISTRICTS} from '../data/districts.ts';
import {ALL_QUESTS,BADGES} from '../game/quests.ts';
import {HOME_LEVELS} from '../game/home.ts';
import {getLevelFromExp} from '../game/levels.ts';
import {reconcileQuests,suggestQuestLocation} from '../lib/quest-rules.ts';
import {CITY_DESTINATIONS} from '../data/city-destinations.ts';
test('all quests can be completed with the actual unique location catalog',()=>{const all=reconcileQuests(ALL_QUESTS,LOCATIONS,LOCATIONS.map(l=>l.id),{});for(const q of ALL_QUESTS)assert.equal(all[q.id].status,'completed',q.title);});
test('IDs and references form a consistent catalog',()=>{for(const list of [LOCATIONS,DISTRICTS,ALL_QUESTS,BADGES])assert.equal(new Set(list.map(x=>x.id)).size,list.length);for(const l of LOCATIONS)assert.ok(DISTRICTS.some(d=>d.id===l.districtId));for(const d of CITY_DESTINATIONS)assert.ok(LOCATIONS.some(l=>l.id===d.id));for(const b of BADGES){const q=ALL_QUESTS.find(q=>q.id===b.id);assert.equal(b.description,q.description);}});
test('one-time coins can fund every showcase home upgrade',()=>{const income=100+LOCATIONS.reduce((a,l)=>a+l.reward.coins,0)+ALL_QUESTS.reduce((a,q)=>a+q.reward.coins,0);const cost=HOME_LEVELS.reduce((a,h)=>a+h.upgradeCost,0);assert.ok(income>=cost,`${income} < ${cost}`);assert.equal(income,697);assert.equal(cost,600);});
test('reconciliation fixes old targets without revoking claimed rewards',()=>{const ids=LOCATIONS.filter(l=>l.category==='coffee').map(l=>l.id);const saved={'badge-food-5':{questId:'badge-food-5',status:'claimed',progress:5}};const next=reconcileQuests(ALL_QUESTS,LOCATIONS,[...ids,...ids,'unknown'],saved);assert.equal(next['badge-coffee-3'].status,'completed');assert.equal(next['badge-coffee-3'].progress,2);assert.equal(next['badge-food-5'].status,'claimed');assert.equal(next['daily-explore-3'].progress,2);});
test('level boundaries and maximum level never produce invalid progress',()=>{assert.equal(getLevelFromExp(99).level,1);assert.equal(getLevelFromExp(100).level,2);assert.equal(getLevelFromExp(100).levelExp,0);assert.equal(getLevelFromExp(300).level,3);const top=getLevelFromExp(5000);assert.equal(top.level,5);assert.equal(top.nextLevelExp,0);assert.equal(top.progress,100);assert.equal(getLevelFromExp(NaN).level,1);});

test('following suggestions advances every quest to completion without revisits',()=>{
 for(const quest of ALL_QUESTS){
  const ids=[];
  while(reconcileQuests([quest],LOCATIONS,ids,{})[quest.id].status!=='completed'){
   const next=suggestQuestLocation(quest,LOCATIONS,ids);
   assert.ok(next,quest.id);assert.ok(!ids.includes(next.id));
   const before=reconcileQuests([quest],LOCATIONS,ids,{})[quest.id].progress;
   ids.push(next.id);
   assert.equal(reconcileQuests([quest],LOCATIONS,ids,{})[quest.id].progress,before+1);
  }
 }
 assert.equal(suggestQuestLocation(ALL_QUESTS[0],LOCATIONS,LOCATIONS.map(l=>l.id)),undefined);
});
