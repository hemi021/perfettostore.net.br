/* ==========================================
    1. CONFIGURAÇÕES GERAIS E MENU
   ========================================== */
let listaDeProdutos = JSON.parse(localStorage.getItem('perfetto_cart')) || []; 
let listaFavoritos = JSON.parse(localStorage.getItem('perfetto_favs')) || [];
let introExecutada = false;

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
    2. CARROSSEL DE BANNERS
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
    3. SISTEMA DE CARRINHO
   ========================================== */
function salvarDados() {
    localStorage.setItem('perfetto_cart', JSON.stringify(listaDeProdutos));
    localStorage.setItem('perfetto_favs', JSON.stringify(listaFavoritos));
}

function adicionarAoCarrinho(nome, preco, imagem, botao) {
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

/* ==========================================
    4. FAVORITOS (WISHLIST) E SINCRONIZAÇÃO
   ========================================== */
function sincronizarFavoritos() {
    const botoesFav = document.querySelectorAll('.btn-fav');
    botoesFav.forEach(btn => {
        const card = btn.closest('.card');
        if (!card) return;
        const h3 = card.querySelector('h3');
        if (!h3) return;
        const nomeProduto = h3.innerText.trim();
        const ehFavorito = listaFavoritos.some(fav => fav.nome === nomeProduto);

        if (ehFavorito) {
            btn.classList.add('active');
            const icone = btn.querySelector('i');
            if (icone) icone.classList.replace('far', 'fas');
        }
    });
}

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
            </div>`;
    });
    container.innerHTML = html;
}

/* ==========================================
    5. ANIMAÇÃO DE INTRO (ESTILIZADA)
   ========================================== */
function iniciarAnimacaoIntro() {
    const textElement = document.getElementById("typing-text");
    const introScreen = document.getElementById("intro-perfetto");
    
    // Se não achar os elementos ou já tiver rodado, para aqui
    if (!textElement || !introScreen || introExecutada) return;

    introExecutada = true;
    textElement.textContent = ""; // Garante que comece totalmente limpo
    
    const phrase = "Perfetto Store"; 
    let i = 0;

    function type() {
        if (i < phrase.length) {
            textElement.textContent += phrase.charAt(i);
            i++;
            // 80ms é o tempo ideal para fontes de luxo (serifadas)
            setTimeout(type, 80); 
        } else {
            // Remove o cursor piscante para um final mais elegante
            textElement.style.borderRight = "none";
            
            setTimeout(() => {
                introScreen.classList.add('fade-out-intro');
                setTimeout(() => { 
                    introScreen.style.display = 'none'; 
                }, 800);
            }, 600); 
        }
    }

    textElement.classList.add("cursor-blink");
    type();

    // Segurança: remove a tela se travar por qualquer motivo
    setTimeout(() => { 
        if(introScreen && introScreen.style.display !== 'none') {
            introScreen.style.display = 'none'; 
        }
    }, 5000);
}

/* ==========================================
    6. EFEITO SCROLL REVEAL (VERSÃO TURBO)
   ========================================== */
function aplicarScrollReveal() {
    if (typeof ScrollReveal === 'undefined') return;

    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '50px',   // Distância menor para ser mais ágil
        duration: 1500,     // Mais rápido (1.5s em vez de 2.5s)
        delay: 100,         // Começa quase na hora
        scale: 0.9,         // Menos zoom para carregar visualmente mais rápido
        opacity: 0,
        reset: true 
    });

    // Título Hero (Entrada mais direta)
    sr.reveal('.hero-text', { origin: 'left', distance: '150px', duration: 1800 });
    sr.reveal('.hero-img', { origin: 'right', distance: '150px', duration: 1800 });

    // Cards de Produtos (Efeito cascata veloz)
    sr.reveal('.card', { 
        interval: 100,      // Aparece um atrás do outro rapidinho
        rotate: { x: 5 },   // Rotação sutil
        scale: 0.95, 
        distance: '60px' 
    });

    sr.reveal('.carousel', { delay: 200, scale: 1 });
    sr.reveal('.section-title', { origin: 'top', distance: '30px' });
    sr.reveal('.footer-container', { delay: 100 });
}

/* ==========================================
    7. INICIALIZAÇÃO ÚNICA
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    inicializarMenu();
    atualizarContadorTotal();
    renderizarFavoritos();
    sincronizarFavoritos();
    
    if (document.getElementById('carousel-container')) iniciarCarrossel();
    if (document.getElementById('intro-perfetto')) iniciarAnimacaoIntro();
});

window.addEventListener('load', () => {
    aplicarScrollReveal();
});

/* ==========================================
    8. UTILITÁRIOS E PÁGINA DE PRODUTO
   ========================================== */
function changeImage(element) {
    const mainImg = document.getElementById('mainImg');
    if (mainImg) {
        mainImg.src = element.src;
        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
    }
}

function selectSize(btn) {
    document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
});