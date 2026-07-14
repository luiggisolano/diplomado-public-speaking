/* eslint-disable */
// @ts-nocheck
export function initTelon(){
  var __ac=new AbortController(),__sig=__ac.signal,__alive=true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
  function smooth(t){ t=clamp(t,0,1); return t*t*(3-2*t); }
  function seg(p,a,b){ return smooth((p-a)/((b-a)||1)); }
  function win(p,a,b,c,d){ return clamp(seg(p,a,b)-seg(p,c,d),0,1); }
  function kf(p,st){ for(var i=0;i<st.length-1;i++){ var A=st[i],B=st[i+1]; if(p<=B[0]||i===st.length-2){ return A[1]+(B[1]-A[1])*smooth((p-A[0])/((B[0]-A[0])||1)); } } return st[st.length-1][1]; }

  var rvs=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window && !reduce){ var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'}); rvs.forEach(function(el){io.observe(el);}); }
  else { rvs.forEach(function(el){el.classList.add('in'); }); }

  /* polvo dorado sobre el hero */
  (function(){ var c=document.getElementById('fx-hero'); if(!c)return; var x=c.getContext('2d'),w,h,dpr,ps=[],t=0;
    function rz(){ dpr=Math.min(2,devicePixelRatio||1); w=c.clientWidth; h=c.clientHeight; if(!w||!h)return; c.width=w*dpr; c.height=h*dpr; x.setTransform(dpr,0,0,dpr,0,0); if(!ps.length){for(var i=0;i<70;i++)ps.push({x:Math.random(),y:Math.random(),s:Math.random()*1.6+.4,vy:-(Math.random()*.0007+.0002),vx:(Math.random()-.5)*.0004,tw:Math.random()*6});} }
    function fr(){ if(!__alive)return; if(!w||!h){requestAnimationFrame(fr);return;} t+=.006; x.clearRect(0,0,w,h); x.globalCompositeOperation='lighter';
      for(var i=0;i<ps.length;i++){var p=ps[i]; if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.y<-.02){p.y=1.02;p.x=Math.random();}} var a=.5*(p.s/2)*(0.6+0.4*Math.sin(t+p.tw)); x.globalAlpha=a; x.fillStyle='#F2D08A'; x.beginPath(); x.arc(p.x*w,p.y*h,p.s,0,6.283); x.fill();}
      x.globalAlpha=1; x.globalCompositeOperation='source-over'; if(!reduce)requestAnimationFrame(fr); }
    new ResizeObserver(rz).observe(c); rz(); fr(); })();

  var curL=document.getElementById('cur-l'),curR=document.getElementById('cur-r'),valance=document.getElementById('valance'),curtain=document.getElementById('curtain'),curName=document.getElementById('cur-name'),hint=document.getElementById('cur-hint'),stageBg=document.getElementById('stage-bg'),actTitle=document.getElementById('act-title'),actMic=document.getElementById('act-mic'),corners=[document.getElementById('c-tl'),document.getElementById('c-tr'),document.getElementById('c-bl'),document.getElementById('c-br')],cornerT=[[-40,-30],[40,-30],[-40,30],[40,30]];

  function applyProgress(p){
    var op=smooth(clamp(p/0.16,0,1));
    curL.style.transform='translateX('+(-103*op)+'%)'; curR.style.transform='translateX('+(103*op)+'%)'; valance.style.transform='translateY('+(-104*op)+'%)';
    curtain.style.opacity = op>=0.999?'0':'1'; curName.style.opacity=String(clamp(1-p/0.09,0,1)); hint.style.opacity=String(clamp(1-p/0.05,0,1));
    /* zoom cinematográfico del micrófono real */
    var sc=kf(p,[[0,1.06],[0.16,1.12],[0.4,1.22],[0.62,1.4],[1,1.78]]);
    var py=kf(p,[[0,42],[0.5,46],[1,58]]);
    stageBg.style.transform='scale('+sc+')'; stageBg.style.backgroundPosition='center '+py+'%';
    var tv=win(p,0.12,0.22,0.34,0.44); actTitle.style.opacity=String(tv); actTitle.style.transform='translateY('+((1-seg(p,0.12,0.24))*24)+'px)'; actTitle.style.pointerEvents=tv>0.5?'auto':'none';
    for(var i=0;i<4;i++){ var st=0.40+i*0.03; var v=win(p,st,st+0.09,0.60,0.68); corners[i].style.opacity=String(v); corners[i].style.transform='translate('+(cornerT[i][0]*(1-seg(p,st,st+0.10)))+'px,'+(cornerT[i][1]*(1-seg(p,st,st+0.10)))+'px)'; }
    var mv=win(p,0.74,0.84,1.01,1.01); actMic.style.opacity=String(mv); actMic.style.transform='translateY('+((1-seg(p,0.74,0.86))*24)+'px)'; actMic.style.pointerEvents=mv>0.5?'auto':'none';
  }

  var forced=null; var hm=(location.hash||'').match(/p=([0-9.]+)/); if(hm) forced=parseFloat(hm[1]);
  var exp=document.querySelector('.experience'), scrollP=0;
  function onScroll(){ var r=exp.getBoundingClientRect(); var tot=exp.offsetHeight-window.innerHeight; scrollP=clamp(-r.top/(tot||1),0,1); }
  window.addEventListener('scroll',onScroll,{passive:true,signal:__sig}); window.addEventListener('resize',onScroll,{signal:__sig}); onScroll();
  function loop(){ if(!__alive)return; requestAnimationFrame(loop); applyProgress(forced!=null?forced:scrollP); }
  applyProgress(forced!=null?forced:0); loop();
  return function(){__alive=false;__ac.abort();};
}
