(function(){
  'use strict';
  function svg(name){
    const s={
      user:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="17" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M10 39c1.8-8 7.2-12 14-12s12.2 4 14 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
      cart:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 9h6l4 23h21l5-16H15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="19" cy="39" r="3" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="37" cy="39" r="3" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
      menu:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 12h32M8 24h32M8 36h32" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
      search:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="21" r="12" fill="none" stroke="currentColor" stroke-width="3"/><path d="m30 30 10 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
    }; return s[name]||'';
  }
  function apply(){
    const header=document.querySelector('.header');
    if(!header)return;
    const style=document.createElement('style');
    style.id='dastchin-reference-fidelity';
    style.textContent=`
      *{box-sizing:border-box}
      body{margin:0!important;background:#fff!important;color:#102f4a!important;font-family:Tahoma,"Segoe UI",Arial,sans-serif!important}
      .layout{grid-template-columns:61.5% 38.5%!important;min-height:100vh!important}
      .header{height:103px!important;background:#006b40!important;overflow:visible!important;border-radius:0!important;box-shadow:none!important}
      .header:after{left:24%!important;right:24%!important;top:0!important;height:103px!important;background:#fff!important;border-radius:0 0 82px 82px!important;box-shadow:none!important}
      .brand{width:340px!important;height:103px!important;top:0!important;z-index:3!important}
      .brand img{width:100%!important;height:100%!important;object-fit:contain!important}
      .headbtn{top:24px!important;z-index:8!important;color:#fff!important}
      .user{left:30px!important;width:54px!important;height:54px!important;border-radius:50%!important;background:#fff!important;color:#087a4b!important;padding:11px!important}
      .cart{left:122px!important;font-size:0!important;padding:5px!important;width:55px!important;height:55px!important}
      .hamb{right:29px!important;font-size:0!important;width:54px!important;height:54px!important;padding:7px!important}
      .headbtn svg{display:block;width:100%;height:100%}
      .cart .badge{right:-10px!important;top:-7px!important;min-width:29px!important;height:29px!important;background:#ef3f3f!important;border:2px solid #fff!important;font-size:14px!important}
      .hero{margin:34px 15px 18px!important;border-radius:20px!important;box-shadow:0 4px 18px rgba(17,50,44,.09)!important}
      .hero img{aspect-ratio:2.43/1!important;object-fit:cover!important}
      .search{height:51px!important;margin:0 15px 15px!important;border-radius:17px!important}
      .search span{font-size:0!important;width:30px!important;height:30px!important;flex:0 0 30px!important}
      .search span:after{content:'';display:block;width:30px;height:30px;background:url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"%3E%3Ccircle cx="21" cy="21" r="12" fill="none" stroke="%23132e42" stroke-width="3"/%3E%3Cpath d="m30 30 10 10" fill="none" stroke="%23132e42" stroke-width="3" stroke-linecap="round"/%3E%3C/svg%3E') center/contain no-repeat}
      .cats{grid-template-columns:repeat(5,1fr)!important;gap:11px!important;margin:0 20px 23px!important}
      .cat{height:105px!important;border-radius:17px!important}
      .products{grid-template-columns:repeat(4,1fr)!important;gap:13px!important;margin:0 15px!important}
      .prodimg{height:185px!important}
      .bottom{width:61.5%!important;height:76px!important}
      .side{padding:4px 10px 70px!important}
      .tracking{height:568px!important;border-radius:21px!important}
      .admin{margin-top:26px!important;height:357px!important}
      .services{width:38.5%!important;height:56px!important}
      @media(max-width:1050px){.layout{grid-template-columns:1fr!important}.bottom{width:100%!important}.services{display:none!important}}
      @media(max-width:760px){
        .header{height:103px!important}.header:after{left:24%!important;right:24%!important;border-radius:0 0 55px 55px!important}
        .brand{width:290px!important;height:103px!important}.user{left:13px!important}.cart{left:80px!important}.hamb{right:13px!important}
        .hero{margin:34px 0 13px!important;border-radius:0 0 20px 20px!important}.hero img{aspect-ratio:2/1!important}
        .cats{gap:7px!important;margin:0 12px 18px!important}.cat{height:91px!important}.cats .cat:nth-child(5){display:none!important}
        .products{grid-template-columns:repeat(2,1fr)!important;gap:9px!important;margin:0 12px!important}.prodimg{height:150px!important}.bottom{height:74px!important}
      }
    `;
    document.head.appendChild(style);
    const user=document.getElementById('user'); if(user){user.innerHTML=svg('user');}
    const cart=document.getElementById('openCart'); if(cart){cart.firstChild && cart.firstChild.nodeType===3 ? cart.firstChild.remove():null; cart.insertAdjacentHTML('afterbegin',svg('cart'));}
    const menu=document.getElementById('menu'); if(menu)menu.innerHTML=svg('menu');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,20));else setTimeout(apply,20);
})();