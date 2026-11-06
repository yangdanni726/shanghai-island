export const MIN_VIEW = 8;
export const MAX_VIEW = 40;
export function clampView(value: number) {return Math.max(MIN_VIEW,Math.min(MAX_VIEW,value));}
export function wheelView(current:number,deltaY:number,deltaMode=0,pinch=false) {
  const pixels=deltaY*(deltaMode===1?16:deltaMode===2?600:1);
  return clampView(current*Math.exp(Math.max(-150,Math.min(150,pixels))*(pinch?.008:.002)));
}
