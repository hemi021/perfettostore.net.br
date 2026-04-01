/* ==========================================
   1. CONFIGURAÇÕES GERAIS E MENU
   ========================================== */
let listaDeProdutos = []; 
let listaFavoritos = JSON.parse(localStorage.getItem('perfetto_favs')) || [];

function inicializarMenu() {
    const btnAbrir = document.getElementById('menu-toggle');
    const btnFechar = document.getElementById('close-menu');
    const menuSide = document.getElementById('menu-side');
    const overlay = document.getElementById('bg-overlay');

    const fechar = () => {
        if(menuSide) menuSide.classList.remove('active');
        if(overlay) overlay.classList.remove('active');
    };

    if (btnAbrir && menuSide) {
        btnAbrir.onclick = () => {
            menuSide.classList.add('active');
            if(overlay) overlay.classList.add('active');
        };
    }

    if (btnFechar) btnFechar.onclick = fechar;
    if (overlay) overlay.onclick = fechar;
}

/* ==========================================
   2. CARROSSEL DE BANNERS (LÓGICA DE TRILHO)
   ========================================== */
let bannerIndex = 0;

function showSlide(n) {
    const container = document.getElementById('carousel-container');
    const slides = document.querySelectorAll('.slide');
    
    if (!container || slides.length === 0) return;

    bannerIndex += n;
    if (bannerIndex >= slides.length) bannerIndex = 0;
    if (bannerIndex < 0) bannerIndex = slides.length - 1;

    // Move o trilho exatamente 100% para cada slide
    container.style.transform = `translateX(${-bannerIndex * 100}%)`;
}

function iniciarCarrossel() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const container = document.getElementById('carousel-container');

    if (nextBtn) nextBtn.onclick = () => showSlide(1);
    if (prevBtn) prevBtn.onclick = () => showSlide(-1);

    // Auto-play a cada 5 segundos
    let autoPlay = setInterval(() => showSlide(1), 5000);

    if (container) {
        container.onmouseenter = () => clearInterval(autoPlay);
        container.onmouseleave = () => autoPlay = setInterval(() => showSlide(1), 5000);
    }
}

/* ==========================================
   3. SISTEMA DE CARRINHO
   ========================================== */
function atualizarContadorTotal() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItens = listaDeProdutos.reduce((soma, item) => soma + item.qtd, 0);
    if (cartCountElement) cartCountElement.innerText = totalItens;
}

// Configura botões de compra da vitrine
function configurarBotoesCompra() {
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(btn => {
        btn.onclick = () => {
            const card = btn.closest('.card');
            if (card) {
                const nome = card.querySelector('h3').innerText;
                const preco = card.querySelector('.price').innerText;
                adicionarAoCarrinho(nome, preco);
                
                btn.innerHTML = "Adicionado! ✓";
                setTimeout(() => { btn.innerHTML = "Eu quero"; }, 800);
            }
        };
    });
}

function adicionarAoCarrinho(nome, preco) {
    const itemExistente = listaDeProdutos.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.qtd += 1;
    } else {
        listaDeProdutos.push({ nome: nome, preco: preco, qtd: 1 });
    }
    atualizarContadorTotal();
}

/* ==========================================
   4. FAVORITOS (WISHLIST)
   ========================================== */
window.toggleFavorito = function(btn, nomeProduto) {
    const card = btn.closest('.card');
    const preco = card.querySelector('.price').innerText;
    const imgUrl = card.querySelector('img').src;
    const index = listaFavoritos.findIndex(item => item.nome === nomeProduto);

    if (index > -1) {
        listaFavoritos.splice(index, 1);
        btn.classList.remove('active');
        btn.querySelector('i').classList.replace('fas', 'far'); 
    } else {
        listaFavoritos.push({ nome: nomeProduto, preco: preco, img: imgUrl });
        btn.classList.add('active');
        btn.querySelector('i').classList.replace('far', 'fas'); 
    }

    localStorage.setItem('perfetto_favs', JSON.stringify(listaFavoritos));
    renderizarFavoritos();
};

function renderizarFavoritos() {
    const container = document.getElementById('lista-favoritos');
    if (!container) return;

    if (listaFavoritos.length === 0) {
        container.innerHTML = `<p style="font-size: 13px; color: #999; text-align: center; padding: 30px;">Sua lista está vazia. 💜</p>`;
        return;
    }

    let html = "";
    listaFavoritos.forEach((item, index) => {
        html += `
            <div class="fav-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #eee; position: relative;">
                <button onclick="removerFavoritoUnico(${index})" style="position: absolute; top: -5px; right: -5px; background: #ff4d4d; color: white; border: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer;">&times;</button>
                <img src="${item.img}" style="width: 50px; height: 60px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1;">
                    <p style="font-size: 12px; margin: 0; font-weight: bold;">${item.nome}</p>
                    <span style="font-size: 11px; color: #957DAD;">${item.preco}</span>
                </div>
                <button onclick="addFavParaCarrinho(${index})" style="background: #f8f8f8; border: none; padding: 8px; border-radius: 50%; color: #957DAD; cursor: pointer;">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>`;
    });
    container.innerHTML = html + `<button onclick="limparTodosFavoritos()" style="width: 100%; padding: 10px; background: none; border: 1px dashed #ff4d4d; color: #ff4d4d; border-radius: 8px; cursor: pointer; font-size: 12px;">Limpar Tudo</button>`;
}

window.removerFavoritoUnico = function(index) {
    listaFavoritos.splice(index, 1);
    localStorage.setItem('perfetto_favs', JSON.stringify(listaFavoritos));
    renderizarFavoritos();
};

window.limparTodosFavoritos = function() {
    if (confirm("Remover todos os favoritos? 💜")) {
        listaFavoritos = [];
        localStorage.setItem('perfetto_favs', JSON.stringify(listaFavoritos));
        renderizarFavoritos();
    }
};

window.addFavParaCarrinho = function(index) {
    const item = listaFavoritos[index];
    adicionarAoCarrinho(item.nome, item.preco);
    alert("Produto adicionado ao carrinho! 💜");
};

/* ==========================================
   5. COMPARTILHAMENTO E UTILITÁRIOS
   ========================================== */
window.compartilharProduto = function(nome) {
    const url = window.location.href;
    const msg = `Olha que lindo esse(a) ${nome} que vi na Perfetto Store! 💜`;

    if (navigator.share) {
        navigator.share({ title: 'Perfetto Store', text: msg, url: url });
    } else {
        navigator.clipboard.writeText(`${msg} Link: ${url}`);
        alert("Link copiado! Envie para suas amigas. ✨");
    }
};

/* ==========================================
   INICIALIZAÇÃO AO CARREGAR A PÁGINA
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    inicializarMenu();
    iniciarCarrossel();
    configurarBotoesCompra();
    renderizarFavoritos();
});