function wrap(t,max){
  const w=t.split(' '),L=[];let cur='';
  for(const p of w){if((cur+' '+p).trim().length>max){L.push(cur);cur=p}else cur=(cur+' '+p).trim()}
  L.push(cur);return L;
}
const lista=[];
FRASES.forEach((t,i)=>{const c=(i===0||i>=FRASES.length-UNICAS)?1:REPETIR;for(let j=0;j<c;j++)lista.push(t)});
const MSG=[];
lista.forEach((t,idx)=>{
  let X,Y,Z,ok,tries=0;
  do{
    X=rnd(-680,680);Z=rnd(-680,680);Y=rnd(-380,380);
    ok=Math.hypot(X,Z)>170&&MSG.every(m=>Math.hypot(m.X-X,m.Y-Y,m.Z-Z)>150);
  }while(!ok&&++tries<400);
  MSG.push({lines:wrap(t,30),X,Y,Z,ic:ICONOS[idx%ICONOS.length],spr:null});
});
(function(){const c=Math.cos(yaw),s=Math.sin(yaw),z1=-420;MSG[0].X=-z1*s;MSG[0].Z=z1*c;MSG[0].Y=-60;MSG[0].ic="💜";})();

const BASE=34;
function buildSprites(){
  for(const m of MSG){
    const c=document.createElement('canvas'),g=c.getContext('2d');
    g.font=`400 ${BASE}px ${FONT}`;
    const ws=m.lines.map(l=>g.measureText(l).width),maxW=Math.max(...ws);
    const pad=BASE*.9,side=BASE*1.3,lh=BASE*1.1;
    const w=Math.ceil(maxW+2*(pad+side)),h=Math.ceil(m.lines.length*lh+2*pad);
    c.width=w;c.height=h;
    g.font=`400 ${BASE}px ${FONT}`;g.textBaseline='middle';g.textAlign='center';
    g.fillStyle='#f5ecff';g.shadowColor='#b46cff';g.shadowBlur=BASE*.5;
    const y0=h/2-(m.lines.length-1)*lh/2;
    m.lines.forEach((l,i)=>g.fillText(l,w/2,y0+i*lh));
    g.shadowBlur=0;g.textAlign='right';g.font=`${BASE*.85}px sans-serif`;
    g.fillText(m.ic,w/2-ws[0]/2-BASE*.3,y0);
    m.spr={c,w,h};
  }
}
buildSprites();
if(document.fonts){
  document.fonts.load(`24px 'Sue Ellen Francisco'`).then(buildSprites).catch(()=>{});
  document.fonts.ready.then(buildSprites);
}
