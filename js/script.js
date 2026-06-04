let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
let favoritos = JSON.parse(localStorage.getItem('perfetto_favorites')) || [];
let currentBanner = 0;

const menuToggle = document.getElementById('menu-toggle');
const menuSide = document.getElementById('menu-side');
const closeMenu = document.getElementById('close-menu');
const overlay = document.getElementById('bg-overlay');
const banners = document.querySelectorAll('.banner-img');

function openMenu() {
    if (!menuSide) return;
    menuSide.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

function closeMenuFn() {
    if (!menuSide) return;
    menuSide.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

if (menuToggle && menuSide) {
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMenu();
    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', closeMenuFn);
}

if (overlay) {
    overlay.addEventListener('click', closeMenuFn);
}

document.addEventListener('click', function(e) {
    if (!menuSide || !menuToggle) return;
    if (menuSide.classList.contains('active')) {
        if (!menuSide.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenuFn();
        }
    }
});

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

function salvarCarrinho() {
    localStorage.setItem('perfetto_cart', JSON.stringify(carrinho));
}

function salvarFavoritos() {
    localStorage.setItem('perfetto_favorites', JSON.stringify(favoritos));
}

function atualizarBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = carrinho.length;
    }
}

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
        max-width: calc(100vw - 30px);
        text-align: center;
    `;
    toast.innerHTML = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

function adicionarAoCarrinho(nome, preco, imagem) {
    carrinho.push({ nome, preco, imagem });
    salvarCarrinho();
    atualizarBadge();
    showPush(`✨ ${nome} adicionado ao carrinho!`);
}

function toggleCart() {
    window.location.href = 'carrinho.html';
}

function produtoJaFavorito(nomeProduto) {
    return favoritos.findIndex(f => f.nome === nomeProduto);
}

function toggleFavorito(botao, nomeProduto, imagem = '', preco = 0) {
    const icone = botao.querySelector('i');
    const index = produtoJaFavorito(nomeProduto);

    if (index === -1) {
        favoritos.push({ nome: nomeProduto, imagem, preco });
        botao.classList.add('active');
        if (icone) {
            icone.classList.remove('far');
            icone.classList.add('fas');
        }
        showPush(`💜 ${nomeProduto} salvo nos favoritos!`);
    } else {
        favoritos.splice(index, 1);
        botao.classList.remove('active');
        if (icone) {
            icone.classList.remove('fas');
            icone.classList.add('far');
        }
        showPush(`💔 ${nomeProduto} removido.`);
    }

    salvarFavoritos();
    carregarFavoritos();
}

function removerFavorito(nomeProduto, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const index = produtoJaFavorito(nomeProduto);
    if (index !== -1) {
        favoritos.splice(index, 1);
        salvarFavoritos();
        carregarFavoritos();
        showPush(`💔 ${nomeProduto} removido dos favoritos.`);
    }
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
                <p class="fav-item-price">R$ ${Number(item.preco || 0).toFixed(2).replace('.', ',')}</p>
            </div>
            <button class="fav-remove" onclick="removerFavorito('${item.nome}', event)">
                <i class="fas fa-times"></i>
            </button>
        `;
        lista.appendChild(favItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    atualizarBadge();
    carregarFavoritos();
});