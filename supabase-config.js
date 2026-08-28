window.DASTCHIN_SUPABASE_URL='https://ydfjpwofursqdxtjnvdw.supabase.co';
window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY='sb_publishable_hkQHmGJCe3Mm96JvIn6QEg_N5dqCMhV';

document.addEventListener('DOMContentLoaded',function(){
const s=document.createElement('style');s.textContent=`
.header{height:76px!important;background:#008d4f!important;border-radius:0 0 18px 18px!important;box-shadow:none!important;overflow:hidden!important}
.header:after{display:none!important}
.brand{display:none!important}
.hamb{right:18px!important;top:18px!important;z-index:20!important}.hamb i{height:4px!important;margin:6px 0!important}
.account{left:18px!important;top:10px!important;width:54px!important;height:54px!important;z-index:20!important}
.topcart{left:80px!important;top:22px!important;z-index:20!important}
.hero{margin:0!important;border-radius:0 0 24px 24px!important;overflow:hidden!important;box-shadow:none!important}
.hero img{width:100%!important;height:auto!important;aspect-ratio:auto!important;object-fit:cover!important;display:block!important}
.pimg{overflow:hidden!important}.pimg img{max-width:100%!important;max-height:100%!important;object-fit:contain!important}
.adminDeleteBtn{background:#ef3c3c!important;color:#fff!important;border-radius:10px!important;padding:8px 10px!important;font-weight:900!important;margin-top:7px!important}
@media(max-width:760px){.header{height:70px!important}.hamb{top:15px!important}.account{top:8px!important}.topcart{top:19px!important}.hero{margin:0!important}.hero img{width:100%!important;height:auto!important;object-fit:cover!important}}
`;document.head.appendChild(s);

if(location.pathname.endsWith('/admin.html')||location.pathname.endsWith('admin.html')){
const addDelete=()=>{document.querySelectorAll('#productsList .product').forEach(row=>{if(row.querySelector('.adminDeleteBtn'))return;const img=row.querySelector('img');const id=img&&img.closest('.product')?.querySelector('[data-product-id]')?.dataset.productId;const text=row.querySelector('b');if(!text)return;const name=text.textContent.trim();const b=document.createElement('button');b.className='adminDeleteBtn';b.type='button';b.textContent='حذف محصول';b.dataset.name=name;b.onclick=async()=>{if(!confirm('محصول «'+name+'» حذف شود؟'))return;const sb=supabase.createClient(window.DASTCHIN_SUPABASE_URL,window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true}});const {data:{session}}=await sb.auth.getSession();if(!session){alert('ابتدا وارد مدیریت شوید.');return}const {data:me}=await sb.from('profiles').select('role').eq('id',session.user.id).single();if(me?.role!=='admin'){alert('دسترسی مدیریت ندارید.');return}const {data:p}=await sb.from('products').select('id').eq('name',name).limit(1).maybeSingle();if(!p){alert('محصول پیدا نشد.');return}const r=await sb.from('products').update({active:false,is_active:false}).eq('id',p.id);if(r.error){alert('خطا: '+r.error.message);return}row.remove();};row.appendChild(b)})};
setTimeout(addDelete,1200);new MutationObserver(addDelete).observe(document.getElementById('productsList')||document.body,{childList:true,subtree:true});
}

const refresh=async()=>{try{if(typeof supabase==='undefined'||!window.DASTCHIN_SUPABASE_URL)return;const sb=supabase.createClient(window.DASTCHIN_SUPABASE_URL,window.DASTCHIN_SUPABASE_PUBLISHABLE_KEY);const r=await sb.from('products').select('*').eq('active',true).order('sort_order').order('created_at',{ascending:false});if(!r.error&&Array.isArray(r.data)&&typeof renderProducts==='function'){products=r.data;renderProducts()}}catch(e){console.warn(e)}};
setTimeout(refresh,600);setInterval(refresh,10000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
});