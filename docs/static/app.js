
const state = {
  products: [],
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
};

function q(sel, root=document){ return root.querySelector(sel); }
function qa(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function formatINR(n){ return `₹${(Math.round(n * 100)/100).toFixed(2)}`; }

function saveCart(){ localStorage.setItem('cart', JSON.stringify(state.cart)); updateCartBadge(); }
function updateCartBadge(){ const el=q('#cartCount'); if(el){ el.textContent = state.cart.reduce((s,i)=>s+i.qty,0); } }

async function loadProducts(){
  const res = await fetch('products.json');
  state.products = await res.json();
}

function renderProducts(list, mount){
  mount.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <div class="product-meta">
        <div>
          <div class="price">${formatINR(p.price)}</div>
          ${p.tag ? `<span class="tag">${p.tag}</span>`: ''}
        </div>
        <button class="btn primary" data-id="${p.id}">Add</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', ()=> addToCart(p.id));
    mount.appendChild(card);
  });
}

function addToCart(id){
  const p = state.products.find(x=>x.id===id);
  const existing = state.cart.find(x=>x.id===id);
  if(existing) existing.qty += 1; else state.cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
  saveCart();
  openCart();
  renderCart();
}

function openCart(){ q('#cartDrawer')?.classList.add('open'); q('#cartDrawer')?.setAttribute('aria-hidden','false'); }
function closeCart(){ q('#cartDrawer')?.classList.remove('open'); q('#cartDrawer')?.setAttribute('aria-hidden','true'); }

function renderCart(){
  const wrap = q('#cartItems'); if(!wrap) return;
  wrap.innerHTML = '';
  let subtotal = 0;
  state.cart.forEach(item=>{
    subtotal += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <div>${item.name}</div>
        <div class="price">${formatINR(item.price)}</div>
      </div>
      <div>
        <div class="qty">
          <button aria-label="Decrease">-</button>
          <span>${item.qty}</span>
          <button aria-label="Increase">+</button>
        </div>
      </div>`;
    const [dec, , inc] = qa('button', row);
    dec.addEventListener('click', ()=>{ item.qty = Math.max(0, item.qty-1); if(item.qty===0){ state.cart = state.cart.filter(x=>x.id!==item.id);} saveCart(); renderCart(); });
    inc.addEventListener('click', ()=>{ item.qty += 1; saveCart(); renderCart(); });
    wrap.appendChild(row);
  });
  const subtotalEl = q('#cartSubtotal');
  if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);
}

function initHeader(){
  const y = new Date().getFullYear(); const yearEl=q('#year'); if(yearEl) yearEl.textContent = y;
  q('#cartButton')?.addEventListener('click', openCart);
  q('#closeCart')?.addEventListener('click', closeCart);
  q('#checkoutBtn')?.addEventListener('click', async ()=>{
    const res = await fetch('/api/order', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items: state.cart }) });
    const data = await res.json();
    alert('Order received (demo). Response: '+JSON.stringify(data));
  });
}

async function initHomepage(){
  const mount = q('#featuredGrid');
  if(!mount) return;
  await loadProducts();
  const featured = state.products.slice(0, 3);
  renderProducts(featured, mount);
}

async function initShop(){
  const mount = q('#productGrid');
  if(!mount) return;
  await loadProducts();
  let current = [...state.products];
  const search = q('#search'); const sort = q('#sort');
  function apply(){
    const term = (search?.value || '').toLowerCase();
    current = state.products.filter(p => p.name.toLowerCase().includes(term));
    const s = sort?.value;
    if(s==='price-asc') current.sort((a,b)=>a.price-b.price);
    else if(s==='price-desc') current.sort((a,b)=>b.price-a.price);
    renderProducts(current, mount);
  }
  search?.addEventListener('input', apply);
  sort?.addEventListener('change', apply);
  apply();
}

function bootstrap(){
  updateCartBadge();
  initHeader();
  initHomepage();
  initShop();
  renderCart();
}
document.addEventListener('DOMContentLoaded', bootstrap);
