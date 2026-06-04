// --- 1. CONTROLE DO MENU LATERAL (ESQUERDA) ---
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
        document.getElementById('bg-overlay').classList.remove('active');
    };
}


// Fechar ao clicar fora do menu
document.addEventListener('click', function(e) {
    if (menuSide && menuSide.classList.contains('active')) {
        if (!menuSide.contains(e.target) && !menuToggle.contains(e.target)) {
            menuSide.classList.remove('active');
            document.getElementById('bg-overlay').classList.remove('active');
        }
    }
});


// Fechar ao clicar no overlay
const overlay = document.getElementById('bg-overlay');
if (overlay) {
    overlay.onclick = function() {
        menuSide.classList.remove('active');
        overlay.classList.remove('active');
    };
}

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


// --- 4. LÓGICA DE FAVORITOS SIMPLES (ORIGINAL) ---
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


// --- 6. LÓGICA DE FAVORITOS COMPLETA (NOVO) ---
let favoritos = JSON.parse(localStorage.getItem('perfetto_favorites')) || [];

// Atualizar favoritos quando carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarBadge();
    carregarFavoritos();
});

// Versão atualizada da função toggleFavorito que salva no localStorage
function toggleFavorito(botao, nomeProduto, imagem = '', preco = 0) {
    const icone = botao.querySelector('i');
    const index = favoritos.findIndex(f => f.nome === nomeProduto);
    
    if (index === -1) {
        // Adicionar favorito
        favoritos.push({ nome: nomeProduto, imagem, preco });
        botao.classList.add('active');
        icone.classList.replace('far', 'fas');
        showPush(`💜 ${nomeProduto} salvo nos favoritos!`);
    } else {
        // Remover favorito
        favoritos.splice(index, 1);
        botao.classList.remove('active');
        icone.classList.replace('fas', 'far');
        showPush(`💔 ${nomeProduto} removido.`);
    }
    
    localStorage.setItem('perfetto_favorites', JSON.stringify(favoritos));
    carregarFavoritos();
}

function carregarFavoritos() {
    const lista = document.getElementById('lista-favoritos');
    if (!lista) return;
    
    lista.innerHTML = '';
    
    if (favoritos.length === 0) {
        lista.innerHTML = '<p class="fav-empty">Você ainda não tem favoritos.</p>';
        return;
    }
    
    favoritos.forEach(item => {
        const favItem = document.createElement('a');
        favItem.className = 'fav-item';
        favItem.href = 'produto.html';
        favItem.innerHTML = `
            <img src="${item.imagem || 'img/placeholder.jpg'}" alt="${item.nome}">
            <div class="fav-item-info">
                <p class="fav-item-name">${item.nome}</p>
                <p class="fav-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
            </div>
            <button class="fav-remove" onclick="removerFavorito('${item.nome}', event)">
                <i class="fas fa-times"></i>
            </button>
        `;
        lista.appendChild(favItem);
    });
}

function removerFavorito(nomeProduto, event) {
    event.preventDefault();
    event.stopPropagation();
    
    const index = favoritos.findIndex(f => f.nome === nomeProduto);
    if (index !== -1) {
        favoritos.splice(index, 1);
        localStorage.setItem('perfetto_favorites', JSON.stringify(favoritos));
        carregarFavoritos();
        showPush(`💔 ${nomeProduto} removido dos favoritos.`);
    }
}


// Inicializa o contador quando a página carrega
document.addEventListener('DOMContentLoaded', atualizarBadge);