/* Maison De La Fork, the compact header (every page; styles in assets/css/header.css)
   Scrolling down, the page's header goes with the page as before. Scrolling back up a little, a compact copy of it
   slides down from the top (logo, menu, search, account, bag with its count), and slides away again on the way down.
   On the shop page it only starts once the Holiday intro is behind; on product pages, once the header is out of view.
   The copy is built here from the page's own header, so the two never drift apart. Load before bag.js. */
(function(){
  const head=document.querySelector('.header'); if(!head) return;
  const de=document.documentElement, intro=document.querySelector('.intro');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');

  const bar=head.cloneNode(true);
  bar.classList.add('header--float'); bar.removeAttribute('id');
  bar.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  bar.setAttribute('aria-label','Site header'); bar.setAttribute('inert',''); bar.setAttribute('aria-hidden','true');
  document.body.appendChild(bar);

  // the bag's count follows the page's own bag
  const realBag=head.querySelector('.bag'), barBag=bar.querySelector('.bag');
  const sync=()=>{ if(!realBag||!barBag) return; const bump=realBag.classList.contains('bump');
    barBag.className=realBag.className.replace(/\bbump\b/,'').trim(); barBag.setAttribute('aria-label',realBag.getAttribute('aria-label')||'Bag');
    const a=realBag.querySelector('.bag__n'), b=barBag.querySelector('.bag__n'); if(a&&b) b.textContent=a.textContent;
    if(bump){ void barBag.offsetWidth; barBag.classList.add('bump'); } };
  sync(); if(window.MDLFBag) MDLFBag.on(()=>requestAnimationFrame(sync));

  // where the compact header may appear
  const start=()=> intro ? intro.offsetTop+intro.offsetHeight-innerHeight+40 : head.offsetTop+head.offsetHeight;
  let shown=false, lastY=scrollY, travel=0, from=start();
  const set=on=>{ if(on===shown) return; shown=on; bar.classList.toggle('is-shown',on);
    if(on){ bar.removeAttribute('inert'); bar.setAttribute('aria-hidden','false'); }
    else { if(bar.contains(document.activeElement)) document.activeElement.blur(); bar.setAttribute('inert',''); bar.setAttribute('aria-hidden','true'); } };
  const onScroll=()=>{
    const y=scrollY, dy=y-lastY; lastY=y;
    if(y<from){ set(false); travel=0; return; }
    if(de.classList.contains('bd-lock')) return;                 // the bag drawer is open: hold still
    travel=(Math.sign(dy)===Math.sign(travel))?travel+dy:dy;      // distance moved in one direction
    if(travel<-10) set(true);                                     // a little way back up: show
    else if(travel>24 && !bar.matches(':hover') && !bar.querySelector(':focus-visible')) set(false);   // on down: hide (not while a keyboard is in it)
  };
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{ from=start(); onScroll(); });
  addEventListener('load',()=>{ from=start(); });
  if(reduce.matches) bar.classList.add('no-motion');
})();
