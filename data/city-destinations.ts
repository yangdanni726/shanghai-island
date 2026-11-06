// Stylized scene anchors; these are not geographical coordinates.
export const CITY_DESTINATIONS = [
  {id:'wukang-coffee',name:'武康路咖啡街',emoji:'☕',label:'梧桐咖啡街角',x:-21,z:4.6,minutes:[18,7,12]},
  {id:'wukang-mansion',name:'武康大楼',emoji:'🏛️',label:'历史建筑街区',x:-17.9,z:-9.2,minutes:[28,11,16]},
  {id:'west-bund',name:'西岸美术馆',emoji:'🎨',label:'社区展馆',x:0,z:-9,minutes:[42,16,23]},
  {id:'lujiazui',name:'陆家嘴',emoji:'🌆',label:'东方明珠地标区',x:14,z:-8.4,minutes:[55,21,28]},
] as const;
export type CityDestination = typeof CITY_DESTINATIONS[number];
export const getCityDestination = (id:string)=>CITY_DESTINATIONS.find(d=>d.id===id);
