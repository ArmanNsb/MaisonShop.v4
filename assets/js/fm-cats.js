/* Fork Monday: the categories open and close; the cards show their spots and stop at what is left. */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.fmcat').forEach(sec=>{
    const body=sec.querySelector('.fmcat__body'), ctrls=sec.querySelectorAll('[aria-controls="'+body.id+'"]'), peek=sec.querySelector('.pol');
    let busy=false;
    const set=open=>{
      if(busy) return; busy=true;
      ctrls.forEach(c=>c.setAttribute('aria-expanded',String(open)));
      if(open){ body.hidden=false; sec.classList.add('is-open');
        if(reduce.matches){ busy=false; return; }
        const h=body.scrollHeight; body.style.height='0px'; body.style.opacity='0';
        requestAnimationFrame(()=>{ body.style.transition='height .65s cubic-bezier(.4,0,.2,1),opacity .5s ease .12s'; body.style.height=h+'px'; body.style.opacity='1'; });
        setTimeout(()=>{ body.style.cssText=''; busy=false; },700);
      } else {
        const done=()=>{ body.hidden=true; sec.classList.remove('is-open'); body.style.cssText=''; busy=false; };
        if(reduce.matches) return done();
        body.style.height=body.scrollHeight+'px'; body.style.opacity='1';
        requestAnimationFrame(()=>{ body.style.transition='height .5s cubic-bezier(.4,0,.2,1),opacity .3s ease'; body.style.height='0px'; body.style.opacity='0'; });
        setTimeout(done,520);
        // keep the row's title in view when a long category closes above the screen
        const top=sec.getBoundingClientRect().top; if(top<0) scrollBy({top:top-20,behavior:reduce.matches?'auto':'smooth'});
      } };
    const toggle=()=>set(body.hidden);
    ctrls.forEach(c=>c.addEventListener('click',toggle));
    peek.addEventListener('click',toggle);
  });

  // spots: pips, "x of y left", sold out at this price; the bag cannot take more than is left
  const paint=card=>{ const total=+card.dataset.total, left=+card.dataset.left;
    card.querySelectorAll('.ocard__pips i').forEach((p,i)=>p.classList.toggle('gone',i>=left));
    const l=card.querySelector('.ocard__left'); if(l) l.textContent=left+' of '+total+' left';
    card.classList.toggle('is-sold',left<=0); };
  const cards=[...document.querySelectorAll('.ocard')]; cards.forEach(paint);
  if(window.MDLFBag){
    const cap=card=>{ const buy=card.querySelector('.buy'); if(!buy) return; const pick=card.querySelector('.pick');
      const key=pick?buy.dataset.key+' · '+pick.dataset.value:buy.dataset.key, left=+card.dataset.left;
      if(MDLFBag.get(key)>left) MDLFBag.set(key,left);
      card.classList.toggle('is-full',MDLFBag.get(key)>=left); };
    cards.forEach(cap); MDLFBag.on(()=>cards.forEach(cap));
  }

  // review only (the preview turns this on): see every card live, low, or sold out
  if(window.FM_STATES){
    const orig=cards.map(c=>+c.dataset.total);
    const bar=document.createElement('div'); bar.className='fmstates';
    bar.innerHTML='<span>Cards</span><button aria-pressed="true" data-s="live">All spots</button><button aria-pressed="false" data-s="low">Few left</button><button aria-pressed="false" data-s="sold">Sold out</button>';
    bar.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return;
      cards.forEach((c,i)=>{ const t=orig[i]; c.dataset.left=b.dataset.s==='live'?t:b.dataset.s==='low'?Math.max(1,Math.floor(t/2)):0; paint(c); });
      bar.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); });
    document.body.appendChild(bar);
  }
})();

/* Fork Monday: the first time a polaroid comes into view the camera fires (a flash over the page), the print
   comes out of the camera from the top, and then it develops */
(function(){
  const pols=[...document.querySelectorAll('.fmcat .pol, .fmsec .pol')]; if(!pols.length||!('IntersectionObserver' in window)) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('fmdev');
  const fl=document.createElement('div'); fl.className='fmflash'; fl.setAttribute('aria-hidden','true'); document.body.appendChild(fl);
  let last=0;
  const flash=p=>{ const now=performance.now(); if(now-last<700) return; last=now;   // never more than one flash in quick succession
    const r=p.getBoundingClientRect(); fl.style.setProperty('--fx',(r.left+r.width/2)+'px'); fl.style.setProperty('--fy',Math.max(0,r.top+r.height*.5)+'px');
    fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go'); };
  // watch the row, not the print: the print is hidden (clipped) until it comes out, so it can't be seen to intersect
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting) return; const p=e.target.querySelector('.pol'); io.unobserve(e.target);
    flash(p); p.classList.add('is-dev');
    p.addEventListener('animationend',ev=>{ if(ev.animationName==='fmeject') p.classList.add('is-out'); }); }),{threshold:.6});
  pols.forEach(p=>io.observe(p.closest('.fmcat__head, .fmsec .shead')||p));
})();

/* Fork Monday: a hand-drawn gold fork lies across the line where each part of the shop begins
   (it takes the place of the holiday garland). It is drawn in from the handle to the tines when it comes into view. */
(function(){
  const at=['#fm-weddings','#fm-tables','#fm-cakes','#fm-nursery','#fm-towers','#sweets','#gifts'];   // between every part of the shop
  const els=at.map(s=>document.querySelector(s)).filter(Boolean).map(sec=>{
    const d=document.createElement('div'); d.className='fmfork'; d.setAttribute('aria-hidden','true');
    d.innerHTML='<img src="assets/img/fm-fork-divider.png" alt="" width="900" height="139" decoding="async">';
    sec.classList.add('has-fmfork'); sec.prepend(d); return d; });
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){ els.forEach(d=>d.classList.add('is-in')); return; }
  document.documentElement.classList.add('fmforks');
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } }),{threshold:1,rootMargin:'0px 0px -12% 0px'});
  els.forEach(d=>io.observe(d));
})();

/* Fork Monday: a date stamp in gold ink on each polaroid, part of the print from the start. Like a real rubber stamp
   it inks unevenly: a fine grain everywhere, and broader patches where the ink came out pale. */
(function(){
  const svg=i=>`<svg viewBox="0 0 168 92"><defs>
    <filter id="fmdf${i}" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${i*11+4}" result="patch"/>
      <feColorMatrix in="patch" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.72" result="patchA"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="${i*5+2}" result="grain"/>
      <feColorMatrix in="grain" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.9 1.4" result="grainA"/>
      <feComposite in="patchA" in2="grainA" operator="in" result="wear"/>
      <feComposite in="SourceGraphic" in2="wear" operator="in"/></filter></defs>
    <g filter="url(#fmdf${i})" fill="currentColor">
      <rect x="2" y="2" width="164" height="88" rx="5" fill="none" stroke="currentColor" stroke-width="2.8"/>
      <rect x="8" y="8" width="152" height="76" rx="2" fill="none" stroke="currentColor" stroke-width="1.1"/>
      <text x="84" y="52" text-anchor="middle" font-family="Dahlia,serif" font-size="27.5">Fork Monday</text>
      <text x="84" y="70" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="8.4" letter-spacing="3.6">30 NOV</text></g></svg>`;
  document.querySelectorAll('.fmcat .pol, .fmsec .pol').forEach((p,i)=>{ const s=document.createElement('span'); s.className='pol__stamp'; s.setAttribute('aria-hidden','true'); s.innerHTML=svg(i); p.appendChild(s); });
})();

/* Fork Monday: the members band. The 30 gets a hand-drawn gold ring (as in the hero) and the button starts to
   catch the light, once the band is well in view */
(function(){
  const band=document.querySelector('.fmhow__members'); if(!band) return;
  const g=band.querySelector('.fmhow__days .g');
  if(g){ g.insertAdjacentHTML('beforeend','<svg class="fmring30" viewBox="0 0 100 70" aria-hidden="true"><path pathLength="1" d="M78 9 C56 1 14 4 6 32 C0 58 34 70 62 66 C90 62 102 44 95 25 C90 11 74 4 54 5"/></svg>'); }
  if(!('IntersectionObserver' in window)){ band.classList.add('is-lit'); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ band.classList.add('is-lit'); io.disconnect(); } }),{threshold:.55});
  io.observe(band);
})();
