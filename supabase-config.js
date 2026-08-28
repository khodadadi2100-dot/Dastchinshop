window.DASTCHIN_SUPABASE_URL='https://ydfjpwofursqdxtjnvdw.supabase.co';
window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY='sb_publishable_hkQHmGJCe3Mm96JvIn6QEg_N5dqCMhV';

// Dastchin mobile UI stability patch.
document.addEventListener('DOMContentLoaded',function(){
  const style=document.createElement('style');
  style.textContent=`
    .header{isolation:isolate!important;overflow:hidden!important}
    .header:after{z-index:1!important;pointer-events:none!important}
    .brand{z-index:10!important;pointer-events:none!important}
    .brand img{content:url('logo-header.svg?v=21')!important;width:min(360px,58vw)!important;height:auto!important;max-height:112px!important;object-fit:contain!important}
    .hamb,.topcart,.account{z-index:30!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
    .hamb{display:block!important}
    .account{display:grid!important;place-items:center!important}
    .hero{position:relative!important;z-index:2!important}
    .overlay{z-index:80!important}
    .drawer,.cart{z-index:90!important}
    .modal{z-index:100!important}
    @media(max-width:760px){
      .header{height:140px!important;border-radius:0 0 28px 28px!important}
      .header:after{width:74vw!important;height:165px!important;top:-72px!important;border-radius:0 0 85px 85px!important}
      .brand{width:72vw!important;height:122px!important;top:8px!important}
      .brand img{width:72vw!important;max-width:340px!important;max-height:108px!important}
      .hamb{right:18px!important;top:39px!important}
      .account{left:18px!important;top:28px!important}
      .topcart{left:80px!important;top:40px!important}
    }
  `;
  document.head.appendChild(style);

  // Rebind critical controls after the page script has loaded.
  const bind=function(id,fn){
    const el=document.getElementById(id);
    if(!el||typeof fn!=='function')return;
    el.onclick=function(e){e.preventDefault();e.stopPropagation();fn(e)};
  };
  setTimeout(function(){
    bind('menuBtn',function(){if(typeof openPanel==='function')openPanel('drawer')});
    bind('cartBtn',function(){if(typeof openPanel==='function')openPanel('cart')});
    bind('accountBtn',function(){if(typeof authModal==='function')authModal()});
    bind('cartNav',function(){if(typeof openPanel==='function')openPanel('cart')});
    bind('accountNav',function(){if(typeof authModal==='function')authModal()});
    bind('trackNav',function(){if(typeof openTracking==='function')openTracking()});
    bind('trackMenu',function(){if(typeof closePanels==='function')closePanels();if(typeof openTracking==='function')openTracking()});
    bind('loginMenu',function(){if(typeof closePanels==='function')closePanels();if(typeof authModal==='function')authModal()});
    bind('closeMenu',function(){if(typeof closePanels==='function')closePanels()});
    bind('closeCart',function(){if(typeof closePanels==='function')closePanels()});
    bind('overlay',function(){if(typeof closePanels==='function')closePanels()});
  },100);
});
