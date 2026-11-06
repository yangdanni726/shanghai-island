import {test} from 'node:test';
import assert from 'node:assert/strict';
import {canStand,movePlayer} from '../lib/city-movement.ts';
const bounds={minX:-10,maxX:10,minZ:-10,maxZ:10};
const walls=[{minX:1,maxX:2,minZ:-3,maxZ:3}];
test('player cannot enter buildings or leave island bounds',()=>{assert.equal(canStand({x:1.5,z:0},walls,bounds),false);assert.equal(canStand({x:9.9,z:0},[],bounds),false);});
test('large movement cannot tunnel through thin buildings',()=>{const p=movePlayer({x:0,z:0},{x:8,z:0},walls,bounds);assert.ok(p.x<.66);});
test('blocked movement slides along wall',()=>{const p=movePlayer({x:0,z:0},{x:2,z:2},walls,bounds);assert.ok(p.x<.66);assert.ok(p.z>1.9);});
test('free movement keeps requested displacement',()=>{const p=movePlayer({x:-5,z:-5},{x:1,z:2},walls,bounds);assert.ok(Math.abs(p.x+4)<1e-8);assert.ok(Math.abs(p.z+3)<1e-8);});
test('shoreline rejects points in the bounding box but outside the island',()=>{
 const shore=[{x:0,z:-8},{x:8,z:0},{x:0,z:8},{x:-8,z:0}];
 assert.equal(canStand({x:7,z:7},[],bounds,.35,shore),false);
 assert.equal(canStand({x:0,z:0},[],bounds,.35,shore),true);
 assert.equal(canStand({x:0,z:7.8},[],bounds,.35,shore),false);
});
