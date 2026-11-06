export const SCHOOLS=['复旦大学','同济大学','上海交通大学','华东师范大学','上海大学'] as const;
export const SOCIAL_PLACES=['wukang-coffee','wukang-mansion','west-bund','lujiazui'];
export interface CityNote {id:string;authorId:string;author:string;school:string;placeId:string;text:string;createdAt:number}
export interface SocialState {schools:Record<string,string>;notes:CityNote[]}
export const INITIAL_SOCIAL:SocialState={schools:{},notes:[]};
export function validSchool(value:unknown):value is string{return typeof value==='string'&&(value===''||SCHOOLS.some(s=>s===value));}
export function normalizeSocial(value:unknown):SocialState {
 if(!value||typeof value!=='object')return INITIAL_SOCIAL;
 const raw=value as Partial<SocialState>;const schools:Record<string,string>={};
 if(raw.schools&&typeof raw.schools==='object')for(const [id,school] of Object.entries(raw.schools)){if(validSchool(school)&&id!=='__proto__'&&id!=='constructor'&&id!=='prototype')schools[id]=school;}
 const seen=new Set<string>();const notes:CityNote[]=[];
 if(Array.isArray(raw.notes))for(const n of raw.notes){
  if(!n||typeof n!=='object'||typeof n.id!=='string'||seen.has(n.id)||typeof n.authorId!=='string'||typeof n.author!=='string'||!validSchool(n.school)||!SOCIAL_PLACES.includes(n.placeId)||typeof n.text!=='string'||!n.text.trim()||typeof n.createdAt!=='number'||!Number.isFinite(n.createdAt))continue;
  seen.add(n.id);notes.push({...n,author:n.author.slice(0,24),text:n.text.trim().slice(0,200)});
 }
 return {schools,notes:notes.slice(0,200)};
}
export function selectNotes(notes:CityNote[],placeId:string|null,school:string|null) {return notes.filter(n=>(!placeId||n.placeId===placeId)&&(school===null||school!==''&&n.school===school));}
export const SAMPLE_NOTES:CityNote[]=[
 {id:'demo-1',authorId:'demo',author:'小满',school:'复旦大学',placeId:'wukang-coffee',text:'想找一个能慢慢坐下来的街角。下次试试带一本书出门。',createdAt:0},
 {id:'demo-2',authorId:'demo',author:'阿禾',school:'同济大学',placeId:'wukang-mansion',text:'建筑观察清单：先看转角，再找沿街立面的小细节。',createdAt:0},
 {id:'demo-3',authorId:'demo',author:'小岚',school:'上海交通大学',placeId:'west-bund',text:'把一次看展和一段滨江散步放在同一天，留一点发呆的时间。',createdAt:0},
 {id:'demo-4',authorId:'demo',author:'木木',school:'华东师范大学',placeId:'lujiazui',text:'今天的探索主题是天际线：找三个不同角度记录城市。',createdAt:0},
 {id:'demo-5',authorId:'demo',author:'团子',school:'上海大学',placeId:'west-bund',text:'想做一本城市色彩笔记，从展馆和街道开始收集灵感。',createdAt:0},
];
