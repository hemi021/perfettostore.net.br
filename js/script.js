/* ==========================================
    1. CONFIGURAÇÕES GERAIS E MENU
    ========================================== */
// ADICIONADO: Agora ele carrega os itens salvos para o carrinho não esvaziar ao mudar de página
let listaDeProdutos = JSON.parse(localStorage.getItem('perfetto_cart')) || []; 
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

    container.style.transform = `translateX(${-bannerIndex * 100}%)`;
}

function iniciarCarrossel() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const container = document.getElementById('carousel-container');

    if (nextBtn) nextBtn.onclick = () => showSlide(1);
    if (prevBtn) prevBtn.onclick = () => showSlide(-1);

    let autoPlay = setInterval(() => showSlide(1), 5000);

    if (container) {
        container.onmouseenter = () => clearInterval(autoPlay);
        container.onmouseleave = () => autoPlay = setInterval(() => showSlide(1), 5000);
    }
}

/* ==========================================
    3. SISTEMA DE CARRINHO (ADICIONADO/CORRIGIDO)
    ========================================== */
// ADICIONADO: Função para salvar no navegador
function salvarDados() {
    localStorage.setItem('perfetto_cart', JSON.stringify(listaDeProdutos));
    localStorage.setItem('perfetto_favs', JSON.stringify(listaFavoritos));
}

function adicionarAoCarrinho(nome, preco, imagem, botao) {
    // Converte preço para número se for string
    const precoNum = typeof preco === 'string' ? parseFloat(preco.replace('R$', '').replace(',', '.')) : preco;

    const itemExistente = listaDeProdutos.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.qtd += 1;
    } else {
        listaDeProdutos.push({ nome: nome, preco: precoNum, img: imagem, qtd: 1 });
    }
    
    salvarDados();
    atualizarContadorTotal();

    if (botao) {
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = "Adicionado! ✓";
        botao.style.background = "#28a745"; 
        setTimeout(() => { 
            botao.innerHTML = textoOriginal; 
            botao.style.background = ""; 
        }, 800);
    }
}

function atualizarContadorTotal() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const total = listaDeProdutos.reduce((sum, item) => sum + item.qtd, 0);
        contador.innerText = total;
    }
}

// ADICIONADO: Função para abrir o Modal do Carrinho
function configurarCarrinhoModal() {
    const cartTrigger = document.getElementById('cart-trigger');
    const modal = document.getElementById('modal-checkout');
    const closeBtn = document.getElementById('close-checkout');

    if (cartTrigger && modal) {
        cartTrigger.onclick = () => {
            renderizarItensCarrinho();
            modal.style.display = 'block';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = 'none';
    }
}

function renderizarItensCarrinho() {
    const resumo = document.getElementById('resumo-carrinho');
    if (!resumo) return;

    if (listaDeProdutos.length === 0) {
        resumo.innerHTML = `<p style="text-align:center; padding:20px;">Seu carrinho está vazio. 💜</p>`;
        return;
    }

    let html = "";
    let totalGeral = 0;

    listaDeProdutos.forEach((item, index) => {
        const subtotal = item.preco * item.qtd;
        totalGeral += subtotal;
        html += `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <img src="${item.img}" width="40" style="border-radius:4px;">
                <div style="flex:1;">
                    <p style="font-size:12px; font-weight:bold; margin:0;">${item.nome}</p>
                    <p style="font-size:11px; margin:0;">${item.qtd}x R$ ${item.preco.toFixed(2)}</p>
                </div>
                <button onclick="removerItemCarrinho(${index})" style="background:none; border:none; color:red; cursor:pointer;">&times;</button>
            </div>`;
    });

    html += `<div style="text-align:right; font-weight:bold; margin-top:10px;">Total: R$ ${totalGeral.toFixed(2)}</div>`;
    resumo.innerHTML = html;
}

window.removerItemCarrinho = function(index) {
    listaDeProdutos.splice(index, 1);
    salvarDados();
    atualizarContadorTotal();
    renderizarItensCarrinho();
};

/* ==========================================
    4. FAVORITOS (WISHLIST) - MANTIDO
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

    salvarDados();
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
    salvarDados();
    renderizarFavoritos();
};

window.limparTodosFavoritos = function() {
    if (confirm("Remover todos os favoritos? 💜")) {
        listaFavoritos = [];
        salvarDados();
        renderizarFavoritos();
    }
};

window.addFavParaCarrinho = function(index) {
    const item = listaFavoritos[index];
    adicionarAoCarrinho(item.nome, item.preco, item.img);
    alert("Produto adicionado ao carrinho! 💜");
};

/* ==========================================
    5. COMPARTILHAMENTO E UTILITÁRIOS - MANTIDO
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
    ADICIONAL: SINCRONIZAÇÃO DE ÍCONES
   ========================================== */
function sincronizarFavoritos() {
    // Busca todos os botões de favorito na página atual
    const botoesFav = document.querySelectorAll('.btn-fav');
    
    botoesFav.forEach(btn => {
        // Tenta encontrar o nome do produto no card atual
        const card = btn.closest('.card');
        if (!card) return;
        
        const h3 = card.querySelector('h3');
        if (!h3) return;
        
        const nomeProduto = h3.innerText.trim();

        // Verifica se esse produto está na nossa lista de favoritos salva
        const ehFavorito = listaFavoritos.some(fav => fav.nome === nomeProduto);

        if (ehFavorito) {
            btn.classList.add('active');
            const icone = btn.querySelector('i');
            if (icone) {
                icone.classList.replace('far', 'fas'); // Troca coração vazio por cheio
            }
        }
    });
}
/* ==========================================
    INICIALIZAÇÃO ÚNICA (CORRIGIDA E COMPLETA)
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Funções globais (Menu, Carrinho, Wishlist Lateral)
    inicializarMenu();
    atualizarContadorTotal();
    renderizarFavoritos();
    
    // 2. Sincroniza os corações dos produtos da página atual
    sincronizarFavoritos();
    
    // 3. Só inicia o Carrossel se ele existir na página (evita erro em categorias)
    if (document.getElementById('carousel-container')) {
        iniciarCarrossel();
    }
    
    // 4. Só inicia a Intro se ela existir na página (geralmente só na home)
    if (document.getElementById('intro-perfetto')) {
        iniciarAnimacaoIntro();
    }
});
/* ==========================================
    FUNÇÕES DA PÁGINA DE PRODUTO
   ========================================== */
function changeImage(element) {
    const mainImg = document.getElementById('mainImg');
    if (mainImg) {
        mainImg.src = element.src;
        const thumbs = document.querySelectorAll('.thumb-item');
        thumbs.forEach(t => t.classList.remove('active'));
        element.classList.add('active');
    }
}

function selectSize(btn) {
    const btns = document.querySelectorAll('.size-option');
    btns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

/* ==========================================
    6. ANIMAÇÃO DE INTRO (DIGITAÇÃO) - VERSÃO RÁPIDA
   ========================================== */
function iniciarAnimacaoIntro() {
    const textElement = document.getElementById("typing-text");
    const introScreen = document.getElementById("intro-perfetto");
    const phrase = "Perfetto Store";
    let i = 0;

    if (!textElement || !introScreen) return;

    function type() {
        if (i < phrase.length) {
            textElement.textContent += phrase.charAt(i);
            i++;
            // Velocidade das letras: 70ms (mais rápido que 100ms)
            setTimeout(type, 70); 
        } else {
            // Finaliza a digitação e tira o cursor
            textElement.style.borderRight = "none";
            
            // Aguarda apenas 500ms (meio segundo) e começa a sumir
            setTimeout(() => {
                introScreen.classList.add('fade-out-intro');
                
                // Tira o display 'none' após a transição do CSS (800ms)
                setTimeout(() => {
                    introScreen.style.display = 'none';
                }, 800);
            }, 500); 
        }
    }

    // Inicia o cursor piscando e a digitação
    textElement.classList.add("cursor-blink");
    type();
}
// Configuração do ScrollReveal - O toque de sofisticação
const sr = ScrollReveal({
    origin: 'bottom', // Os elementos vêm de baixo
    distance: '50px', // O quanto eles se movem
    duration: 2000,   // Tempo da animação (2 segundos para ser bem suave)
    delay: 200,       // Pequena espera antes de começar
    reset: false      // Se true, a animação acontece toda vez que sobe/desce
});

// Aplicando aos elementos do site:
sr.reveal('.banner', { delay: 300 }); 
sr.reveal('.produto-card', { interval: 100 }); // Aparecem um por um em sequência
sr.reveal('.titulo-secao', { origin: 'left', distance: '100px' });
sr.reveal('.footer-container', { delay: 400 });