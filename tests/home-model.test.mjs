import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const binary=readFileSync(new URL('../public/models/home-v5.glb',import.meta.url));
const meta=JSON.parse(readFileSync(new URL('../public/models/home-v5.json',import.meta.url)));
const length=binary.readUInt32LE(12);
const gltf=JSON.parse(binary.subarray(20,20+length).toString());
test('home delivery is a self-contained GLB within desktop budget',()=>{
 assert.equal(binary.readUInt32LE(0),0x46546c67);assert.equal(binary.readUInt32LE(4),2);assert.equal(binary.readUInt32LE(8),binary.length);
 assert.ok(binary.length<6_000_000);assert.ok(meta.triangles<90000);assert.equal(createHash('sha256').update(binary).digest('hex'),meta.sha256);
 assert.ok(gltf.images.length>0);for(const image of gltf.images)assert.equal(typeof image.bufferView,'number');for(const buffer of gltf.buffers)assert.equal(buffer.uri,undefined);
});
test('all five achievement displays are independently addressable',()=>{
 for(let i=0;i<5;i++){const matches=gltf.nodes.filter(n=>n.name===`badge_${i}`);assert.equal(matches.length,1);assert.ok(matches[0].children.length>0);}
});
test('room position bounds are finite and window/door metadata stays explicit',()=>{
 for(const a of gltf.accessors){if(a.min)assert.ok(a.min.every(Number.isFinite));if(a.max)assert.ok(a.max.every(Number.isFinite));}
 assert.equal(meta.openings.length,2);assert.ok(meta.openings.every(o=>o.booleanApplied));assert.equal(meta.openings[1].destination,'balcony');
});
