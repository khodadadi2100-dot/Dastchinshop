(function(){
function boot(){
 const brand=document.querySelector('.brand');
 if(brand){brand.innerHTML='<img src="logo-header.svg" alt="دستچین" class="real-logo">';brand.style.cssText='position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;';}
 const style=document.createElement('style');style.textContent='.real-logo{width:210px;height:auto;display:block}.hero img{object-position:center}.checkout-fix{padding-top:4px}.checkout-fix h2{color:#073b63}.checkout-fix .step{display:flex;justify-content:space-between;align-items:center;margin:4px 0 18px;padding:10px 14px;background:#eef9f3;border-radius:14px;color:#087345;font-size:13px;font-weight:800}.checkout-fix .success{padding:16px;border-radius:15px;background:#edf9f1;color:#087345;line-height:1.9}.checkout-fix .err{padding:12px;border-radius:12px;background:#fff1f1;color:#b42318;margin-top:10px;font-size:13px;line-height:1.8}';document.head.appendChild(style);
 if(typeof window.checkout==='function') window._oldCheckout=window.checkout;
 window.checkout=function(){
  if(!window.cfg){openModal('<div class="checkout-fix"><h2>ثبت سفارش</h2><div class="err">اتصال فروشگاه به پایگاه داده برقرار نیست.</div></div>');return;}
  openModal('<div class="checkout-fix"><h2>ثبت سفارش</h2><div class="step"><span>🛒 سبد خرید</span><span>📍 آدرس</span><span>✓ ثبت نهایی</span></div><div class="field"><label>نام و نام خانوادگی</label><input id="fixName" class="fieldInput" placeholder="مثلاً مازیار خدّادادی"></div><div class="field"><label>شماره موبایل</label><input id="fixPhone" class="fieldInput" inputmode="tel" placeholder="09xxxxxxxxx"></div><div class="field"><label>آدرس تحویل دقیق</label><textarea id="fixAddress" class="fieldInput" rows="4" placeholder="نجف‌آباد، خیابان، کوچه، پلاک..."></textarea></div><div class="field"><label>توضیحات سفارش</label><textarea id="fixNote" class="fieldInput" rows="2" placeholder="مثلاً قبل از تماس هماهنگ کنید"></textarea></div><div class="notice">ارسال در محدوده نجف‌آباد انجام می‌شود.</div><button class="primary" id="fixSubmit">ثبت نهایی سفارش</button><div id="fixMsg"></div></div>');
  const s=document.createElement('style');s.textContent='.checkout-fix .fieldInput{width:100%;padding:13px;border:1px solid #d9e3df;border-radius:13px;outline:0;background:#fff}.checkout-fix .fieldInput:focus{border-color:#008d4f}.checkout-fix .field{margin:10px 0}.checkout-fix .field label{display:block;font-size:13px;font-weight:900;margin-bottom:6px}.checkout-fix .notice{padding:12px;background:#eef9f3;border-radius:12px;margin:12px 0;color:#176b43;font-size:13px}';document.head.appendChild(s);
  document.getElementById('fixSubmit').onclick=submitFixedOrder;
 };
 async function submitFixedOrder(){
  const msg=document.getElementById('fixMsg');const name=document.getElementById('fixName').value.trim();const phone=document.getElementById('fixPhone').value.trim();const address=document.getElementById('fixAddress').value.trim();const note=document.getElementById('fixNote').value.trim();
  if(!name||!phone||!address){msg.innerHTML='<div class="err">نام، شماره موبایل و آدرس را کامل کنید.</div>';return;}
  const {data:{session}}=await cfg.auth.getSession();
  if(!session){msg.innerHTML='<div class="err">برای ثبت سفارش ابتدا وارد حساب شوید.</div>';return;}
  const userId=session.user.id;
  msg.innerHTML='<div class="notice">در حال ثبت آدرس و سفارش...</div>';
  const pr=await cfg.from('profiles').upsert({id:userId,full_name:name,phone:phone},{onConflict:'id'});if(pr.error){msg.innerHTML='<div class="err">خطا در ذخیره اطلاعات مشتری: '+pr.error.message+'</div>';return;}
  const ar=await cfg.from('addresses').insert({user_id:userId,title:'آدرس منزل',address:address,address_text:address,is_default:true}).select('id').single();
  if(ar.error){msg.innerHTML='<div class="err">خطا در ذخیره آدرس: '+ar.error.message+'</div>';return;}
  const items=Object.values(window.cart||{}).map(x=>({product_id:Number(x.p.id),quantity:Number(x.qty)})).filter(x=>Number.isFinite(x.product_id));
  if(!items.length){msg.innerHTML='<div class="err">سبد خرید خالی است.</div>';return;}
  const or=await cfg.rpc('place_order',{p_address_id:ar.data.id,p_items:items,p_note:note});
  if(or.error){msg.innerHTML='<div class="err">خطا در ثبت سفارش: '+or.error.message+'</div>';return;}
  window.cart={};localStorage.removeItem('dastchin_cart');if(typeof renderCart==='function')renderCart();
  document.getElementById('modalContent').innerHTML='<div class="checkout-fix"><h2>سفارش با موفقیت ثبت شد ✅</h2><div class="success">شماره سفارش: <b>'+or.data+'</b><br>سفارش شما ثبت شد و در پنل مدیریت قابل مشاهده است.</div><br><button class="primary" onclick="closeModal()">بازگشت به فروشگاه</button></div>';
 }
 setTimeout(function(){
   const b=document.getElementById('checkout');if(b)b.onclick=function(){window.checkout()};
   const m=document.getElementById('menuBtn');if(m)m.onclick=function(){openPanel('drawer')};
   const c=document.getElementById('cartBtn');if(c)c.onclick=function(){openPanel('cart')};
   const cn=document.getElementById('cartNav');if(cn)cn.onclick=function(){openPanel('cart')};
   const ov=document.getElementById('overlay');if(ov)ov.onclick=closePanels;
   const cm=document.getElementById('closeMenu');if(cm)cm.onclick=closePanels;
   const cc=document.getElementById('closeCart');if(cc)cc.onclick=closePanels;
   const acc=document.getElementById('accountBtn');if(acc)acc.onclick=function(){openModal('<div><h2>حساب کاربری</h2><p class="hint">برای ادامه خرید و ثبت سفارش وارد حساب خود شوید.</p><button class="primary" onclick="closeModal();document.getElementById(\'loginMenu\').click()">ورود / ثبت‌نام</button></div>')};
 },800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,50));else setTimeout(boot,50);
})();