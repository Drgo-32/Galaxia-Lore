const FONT="'Sue Ellen Francisco','Patrick Hand','Comic Sans MS',cursive";
const LOW=Math.min(innerWidth,innerHeight)<700||(navigator.hardwareConcurrency||4)<=4;
const cv=document.getElementById('c'),x=cv.getContext('2d',{alpha:true});
document.getElementById('title').textContent=TITULO;
let W,H,dpr;
function size(){dpr=Math.min(window.devicePixelRatio||1,LOW?1.5:2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
size();addEventListener('resize',size);
const rnd=(a,b)=>a+Math.random()*(b-a);

const R0=60,ARMS=LOW?1800:3000,STARS=LOW?260:520,RING=LOW?160:280;
const N=ARMS+STARS+RING*4;
const PX=new Float64Array(N),PY=new Float64Array(N),PZ=new Float64Array(N);
const CW=new Float64Array(N),SW=new Float64Array(N),PS=new Float32Array(N),PB=new Uint8Array(N);
const stops=[[255,211,110],[255,139,216],[180,108,255],[217,184,255]];
const COLS=[],ALPHA=[];
for(let b=0;b<10;b++){
  const t=b/9,k=t*3,i=Math.min(2,k|0),f=k-i,a=stops[i],c=stops[i+1];
  COLS.push(`rgb(${a[0]+(c[0]-a[0])*f|0},${a[1]+(c[1]-a[1])*f|0},${a[2]+(c[2]-a[2])*f|0})`);ALPHA.push(.85);
}
['#ffd36e','#ff8bd8','#b46cff','#8a5cff'].forEach(c=>{COLS.push(c);ALPHA.push(.95)});
COLS.push('#e9dcff');ALPHA.push(.8);
const NB=COLS.length;
function setOrbit(i,ang,r,y,speed,s,b){
  PX[i]=Math.cos(ang)*r;PZ[i]=Math.sin(ang)*r;PY[i]=y;
  const w=speed/Math.pow(r,1.5);CW[i]=Math.cos(w);SW[i]=Math.sin(w);PS[i]=s;PB[i]=b;
}
let n=0;
for(let i=0;i<ARMS;i++){
  const r=R0*1.7+Math.pow(Math.random(),1.5)*380,arm=(i%3)*2.094;
  const a=arm+r*0.012+rnd(-.5,.5)*(0.4+r/500);
  setOrbit(n++,a,r,rnd(-1,1)*(6+r*0.05),7*.9,rnd(.8,1.8),Math.min(9,((r-R0*1.6)/380*9)|0));
}
for(let j=0;j<4;j++)for(let i=0;i<RING;i++)
  setOrbit(n++,rnd(0,6.283),R0*(1.45+j*.2)+rnd(-4,4),rnd(-2,2),14*.9,rnd(1.1,2.3),10+j);
for(let i=0;i<STARS;i++){
  const u=rnd(0,6.283),w=Math.acos(rnd(-1,1)),d=rnd(1000,1600);
  PX[n]=d*Math.sin(w)*Math.cos(u);PY[n]=d*Math.cos(w);PZ[n]=d*Math.sin(w)*Math.sin(u);
  CW[n]=1;SW[n]=0;PS[n]=rnd(.7,1.5);PB[n]=14;n++;
}
const SX=new Float32Array(N),SY=new Float32Array(N),SS=new Float32Array(N);
const LIST=[0,1].map(()=>Array.from({length:NB},()=>new Int32Array(N)));
const CNT=[0,1].map(()=>new Int32Array(NB));
let yaw=0.4,pitch=0.38,vyaw=0.0006,vpitch=0,D=1000,F=800;
const HS=document.createElement('canvas');HS.width=HS.height=400;
(function(){
  const g=HS.getContext('2d'),r=g.createRadialGradient(200,200,0,200,200,200);
  r.addColorStop(0,'#000');r.addColorStop(.5,'#000');
  r.addColorStop(.506,'rgba(215,170,255,.8)');r.addColorStop(.54,'rgba(180,108,255,.35)');
  r.addColorStop(.75,'rgba(150,80,255,.10)');r.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=r;g.fillRect(0,0,400,400);
})();
let drag=false,lx=0,ly=0;
cv.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{
  if(!drag)return;
  const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;
  vyaw=dx*0.0045;vpitch=dy*0.0045;yaw+=vyaw;pitch=Math.max(-1.45,Math.min(1.45,pitch+vpitch));
  document.getElementById('hint').style.opacity=0;
});
cv.addEventListener('pointerup',()=>{drag=false});
cv.addEventListener('wheel',e=>{e.preventDefault();D=Math.max(600,Math.min(1700,D+e.deltaY*0.6))},{passive:false});
