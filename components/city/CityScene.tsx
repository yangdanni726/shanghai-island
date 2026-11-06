"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { canStand, movePlayer, type Rect } from "@/lib/city-movement";

import { CITY_DESTINATIONS, getCityDestination } from "@/data/city-destinations";
import { wheelView, clampView } from "@/lib/city-zoom";
import { panCamera } from "@/lib/city-camera";
import {readCitySession,writeCitySession,type CitySession} from '@/lib/city-session';
export interface TravelRequest { id:string; nonce:number }
interface Props {resetKey:number;paused:boolean;wide:boolean;view:number;travel:TravelRequest|null;onReady:(saved:CitySession|null)=>void;onZoom:(update:(value:number)=>number)=>void;onSelect:(id:string)=>void;onArrive:(request:TravelRequest,success:boolean)=>void}
interface ModelData { colliders: Rect[]; spawn: {x:number;z:number}; bounds: Rect; shoreline: {x:number;z:number}[] }
export default function CityScene(props:Props) {
  const {resetKey,paused,wide,view,travel,onReady,onZoom,onSelect,onArrive}=props;
  const pins=useRef<(HTMLButtonElement|null)[]>([]);
  const host=useRef<HTMLDivElement>(null);
  const controls=useRef(props);
  useEffect(()=>{controls.current={resetKey,paused,wide,view,travel,onReady,onZoom,onSelect,onArrive};},[resetKey,paused,wide,view,travel,onReady,onZoom,onSelect,onArrive]);
  const [error,setError]=useState("");
  const [attempt,setAttempt]=useState(0);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    const container=host.current;if(!container)return;
    let snapshot:CitySession|null=null;
    const save=()=>{if(snapshot)writeCitySession(snapshot);};
    window.addEventListener('shanghai-island:save-city',save);window.addEventListener('pagehide',save);
    let stopped=false,raf=0,renderer:THREE.WebGLRenderer|undefined;
    const scene=new THREE.Scene();scene.background=new THREE.Color('#8cd5e3');
    const camera=new THREE.OrthographicCamera(-30,30,20,-20,.1,300);
    let gestureActive=false,lastScale=1;
    let panTarget:{x:number;z:number}|null=null,currentCenter={x:0,z:0};let lastReset=controls.current.resetKey,lastWide=controls.current.wide;
    let drag:{id:number;x:number;y:number}|null=null;
    const pan=(dx:number,dy:number)=>{panTarget=panCamera(panTarget??currentCenter,dx,dy,controls.current.view,container.clientHeight);};
    const pointerDown=(e:PointerEvent)=>{if(controls.current.paused||e.button!==0||!(e.target instanceof HTMLCanvasElement))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};container.setPointerCapture(e.pointerId);};
    const pointerMove=(e:PointerEvent)=>{if(!drag||drag.id!==e.pointerId||controls.current.paused)return;pan(drag.x-e.clientX,drag.y-e.clientY);drag.x=e.clientX;drag.y=e.clientY;};
    const pointerUp=(e:PointerEvent)=>{if(drag?.id===e.pointerId){drag=null;if(container.hasPointerCapture(e.pointerId))container.releasePointerCapture(e.pointerId);}};
    container.addEventListener('pointerdown',pointerDown);container.addEventListener('pointermove',pointerMove);container.addEventListener('pointerup',pointerUp);container.addEventListener('pointercancel',pointerUp);
    const wheel=(e:WheelEvent)=>{if(controls.current.paused)return;e.preventDefault();if(gestureActive)return;if(e.ctrlKey||e.metaKey){controls.current.onZoom(v=>wheelView(v,e.deltaY,e.deltaMode,true));}else{const unit=e.deltaMode===1?16:e.deltaMode===2?container.clientHeight:1;pan(e.deltaX*unit,e.deltaY*unit);}};
    const gestureStart=(e:Event)=>{if(controls.current.paused)return;e.preventDefault();gestureActive=true;lastScale=1;};
    const gestureChange=(e:Event)=>{if(!gestureActive)return;e.preventDefault();const scale=(e as Event & {scale:number}).scale;if(Number.isFinite(scale)&&scale>0){const ratio=lastScale/scale;controls.current.onZoom(v=>clampView(v*ratio));lastScale=scale;}};
    const gestureEnd=()=>{gestureActive=false;};
    container.addEventListener("wheel",wheel,{passive:false});container.addEventListener("gesturestart",gestureStart,{passive:false});container.addEventListener("gesturechange",gestureChange,{passive:false});container.addEventListener("gestureend",gestureEnd);
    const keys=new Set<string>();const taps=new Set<string>();const abort=new AbortController();
    const editable=()=>{const e=document.activeElement;return e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName));};
    const down=(e:KeyboardEvent)=>{if(!e.key.startsWith('Arrow')||editable()||controls.current.paused)return;e.preventDefault();keys.add(e.key);if(!e.repeat)taps.add(e.key);};
    const up=(e:KeyboardEvent)=>keys.delete(e.key);
    const clear=()=>{keys.clear();taps.clear();};
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
    const fail=()=>{if(!stopped)setError('3D 场景暂时无法加载。请重试，或返回五岛总览。浏览器需要支持 WebGL。');};
    const dispose=(root:THREE.Object3D)=>root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{Object.values(m).forEach(v=>{if(v instanceof THREE.Texture)v.dispose();});m.dispose();});}if(o instanceof THREE.Light && "shadow" in o){(o as THREE.DirectionalLight).shadow?.dispose();}});
    const timeout=setTimeout(()=>{fail();abort.abort();},20000);
    let resize:ResizeObserver|undefined;
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
      renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
      renderer.domElement.setAttribute('aria-label','上海样本街区 3D 场景，使用方向键移动');renderer.domElement.tabIndex=0;
      container.appendChild(renderer.domElement);
      renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});
      scene.add(new THREE.HemisphereLight(0xe9faff,0x667343,2.1));
      const sun=new THREE.DirectionalLight(0xffefcf,3.2);sun.position.set(-25,45,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:120});sun.shadow.bias=-.0005;scene.add(sun);
      const sea=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshStandardMaterial({color:'#3dbbd4',roughness:.65}));sea.rotation.x=-Math.PI/2;sea.position.y=-1.1;sea.receiveShadow=true;scene.add(sea);
      const avatar=new THREE.Group();
      const body=new THREE.Mesh(new THREE.CapsuleGeometry(.25,.5,4,8),new THREE.MeshStandardMaterial({color:'#f8be35'}));body.position.y=.85;body.castShadow=true;avatar.add(body);
      const head=new THREE.Mesh(new THREE.SphereGeometry(.28,12,8),new THREE.MeshStandardMaterial({color:'#f8c99c'}));head.position.y=1.52;head.castShadow=true;avatar.add(head);
      const hat=new THREE.Mesh(new THREE.SphereGeometry(.3,12,6,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#275c73'}));hat.position.y=1.57;avatar.add(hat);
      const legs=[-1,1].map(side=>{const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.3,3,6),new THREE.MeshStandardMaterial({color:'#285474'}));leg.position.set(side*.14,.3,0);avatar.add(leg);return leg;});
      const marker=new THREE.Mesh(new THREE.RingGeometry(.47,.55,32),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));marker.rotation.x=-Math.PI/2;marker.position.y=.03;avatar.add(marker);scene.add(avatar);
      const resizeCanvas=()=>{if(!renderer)return;const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight);renderer.setSize(w,h);};resize=new ResizeObserver(resizeCanvas);resize.observe(container);resizeCanvas();
      const loader=new GLTFLoader();
      Promise.all([fetch('/shanghai-island/models/city-v4.glb',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('model');return r.arrayBuffer();}),fetch('/shanghai-island/models/city-v4.json',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('metadata');return r.json() as Promise<ModelData>;})]).then(async ([buffer,data])=>{
        if(stopped)return;
        const gltf=await loader.parseAsync(buffer,'/shanghai-island/models/');
        if(stopped){dispose(gltf.scene);return;}
        gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});scene.add(gltf.scene);
        const saved=readCitySession();const valid=saved&&canStand(saved.player,data.colliders,data.bounds,.35,data.shoreline);
        const restored=valid?saved:null;const start=restored?.player??data.spawn;avatar.position.set(start.x,.83,start.z);avatar.rotation.y=restored?.rotation??0;
        const target=new THREE.Vector3(0,0,0),cameraOffset=new THREE.Vector3(31,40,45);let last=performance.now(),t=0;let halfHeight=32;let lastTravel=0;
        clearTimeout(timeout);if(restored){target.set(restored.center.x,2,restored.center.z);panTarget={...restored.center};halfHeight=restored.view;lastWide=restored.wide;controls.current={...controls.current,wide:restored.wide,view:restored.view};snapshot=restored;}
        controls.current.onReady(restored);setLoaded(true);
        const animate=(now:number)=>{
          if(stopped||!renderer)return;if(document.hidden){last=now;raf=requestAnimationFrame(animate);return;}const dt=Math.min((now-last)/1000,.05);last=now;
          const request=controls.current.travel;
          if(request&&request.nonce!==lastTravel){lastTravel=request.nonce;const destination=getCityDestination(request.id);const valid=!!destination&&canStand(destination,data.colliders,data.bounds,.35,data.shoreline);if(valid){panTarget=null;avatar.position.set(destination.x,.83,destination.z);snapshot={version:1,player:{x:destination.x,z:destination.z},center:{x:destination.x,z:destination.z},view:controls.current.view,wide:false,rotation:avatar.rotation.y};clear();}controls.current.onArrive(request,valid);}
          if(controls.current.paused||editable())clear();
          const pressed=(k:string)=>keys.has(k)||taps.has(k);
          let dx=Number(pressed('ArrowRight'))-Number(pressed('ArrowLeft')), dz=Number(pressed('ArrowDown'))-Number(pressed('ArrowUp'));
          if(lastReset!==controls.current.resetKey||lastWide!==controls.current.wide){panTarget=null;lastReset=controls.current.resetKey;lastWide=controls.current.wide;}
          taps.clear();const len=Math.hypot(dx,dz);if(len){panTarget=null;dx/=len;dz/=len;const angle=Math.atan2(cameraOffset.x,cameraOffset.z);const vx=(dx*Math.cos(angle)+dz*Math.sin(angle))*5*dt,vz=(-dx*Math.sin(angle)+dz*Math.cos(angle))*5*dt;const p=movePlayer(avatar.position,{x:vx,z:vz},data.colliders,data.bounds,data.shoreline);avatar.position.x=p.x;avatar.position.z=p.z;avatar.rotation.y=Math.atan2(vx,vz);t+=dt*11;legs[0].rotation.x=Math.sin(t)*.45;legs[1].rotation.x=-Math.sin(t)*.45;}else legs.forEach(l=>l.rotation.x=0);
          const overview=controls.current.wide;target.lerp(panTarget?new THREE.Vector3(panTarget.x,2,panTarget.z):overview?new THREE.Vector3(0,2,0):avatar.position.clone().add(new THREE.Vector3(0,2,0)),1-Math.exp(-dt*4));halfHeight+=( controls.current.view-halfHeight)*(1-Math.exp(-dt*3));
          const aspect=container.clientWidth/Math.max(1,container.clientHeight);camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();camera.position.copy(target).add(cameraOffset);camera.lookAt(target);
          currentCenter={x:target.x,z:target.z};if(!controls.current.paused)snapshot={version:1,player:{x:avatar.position.x,z:avatar.position.z},center:{...currentCenter},view:controls.current.view,wide:controls.current.wide,rotation:avatar.rotation.y};else if(snapshot)snapshot={...snapshot,player:{x:avatar.position.x,z:avatar.position.z}};container.dataset.cameraX=target.x.toFixed(2);container.dataset.cameraZ=target.z.toFixed(2);camera.updateMatrixWorld();
          CITY_DESTINATIONS.forEach((d,i)=>{const pin=pins.current[i];if(!pin)return;const point=new THREE.Vector3(d.x,2.6,d.z).project(camera);pin.style.left=`${(point.x*.5+.5)*container.clientWidth}px`;pin.style.top=`${(-point.y*.5+.5)*container.clientHeight}px`;pin.style.visibility=!controls.current.paused&&Math.abs(point.x)<.93&&Math.abs(point.y)<.82?'visible':'hidden';});
          renderer.render(scene,camera);container.dataset.view=halfHeight.toFixed(2);container.dataset.ready='true';container.dataset.drawCalls=String(renderer.info.render.calls);container.dataset.triangles=String(renderer.info.render.triangles);container.dataset.playerX=avatar.position.x.toFixed(2);container.dataset.playerZ=avatar.position.z.toFixed(2);raf=requestAnimationFrame(animate);
        };raf=requestAnimationFrame(animate);
      }).catch(fail);
    }catch{fail();}
    return ()=>{save();window.removeEventListener('shanghai-island:save-city',save);window.removeEventListener('pagehide',save);clearTimeout(timeout);stopped=true;abort.abort();cancelAnimationFrame(raf);resize?.disconnect();container.removeEventListener('pointerdown',pointerDown);container.removeEventListener('pointermove',pointerMove);container.removeEventListener('pointerup',pointerUp);container.removeEventListener('pointercancel',pointerUp);container.removeEventListener("wheel",wheel);container.removeEventListener("gesturestart",gestureStart);container.removeEventListener("gesturechange",gestureChange);container.removeEventListener("gestureend",gestureEnd);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);dispose(scene);renderer?.dispose();renderer?.domElement.remove();};
  },[attempt]);
  return <><div ref={host} className="city-canvas">{CITY_DESTINATIONS.map((d,i)=><button key={d.id} ref={el=>{pins.current[i]=el;}} className="city-pin" style={{visibility:'hidden'}} onDoubleClick={()=>onSelect(d.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(d.id);}}} aria-label={`查看${d.name}交通方案`} title={`双击查看${d.name}交通方案`}><span>{d.emoji}</span>{d.name}</button>)}</div>{!loaded&&!error&&<div className="city-loading" role="status">正在把城市装进口袋…</div>}{error&&<div className="city-loading" role="alert"><p>{error}</p><button onClick={()=>{setError('');setLoaded(false);setAttempt(v=>v+1);}}>重新加载</button></div>}</>;
}
