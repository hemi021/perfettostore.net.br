// Controle do Menu
const menuToggle = document.getElementById('menu-toggle');
const menuSide = document.getElementById('menu-side');
const closeMenu = document.getElementById('close-menu');

if(menuToggle) {
    menuToggle.onclick = () => menuSide.classList.add('active');
}
if(closeMenu) {
    closeMenu.onclick = () => menuSide.classList.remove('active');
}

// Lógica de Carrinho Persistente
let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];

function adicionarAoCarrinho(nome, preco, imagem) {
    const item = { nome, preco, imagem };
    carrinho.push(item);
    localStorage.setItem('perfetto_cart', JSON.stringify(carrinho));
    
    atualizarBadge();
    showPush(`✨ ${nome} adicionado!`);
}

function atualizarBadge() {
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = carrinho.length;
}

// Notificação Push elegante
function showPush(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: white; border-left: 5px solid #957DAD;
        padding: 15px 25px; border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        z-index: 9999; font-family: sans-serif;
    `;
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}

// Inicia o contador ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarBadge);