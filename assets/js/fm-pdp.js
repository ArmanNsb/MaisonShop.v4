/* Fork Monday service pages: for a visitor who is not signed in, "Add to cart" first shows what members pay
   (once per page); "Continue" adds it at the regular price. Spots, sold out and the members/visitor switch come from
   fm-cats.js, as on the shop. */
(function(){
  const box=document.querySelector('.fmbuyc'); if(!box) return;
  const nd=box.querySelector('.fmnudge'); let seen=false;
  const guest=()=>document.documentElement.classList.contains('fm-guest');
  document.querySelectorAll('.js-add,.js-add2').forEach(b=>b.addEventListener('click',e=>{
    if(!guest()||seen||!nd) return; e.preventDefault(); e.stopImmediatePropagation();
    nd.hidden=false; if(b.classList.contains('js-add2')) nd.scrollIntoView({block:'center',behavior:'smooth'});
    nd.querySelector('a').focus({preventScroll:true}); },true));
  if(nd){
    const add=box.querySelector('.js-add');
    nd.querySelector('.fmnudge__go').addEventListener('click',()=>{ seen=true; nd.hidden=true; add.click(); });
    nd.querySelector('.fmnudge__x').addEventListener('click',()=>{ nd.hidden=true; add.focus({preventScroll:true}); });
    nd.addEventListener('keydown',e=>{ if(e.key==='Escape'){ nd.hidden=true; add.focus({preventScroll:true}); } });
  }
})();
