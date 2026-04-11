// --- CONTROLE DO MENU LATERAL (DIREITA) ---
const menuToggle = document.getElementById('menu-toggle');
const menuSide = document.getElementById('menu-side');
const closeMenu = document.getElementById('close-menu');

if(menuToggle) {
    menuToggle.onclick = () => menuSide.classList.add('active');
}
if(closeMenu) {
    closeMenu.onclick = () => menuSide.classList.remove('active');
}

// Fechar ao clicar fora do menu
document.addEventListener('click', (e) => {
    if (menuSide && menuSide.classList.contains('active')) {
        if (!menuSide.contains(e.target) && !menuToggle.contains(e.target)) {
            menuSide.classList.remove('active');
        }
    }
});

// --- LÓGICA DE CARRINHO PERSISTENTE ---
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
    if(badge) badge.innerText = carrinho.length;
}

// --- LÓGICA DE FAVORITOS ---
function toggleFavorito(botao, nomeProduto) {
    const icone = botao.querySelector('i');
    botao.classList.toggle('active');
    
    if (botao.classList.contains('active')) {
        icone.classList.replace('far', 'fas'); // Coração preenchido
        showPush(`💜 ${nomeProduto} adicionado aos favoritos!`);
    } else {
        icone.classList.replace('fas', 'far'); // Coração vazio
        showPush(`💔 ${nomeProduto} removido dos favoritos.`);
    }
}

// --- GALERIA E PRODUTO ---
function changeImage(element) {
    const mainImg = document.getElementById('mainImg');
    if(mainImg) mainImg.src = element.src;
    
    document.querySelectorAll('.thumb-item').forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

function selectSize(element) {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

// --- BANNER ROTATIVO (SLIDER) ---
let currentBanner = 0;
const banners = document.querySelectorAll('.banner-img');

function nextBanner() {
    if (banners.length > 0) {
        banners[currentBanner].classList.remove('active');
        currentBanner = (currentBanner + 1) % banners.length;
        banners[currentBanner].classList.add('active');
    }
}

if (banners.length > 0) {
    setInterval(nextBanner, 4000); // Troca a cada 4 segundos
}

// --- NOTIFICAÇÃO PUSH ELEGANTE ---
function showPush(msg) {
    const toast = document.createElement('div');
    toast.className = 'push-toast';
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%;
        transform: translateX(-50%); background: #2e1f4a;
        color: white; padding: 12px 25px; border-radius: 50px;
        z-index: 10000; font-size: 14px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-family: 'Poppins', sans-serif;
    `;
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => { 
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500); 
    }, 3000);
}

// Inicializa o badge ao carregar
document.addEventListener('DOMContentLoaded', atualizarBadge);
// --- 1. CONTROLE DO MENU LATERAL (DIREITA) ---
const menuToggle = document.getElementById('menu-toggle');
const menuSide = document.getElementById('menu-side');
const closeMenu = document.getElementById('close-menu');

if(menuToggle && menuSide) {
    menuToggle.onclick = () => menuSide.classList.add('active');
}
if(closeMenu) {
    closeMenu.onclick = () => menuSide.classList.remove('active');
}

// Fechar menu ao clicar fora dele
document.addEventListener('click', (e) => {
    if (menuSide && menuSide.classList.contains('active')) {
        if (!menuSide.contains(e.target) && !menuToggle.contains(e.target)) {
            menuSide.classList.remove('active');
        }
    }
});

// --- 2. LÓGICA DE CARRINHO PERSISTENTE ---
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
    if(badge) badge.innerText = carrinho.length;
}

// --- 3. LÓGICA DE FAVORITOS ---
function toggleFavorito(botao, nomeProduto) {
    const icone = botao.querySelector('i');
    botao.classList.toggle('active');
    
    if (botao.classList.contains('active')) {
        icone.classList.replace('far', 'fas'); // Coração preenchido
        showPush(`💜 ${nomeProduto} salvo nos favoritos!`);
    } else {
        icone.classList.replace('fas', 'far'); // Coração vazio
        showPush(`💔 ${nomeProduto} removido dos favoritos.`);
    }
}

// --- 4. GALERIA DE PRODUTOS E TAMANHOS ---
function changeImage(element) {
    const mainImg = document.getElementById('mainImg');
    if(mainImg) {
        mainImg.src = element.src;
        document.querySelectorAll('.thumb-item').forEach(thumb => thumb.classList.remove('active'));
        element.classList.add('active');
    }
}

function selectSize(element) {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

// --- 5. BANNER ROTATIVO AUTOMÁTICO ---
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
    setInterval(nextBanner, 4000); // Troca a cada 4 segundos
}

// --- 6. NOTIFICAÇÃO PUSH ELEGANTE ---
function showPush(msg) {
    // Remove toast anterior se existir para não acumular
    const oldToast = document.querySelector('.push-toast');
    if(oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'push-toast';
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%;
        transform: translateX(-50%); background: #2e1f4a;
        color: white; padding: 14px 28px; border-radius: 50px;
        z-index: 10000; font-size: 14px; font-weight: 500;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        font-family: 'Poppins', sans-serif;
        transition: opacity 0.5s ease;
        white-space: nowrap;
    `;
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    
    setTimeout(() => { 
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500); 
    }, 3000);
}

// Inicializar contador ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarBadge);