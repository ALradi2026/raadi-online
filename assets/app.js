// assets/app.js
// نسخة مبسطة تعمل محلياً في المتصفح: عرض منتجات، إضافة للسلة، عداد السلة، وتخزين في localStorage

const App = (function(){
  // بيانات منتجات مبدئية
  const PRODUCTS = [
    {id:1,sku:'RA-001',title:'ساعة رعدي كلاسيك',price:299,old_price:399,image:'design/logo.png',stock:10,desc:'ساعة فاخرة بتصميم عربي'},
    {id:2,sku:'RA-002',title:'سماعات رعدي برو',price:149,old_price:199,image:'https://picsum.photos/seed/p2/600/400',stock:25,desc:'سماعات صوتية نقية'},
    {id:3,sku:'RA-003',title:'عطر الرعدي الذهبي',price:89,old_price:129,image:'https://picsum.photos/seed/p3/600/400',stock:50,desc:'عطر شرقي فاخر'},
    {id:4,sku:'RA-004',title:'حقيبة سفر رعدي',price:199,old_price:249,image:'https://picsum.photos/seed/p4/600/400',stock:8,desc:'حقيبة متينة وعصرية'}
  ];

  const KEY_CART = 'raadi_cart_v1';

  function read(key){ try{ return JSON.parse(localStorage.getItem(key)||'null'); }catch(e){return null} }
  function write(key,val){ localStorage.setItem(key,JSON.stringify(val)); }

  function getCart(){ return read(KEY_CART) || []; }
  function saveCart(cart){ write(KEY_CART,cart); }

  function addToCart(productId,qty=1){
    const cart = getCart();
    const item = cart.find(i=>i.id==productId);
    if(item) item.qty += qty; else cart.push({id:productId,qty});
    saveCart(cart);
    updateCartCount();
    showToast('أضيف المنتج إلى السلة');
  }

  function updateCartCount(){
    const el = document.getElementById('cartCount');
    if(!el) return;
    const count = getCart().reduce((s,i)=>s+i.qty,0);
    el.textContent = count;
  }

  function renderProducts(list = PRODUCTS){
    const container = document.getElementById('products');
    if(!container) return;
    container.innerHTML = '';
    list.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}" />
        <h4>${p.title}</h4>
        <div class="muted">SKU: ${p.sku}</div>
        <div class="price">${p.price} ر.س <span class="muted" style="text-decoration:line-through;margin-right:8px">${p.old_price} ر.س</span></div>
        <div style="margin-top:auto;display:flex;gap:8px">
          <button class="btn-primary" data-id="${p.id}">أضف للسلة</button>
          <button class="btn-secondary view" data-id="${p.id}">عرض</button>
        </div>
      `;
      container.appendChild(card);
    });
    // ربط الأزرار
    document.querySelectorAll('.btn-primary').forEach(b=>{
      b.onclick = ()=> addToCart(parseInt(b.dataset.id),1);
    });
    document.querySelectorAll('.view').forEach(b=>{
      b.onclick = ()=> {
        const id = b.dataset.id;
        // نفتح صفحة المنتج (لم تُنشأ بعد) أو نعرض تنبيه مؤقت
        alert('سيتم إضافة صفحة تفاصيل المنتج لاحقاً. معرف المنتج: ' + id);
      };
    });
  }

  function showToast(msg){
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position='fixed';
    t.style.left='50%';
    t.style.transform='translateX(-50%)';
    t.style.bottom='24px';
    t.style.background='#111';
    t.style.color='#fff';
    t.style.padding='10px 16px';
    t.style.borderRadius='8px';
    t.style.zIndex=9999;
    document.body.appendChild(t);
    setTimeout(()=> t.remove(),1800);
  }

  // تهيئة عند تحميل الصفحة
  function init(){
    document.addEventListener('DOMContentLoaded', ()=>{
      renderProducts();
      updateCartCount();
      const cartBtn = document.getElementById('cartBtn');
      if(cartBtn) cartBtn.onclick = ()=> location.href = 'cart.html';
      const accountBtn = document.getElementById('accountBtn');
      if(accountBtn) accountBtn.onclick = ()=> location.href = 'login.html';
      const search = document.getElementById('searchInput');
      if(search) search.oninput = (e)=> {
        const q = e.target.value.trim().toLowerCase();
        if(!q) return renderProducts();
        const filtered = PRODUCTS.filter(p=> p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
        renderProducts(filtered);
      };
    });
  }

  return { init, addToCart, updateCartCount };
})();

App.init();
