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
