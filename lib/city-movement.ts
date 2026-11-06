export interface Point { x: number; z: number }
export interface Rect { minX: number; maxX: number; minZ: number; maxZ: number }
export function canStand(p: Point, obstacles: Rect[], bounds: Rect, radius = .35, shoreline: Point[] = []) {
  if (p.x < bounds.minX + radius || p.x > bounds.maxX - radius || p.z < bounds.minZ + radius || p.z > bounds.maxZ - radius) return false;
  if (shoreline.length) {
    let inside=false;
    for(let i=0,j=shoreline.length-1;i<shoreline.length;j=i++) {
      const a=shoreline[i],b=shoreline[j];
      if((a.z>p.z)!==(b.z>p.z) && p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x) inside=!inside;
      const length=(b.x-a.x)**2+(b.z-a.z)**2;
      const t=Math.max(0,Math.min(1,((p.x-a.x)*(b.x-a.x)+(p.z-a.z)*(b.z-a.z))/length));
      if(Math.hypot(p.x-a.x-t*(b.x-a.x),p.z-a.z-t*(b.z-a.z))<radius) return false;
    }
    if(!inside)return false;
  }
  return !obstacles.some(r => {
    const x = Math.max(r.minX, Math.min(p.x, r.maxX));
    const z = Math.max(r.minZ, Math.min(p.z, r.maxZ));
    return (p.x-x)**2 + (p.z-z)**2 < radius**2;
  });
}
export function movePlayer(p: Point, delta: Point, obstacles: Rect[], bounds: Rect, shoreline: Point[] = []): Point {
  // Substeps prevent tunnelling through thin walls after a slow frame.
  const steps = Math.max(1, Math.ceil(Math.hypot(delta.x, delta.z)/.15));
  let next = {...p};
  for (let i=0;i<steps;i++) {
    const x = {...next, x: next.x + delta.x/steps};
    if (canStand(x,obstacles,bounds,.35,shoreline)) next=x;
    const z = {...next, z: next.z + delta.z/steps};
    if (canStand(z,obstacles,bounds,.35,shoreline)) next=z;
  }
  return next;
}
