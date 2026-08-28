window.DASTCHIN_SUPABASE_URL='https://ydfjpwofursqdxtjnvdw.supabase.co';
window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY='sb_publishable_hkQHmGJCe3Mm96JvIn6QEg_N5dqCMhV';

document.addEventListener('DOMContentLoaded',function(){
const s=document.createElement('style');s.textContent=`
/* FINAL COMPACT GREEN HEADER */
.header{height:72px!important;background:#008d4f!important;border-radius:0 0 16px 16px!important;box-shadow:none!important;overflow:hidden!important}
.header:after{display:none!important}
.brand{display:grid!important;position:absolute!important;z-index:4!important;left:50%!important;top:2px!important;transform:translateX(-50%)!important;width:150px!important;height:68px!important;place-items:center!important;pointer-events:none!important}
.brand img{width:145px!important;height:64px!important;object-fit:contain!important}
.hamb{right:16px!important;top:14px!important;z-index:20!important}.hamb i{height:4px!important;margin:6px 0!important}
.account{left:16px!important;top:9px!important;width:52px!important;height:52px!important;z-index:20!important}
.topcart{left:74px!important;top:18px!important;z-index:20!important}
.hero{margin:0 0 14px!important;border-radius:0 0 22px 22px!important;overflow:hidden!important;box-shadow:none!important}
.hero img{width:100%!important;height:auto!important;aspect-ratio:auto!important;object-fit:cover!important;display:block!important}
.pimg{overflow:hidden!important}.pimg img{max-width:100%!important;max-height:100%!important;object-fit:contain!important}
.adminActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.adminAction{border:0;border-radius:10px;padding:8px 10px;font-weight:900;cursor:pointer}.adminAdd{background:#008d4f;color:#fff}.adminEnable{background:#eaf7f0;color:#087a4b}.adminDisable{background:#fff3df;color:#9a6200}.adminDelete{background:#ef3c3c;color:#fff}
.adminForm{background:#f7faf9;border:1px solid #e1ebe7;border-radius:16px;padding:12px;margin-bottom:14px}.adminForm input,.adminForm select{width:100%;padding:10px;margin:5px 0;border:1px solid #d8e3df;border-radius:10px}.adminForm button{width:100%;padding:11px;border:0;border-radius:11px;background:#008d4f;color:#fff;font-weight:900;margin-top:6px}
@media(max-width:760px){.header{height:68px!important}.brand{height:64px!important;width:145px!important}.brand img{height:60px!important}.hamb{top:13px!important}.account{top:8px!important}.topcart{top:17px!important}.hero{margin:0 0 12px!important}}
`;document.head.appendChild(s);

if(location.pathname.endsWith('/admin.html')||location.pathname.endsWith('admin.html')){
const sb=supabase.createClient(window.DASTCHIN_SUPABASE_URL,window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const getAdmin=async()=>{const {data:{session}}=await sb.auth.getSession();if(!session)return null;const {data:me}=await sb.from('profiles').select('role').eq('id',session.user.id).single();return me?.role==='admin'?session:null};
const addAdminControls=async()=>{if(!await getAdmin())return;const panel=document.getElementById('products');if(!panel)return;
if(!document.getElementById('adminProductForm')){const form=document.createElement('div');form.id='adminProductForm';form.className='adminForm';form.innerHTML='<b>افزودن محصول جدید</b><input id="apName" placeholder="نام محصول"><input id="apPrice" type="number" placeholder="قیمت (تومان)"><input id="apStock" type="number" placeholder="موجودی" value="0"><input id="apCategory" placeholder="دسته‌بندی" value="لبنیات"><input id="apUnit" placeholder="واحد / توضیح کوتاه"><input id="apImage" placeholder="آدرس تصویر (اختیاری)"><button id="apSave">＋ افزودن محصول جدید</button><div id="apMsg" class="muted"></div>';panel.insertBefore(form,panel.children[1]||null);document.getElementById('apSave').onclick=async()=>{const name=document.getElementById('apName').value.trim();const price=Number(document.getElementById('apPrice').value);const stock=Number(document.getElementById('apStock').value||0);const category=document.getElementById('apCategory').value.trim()||'لبنیات';const unit=document.getElementById('apUnit').value.trim();const image=document.getElementById('apImage').value.trim();const msg=document.getElementById('apMsg');if(!name||!price){msg.textContent='نام و قیمت الزامی است.';return}const r=await sb.from('products').insert({name,price,stock,category,unit,image_url:image||null,active:true,is_active:true,sort_order:999});if(r.error){msg.textContent='خطا: '+r.error.message;return}msg.textContent='محصول با موفقیت اضافه شد.';['apName','apPrice','apStock','apUnit','apImage'].forEach(id=>document.getElementById(id).value='');setTimeout(()=>location.reload(),500)}}
const rows=Array.from(document.querySelectorAll('#productsList .product'));for(const row of rows){if(row.querySelector('.adminActions'))continue;const b=row.querySelector('b');if(!b)continue;const name=b.textContent.trim();const action=document.createElement('div');action.className='adminActions';action.innerHTML='<button class="adminAction adminEnable">فعال‌سازی</button><button class="adminAction adminDisable">غیرفعال‌سازی</button><button class="adminAction adminDelete">حذف محصول</button>';row.appendChild(action);action.querySelector('.adminEnable').onclick=()=>setProduct(name,true);action.querySelector('.adminDisable').onclick=()=>setProduct(name,false);action.querySelector('.adminDelete').onclick=()=>deleteProduct(name)}
};
const findId=async name=>{const r=await sb.from('products').select('id').eq('name',name).limit(1).maybeSingle();return r.data?.id};
const setProduct=async(name,active)=>{const id=await findId(name);if(!id){alert('محصول پیدا نشد.');return}const r=await sb.from('products').update({active,is_active:active}).eq('id',id);if(r.error)alert('خطا: '+r.error.message);else location.reload()};
const deleteProduct=async name=>{if(!confirm('محصول «'+name+'» حذف شود؟'))return;const id=await findId(name);if(!id){alert('محصول پیدا نشد.');return}const r=await sb.from('products').update({active:false,is_active:false}).eq('id',id);if(r.error)alert('خطا: '+r.error.message);else location.reload()};
const watch=()=>setTimeout(addAdminControls,900);watch();setInterval(addAdminControls,5000);
}

const refresh=async()=>{try{if(typeof supabase==='undefined'||!window.DASTCHIN_SUPABASE_URL)return;const sb2=supabase.createClient(window.DASTCHIN_SUPABASE_URL,window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY);const r=await sb2.from('products').select('*').eq('active',true).order('sort_order').order('created_at',{ascending:false});if(!r.error&&Array.isArray(r.data)&&typeof renderProducts==='function'){products=r.data;renderProducts()}}catch(e){console.warn(e)}};
setTimeout(refresh,600);setInterval(refresh,10000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
});