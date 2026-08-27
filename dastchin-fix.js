(function(){
function getDb(){
  if(window.cfg)return window.cfg;
  if(window.DASTCHIN_SUPABASE_URL&&window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY&&window.supabase){
    window.cfg=window.supabase.createClient(window.DASTCHIN_SUPABASE_URL,window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY);
    return window.cfg;
  }
  return null;
}
function boot(){
 const brand=document.querySelector('.brand');
 const top=document.querySelector('.top');
 if(brand&&top){
   brand.innerHTML='<img src="logo.svg?v=6" alt="دستچین" class="real-logo">';
   brand.style.cssText='position:absolute;left:50%;top:6px;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;z-index:3;width:min(420px,70vw);height:128px;pointer-events:none;';
   top.classList.add('approved-header');
 }
 const menuBody=document.querySelector('#drawer .panelBody');
 if(menuBody&&!document.getElementById('adminEntry')){
   const a=document.createElement('a');
   a.id='adminEntry';a.href='admin.html';a.textContent='پنل مدیریت';
   a.style.cssText='display:block;text-align:center;text-decoration:none;margin-top:14px;padding:12px;border-radius:14px;background:#082e5b;color:#fff;font-weight:900;';
   menuBody.appendChild(a);
 }
 const style=document.createElement('style');
 style.textContent=`
 .approved-header{height:140px!important;background:linear-gradient(180deg,#006f3f 0%,#008d4f 100%)!important;position:relative!important;overflow:hidden;border-radius:0 0 22px 22px!important;box-shadow:0 3px 14px rgba(6,62,46,.2)!important}
 .approved-header:before{content:"";position:absolute;z-index:1;left:50%;top:-42px;transform:translateX(-50%);width:min(560px,76vw);height:170px;background:#fff;border-radius:0 0 95px 95px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
 .approved-header .real-logo{width:min(340px,62vw);height:auto;display:block;position:relative;z-index:2;max-height:112px;object-fit:contain}
 .approved-header .hamb,.approved-header .topRight{position:relative;z-index:4}
 .approved-header .hamb{margin-top:28px}.approved-header .topRight{margin-top:28px}
 .approved-header .brand{pointer-events:none}
 .checkout-fix{padding-top:4px}.checkout-fix h2{color:#073b63}
 .checkout-fix .step{display:flex;justify-content:space-between;align-items:center;margin:4px 0 18px;padding:10px 14px;background:#eef9f3;border-radius:14px;color:#087345;font-size:13px;font-weight:800}
 .checkout-fix .success{padding:16px;border-radius:15px;background:#edf9f1;color:#087345;line-height:1.9}
 .checkout-fix .err{padding:12px;border-radius:12px;background:#fff1f1;color:#b42318;margin-top:10px;font-size:13px;line-height:1.8;white-space:normal}
 .checkout-fix .fieldInput{width:100%;padding:13px;border:1px solid #d9e3df;border-radius:13px;outline:0;background:#fff}
 .checkout-fix .fieldInput:focus{border-color:#008d4f}
 .checkout-fix .field{margin:10px 0}.checkout-fix .field label{display:block;font-size:13px;font-weight:900;margin-bottom:6px}
 .checkout-fix .notice{padding:12px;background:#eef9f3;border-radius:12px;margin:12px 0;color:#176b43;font-size:13px}
 @media(max-width:760px){
   .approved-header{height:140px!important}
   .approved-header:before{width:74vw;height:150px;top:-38px;border-radius:0 0 72px 72px}
   .approved-header .brand{width:74vw;height:122px;top:7px}
   .approved-header .real-logo{width:72vw;max-width:340px;max-height:112px}
   .approved-header .hamb{margin-top:34px}.approved-header .topRight{margin-top:34px}
 }
 `;
 document.head.appendChild(style);
 window.cfg=getDb();
 window.checkout=function(){
  const db=getDb();
  if(!db){openModal('<div class="checkout-fix"><h2>ثبت سفارش</h2><div class="err">اتصال فروشگاه به پایگاه داده برقرار نیست. لطفاً صفحه را یک‌بار تازه‌سازی کنید.</div></div>');return;}
  openModal('<div class="checkout-fix"><h2>ثبت سفارش</h2><div class="step"><span>🛒 سبد خرید</span><span>📍 اطلاعات مشتری</span><span>✓ ثبت نهایی</span></div><div class="field"><label>نام و نام خانوادگی <b>*</b></label><input id="fixName" class="fieldInput" autocomplete="name" placeholder="نام و نام خانوادگی"></div><div class="field"><label>شماره تلفن <b>*</b></label><input id="fixPhone" class="fieldInput" inputmode="tel" autocomplete="tel" placeholder="09xxxxxxxxx"></div><div class="field"><label>آدرس تحویل دقیق <b>*</b></label><textarea id="fixAddress" class="fieldInput" rows="4" autocomplete="street-address" placeholder="نجف‌آباد، خیابان، کوچه، پلاک..."></textarea></div><div class="field"><label>توضیحات سفارش</label><textarea id="fixNote" class="fieldInput" rows="2" placeholder="اختیاری"></textarea></div><div class="notice">نام، شماره تلفن و آدرس برای ثبت سفارش الزامی است.</div><button class="primary" id="fixSubmit">ثبت نهایی سفارش</button><div id="fixMsg"></div></div>');
  document.getElementById('fixSubmit').onclick=submitFixedOrder;
 };
 async function submitFixedOrder(){
  const db=getDb();const msg=document.getElementById('fixMsg');
  const name=document.getElementById('fixName').value.trim();const phone=document.getElementById('fixPhone').value.trim();const address=document.getElementById('fixAddress').value.trim();const note=document.getElementById('fixNote').value.trim();
  if(!name||!phone||!address){msg.innerHTML='<div class="err">برای ثبت نهایی، نام و نام خانوادگی، شماره تلفن و آدرس را کامل کنید.</div>';return;}
  if(!/^09\d{9}$/.test(phone.replace(/\s+/g,''))){msg.innerHTML='<div class="err">شماره تلفن را به صورت ۱۱ رقمی و با 09 وارد کنید.</div>';return;}
  const {data:{session}}=await db.auth.getSession();
  if(!session){msg.innerHTML='<div class="err">برای ثبت سفارش ابتدا وارد حساب شوید.</div>';return;}
  const userId=session.user.id;msg.innerHTML='<div class="notice">در حال ثبت اطلاعات و سفارش...</div>';
  const pr=await db.from('profiles').upsert({id:userId,full_name:name,phone:phone},{onConflict:'id'});
  if(pr.error){msg.innerHTML='<div class="err">خطا در ذخیره اطلاعات مشتری: '+escapeHtml(pr.error.message)+'</div>';return;}
  const ar=await db.from('addresses').insert({user_id:userId,title:'آدرس منزل',address:address,address_text:address,is_default:true}).select('id').single();
  if(ar.error){msg.innerHTML='<div class="err">خطا در ذخیره آدرس: '+escapeHtml(ar.error.message)+'</div>';return;}
  const stored=JSON.parse(localStorage.getItem('dastchin_cart')||'{}');
  const items=Object.values(stored).map(x=>({product_id:Number(x.p?.id),quantity:Number(x.qty)})).filter(x=>Number.isFinite(x.product_id)&&x.quantity>0);
  if(!items.length){msg.innerHTML='<div class="err">سبد خرید خالی است.</div>';return;}
  const or=await db.rpc('place_order',{p_address_id:ar.data.id,p_items:items,p_payment_method:'cash_on_delivery',p_note:note||null});
  if(or.error){msg.innerHTML='<div class="err">خطا در ثبت سفارش: '+escapeHtml(or.error.message)+'</div>';return;}
  localStorage.removeItem('dastchin_cart');
  if(typeof renderCart==='function')renderCart();
  document.getElementById('modalContent').innerHTML='<div class="checkout-fix"><h2>سفارش با موفقیت ثبت شد ✅</h2><div class="success">شماره سفارش: <b>'+escapeHtml(String(or.data))+'</b><br>سفارش شما ثبت شد و در پنل مدیریت قابل مشاهده است.</div><br><button class="primary" onclick="closeModal()">بازگشت به فروشگاه</button></div>';
 }
 function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
 setTimeout(function(){
   const b=document.getElementById('checkout');if(b)b.onclick=function(){window.checkout()};
   const m=document.getElementById('menuBtn');if(m)m.onclick=function(){openPanel('drawer')};
   const c=document.getElementById('cartBtn');if(c)c.onclick=function(){openPanel('cart')};
   const cn=document.getElementById('cartNav');if(cn)cn.onclick=function(){openPanel('cart')};
   const ov=document.getElementById('overlay');if(ov)ov.onclick=closePanels;
   const cm=document.getElementById('closeMenu');if(cm)cm.onclick=closePanels;
   const cc=document.getElementById('closeCart');if(cc)cc.onclick=closePanels;
 },800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,50));else setTimeout(boot,50);
})();