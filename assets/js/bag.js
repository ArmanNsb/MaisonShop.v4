/* Maison De La Fork, the bag drawer (every page). Built here; styles in assets/css/bag.css.
   It reads the bag from window.MDLFBag (assets/js/shop.js or product.js) and changes it only through MDLFBag.set,
   so the cards and the header badge keep in step.
   - Hover over the header bag (mouse): the drawer peeks in, and goes again when the pointer leaves it and the bag.
   - Click or tap the bag: it opens and stays (focus is held inside; Escape, the veil or the close button closes it).
   - Something new added: it peeks in with the new line warmed in ochre, and steps back after a few seconds
     unless the pointer or focus is inside.
   CATALOG gives each product's page, thumbnail (192 px squares in assets/img/bag/) and price for the lines;
   keep it in step with the cards in index.html. */
(function(){
  if(!window.MDLFBag) return;
  const CATALOG={
 "Lattice Pie": {
  "url": "product-lattice-pie.html",
  "img": "assets/img/bag/hol-pie-sweet-d.jpg",
  "price": "Price to come"
 },
 "Pigeon Pie": {
  "url": "product-pigeon-pie.html",
  "img": "assets/img/bag/hol-pie-savory-d.jpg",
  "price": "Price to come"
 },
 "Toot Tower": {
  "url": "product-toot-tower.html",
  "img": "assets/img/bag/hol-pomegranate-d.jpg",
  "price": "$230",
  "imgs": {
   "Pastel Almond": "assets/img/bag/toot-pastel-p1.jpg"
  }
 },
 "Special Gift Box": {
  "url": "product-special-gift-box.html",
  "img": "assets/img/bag/special-gift-s-d.jpg",
  "price": "$300",
  "note": "3 boxes"
 },
 "Madeleine Tower": {
  "url": "product-madeleine-tower.html",
  "img": "assets/img/bag/hol-madeleine-d.jpg",
  "price": "$35",
  "note": "Tower"
 },
 "Green Bean Casserole with Brie": {
  "url": "product-green-bean-casserole-with-brie.html",
  "img": "assets/img/bag/greenbean-c-d.jpg",
  "price": "Price to come",
  "note": "Side dish"
 },
 "Rainbow Potato Gratin": {
  "url": "product-rainbow-potato-gratin.html",
  "img": "assets/img/bag/gratin-c-d.jpg",
  "price": "Price to come",
  "note": "Side dish"
 },
 "Abrisham Collection": {
  "url": "product-abrisham-collection.html",
  "img": "assets/img/bag/abrisham-c-d.jpg",
  "price": "$132",
  "note": "Large"
 },
 "Diba Collection": {
  "url": "product-diba-collection.html",
  "img": "assets/img/bag/diba-c-d.jpg",
  "price": "$101",
  "note": "Small"
 },
 "Pansy Cookie": {
  "url": "product-pansy-cookie.html",
  "img": "assets/img/bag/pansy-c-d.jpg",
  "price": "$101",
  "note": "36 pieces"
 },
 "Noon Berenji": {
  "url": "product-noon-berenji.html",
  "img": "assets/img/bag/botanical-c-d.jpg",
  "price": "$112"
 },
 "Noon Berenji, Pinkland": {
  "url": "product-noon-berenji-pinkland.html",
  "img": "assets/img/bag/pinkland-c-d.jpg",
  "price": "$68",
  "note": "32 pieces"
 },
 "Toot": {
  "url": "product-toot.html",
  "img": "assets/img/bag/toot-c-d.jpg",
  "price": "$62",
  "note": "Gluten-free"
 },
 "Pa-Derazi": {
  "url": "product-pa-derazi.html",
  "img": "assets/img/bag/paderazi-c-d.jpg",
  "price": "$79",
  "note": "28 pieces"
 },
 "Walnut": {
  "url": "product-walnut.html",
  "img": "assets/img/bag/walnut-c-d.jpg",
  "price": "$87",
  "note": "24 pieces"
 },
 "Coconut Macaroon": {
  "url": "product-coconut-macaroon.html",
  "img": "assets/img/bag/coconut-c-d.jpg",
  "price": "$87",
  "note": "Vegan"
 },
 "Calisson": {
  "url": "product-calisson.html",
  "img": "assets/img/bag/calisson-c-d.jpg",
  "price": "$72",
  "note": "18 pieces"
 },
 "Rumi Blend": {
  "url": "product-rumi-blend.html",
  "img": "assets/img/bag/rumi-c-d.jpg",
  "price": "$23",
  "note": "Maison Tea"
 },
 "Gift Card": {
  "url": "product-gift-card.html",
  "img": "assets/img/bag/gift-card-s-d.jpg",
  "price": "",
  "note": "Any amount"
 }
};
  // every header bag opens the drawer (the page's header, and the compact header that slides in on scroll-up)
  const bags=[...document.querySelectorAll('.bag')]; if(!bags.length) return;
  const hover=matchMedia('(hover:hover) and (pointer:fine)'), reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const SVG={
    close:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    minus:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 12h12"/></svg>',
    plus:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>',
    arrow:'<svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
  };
  /* FM-CATALOG */ Object.assign(CATALOG,{
 "Sofreh Aghd Design": {
  "url": "#fm-weddings",
  "price": "$9,000",
  "note": "Local \u00b7 $10,000 credit"
 },
 "Sofreh Aghd Design, Destination": {
  "url": "#fm-weddings",
  "price": "$12,600",
  "note": "$14,000 credit"
 },
 "Wedding Planning": {
  "url": "#fm-weddings",
  "price": "$33,750",
  "note": "$37,500 credit"
 },
 "Wedding Cake": {
  "url": "#fm-weddings",
  "price": "$850",
  "note": "$1,000 credit"
 },
 "Dessert Table": {
  "url": "#fm-tables",
  "price": "$9,000",
  "note": "$10,000 credit"
 },
 "Dinner Table": {
  "url": "#fm-tables",
  "price": "Price to come",
  "note": "Credit to be confirmed"
 },
 "Custom Cake, Petite": {
  "url": "#fm-cakes",
  "price": "$255",
  "note": "$300 credit"
 },
 "Custom Cake, Classic": {
  "url": "#fm-cakes",
  "price": "$510",
  "note": "$600 credit"
 },
 "Custom Cake, Grand": {
  "url": "#fm-cakes",
  "price": "$850",
  "note": "$1,000 credit"
 },
 "Bridal Shower Cake": {
  "url": "#fm-cakes",
  "price": "Price to come",
  "note": "Credit to be confirmed"
 },
 "Anniversary Cake": {
  "url": "#fm-cakes",
  "price": "Price to come",
  "note": "Credit to be confirmed"
 },
 "Baby Shower": {
  "url": "#fm-nursery",
  "price": "Price to come",
  "note": "Credit to be confirmed"
 },
 "Custom Birthday Cake": {
  "url": "#fm-nursery",
  "price": "Price to come",
  "note": "Credit to be confirmed"
 },
 "One Sweet First Year": {
  "url": "#fm-nursery",
  "price": "$1,260"
 },
 "Madeleine Tower": {
  "url": "#fm-towers",
  "price": "$297.50",
  "img": "assets/img/bag/hol-madeleine-d.jpg"
 },
 "Toot Tower, Small": {
  "url": "#fm-towers",
  "price": "Price to come",
  "img": "assets/img/bag/hol-pomegranate-d.jpg",
  "imgs": {
   "Pastel Almond": "assets/img/bag/toot-pastel-p1.jpg",
   "Pomegranate": "assets/img/bag/hol-pomegranate-d.jpg"
  }
 },
 "Toot Tower, Medium": {
  "url": "#fm-towers",
  "price": "$195.50",
  "img": "assets/img/bag/hol-pomegranate-d.jpg",
  "imgs": {
   "Pastel Almond": "assets/img/bag/toot-pastel-p1.jpg",
   "Pomegranate": "assets/img/bag/hol-pomegranate-d.jpg"
  }
 },
 "Toot Tower, Large": {
  "url": "#fm-towers",
  "price": "Price to come",
  "img": "assets/img/bag/toot-pastel-p1.jpg",
  "imgs": {
   "Pastel Almond": "assets/img/bag/toot-pastel-p1.jpg",
   "Pomegranate": "assets/img/bag/hol-pomegranate-d.jpg"
  }
 }
}); /* /FM-CATALOG */
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const money=n=>'$'+(Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:n%1?2:0});
  const unit=p=>{const m=/^\$\s*([\d,.]+)$/.exec((p||'').trim()); return m?parseFloat(m[1].replace(/,/g,'')):null;};
  const split=k=>{const i=k.indexOf(' · '); return i<0?[k,'']:[k.slice(0,i),k.slice(i+3)];};

  /* the drawer */
  const root=document.createElement('div'); root.className='bd'; root.setAttribute('aria-hidden','true');
  root.innerHTML=
    '<div class="bd__veil"></div>'+
    '<aside class="bd__panel" role="dialog" aria-modal="true" aria-labelledby="bd-title" tabindex="-1">'+
      '<header class="bd__head"><div><p class="bd__eyebrow"><i>/</i>Maison De La Fork</p>'+
        '<h2 class="bd__title" id="bd-title">Your Bag<span class="bd__count"></span></h2></div>'+
        '<button class="bd__close" type="button" aria-label="Close the bag">'+SVG.close+'</button></header>'+
      '<div class="bd__body"><ul class="bd__list"></ul>'+
        '<div class="bd__empty"><img src="assets/img/monogram-emboss.png" alt=""><h3>Your bag is empty</h3>'+
        '<p>Every piece is made by hand, in small batches. Begin with the Holiday Collection.</p>'+
        '<a class="bd__cta" href="index.html#holiday"><span>Discover the collection</span>'+SVG.arrow+'</a></div></div>'+
      '<footer class="bd__foot"><div class="bd__row"><span>Subtotal</span><span class="bd__sub"><b>$0</b></span></div>'+
        '<p class="bd__note"></p>'+
        '<button class="bd__cta js-checkout" type="button"><span>Checkout</span>'+SVG.arrow+'</button>'+
        '<p class="bd__msg" role="status"></p>'+
        '<button class="bd__more" type="button">Continue shopping</button></footer>'+
    '</aside>';
  document.body.appendChild(root);
  const panel=root.querySelector('.bd__panel'), list=root.querySelector('.bd__list'), sub=root.querySelector('.bd__sub b'),
        note=root.querySelector('.bd__note'), count=root.querySelector('.bd__count'), msg=root.querySelector('.bd__msg');

  /* lines */
  const lineHTML=(key,q,i)=>{
    const [name,opt]=split(key), c=CATALOG[name]||{}, u=unit(c.price), img=(c.imgs&&c.imgs[opt])||c.img||'assets/img/monogram-emboss.png';
    const each=u!==null&&q>1?'<small>'+money(u)+' each</small>':'';
    const price=u!==null?money(u*q)+each:esc(c.price||'Price to come');
    const href=c.url?esc(c.url):'#';
    return '<li class="bdl" data-key="'+esc(key)+'" style="--i:'+i+'">'+
      '<a class="bdl__img" href="'+href+'" tabindex="-1" aria-hidden="true"><img src="'+esc(img)+'" alt="" loading="lazy"></a>'+
      '<div class="bdl__main"><a class="bdl__name" href="'+href+'">'+esc(name)+'</a>'+
        ((opt||c.note)?'<p class="bdl__opt">'+esc(opt||c.note)+'</p>':'')+
        '<div class="bdl__row"><div class="bdl__qty" role="group" aria-label="Quantity of '+esc(key)+'">'+
          '<button type="button" data-d="-1" aria-label="One fewer"'+(q<=1?' disabled':'')+'>'+SVG.minus+'</button>'+
          '<output class="bdl__n" aria-live="polite">'+q+'</output>'+
          '<button type="button" data-d="1" aria-label="One more">'+SVG.plus+'</button></div>'+
        '<button class="bdl__rm" type="button" aria-label="Remove '+esc(key)+'">Remove</button></div></div>'+
      '<div class="bdl__price'+(u===null?' is-tbc':'')+'">'+price+'</div></li>';
  };
  let lastSub='';
  const render=(fresh)=>{
    const items=MDLFBag.items(), keys=Object.keys(items);
    list.innerHTML=keys.map((k,i)=>lineHTML(k,items[k],i)).join('');
    root.classList.toggle('is-empty',!keys.length);
    const n=keys.reduce((a,k)=>a+items[k],0); count.textContent=n?n+(n===1?' piece':' pieces'):'';
    let total=0, tbc=0; keys.forEach(k=>{const u=unit((CATALOG[split(k)[0]]||{}).price); if(u===null) tbc++; else total+=u*items[k];});
    const s=money(total); if(s!==lastSub){ sub.textContent=s; if(lastSub&&!reduce.matches){sub.classList.remove('roll'); void sub.offsetWidth; sub.classList.add('roll');} lastSub=s; }
    note.textContent=(tbc?'Holiday pieces priced on confirmation are not included. ':'')+'Taxes and delivery are calculated at checkout.';
    if(fresh){ const li=list.querySelector('[data-key="'+CSS.escape(fresh)+'"]'); if(li){ li.classList.add('is-new'); const o=li.querySelector('.bdl__n'); o.classList.add('tick');
      requestAnimationFrame(()=>li.scrollIntoView({block:'nearest',behavior:reduce.matches?'auto':'smooth'})); } }
  };
  // a change made inside the drawer is painted in place, so the lines don't re-run their entrance
  let inside=false;
  list.addEventListener('click',e=>{
    const li=e.target.closest('.bdl'); if(!li) return; const key=li.dataset.key;
    const d=e.target.closest('[data-d]');
    if(d){ inside=true; MDLFBag.set(key,MDLFBag.get(key)+ +d.dataset.d); inside=false;
      const o=list.querySelector('[data-key="'+CSS.escape(key)+'"] .bdl__n'); if(o){o.classList.remove('tick'); void o.offsetWidth; o.classList.add('tick');}
      const b=list.querySelector('[data-key="'+CSS.escape(key)+'"] [data-d="'+d.dataset.d+'"]'); if(b) b.focus({preventScroll:true}); return; }
    if(e.target.closest('.bdl__rm')){
      const h=li.offsetHeight; li.style.height=h+'px'; void li.offsetHeight; li.classList.add('is-leaving'); li.style.height='0px'; li.style.paddingTop=li.style.paddingBottom='0px';
      const next=li.nextElementSibling||li.previousElementSibling;
      setTimeout(()=>{ inside=true; MDLFBag.set(key,0); inside=false; const f=next&&list.querySelector('[data-key="'+CSS.escape(next.dataset.key)+'"] .bdl__rm'); (f||panel.querySelector('.bd__close')).focus({preventScroll:true}); }, reduce.matches?0:420);
    }
  });

  /* open, close */
  let state='closed', timer=0, autoT=0, lastFocus=null;
  const setOpen=(mode)=>{
    clearTimeout(timer);
    if(mode==='closed'){ if(state==='closed') return; state='closed'; root.classList.remove('is-open','is-peek'); root.setAttribute('aria-hidden','true');
      bags.forEach(b=>b.classList.remove('is-active')); document.documentElement.classList.remove('bd-lock'); document.documentElement.style.paddingRight='';
      if(lastFocus&&panel.contains(document.activeElement)) lastFocus.focus({preventScroll:true}); return; }
    const was=state; state=mode;
    if(was==='closed'){ root.classList.remove('no-stagger'); render(); } else root.classList.add('no-stagger');
    root.classList.add('is-open'); root.classList.toggle('is-peek',mode==='peek'); root.setAttribute('aria-hidden','false'); bags.forEach(b=>b.classList.add('is-active'));
    const de=document.documentElement;   // lock the page behind, keeping the scrollbar's width so nothing shifts
    if(mode==='pinned'&&!de.classList.contains('bd-lock')){ de.style.paddingRight=(innerWidth-de.clientWidth)+'px'; de.classList.add('bd-lock'); }
    if(mode!=='pinned'){ de.classList.remove('bd-lock'); de.style.paddingRight=''; }
    if(mode==='pinned'){ lastFocus=document.activeElement; setTimeout(()=>panel.querySelector('.bd__close').focus({preventScroll:true}),60); }
  };
  const close=()=>setOpen('closed');
  bags.forEach(b=>b.addEventListener('click',e=>{ e.preventDefault(); state==='pinned'?close():setOpen('pinned'); }));
  root.querySelector('.bd__veil').addEventListener('click',close);
  root.querySelector('.bd__close').addEventListener('click',close);
  root.querySelector('.bd__more').addEventListener('click',close);
  root.querySelector('.js-checkout').addEventListener('click',()=>{ msg.textContent='Checkout opens once the bag is connected to the store.'; msg.classList.add('is-on'); clearTimeout(msg._t); msg._t=setTimeout(()=>msg.classList.remove('is-on'),3200); });

  // hover peek (mouse only): opens after a short pause on the bag, closes a moment after the pointer leaves both
  // only a mouse counts as 'over' (a tap leaves a sticky :hover behind on touch screens)
  let mouseIn=false, onBag=false;
  const overAny=()=>mouseIn||onBag;
  const leave=()=>{ if(state!=='peek') return; clearTimeout(timer); timer=setTimeout(()=>{ if(state==='peek'&&!overAny()&&!panel.contains(document.activeElement)) close(); },320); };
  bags.forEach(b=>{
    b.addEventListener('pointerenter',e=>{ if(e.pointerType!=='mouse') return; onBag=true; if(!hover.matches||state!=='closed') return; clearTimeout(timer); timer=setTimeout(()=>{ if(onBag) setOpen('peek'); },140); });
    b.addEventListener('pointerleave',e=>{ if(e.pointerType==='mouse'){ onBag=false; leave(); } }); });
  panel.addEventListener('pointerleave',e=>{ if(e.pointerType==='mouse'){ mouseIn=false; leave(); } });
  panel.addEventListener('pointerenter',e=>{ if(e.pointerType==='mouse'){ mouseIn=true; clearTimeout(timer); clearTimeout(autoT); } });
  panel.addEventListener('pointerdown',()=>clearTimeout(autoT));   // a touch inside keeps it open
  panel.addEventListener('focusin',()=>clearTimeout(autoT));

  // keyboard: Escape closes; Tab stays inside while the drawer is pinned
  addEventListener('keydown',e=>{
    if(state==='closed') return;
    if(e.key==='Escape'){ e.preventDefault(); close(); return; }
    if(e.key==='Tab'&&state==='pinned'){ const f=[...panel.querySelectorAll('a[href],button:not([disabled])')].filter(x=>x.offsetParent&&x.tabIndex>=0);
      if(!f.length) return; const a=f[0], z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault(); z.focus();} else if(!e.shiftKey&&document.activeElement===z){e.preventDefault(); a.focus();} }
  });

  // the bag changes: repaint; something new from the page peeks the drawer in with that line warmed
  let before=MDLFBag.items();
  MDLFBag.on(key=>{
    const now=MDLFBag.items(), was=before[key]||0, q=now[key]||0; before=now;
    if(inside){ root.classList.add('no-stagger'); render(); return; }
    const isProduct=!!document.body.dataset.product;
    if(q>was && (was===0||isProduct)){
      if(state==='closed') { setOpen('peek'); render(key); } else { root.classList.add('no-stagger'); render(key); }
      clearTimeout(autoT); if(state==='peek') autoT=setTimeout(()=>{ if(state==='peek'&&!overAny()&&!panel.contains(document.activeElement)) close(); },3800);
    } else if(state!=='closed'){ root.classList.add('no-stagger'); render(); }
  });
})();
