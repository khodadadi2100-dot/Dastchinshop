window.DASTCHIN_SUPABASE_URL='https://ydfjpwofursqdxtjnvdw.supabase.co';
window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY='sb_publishable_hkQHmGJCe3Mm96JvIn6QEg_N5dqCMhV';

// Dastchin UI stability and admin product tools.
document.addEventListener('DOMContentLoaded',function(){
  const style=document.createElement('style');
  style.textContent=`
    .header{isolation:isolate!important;overflow:hidden!important;position:relative!important;height:140px!important;background:linear-gradient(180deg,#006f3f 0%,#008d4f 100%)!important}
    .header:after{z-index:1!important;pointer-events:none!important;left:50%!important;top:-38px!important;width:min(620px,68vw)!important;height:170px!important;border-radius:0 0 115px 115px!important;background:#fff!important}
    .brand{z-index:10!important;pointer-events:none!important;left:50%!important;top:4px!important;width:min(430px,58vw)!important;height:128px!important}
    .brand img{content:url('logo-header.svg?v=31')!important;width:100%!important;height:118px!important;max-width:none!important;max-height:none!important;object-fit:contain!important}
    .hamb,.topcart,.account{z-index:30!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
    .hamb{display:block!important;right:24px!important;top:39px!important}
    .account{display:grid!important;place-items:center!important}
    .hero{position:relative!important;z-index:2!important;margin:18px 20px 14px!important;overflow:hidden!important;border-radius:30px!important;background:#fff!important}
    .hero img{display:block!important;width:100%!important;height:auto!important;aspect-ratio:1024/390!important;object-fit:cover!important;object-position:center!important}
    .overlay{z-index:80!important}
    .drawer,.cart{z-index:90!important}
    .modal{z-index:100!important}
    .modalBox{position:relative!important}
    .modalClose{position:absolute!important;left:14px!important;top:12px!important;width:38px!important;height:38px!important;border-radius:50%!important;background:#eef5f2!important;color:#31557d!important;font-size:26px!important;line-height:1!important;font-weight:900!important;z-index:3!important}
    .adminAddBtn{background:#008d4f!important;color:#fff!important;border-radius:13px!important;padding:11px 15px!important;font-weight:900!important;margin-bottom:12px!important;width:100%!important}
    .adminAddBox{background:#f7faf9!important;border:1px solid #e0ebe6!important;border-radius:16px!important;padding:14px!important;margin-bottom:14px!important}
    .adminAddBox label{display:block!important;font-size:12px!important;font-weight:900!important;margin:8px 0 5px!important}
    .adminAddBox input,.adminAddBox select{width:100%!important;padding:11px!important;border:1px solid #d7e3de!important;border-radius:11px!important;background:#fff!important}
    .adminAddGrid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important}
    @media(max-width:760px){
      .header{height:140px!important;border-radius:0 0 28px 28px!important}
      .header:after{width:74vw!important;height:165px!important;top:-38px!important;border-radius:0 0 90px 90px!important}
      .brand{width:72vw!important;max-width:340px!important;height:122px!important;top:5px!important}
      .brand img{width:100%!important;height:112px!important}
      .hamb{right:18px!important;top:39px!important}
      .account{left:18px!important;top:28px!important}
      .topcart{left:80px!important;top:40px!important}
      .hero{margin:0 0 14px!important;border-radius:0 0 28px 28px!important}
      .hero img{aspect-ratio:1024/430!important}
      .adminAddGrid{grid-template-columns:1fr!important}
    }
  `;
  document.head.appendChild(style);

  // Make every modal dismissible, including login/sign-up, without requiring refresh.
  const modal=document.getElementById('modal');
  if(modal){
    const addClose=function(){
      const box=modal.querySelector('.modalBox');
      if(box&&!box.querySelector('.modalClose')){
        const b=document.createElement('button');
        b.className='modalClose'; b.type='button'; b.setAttribute('aria-label','بستن'); b.textContent='×';
        b.onclick=function(e){e.preventDefault();e.stopPropagation();if(typeof closeModal==='function')closeModal()};
        box.appendChild(b);
      }
    };
    new MutationObserver(addClose).observe(modal,{attributes:true,subtree:true,childList:true});
    modal.addEventListener('click',function(e){if(e.target===modal&&typeof closeModal==='function')closeModal()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('show')&&typeof closeModal==='function')closeModal()});
  }

  // Restore the admin "add new product" option.
  if(location.pathname.endsWith('/admin.html')||location.pathname.endsWith('admin.html')){
    setTimeout(function(){
      const panel=document.getElementById('products');
      const list=document.getElementById('productsList');
      if(!panel||!list||document.getElementById('adminAddProductBtn'))return;
      const btn=document.createElement('button');
      btn.id='adminAddProductBtn'; btn.className='adminAddBtn'; btn.type='button'; btn.textContent='＋ افزودن محصول جدید';
      panel.insertBefore(btn,list);
      btn.onclick=function(){
        let box=document.getElementById('adminAddBox');
        if(box){box.remove();return}
        box=document.createElement('div'); box.id='adminAddBox'; box.className='adminAddBox';
        box.innerHTML=`<b>افزودن محصول جدید</b>
          <label>نام محصول *</label><input id="apName" placeholder="مثلاً ماست چکیده">
          <div class="adminAddGrid"><div><label>قیمت (تومان) *</label><input id="apPrice" inputmode="numeric" placeholder="320000"></div><div><label>موجودی *</label><input id="apStock" inputmode="numeric" placeholder="10"></div></div>
          <div class="adminAddGrid"><div><label>دسته‌بندی</label><select id="apCat"><option>لبنیات</option><option>پروتئین</option><option>شوریجات</option><option>محلی</option></select></div><div><label>واحد/توضیح کوتاه</label><input id="apMeta" placeholder="۱ کیلوگرم"></div></div>
          <label>آدرس تصویر محصول</label><input id="apImage" placeholder="https://...">
          <div style="display:flex;gap:8px;margin-top:12px"><button id="apSave" class="btn" style="background:#008d4f;color:#fff">ذخیره محصول</button><button id="apCancel" class="btn" style="background:#eaf0ee;color:#31557d">انصراف</button></div><div id="apMsg" class="muted" style="margin-top:8px"></div>`;
        panel.insertBefore(box,list);
        document.getElementById('apCancel').onclick=function(){box.remove()};
        document.getElementById('apSave').onclick=async function(){
          const msg=document.getElementById('apMsg'),name=document.getElementById('apName').value.trim(),price=Number(document.getElementById('apPrice').value.replace(/,/g,'')),stock=Number(document.getElementById('apStock').value),category=document.getElementById('apCat').value,meta=document.getElementById('apMeta').value.trim(),image_url=document.getElementById('apImage').value.trim();
          if(!name||!Number.isFinite(price)||price<0||!Number.isInteger(stock)||stock<0){msg.textContent='نام، قیمت معتبر و موجودی معتبر را وارد کنید.';return}
          msg.textContent='در حال ذخیره...';
          const sb=window.supabase.createClient(window.DASTCHIN_SUPABASE_URL,window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
          const {data:{session}}=await sb.auth.getSession();
          if(!session){msg.textContent='ابتدا وارد حساب مدیریت شوید.';return}
          const {data:me}=await sb.from('profiles').select('role').eq('id',session.user.id).single();
          if(me?.role!=='admin'){msg.textContent='این حساب دسترسی مدیریت ندارد.';return}
          const slug=name.toLowerCase().replace(/\s+/g,'-')+'-'+Date.now();
          const r=await sb.from('products').insert({name,price,stock,category,meta,image_url:image_url||null,active:true,is_active:true,slug,sort_order:100});
          if(r.error){msg.textContent='خطا: '+r.error.message;return}
          msg.textContent='محصول با موفقیت اضافه شد. ✓';
          setTimeout(function(){box.remove();location.reload()},700);
        };
      };
    },900);
  }
});

// Live product synchronization: newly created products become visible without a manual rebuild.
document.addEventListener('DOMContentLoaded',function(){
  const refreshProducts=async function(){
    try{
      if(typeof loadProducts==='function'){
        await loadProducts();
        return;
      }
      if(typeof supabase==='undefined'||!window.DASTCHIN_SUPABASE_URL)return;
      const sb=supabase.createClient(window.DASTCHIN_SUPABASE_URL,window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY);
      const r=await sb.from('products').select('*').or('active.eq.true,is_active.eq.true').order('sort_order').order('created_at',{ascending:false});
      if(!r.error&&Array.isArray(r.data)&&typeof renderProducts==='function'){
        products=r.data;
        renderProducts();
      }
    }catch(e){console.warn('Dastchin product refresh:',e)}
  };
  const refreshBtn=document.getElementById('refresh');
  if(refreshBtn)refreshBtn.addEventListener('click',refreshProducts);
  setTimeout(refreshProducts,700);
  setInterval(refreshProducts,10000);

  // If the public page was left open while a product was added in admin, refresh its product list promptly.
  if(location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')||location.pathname.endsWith('index.html')){
    document.addEventListener('visibilitychange',function(){if(!document.hidden)refreshProducts()});
  }
});
