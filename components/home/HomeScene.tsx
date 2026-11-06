"use client";

import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import JourneyLink from '@/components/JourneyLink';
import {BADGES} from '@/game/quests';
import './home.css';

type Action='in'|'out'|'left'|'right'|'reset';
export default function HomeScene({homeLevel,trophies}:{homeLevel:number;trophies:string[]}) {
 const [activity,setActivity]=useState('正在回家…');
 const [walking,setWalking]=useState(true);
 const travel=useRef<(place:'rest'|'view'|'entry')=>void>(()=>{});
 const host=useRef<HTMLDivElement>(null);
 const actions=useRef<(action:Action)=>void>(()=>{});
 const updateBadges=useRef<(ids:string[])=>void>(()=>{});
 const currentBadges=useRef(trophies);
 const [attempt,setAttempt]=useState(0);
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
 const [expanded,setExpanded]=useState(false);
 const [zoom,setZoom]=useState(100);
 useEffect(()=>{currentBadges.current=trophies;updateBadges.current(trophies);},[trophies]);
 useEffect(()=>{
  const element=host.current;if(!element)return;
  let disposed=false,renderer:THREE.WebGLRenderer|undefined,orbit:OrbitControls|undefined,resize:ResizeObserver|undefined,observer:IntersectionObserver|undefined;
  let model:THREE.Group|undefined,visible=true,ready=false,animation=0;
  const avatar=new THREE.Group();const legs:THREE.Mesh[]=[];
  const part=(geometry:THREE.BufferGeometry,color:string,x:number,y:number,z:number)=>{const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color}));mesh.position.set(x,y,z);mesh.castShadow=true;avatar.add(mesh);return mesh;};
  part(new THREE.CapsuleGeometry(.25,.5,4,8),'#f8be35',0,.85,0);
  part(new THREE.SphereGeometry(.28,12,8),'#f8c99c',0,1.52,0);
  part(new THREE.SphereGeometry(.3,12,6,0,Math.PI*2,0,Math.PI/2),'#275c73',0,1.57,0);
  for(const side of [-1,1])legs.push(part(new THREE.CapsuleGeometry(.105,.3,3,6),'#285474',side*.14,.3,0));
  part(new THREE.SphereGeometry(.055,8,6),'#333333',-.1,1.54,.25);part(new THREE.SphereGeometry(.055,8,6),'#333333',.1,1.54,.25);
  avatar.position.set(2.9,.065,3);
  const abort=new AbortController();
  const scene=new THREE.Scene();scene.add(avatar);scene.background=new THREE.Color('#dcebea');
  const camera=new THREE.OrthographicCamera(-8,8,5,-5,.1,100);
  const target=new THREE.Vector3(0,2,-.5);
  const initialOffset=new THREE.Vector3(11,8,15.5);
  camera.position.copy(target).add(initialOffset);camera.lookAt(target);
  const fail=()=>{if(!disposed){ready=false;element.dataset.ready='false';setStatus('error');setWalking(false);setActivity('小屋未能加载，可重试或返回城市。');}};
  const timeout=setTimeout(()=>{fail();abort.abort();},20000);
  const release=(root:THREE.Object3D)=>{
   const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
   root.traverse(o=>{if(o instanceof THREE.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{materials.add(m);Object.values(m).forEach(v=>{if(v instanceof THREE.Texture)textures.add(v);});});}if(o instanceof THREE.DirectionalLight)o.shadow.dispose();});
   geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>{t.dispose();if(typeof ImageBitmap!=='undefined'&&t.image instanceof ImageBitmap)t.image.close();});
  };
  const render=()=>{
   if(disposed||!renderer||!visible||document.hidden)return;
   renderer.render(scene,camera);
   element.dataset.zoom=camera.zoom.toFixed(3);element.dataset.cameraX=camera.position.x.toFixed(2);element.dataset.cameraZ=camera.position.z.toFixed(2);
   element.dataset.drawCalls=String(renderer.info.render.calls);element.dataset.triangles=String(renderer.info.render.triangles);
  };
  travel.current=place=>{
   if(!ready)return;cancelAnimationFrame(animation);setWalking(true);
   const destination=place==='view'?new THREE.Vector3(3.35,.065,-2.25):place==='rest'?new THREE.Vector3(1.7,.065,1.55):new THREE.Vector3(2.9,.065,.6);
   // Clear circulation lane on the right; furniture stays left of x=2.5.
   const route=[avatar.position.clone(),new THREE.Vector3(2.9,.065,avatar.position.z),new THREE.Vector3(2.9,.065,destination.z),destination];
   const lengths=route.slice(1).map((p,i)=>p.distanceTo(route[i]));const total=lengths.reduce((a,b)=>a+b,0);const started=performance.now();
   setActivity(place==='entry'?'收起行囊，欢迎回来…':place==='view'?'走到窗边，看看绿树…':'回到客厅，歇一歇…');
   const tick=(now:number)=>{
    if(disposed)return;let distance=window.matchMedia('(prefers-reduced-motion: reduce)').matches?total:Math.min(total,(now-started)/1000*2.2);const done=distance>=total;
    for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){avatar.position.lerpVectors(route[i],route[i+1],lengths[i]?distance/lengths[i]:1);const delta=route[i+1].clone().sub(route[i]);if(delta.lengthSq())avatar.rotation.y=Math.atan2(delta.x,delta.z);break;}distance-=lengths[i];}
    legs.forEach((leg,i)=>leg.rotation.x=done?0:Math.sin(now*.012+i*Math.PI)*.4);render();
    if(done){avatar.rotation.y=place==='view'?Math.PI:0;setWalking(false);setActivity(place==='view'?'蓝天和绿树，给自己留一点空白。':place==='rest'?'在家歇一歇，再出发。':'到家了！今天的发现已经记在足迹里。');render();}else animation=requestAnimationFrame(tick);
   };animation=requestAnimationFrame(tick);
  };
  let scale=1;
  const applyZoom=(factor:number)=>{camera.zoom=THREE.MathUtils.clamp(camera.zoom*factor,.65,1.8);camera.updateProjectionMatrix();setZoom(Math.round(camera.zoom*100));render();};
  const wheel=(e:WheelEvent)=>{
   e.preventDefault();e.stopImmediatePropagation();if(!orbit||!ready)return;
   const unit=e.deltaMode===1?16:e.deltaMode===2?element.clientHeight:1;
   if(e.ctrlKey||e.metaKey)applyZoom(Math.exp(-e.deltaY*unit*.007));
   else{
    const speed=10/(Math.max(1,element.clientHeight)*camera.zoom);
    const right=new THREE.Vector3().setFromMatrixColumn(camera.matrix,0),up=new THREE.Vector3().setFromMatrixColumn(camera.matrix,1);
    const next=orbit.target.clone().addScaledVector(right,e.deltaX*unit*speed).addScaledVector(up,-e.deltaY*unit*speed);
    next.x=THREE.MathUtils.clamp(next.x,-2,2);next.y=THREE.MathUtils.clamp(next.y,.6,3.2);next.z=THREE.MathUtils.clamp(next.z,-2,1);
    camera.position.add(next.clone().sub(orbit.target));orbit.target.copy(next);orbit.update();render();
   }
  };
  const gestureStart=(e:Event)=>{e.preventDefault();scale=1;};
  const gestureChange=(e:Event)=>{e.preventDefault();const next=(e as Event&{scale:number}).scale;if(Number.isFinite(next)&&next>0){applyZoom(next/scale);scale=next;}};
  const keydown=(e:KeyboardEvent)=>{const map:Record<string,Action>={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out',Home:'reset'};if(map[e.key]){e.preventDefault();actions.current(map[e.key]);}};
  const visibility=()=>render();
  element.addEventListener('wheel',wheel,{passive:false,capture:true});element.addEventListener('gesturestart',gestureStart,{passive:false});element.addEventListener('gesturechange',gestureChange,{passive:false});element.addEventListener('keydown',keydown);document.addEventListener('visibilitychange',visibility);
  try{
   renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
   renderer.domElement.setAttribute('aria-label','V5 小屋3D模型；拖动旋转，双指平移，捏合缩放');renderer.domElement.tabIndex=0;renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});element.appendChild(renderer.domElement);
   scene.add(new THREE.HemisphereLight(0xfff8eb,0x99a6af,2));
   const sun=new THREE.DirectionalLight(0xffecd9,3);sun.position.set(-3,9,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:.1,far:35});sun.shadow.bias=-.00025;sun.shadow.normalBias=.018;sun.target.position.set(0,1,0);scene.add(sun,sun.target);
   orbit=new OrbitControls(camera,renderer.domElement);orbit.target.copy(target);orbit.enableDamping=false;orbit.enableZoom=false;orbit.enablePan=false;orbit.minAzimuthAngle=.1;orbit.maxAzimuthAngle=1.12;orbit.minPolarAngle=.72;orbit.maxPolarAngle=1.24;orbit.rotateSpeed=.6;orbit.addEventListener('change',render);orbit.update();
   actions.current=action=>{
    if(!orbit)return;
    if(action==='in'||action==='out'){applyZoom(action==='in'?1.15:1/1.15);return;}
    if(action==='reset'){orbit.target.copy(target);camera.position.copy(target).add(initialOffset);camera.zoom=1;camera.updateProjectionMatrix();setZoom(100);}
    else{const offset=camera.position.clone().sub(orbit.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),action==='left'?-.12:.12);camera.position.copy(orbit.target).add(offset);}
    orbit.update();render();
   };
   const fit=()=>{if(!renderer)return;const w=Math.max(1,element.clientWidth),h=Math.max(1,element.clientHeight),aspect=w/h;let half=Math.max(5.3,7.6/aspect);
    if(model){camera.updateMatrixWorld();const bounds=new THREE.Box3().setFromObject(model);for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const point=new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);half=Math.max(half,Math.abs(point.y)+.35,(Math.abs(point.x)+.35)/aspect);}}
    camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(w,h);render();};
   resize=new ResizeObserver(fit);resize.observe(element);fit();observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)render();});observer.observe(element);
   updateBadges.current=ids=>{if(!model)return;BADGES.forEach((b,i)=>{const object=model?.getObjectByName(`badge_${i}`);if(object)object.visible=ids.includes(b.id);});render();};
   fetch('/shanghai-island/models/home-v5.glb',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('model');return r.arrayBuffer();}).then(async bytes=>{
    if(disposed)return;const gltf=await new GLTFLoader().parseAsync(bytes,'/shanghai-island/models/');if(disposed){release(gltf.scene);return;}
    clearTimeout(timeout);model=gltf.scene;model.traverse(o=>{if(o instanceof THREE.Mesh){const backdrop=o.name.includes('backdrop');o.castShadow=!backdrop;o.receiveShadow=!backdrop;}});scene.add(model);ready=true;updateBadges.current(currentBadges.current);element.dataset.ready='true';setStatus('ready');fit();travel.current('entry');
   }).catch(()=>{if(!disposed)fail();});
  }catch{fail();}
  return()=>{disposed=true;clearTimeout(timeout);cancelAnimationFrame(animation);travel.current=()=>{};abort.abort();actions.current=()=>{};updateBadges.current=()=>{};resize?.disconnect();observer?.disconnect();orbit?.dispose();element.removeEventListener('wheel',wheel,true);element.removeEventListener('gesturestart',gestureStart);element.removeEventListener('gesturechange',gestureChange);element.removeEventListener('keydown',keydown);document.removeEventListener('visibilitychange',visibility);release(scene);renderer?.dispose();renderer?.domElement.remove();};
 },[attempt]);
 return <><section className={`home-scene ${expanded?'home-scene-expanded':''}`} aria-label="我的3D小屋">
  <div className="home-viewer" ref={host}/>
  <div className="home-scene-label"><span>我的街角小屋</span><small>Lv.{homeLevel} · {trophies.length} 枚探索徽章</small></div>
  <div className="home-viewer-tools" aria-label="小屋视角工具">
   <button onClick={()=>actions.current('left')} disabled={status!=='ready'} aria-label="向左旋转小屋">↶</button><button onClick={()=>actions.current('right')} disabled={status!=='ready'} aria-label="向右旋转小屋">↷</button>
   <button onClick={()=>actions.current('out')} disabled={status!=='ready'} aria-label="缩小小屋">−</button><span aria-label="小屋缩放">{zoom}%</span><button onClick={()=>actions.current('in')} disabled={status!=='ready'} aria-label="放大小屋">＋</button>
   <button onClick={()=>actions.current('reset')} disabled={status!=='ready'}>重置视角</button><button aria-pressed={expanded} onClick={()=>setExpanded(v=>!v)}>{expanded?'收起画面':'展开画面'}</button>
  </div>
  <div className="home-viewer-help">拖动旋转 · 双指平移 · 捏合缩放<span>窗外为蓝天绿树背景</span></div>
  {status!=='ready'&&<div className="home-viewer-loading" role={status==='error'?'alert':'status'}>{status==='loading'?'正在布置你的3D小屋…':<><p>小屋加载失败或超时，请重试；也可先返回城市。</p><button onClick={()=>{setStatus('loading');setAttempt(v=>v+1);}}>重新加载小屋</button><JourneyLink href="/?from=home">← 返回城市</JourneyLink></>}</div>}
 </section>
 <div className="home-life" aria-label="回家后的生活">
  <p role="status">{activity}</p>
  <div><button disabled={walking||status!=='ready'} onClick={()=>travel.current('rest')}>☕ 客厅歇一歇</button><button disabled={walking||status!=='ready'} onClick={()=>travel.current('view')}>🌿 看看窗外</button><a href="#home-memories">📖 整理探索成果</a><JourneyLink href="/?from=home">返回城市 →</JourneyLink></div>
  <small>回家 → 客厅停留 → 整理足迹 → 再次出发</small>
 </div></>;
}
