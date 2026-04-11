// --- 1. CONTROLE DO MENU LATERAL (DIREITA) ---
const menuToggle = document.getElementById('menu-toggle');
const menuSide = document.getElementById('menu-side');
const closeMenu = document.getElementById('close-menu');

if (menuToggle && menuSide) {
    menuToggle.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation(); // Evita que o clique feche o menu imediatamente
        menuSide.classList.add('active');
    };
}

if (closeMenu) {
    closeMenu.onclick = function() {
        menuSide.classList.remove('active');
    };
}

// Fechar ao clicar fora do menu
document.addEventListener('click', function(e) {
    if (menuSide && menuSide.classList.contains('active')) {
        if (!menuSide.contains(e.target) && !menuToggle.contains(e.target)) {
            menuSide.classList.remove('active');
        }
    }
});

// --- 2. BANNER ROTATIVO AUTOMÁTICO ---
let currentBanner = 0;
const banners = document.querySelectorAll('.banner-img');

function nextBanner() {
    if (banners.length > 1) {
        banners[currentBanner].classList.remove('active');
        currentBanner = (currentBanner + 1) % banners.length;
        banners[currentBanner].classList.add('active');
    }
}

if (banners.length > 0) {
    setInterval(nextBanner, 4000);
}

// --- 3. LÓGICA DO CARRINHO ---
let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];

function adicionarAoCarrinho(nome, preco, imagem) {
    const item = { nome, preco, imagem };
    carrinho.push(item);
    localStorage.setItem('perfetto_cart', JSON.stringify(carrinho));
    
    atualizarBadge();
    showPush(`✨ ${nome} adicionado ao carrinho!`);
}

function atualizarBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = carrinho.length;
    }
}

// Função para o clique no ícone do carrinho (Redireciona ou abre painel)
function toggleCart() {
    // Se você tiver uma página de carrinho:
    window.location.href = 'carrinho.html'; 
    // Caso queira apenas um aviso por enquanto, use: showPush("🛒 Seu carrinho está sendo carregado...");
}

// --- 4. LÓGICA DE FAVORITOS ---
function toggleFavorito(botao, nomeProduto) {
    const icone = botao.querySelector('i');
    botao.classList.toggle('active');
    
    if (botao.classList.contains('active')) {
        icone.classList.replace('far', 'fas');
        showPush(`💜 ${nomeProduto} salvo nos favoritos!`);
    } else {
        icone.classList.replace('fas', 'far');
        showPush(`💔 ${nomeProduto} removido.`);
    }
}

// --- 5. NOTIFICAÇÃO PUSH ---
function showPush(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%;
        transform: translateX(-50%); background: #2e1f4a;
        color: white; padding: 12px 25px; border-radius: 50px;
        z-index: 10000; font-family: 'Poppins', sans-serif;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        transition: opacity 0.5s ease;
        pointer-events: none;
    `;
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

// Inicializa o contador quando a página carrega
document.addEventListener('DOMContentLoaded', atualizarBadge);