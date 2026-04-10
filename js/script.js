/* ==========================================
   1. CONFIGURAÇÕES INICIAIS E INTRO
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    iniciarIntro();
    renderizarFavoritos();
    atualizarContadorTotal();
});

function iniciarIntro() {
    const textElement = document.getElementById("typing-text");
    const introDiv = document.getElementById("intro-perfetto");
    const phrase = "Perfetto Store";
    let i = 0;

    if (!textElement) return;

    function type() {
        if (i < phrase.length) {
            textElement.textContent += phrase.charAt(i);
            i++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                introDiv.classList.add("fade-out-intro");
                // Remove do DOM após a transição para não atrapalhar cliques
                setTimeout(() => introDiv.style.display = 'none', 800);
            }, 800);
        }
    }
    type();
}

/* ==========================================
   2. MENU LATERAL (SIDE-PANEL) E FAVORITOS
   ========================================== */
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('menu-side');
const overlay = document.getElementById('bg-overlay');
const closeBtn = document.getElementById('close-menu');

function toggleMenu() {
    if (sideMenu && overlay) {
        sideMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

if (menuToggle) menuToggle.onclick = toggleMenu;
if (closeBtn) closeBtn.onclick = toggleMenu;
if (overlay) overlay.onclick = toggleMenu;

// Lógica de Favoritos
let favoritos = JSON.parse(localStorage.getItem('perfetto_favs')) || [];

window.toggleFavorito = function(btn, nome, preco, img) {
    const index = favoritos.findIndex(f => f.nome === nome);
    
    if (index > -1) {
        favoritos.splice(index, 1);
        btn.classList.remove('active');
        btn.querySelector('i').className = 'far fa-heart';
    } else {
        favoritos.push({ nome, preco, img });
        btn.classList.add('active');
        btn.querySelector('i').className = 'fas fa-heart';
    }
    
    localStorage.setItem('perfetto_favs', JSON.stringify(favoritos));
    renderizarFavoritos();
};

function renderizarFavoritos() {
    const container = document.getElementById('lista-favoritos');
    if (!container) return;
    
    if (favoritos.length === 0) {
        container.innerHTML = '<p style="font-size:12px; color:#999; padding:10px;">Nenhum favorito ainda.</p>';
        return;
    }

    container.innerHTML = favoritos.map(f => `
        <div class="fav-item" style="display:flex; align-items:center; gap:10px; margin-bottom:10px; padding:5px; border-bottom:1px solid #f0f0f0;">
            <img src="${f.img}" style="width:40px; height:50px; object-fit:cover; border-radius:4px;">
            <div>
                <span style="font-size:12px; display:block; font-weight:600;">${f.nome}</span>
                <span style="font-size:11px; color:var(--roxo-principal);">${f.preco}</span>
            </div>
        </div>
    `).join('');
}

/* ==========================================
   3. CARROSSEL DE BANNERS
   ========================================== */
let bannerIndex = 0;
const containerCarousel = document.getElementById('carousel-container');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

function showSlide(n) {
    if (!containerCarousel || slides.length === 0) return;
    bannerIndex += n;
    if (bannerIndex >= slides.length) bannerIndex = 0;
    if (bannerIndex < 0) bannerIndex = slides.length - 1;
    containerCarousel.style.transform = `translateX(${-bannerIndex * 100}%)`;
}

if (nextBtn) nextBtn.onclick = () => showSlide(1);
if (prevBtn) prevBtn.onclick = () => showSlide(-1);

// AutoPlay
setInterval(() => showSlide(1), 5000);

/* ==========================================
   4. SISTEMA DE COMPRA E MERCADO PAGO
   ========================================== */
let listaDeProdutos = [];
const cartCountElement = document.getElementById('cart-count');
const modalCheckout = document.getElementById('modal-checkout');
const resumoConteudo = document.getElementById('resumo-carrinho');

window.adicionarAoCarrinho = function(nome, preco, img, btn) {
    const itemExistente = listaDeProdutos.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.qtd += 1;
    } else {
        listaDeProdutos.push({ nome, preco, img, qtd: 1 });
    }
    
    atualizarContadorTotal();
    
    // Feedback visual no botão
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = "Adicionado! ✓";
        btn.style.background = "#7a6391";
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = "";
        }, 800);
    }
};

function atualizarContadorTotal() {
    const totalItens = listaDeProdutos.reduce((soma, item) => soma + item.qtd, 0);
    if (cartCountElement) cartCountElement.innerText = totalItens;

    let subtotal = listaDeProdutos.reduce((soma, item) => {
        let precoLimpo = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.'));
        return soma + (precoLimpo * item.qtd);
    }, 0);

    let valorFrete = window.freteAtual || 0;
    let totalGeral = subtotal + valorFrete;

    const totalDisplay = document.getElementById('valor-total-modal');
    if (totalDisplay) {
        totalDisplay.innerText = `Total: R$ ${totalGeral.toFixed(2)} (Frete: R$ ${valorFrete.toFixed(2)})`;
    }
}

window.renderizarResumo = function() {
    if (!resumoConteudo) return;
    resumoConteudo.innerHTML = listaDeProdutos.map((item, index) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
            <div style="flex:1; text-align:left;">
                <span style="font-weight:500; font-size:14px; display:block;">${item.nome}</span>
                <small style="color:#888;">${item.preco}</small>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button type="button" onclick="alterarQtd(${index}, -1)" style="width:25px; height:25px; border-radius:50%; border:1px solid #ddd; background:white;">-</button>
                <span style="font-weight:bold;">${item.qtd}</span>
                <button type="button" onclick="alterarQtd(${index}, 1)" style="width:25px; height:25px; border-radius:50%; border:none; background:#957DAD; color:white;">+</button>
            </div>
        </div>
    `).join('');
};

window.alterarQtd = function(index, operacao) {
    listaDeProdutos[index].qtd += operacao;
    if (listaDeProdutos[index].qtd <= 0) listaDeProdutos.splice(index, 1);
    renderizarResumo();
    atualizarContadorTotal();
};

// Checkout Pro Mercado Pago
const mp = new MercadoPago('APP_USR-a68e1268-65ea-4878-9949-14e0cc2af141', { locale: 'pt-BR' });

const btnFinish = document.getElementById('btn-finish');
if (btnFinish) {
    btnFinish.onclick = () => {
        const nome = document.getElementById('c-nome').value;
        const endereco = document.getElementById('c-end').value;

        if (!nome || !endereco) {
            alert("Preencha os dados de entrega! 💜");
            return;
        }

        window.location.href = "https://link.mercadopago.com.br/pedidoperfettostore";
    };
}

/* ==========================================
   5. CÁLCULO DE FRETE (JOINVILLE)
   ========================================== */
document.querySelectorAll('.btn-calc').forEach(btn => {
    btn.onclick = async function() {
        const container = this.closest('.shipping-calculator');
        const input = container.querySelector('.cep-input');
        const resultDiv = container.querySelector('.shipping-result');
        const cep = input.value.replace(/\D/g, '');

        if (cep.length !== 8) return alert("CEP incompleto!");

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await response.json();
            if (dados.erro) return alert("CEP não encontrado!");

            const bairro = dados.bairro.toLowerCase();
            let valorUber = 12.00;

            if (bairro.includes("centro") || bairro.includes("america") || bairro.includes("ateneu")) {
                valorUber = 8.00;
            } else if (bairro.includes("pirabeiraba") || bairro.includes("aventureiro") || bairro.includes("vila nova")) {
                valorUber = 18.00;
            }

            resultDiv.style.display = "block";
            resultDiv.innerHTML = `<div style="color:#957DAD;">🛵 Uber Moto para ${dados.bairro}: R$ ${valorUber.toFixed(2)}</div>`;
            
            window.freteAtual = valorUber;
            atualizarContadorTotal();
        } catch (e) { alert("Erro ao calcular."); }
    };
});