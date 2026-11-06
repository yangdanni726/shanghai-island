/** Session-only presentation state; never writes rewards or the player save. */
export interface CitySession { version:1; player:{x:number;z:number}; center:{x:number;z:number}; view:number; wide:boolean; rotation:number }
const KEY='shanghai-island:city-session-v1';
let memory:CitySession|null=null;
export function normalizeCitySession(value:unknown):CitySession|null {
 if(!value||typeof value!=='object')return null;
 const s=value as CitySession;
 const point=(p:CitySession['player'])=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.abs(p.x)<=100&&Math.abs(p.z)<=100;
 if(s.version!==1||!point(s.player)||!point(s.center)||!Number.isFinite(s.view)||s.view<8||s.view>40||typeof s.wide!=='boolean'||!Number.isFinite(s.rotation))return null;
 return {version:1,player:{...s.player},center:{...s.center},view:s.view,wide:s.wide,rotation:s.rotation};
}
export function readCitySession(){try{return normalizeCitySession(JSON.parse(sessionStorage.getItem(KEY)||'null'))??memory;}catch{return memory;}}
export function writeCitySession(value:CitySession){memory=normalizeCitySession(value);try{sessionStorage.setItem(KEY,JSON.stringify(memory));}catch{/* This tab still works without storage. */}}
