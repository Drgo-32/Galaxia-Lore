let ac,master,muted=false,step=0;
const BPM=88,SP=60/BPM/4;
const kick=[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],snare=[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0];
const bass=[110,0,0,0,0,0,130.8,0,0,0,98,0,0,0,123.5,0];
let noiseBuf;
function noise(t,dur,f,vol){
  const s=ac.createBufferSource();s.buffer=noiseBuf;
  const fl=ac.createBiquadFilter();fl.type='highpass';fl.frequency.value=f;
  const g=ac.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  s.connect(fl).connect(g).connect(master);s.start(t);s.stop(t+dur);
}
function tone(t,f0,f1,dur,vol,type){
  const o=ac.createOscillator(),g=ac.createGain();o.type=type;
  o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(g).connect(master);o.start(t);o.stop(t+dur);
}
function tick(){
  const t=ac.currentTime+.05,i=step%16;
  if(kick[i])tone(t,150,40,.35,.9,'sine');
  if(snare[i])noise(t,.18,1800,.5);
  if(i%2===0)noise(t,.04,7000,.18);
  if(bass[i])tone(t,bass[i],bass[i]*.98,SP*3,.45,'triangle');
  step++;
}
let yt,ytListo=false,ytFallo=false,usandoBeat=false,usandoLocal=false,usandoYT=false,started=false,idxVideo=0,beatTimer=null;
let aLocal=null,localListo=false;

function aviso(txt){
  if(!DEPURAR)return;
  const d=document.createElement('div');
  d.style.cssText='position:fixed;z-index:9;left:50%;transform:translateX(-50%);bottom:64px;background:#000c;color:#fff;padding:8px 14px;border-radius:10px;font:13px system-ui,sans-serif;max-width:90vw;text-align:center';
  d.textContent=txt;document.body.appendChild(d);setTimeout(()=>d.remove(),9000);
}
if(location.protocol==='file:')aviso('Estás abriendo la página como archivo: YouTube casi siempre bloquea el reproductor así. Usa GitHub Pages o un servidor local.');

if(AUDIO_LOCAL){
  aLocal=new Audio();aLocal.preload='auto';aLocal.loop=true;aLocal.volume=VOLUMEN/100;
  aLocal.addEventListener('canplay',()=>{localListo=true});
  aLocal.src=AUDIO_LOCAL;
}

const yf=document.getElementById('yt');
(function(){
  const q=new URLSearchParams({enablejsapi:1,playsinline:1,controls:0,disablekb:1,fs:0,rel:0,modestbranding:1,start:INICIO});
  if(location.protocol.indexOf('http')===0)q.set('origin',location.origin);
  yf.src='https://www.youtube.com/embed/'+VIDEO_IDS[0]+'?'+q.toString();
})();

window.onYouTubeIframeAPIReady=function(){
  yt=new YT.Player('yt',{events:{
    onReady:()=>{
      ytListo=true;
      if(started&&!usandoLocal&&!usandoYT&&!ytFallo){pararBeat();iniciarYT()}
    },
    onError:e=>siguienteVideo(e.data),
    onStateChange:e=>{
      if(e.data===0){yt.seekTo(INICIO,true);yt.playVideo()}
      if(e.data===1){const b=document.getElementById('musicbtn');if(b)b.remove()}
    }
  }});
};
const tagYT=document.createElement('script');tagYT.src='https://www.youtube.com/iframe_api';
tagYT.onerror=()=>{ytFallo=true;aviso('No se pudo cargar YouTube (¿sin internet?). Suena el beat de respaldo.');if(started)iniciarBeat()};
document.head.appendChild(tagYT);

function siguienteVideo(codigo){
  idxVideo++;
  if(idxVideo<VIDEO_IDS.length){
    aviso('El video '+idxVideo+' no se puede reproducir (código '+codigo+'). Probando el siguiente.');
    const datos={videoId:VIDEO_IDS[idxVideo],startSeconds:INICIO};
    if(started)yt.loadVideoById(datos);else yt.cueVideoById(datos);
    return;
  }
  ytFallo=true;
  aviso('YouTube no dejó reproducir el video (código '+codigo+'). Puede que no permita incrustarse. Suena el beat de respaldo.');
  if(started&&!usandoBeat&&!usandoLocal)iniciarBeat();
}

function iniciarBeat(){
  if(usandoBeat)return;usandoBeat=true;
  ac=new (window.AudioContext||window.webkitAudioContext)();
  noiseBuf=ac.createBuffer(1,ac.sampleRate*.25,ac.sampleRate);
  const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  master=ac.createGain();master.gain.value=muted?0:.5;master.connect(ac.destination);
  beatTimer=setInterval(tick,SP*1000);
}
function pararBeat(){
  if(!usandoBeat)return;
  clearInterval(beatTimer);usandoBeat=false;
  if(ac&&ac.close)ac.close();
}

function iniciarYT(){
  if(usandoYT)return;usandoYT=true;
  yt.unMute();yt.setVolume(0);yt.playVideo();
  const fin=DURACION>0?INICIO+DURACION:Infinity;
  setInterval(()=>{
    if(!yt.getCurrentTime)return;
    const t=yt.getCurrentTime();
    if(t>=fin||t<INICIO-1){yt.seekTo(INICIO,true);return}
    const f=Math.max(0,Math.min(1,(t-INICIO)/2,(fin-t)/2));
    yt.setVolume(Math.round(f*VOLUMEN));
  },250);
  setTimeout(revisarReproduccion,2500);
}
function revisarReproduccion(){
  const st=yt.getPlayerState?yt.getPlayerState():-1;
  if(st===1||st===3||ytFallo||usandoBeat||usandoLocal)return;
  mostrarBotonMusica();
}
function mostrarBotonMusica(){
  if(document.getElementById('musicbtn'))return;
  const b=document.createElement('button');b.id='musicbtn';b.textContent='🎵 Toca para activar la música';
  b.style.cssText='position:fixed;z-index:9;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 64px);padding:10px 18px;border-radius:999px;border:1px solid #ffffff55;background:#2a0a4dcc;color:#fff;font:16px system-ui,sans-serif';
  b.onclick=()=>{yt.playVideo();b.remove()};
  document.body.appendChild(b);
}

function usarYT(){
  if(ytFallo)return iniciarBeat();
  if(ytListo)return iniciarYT();
  setTimeout(()=>{
    if(!ytListo&&!usandoYT&&!usandoLocal&&!usandoBeat){
      aviso('YouTube tarda en cargar. Suena el beat y la canción entrará en cuanto esté lista.');
      iniciarBeat();
    }
  },4000);
}
function arrancar(){
  if(localListo)return aLocal.play().then(()=>{usandoLocal=true;aviso('Sonando '+AUDIO_LOCAL)}).catch(usarYT);
  usarYT();
}
document.getElementById('start').addEventListener('click',function(){
  started=true;
  this.style.opacity=0;setTimeout(()=>this.remove(),1000);
  arrancar();
  const m=document.getElementById('mute');m.style.display='block';
  m.onclick=()=>{
    muted=!muted;
    if(usandoBeat)master.gain.value=muted?0:.5;
    if(usandoLocal)aLocal.muted=muted;
    if(usandoYT&&yt&&yt.mute)muted?yt.mute():yt.unMute();
    m.textContent=muted?'🔇':'🔊';
  };
});
