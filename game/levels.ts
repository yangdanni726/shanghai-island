export const LEVEL_CONFIG = [
 {level:1,title:'城市新手',minExp:0,maxExp:100},
 {level:2,title:'城市探索家',minExp:100,maxExp:300},
 {level:3,title:'城市冒险家',minExp:300,maxExp:600},
 {level:4,title:'城市猎手',minExp:600,maxExp:1000},
 {level:5,title:'岛屿开拓者',minExp:1000,maxExp:1500},
];
export function getLevelFromExp(input:number) {
 const exp=Number.isFinite(input)?Math.max(0,input):0;
 let config=LEVEL_CONFIG[0];for(const c of LEVEL_CONFIG)if(exp>=c.minExp)config=c;
 const isMaxLevel=config.level===LEVEL_CONFIG.length;
 const levelSpan=config.maxExp-config.minExp;
 const levelExp=isMaxLevel?levelSpan:exp-config.minExp;
 return {level:config.level,title:config.title,maxExp:config.maxExp,minExp:config.minExp,isMaxLevel,levelSpan,levelExp,nextLevelExp:isMaxLevel?0:config.maxExp-exp,progress:Math.min(100,levelExp/levelSpan*100)};
}
