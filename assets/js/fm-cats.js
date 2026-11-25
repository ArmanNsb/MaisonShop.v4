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
    card.querySelectorAll('.ocard__left').forEach(l=>l.textContent=left+' of '+total+' left');
    card.classList.toggle('is-sold',left<=0); };
  const cards=[...document.querySelectorAll('.ocard')]; cards.forEach(paint);
  if(window.MDLFBag){
    const cap=card=>{ const buy=card.querySelector('.buy'); if(!buy) return; const pick=card.querySelector('.pick');
      const key=pick?buy.dataset.key+' · '+pick.dataset.value:buy.dataset.key, left=+card.dataset.left;
      if(MDLFBag.get(key)>left) MDLFBag.set(key,left);
      card.classList.toggle('is-full',MDLFBag.get(key)>=left); };
    cards.forEach(cap); MDLFBag.on(()=>cards.forEach(cap));
  }

  /* members first: on 26 and 27 Nov the Fork Monday prices are for members only. A visitor who is not signed in sees
     the members' price on every card, locked, with the way to create a profile; the regular price is the one they can
     buy at now. From 28 Nov (Los Angeles time) the lock comes off for everyone.
     The store sets window.FM_MEMBER = true for a signed-in member (and may set window.FM_GUEST to force either way). */
  const OPEN_ALL=Date.UTC(2026,10,28,8);   // 28 Nov 2026, 00:00 in Los Angeles
  const LOCK='<svg class="fmmem__lock" viewBox="0 0 24 30" aria-hidden="true"><path class="sh" d="M6.5 13V8.6a5.5 5.5 0 0 1 11 0V13"/><rect x="2" y="13" width="20" height="15" rx="2.6"/><circle cx="12" cy="19.4" r="1.9"/><path d="M12 21.2v2.6"/></svg>';
  const money=n=>'$'+n.toLocaleString('en-US'), num=t=>+t.replace(/[^0-9.]/g,'');
  document.querySelectorAll('.fmcard').forEach(card=>{ const pr=card.querySelector('.fmprice b'), rg=card.querySelector('.fmprice s'), meta=card.querySelector('.card__meta'), info=card.querySelector('.card__info');
    if(!pr||!rg||!meta) return;
    const now=pr.textContent.trim(), reg=rg.textContent.trim(), save=money(num(reg)-num(now));
    // over the regular price: its label (with the piece count, if the product has one)
    const sz=card.querySelector('.card__spec > .card__m');
    const lab=document.createElement('span'); lab.className='fmreg'; lab.innerHTML='Regular price'+(sz?'<span class="fmreg__sz"> · '+sz.textContent+'</span>':'');
    meta.prepend(lab);
    if(sz){ const z=document.createElement('p'); z.className='fmsz'; z.textContent=sz.textContent; card.querySelector('.card__name').after(z); }
    // the members' panel: label, spots and saving, the locked price, the way in
    const m=document.createElement('a'); m.className='fmmem'; m.href='#create-profile';
    m.setAttribute('aria-label','Members price '+now+', locked. Save '+save+'. Sign in or create a profile');
    m.innerHTML='<span class="fmmem__lab">Members price</span>'
      +'<span class="fmmeta"><span class="ocard__left"></span><span class="fmdot" aria-hidden="true">·</span><span class="fmsv">Save '+save+'</span></span>'
      +'<span class="fmmem__row"><span class="fmmem__p">'+now+'</span>'+LOCK+'</span>'
      +'<span class="fmmem__sold">Sold out</span>'
      +'<span class="fmmem__go"><span class="fmgo">Sign in or create a profile</span></span>';
    meta.after(m);
    // pressing the regular + first shows what members pay; "Continue" adds it at the regular price
    const nd=document.createElement('div'); nd.className='fmnudge'; nd.hidden=true; nd.setAttribute('role','dialog'); nd.setAttribute('aria-label','Members price');
    nd.innerHTML='<p>Members pay '+now+'<small>Save '+save+' with a free profile.</small></p><a href="#create-profile">Sign in or create a profile</a>'
      +'<button type="button" class="fmnudge__go">Continue at '+reg+'</button><button type="button" class="fmnudge__x" aria-label="Close">&times;</button>';
    info.appendChild(nd);
    const add=meta.querySelector('.add--seal');
    if(add) add.addEventListener('click',e=>{ if(!document.documentElement.classList.contains('fm-guest')||card.dataset.nudged) return;
      e.preventDefault(); e.stopImmediatePropagation(); nd.hidden=false; nd.querySelector('a').focus({preventScroll:true}); },true);
    nd.querySelector('.fmnudge__go').addEventListener('click',()=>{ card.dataset.nudged='1'; nd.hidden=true; add&&add.click(); });
    nd.querySelector('.fmnudge__x').addEventListener('click',()=>{ nd.hidden=true; add&&add.focus({preventScroll:true}); });
    nd.addEventListener('keydown',e=>{ if(e.key==='Escape'){ nd.hidden=true; add&&add.focus({preventScroll:true}); } });
  });
  cards.forEach(paint);
  // phones have no pointer to rest on the panel: the padlock gives one small shake the first time a card comes into view
  if('IntersectionObserver' in window && matchMedia('(hover: none)').matches && !reduce.matches){
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting||!document.documentElement.classList.contains('fm-guest')) return;
      io.unobserve(e.target); const l=e.target.querySelector('.fmmem__lock'); if(l){ l.classList.add('is-shake'); l.addEventListener('animationend',()=>l.classList.remove('is-shake'),{once:true}); } }),{threshold:.7});
    document.querySelectorAll('.fmmem').forEach(m=>io.observe(m));
  }
  const guest=()=>window.FM_GUEST!=null?!!window.FM_GUEST:(!window.FM_MEMBER&&Date.now()<OPEN_ALL);
  const setGuest=g=>document.documentElement.classList.toggle('fm-guest',g);
  setGuest(guest());

  /* review switches. FM_STATES (design preview only): the stock bar, every card live, low or sold out.
     FM_REVIEW (set in the page's <head> while the client reviews): the "Not a member / Member" switch, so both views
     can be seen on the real page. Remove that line, or set it to false, before the campaign goes live. */
  if(window.FM_STATES){
    const orig=cards.map(c=>+c.dataset.total);
    const bar=document.createElement('div'); bar.className='fmstates';
    bar.innerHTML='<span>Cards</span><button aria-pressed="true" data-s="live">All spots</button><button aria-pressed="false" data-s="low">Few left</button><button aria-pressed="false" data-s="sold">Sold out</button>';
    bar.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return;
      cards.forEach((c,i)=>{ const t=orig[i]; c.dataset.left=b.dataset.s==='live'?t:b.dataset.s==='low'?Math.max(1,Math.floor(t/2)):0; paint(c); });
      bar.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); });
    document.body.appendChild(bar);
  }
  if(window.FM_STATES||window.FM_REVIEW){
    const vb=document.createElement('div'); vb.className='fmstates fmstates--who'+(window.FM_STATES?'':' fmstates--solo');
    vb.setAttribute('role','group'); vb.setAttribute('aria-label','Preview as');
    vb.innerHTML='<span>Visitor</span><button type="button" data-g="1">Not a member</button><button type="button" data-g="0">Member</button>';
    const mark=()=>vb.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(document.documentElement.classList.contains('fm-guest')===(x.dataset.g==='1'))));
    vb.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; setGuest(b.dataset.g==='1'); mark();
      try{ localStorage.setItem('fm-visitor',b.dataset.g==='1'?'guest':'member'); }catch(err){} });
    let g0=true; try{ g0=localStorage.getItem('fm-visitor')!=='member'; }catch(e){}   // the choice holds from page to page
    setGuest(g0); mark(); document.body.appendChild(vb);
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

/* Fork Monday: the members band. The button starts to catch the light once the band is well in view */
(function(){
  const band=document.querySelector('.fmhow__members'); if(!band) return;
  if(!('IntersectionObserver' in window)){ band.classList.add('is-lit'); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ band.classList.add('is-lit'); io.disconnect(); } }),{threshold:.55});
  io.observe(band);
})();
