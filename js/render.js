const tF=[],tN=[];
let last=0;
function frame(now){
  requestAnimationFrame(frame);
  if(now-last<14)return;
  last=now;
  if(!drag){yaw+=vyaw;pitch=Math.max(-1.45,Math.min(1.45,pitch+vpitch));vyaw+=(0.0006-vyaw)*0.02;vpitch*=0.95}
  x.clearRect(0,0,W,H);
  const cx=W/2,cy=H/2,sc=Math.min(1,Math.min(W,H)/560);
  const cyw=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  CNT[0].fill(0);CNT[1].fill(0);

  for(let i=0;i<N;i++){
    let X=PX[i],Z=PZ[i];
    if(SW[i]!==0){const nx=X*CW[i]-Z*SW[i];Z=X*SW[i]+Z*CW[i];X=nx;PX[i]=X;PZ[i]=Z}
    const Y=PY[i],x1=X*cyw+Z*sy,z1=-X*sy+Z*cyw,z2=Y*sp+z1*cp,dd=D+z2;
    if(dd<150)continue;
    const k=F/dd,l=z2>0?0:1,b=PB[i],c=CNT[l][b]++;
    LIST[l][b][c]=i;
    SX[i]=cx+x1*k*sc;SY[i]=cy+(Y*cp-z1*sp)*k*sc;SS[i]=Math.max(1,PS[i]*k*sc*1.5);
  }

  tF.length=0;tN.length=0;
  for(const m of MSG){
    const x1=m.X*cyw+m.Z*sy,z1=-m.X*sy+m.Z*cyw,z2=m.Y*sp+z1*cp,dd=D+z2;
    if(dd<250)continue;
    const k=F/dd,a=Math.min(.95,.3+(1.25-k)*.9)*Math.min(1,(2.1-k)*2.2);
    if(a<=.02)continue;
    const s=19*k*sc/BASE*1.0;
    if(19*k*sc<5)continue;
    const w=m.spr.w*s,h=m.spr.h*s,px=cx+x1*k*sc,py=cy+(m.Y*cp-z1*sp)*k*sc;
    if(px+w/2<0||px-w/2>W||py+h/2<0||py-h/2>H)continue;
    (z2>0?tF:tN).push({m,px,py,w,h,a,z:z2});
  }

  function dots(l){
    for(let b=0;b<NB;b++){
      const cnt=CNT[l][b];if(!cnt)continue;
      const L=LIST[l][b];
      x.fillStyle=COLS[b];x.globalAlpha=ALPHA[b];x.beginPath();
      for(let j=0;j<cnt;j++){const i=L[j],s=SS[i];x.rect(SX[i]-s/2,SY[i]-s/2,s,s)}
      x.fill();
    }
    x.globalAlpha=1;
  }
  function txt(list){
    list.sort((p,q)=>q.z-p.z);
    for(const t of list){x.globalAlpha=t.a;x.drawImage(t.m.spr.c,t.px-t.w/2,t.py-t.h/2,t.w,t.h)}
    x.globalAlpha=1;
  }
  dots(0);txt(tF);
  const rk=R0*F/D*sc*4;
  x.drawImage(HS,cx-rk,cy-rk,rk*2,rk*2);
  dots(1);txt(tN);
}
requestAnimationFrame(frame);
