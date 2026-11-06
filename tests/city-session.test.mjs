import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCitySession,readCitySession,writeCitySession} from '../lib/city-session.ts';
import {canStand} from '../lib/city-movement.ts';
import {readFileSync} from 'node:fs';
const valid={version:1,player:{x:1,z:2},center:{x:4,z:5},view:13,wide:false,rotation:1.2};
test('invalid navigation saves cannot inject nonfinite or off-world coordinates',()=>{
 for(const value of [null,{}, {...valid,version:2},{...valid,view:0},{...valid,player:{x:Infinity,z:0}},{...valid,center:{x:999,z:0}}])assert.equal(normalizeCitySession(value),null);
 assert.deepEqual(normalizeCitySession(valid),valid);
});
test('navigation save excludes rewards and has an in-memory fallback',()=>{
 globalThis.sessionStorage={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
 writeCitySession({...valid,coins:999,experience:999});assert.deepEqual(readCitySession(),valid);delete globalThis.sessionStorage;
});
test('real city spawn is safe and building positions are rejected before restoration',()=>{
 const data=JSON.parse(readFileSync(new URL('../public/models/city-v4.json',import.meta.url)));
 assert.ok(canStand(data.spawn,data.colliders,data.bounds,.35,data.shoreline));
 const b=data.colliders[0];assert.equal(canStand({x:(b.minX+b.maxX)/2,z:(b.minZ+b.maxZ)/2},data.colliders,data.bounds,.35,data.shoreline),false);
});
