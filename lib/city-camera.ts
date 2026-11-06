export interface CameraPoint {x:number;z:number}
// Convert screen scroll to ground movement for the fixed 31/40/45 camera.
export function panCamera(center:CameraPoint,dx:number,dy:number,view:number,height:number):CameraPoint {
 const angle=Math.atan2(31,45),pitch=40/Math.hypot(31,40,45);
 const scale=2*view/Math.max(1,height);
 const right=Math.max(-600,Math.min(600,dx))*scale;
 const down=Math.max(-600,Math.min(600,dy))*scale/pitch;
 return {x:Math.max(-27,Math.min(27,center.x+right*Math.cos(angle)+down*Math.sin(angle))),z:Math.max(-23,Math.min(23,center.z-right*Math.sin(angle)+down*Math.cos(angle)))};
}
