const products = [
  { id: 1, name: "Conjunto Lilás", price: 200, category: "conjuntos", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=500" },
  { id: 2, name: "Blusa Floral", price: 120, category: "blusas", img: "https://images.unsplash.com/photo-1564252261158-4dd0f2159bd0?q=80&w=500" },
  { id: 3, name: "Short Jeans", price: 90, category: "shorts", img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=500" },
  { id: 4, name: "Saia Longa", price: 150, category: "saias", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=500" }
];

// Carrega carrinho do navegador ou inicia vazio
let cart = JSON.parse(localStorage.getItem('perfetto_cart')) || [];

function renderProducts() {
  const grids = ["featured-grid", "conjuntos-grid", "blusas-grid", "shorts-grid", "saias-grid"];
  
  grids.forEach(gridId => {
    const element = document.getElementById(gridId);
    if (!element) return;

    if (gridId === "featured-grid") {
      element.innerHTML = products.map(p => createCard(p)).join("");
    } else {
      const cat = gridId.replace("-grid", "");
      element.innerHTML = products.filter(p => p.category === cat).map(createCard).join("");
    }
  });
  updateCartUI();
}

function createCard(p) {
  return `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>R$ ${p.price.toFixed(2)}</p>
      <button class="btn-primary" onclick="addToCart(${p.id})">Adicionar à Sacola</button>
    </div>
  `;
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  localStorage.setItem('perfetto_cart', JSON.stringify(cart));
  updateCartUI();
  toggleCart(true);
}

function updateCartUI() {
  const badge = document.getElementById("cart-badge");
  const list = document.getElementById("cart-items");
  if(badge) badge.innerText = cart.length;
  if(list) {
    list.innerHTML = cart.map((item, index) => `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
        <span>${item.name}</span>
        <b>R$ ${item.price}</b>
        <button onclick="removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer;">X</button>
      </div>
    `).join("");
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('perfetto_cart', JSON.stringify(cart));
  updateCartUI();
}

function toggleCart(forceOpen = false) {
  const sidebar = document.getElementById("cart-sidebar");
  if(forceOpen) sidebar.classList.add("open");
  else sidebar.classList.toggle("open");
}

function navigate(page) {
  const target = document.getElementById("page-" + page);
  if (target) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    target.classList.add("active");
  } else {
    // Se você estiver em uma subpasta, ele volta para a raiz e entra na pasta certa
    window.location.href = window.location.origin + "/" + page;
  }
}

function checkout() {
  alert("Pedido enviado para o WhatsApp da Perfetto!");
  cart = [];
  localStorage.removeItem('perfetto_cart');
  updateCartUI();
  toggleCart();
}

document.addEventListener("DOMContentLoaded", renderProducts);
function showPush(message) {
    // 1. Cria o Estilo CSS dinamicamente (se ainda não existir)
    if (!document.getElementById('push-style')) {
        const style = document.createElement('style');
        style.id = 'push-style';
        style.innerHTML = `
            .push-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                color: #2e1f4a;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                border-left: 6px solid #9b72cf;
                z-index: 10000;
                font-family: sans-serif;
                display: flex;
                align-items: center;
                gap: 12px;
                animation: pushIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            @keyframes pushIn {
                from { transform: translateX(120%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .push-fadeOut {
                animation: pushOut 0.5s ease forwards;
            }
            @keyframes pushOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(120%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Cria o elemento da Notificação
    const toast = document.createElement('div');
    toast.className = 'push-toast';
    toast.innerHTML = `
        <span style="font-size: 20px;">🛍️</span>
        <div style="display: flex; flex-direction: column;">
            <strong style="font-size: 14px; color: #9b72cf;">Perfetto Store</strong>
            <span style="font-size: 13px;">${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // 3. Remove automaticamente após 3 segundos
    setTimeout(() => {
        toast.classList.add('push-fadeOut');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Para testar, basta chamar:
// showPush("Conjunto Lilás adicionado!");