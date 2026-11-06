#!/usr/bin/env python3
"""Serve the exported build on loopback, without depending on a dev terminal."""
from pathlib import Path
import argparse, http.server, socket, subprocess, sys, time, urllib.request, urllib.parse
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=4180);parser.add_argument('--serve',action='store_true');args=parser.parse_args()
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT/'out'),**kw)
 def do_GET(self):
  if self.path=='/':self.send_response(302);self.send_header('Location','/shanghai-island/');self.end_headers();return
  if not self.path.startswith('/shanghai-island/') and self.path!='/shanghai-island':self.send_error(404);return
  url=urllib.parse.urlsplit(self.path)
  local=url.path.removeprefix('/shanghai-island')
  target=(ROOT/'out'/local.lstrip('/')).resolve()
  if target.is_relative_to((ROOT/'out').resolve()) and target.is_dir() and not url.path.endswith('/'):
   self.send_response(301);self.send_header('Location',url.path+'/'+('?' + url.query if url.query else ''));self.end_headers();return
  self.path=self.path.removeprefix('/shanghai-island') or '/';super().do_GET()
 def end_headers(self):self.send_header('Cache-Control','no-cache');super().end_headers()
if args.serve:
 http.server.ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
else:
 if not (ROOT/'out/index.html').exists():sys.exit('缺少构建文件，请先运行 npm run build。')
 base=f'http://127.0.0.1:{args.port}/shanghai-island/'
 def check():
  try:
   with urllib.request.urlopen(base,timeout=3) as r:html=r.read().decode()
   if '上海岛' not in html:return False
   for asset in ['models/home-v5.glb','models/city-v4.glb']:
    with urllib.request.urlopen(base+asset,timeout=3) as r:
     if r.read(4)!=b'glTF':return False
   return True
  except Exception:return False
 if check():print('网站已经运行，页面与模型资源正常：'+base);sys.exit(0)
 with socket.socket() as probe:
  if probe.connect_ex(('127.0.0.1',args.port))==0:sys.exit(f'端口 {args.port} 被其他或异常服务占用；未停止该服务。请检查后重试，或通过 --port 指定端口。更换端口使用独立存档。')
 log=ROOT/'.preview.log'
 with log.open('a') as f:subprocess.Popen([sys.executable,__file__,'--serve','--port',str(args.port)],stdout=f,stderr=f,start_new_session=True)
 for _ in range(20):
  if check():print('网站已启动，页面与模型资源正常：'+base);break
  time.sleep(.25)
 else:sys.exit('启动失败，请检查 '+str(log))
