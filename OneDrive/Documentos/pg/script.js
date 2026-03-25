/* ==========================================
   1. MENU LATERAL (SIDE-PANEL)
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


/* ==========================================
   2. CARROSSEL DE BANNERS
   ========================================== */
let bannerIndex = 0;
const container = document.getElementById('carousel-container');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
let autoPlayInterval;

function showSlide(n) {
    if (!container || slides.length === 0) return;
    bannerIndex += n;
    if (bannerIndex >= slides.length) bannerIndex = 0;
    if (bannerIndex < 0) bannerIndex = slides.length - 1;
    container.style.transform = `translateX(${-bannerIndex * 100}%)`;
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => showSlide(1), 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

if (nextBtn) nextBtn.onclick = () => showSlide(1);
if (prevBtn) prevBtn.onclick = () => showSlide(-1);

if (container && slides.length > 0) {
    startAutoPlay();
    container.onmouseenter = stopAutoPlay; 
    container.onmouseleave = startAutoPlay; 
}

/* ==========================================
   3. SISTEMA DE COMPRA E MODAL
   ========================================== */
const cartCountElement = document.getElementById('cart-count');
const buyButtons = document.querySelectorAll('.btn-buy');
const modalCheckout = document.getElementById('modal-checkout');
const closeCheckout = document.getElementById('close-checkout');
const cartTrigger = document.getElementById('cart-trigger');
const btnFinish = document.getElementById('btn-finish');

const camadaCarrinho = document.getElementById('camada-carrinho');
const camadaFormulario = document.getElementById('camada-formulario');
const btnIrParaDados = document.getElementById('ir-para-dados');
const btnVoltarCarrinho = document.getElementById('voltar-carrinho');
const resumoConteudo = document.getElementById('resumo-carrinho');

let listaDeProdutos = []; 

// Atualiza o contador visual e o valor total no modal
function atualizarContadorTotal() {
    const totalItens = listaDeProdutos.reduce((soma, item) => soma + item.qtd, 0);
    if (cartCountElement) cartCountElement.innerText = totalItens;

    let subtotalProdutos = listaDeProdutos.reduce((soma, item) => {
        let precoLimpo = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.'));
        return soma + (precoLimpo * item.qtd);
    }, 0);

    let valorFrete = window.freteAtual || 0;
    let valorFinalComFrete = subtotalProdutos + valorFrete;

    const totalDisplay = document.getElementById('valor-total-modal');
    if (totalDisplay) {
        totalDisplay.innerText = `Total: R$ ${valorFinalComFrete.toFixed(2)} (Frete: R$ ${valorFrete.toFixed(2)})`;
    }
}

// Clique no botão Comprar
buyButtons.forEach(btn => {
    btn.onclick = () => {
        const card = btn.closest('.card');
        if (card) {
            const nomeProduto = card.querySelector('h3').innerText;
            const precoProduto = card.querySelector('.price').innerText;

            const itemExistente = listaDeProdutos.find(item => item.nome === nomeProduto);

            if (itemExistente) {
                itemExistente.qtd += 1;
            } else {
                listaDeProdutos.push({ nome: nomeProduto, preco: precoProduto, qtd: 1 });
            }
            
            atualizarContadorTotal();
            
            // Efeito visual
            btn.innerHTML = "Adicionado! ✓";
            btn.style.background = "#7a6391";
            setTimeout(() => {
                btn.innerHTML = "Comprar";
                btn.style.background = "";
            }, 800);
        }
    };
});

function renderizarResumo() {
    if (!resumoConteudo) return;
    resumoConteudo.innerHTML = "";
    
    listaDeProdutos.forEach((item, index) => {
        resumoConteudo.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
                <div style="flex:1; text-align:left;">
                    <span style="font-weight:500; font-size:14px; display:block;">${item.nome}</span>
                    <small style="color:#888;">${item.preco}</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button type="button" onclick="alterarQtd(${index}, -1)" style="width:25px; height:25px; border-radius:50%; border:1px solid #ddd; background:white; cursor:pointer;">-</button>
                    <span style="font-weight:bold;">${item.qtd}</span>
                    <button type="button" onclick="alterarQtd(${index}, 1)" style="width:25px; height:25px; border-radius:50%; border:none; background:#957DAD; color:white; cursor:pointer;">+</button>
                </div>
            </div>`;
    });
}

window.alterarQtd = function(index, operacao) {
    listaDeProdutos[index].qtd += operacao;
    if (listaDeProdutos[index].qtd <= 0) {
        listaDeProdutos.splice(index, 1);
    }
    renderizarResumo();
    atualizarContadorTotal();
    if (listaDeProdutos.length === 0) {
        modalCheckout.classList.remove('active');
    }
};

// Abrir carrinho
if (cartTrigger) {
    cartTrigger.onclick = () => {
        if (listaDeProdutos.length > 0) {
            renderizarResumo();
            atualizarContadorTotal(); // Garante que o frete apareça se calculado depois
            if (camadaCarrinho) camadaCarrinho.style.display = 'block';
            if (camadaFormulario) camadaFormulario.style.display = 'none';
            modalCheckout.classList.add('active');
        } else {
            alert("Seu carrinho ainda está vazio! 🛍️");
        }
    };
}

// Navegação entre camadas do modal
if (btnIrParaDados) btnIrParaDados.onclick = () => {
    camadaCarrinho.style.display = 'none';
    camadaFormulario.style.display = 'block';
};
if (btnVoltarCarrinho) btnVoltarCarrinho.onclick = () => {
    camadaCarrinho.style.display = 'block';
    camadaFormulario.style.display = 'none';
};
if (closeCheckout) closeCheckout.onclick = () => modalCheckout.classList.remove('active');

/* ==========================================
   4. FINALIZAÇÃO: MERCADO PAGO (CORRIGIDO)
   ========================================== */

// 1. Inicializa o Mercado Pago com a chave da Amanda
const mp = new MercadoPago('APP_USR-a68e1268-65ea-4878-9949-14e0cc2af141', {
    locale: 'pt-BR'
});

if (btnFinish) {
    btnFinish.onclick = () => {
        const nome = document.getElementById('c-nome').value;
        const endereco = document.getElementById('c-end').value;

        // Validação básica
        if (!nome || !endereco) {
            alert("Por favor, preencha seus dados para a entrega! 💜");
            return;
        }

        if (listaDeProdutos.length === 0) {
            alert("Seu carrinho está vazio! 🛍️");
            return;
        }

        // 2. Cálculo do total para exibir no alerta (opcional)
        let subtotal = listaDeProdutos.reduce((soma, item) => {
            let p = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.'));
            return soma + (p * item.qtd);
        }, 0);
        
        const valorComFrete = subtotal + (window.freteAtual || 0);

        alert(`Pedido da Perfetto Store sendo preparado!\nTotal: R$ ${valorComFrete.toFixed(2)}\n\nVocê será redirecionada para o pagamento seguro e escolha do Motoboy! 🛵`);

        /* 3. REDIRECIONAMENTO:
           Como você está usando o Checkout Pro, o Mercado Pago precisa de um "Preference ID".
           Se a Amanda gerou um "Link de Pagamento" no painel, coloque o LINK aqui entre aspas.
        */
        
        // Exemplo: window.location.href = "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=XXXXX";
        // OU o link curto que o Mercado Pago gera:
        window.location.href = "link.mercadopago.com.br/pedidoperfettostore"; 
    };
}

/* ==========================================
   5. PESQUISA GLOBAL
   ========================================== */
const BANCO_DE_DADOS = [
    { nome: "Blusa Gola Alta", foto: "img/blusa-gola.jpg", link: "blusas.html" },
    { nome: "Vestido Satin", foto: "img/vestido-satin.jpg", link: "vestidos.html" },
    { nome: "Short Jeans Destroyed", foto: "img/short-jeans.jpg", link: "shorts.html" },
    { nome: "Calça Pantalona", foto: "img/calca-panta.jpg", link: "calcas.html" },
    { nome: "Cropped Amarração", foto: "img/cropped.jpg", link: "blusas.html" }
];

const inputBusca = document.getElementById('search-in');
const resultadosBusca = document.getElementById('search-results');

if (inputBusca) {
    inputBusca.addEventListener('input', () => {
        const termo = inputBusca.value.toLowerCase().trim();
        if (!resultadosBusca) return;
        resultadosBusca.innerHTML = "";

        if (termo.length < 2) {
            resultadosBusca.style.display = "none";
            return;
        }

        let encontrouAlgo = false;
        BANCO_DE_DADOS.forEach(produto => {
            if (produto.nome.toLowerCase().includes(termo)) {
                encontrouAlgo = true;
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.style.cssText = "display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-bottom:1px solid rgba(0,0,0,0.05);";
                item.innerHTML = `
                    <img src="${produto.foto}" style="width:40px; height:50px; object-fit:cover; border-radius:4px;">
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-size:14px; color:#333; font-weight:500;">${produto.nome}</span>
                        <small style="font-size:11px; color:#957DAD;">Ver categoria</small>
                    </div>`;
                item.onclick = () => {
                    window.location.href = `${produto.link}?busca=${encodeURIComponent(produto.nome)}`;
                };
                resultadosBusca.appendChild(item);
            }
        });
        resultadosBusca.style.display = encontrouAlgo ? "block" : "none";
    });
}

/* ==========================================
   6. CÁLCULO DE FRETE (VIA CEP)
   ========================================== */
document.querySelectorAll('.btn-calc').forEach(btn => {
    btn.onclick = async function() {
        const container = this.closest('.shipping-calculator');
        const input = container.querySelector('.cep-input');
        const resultDiv = container.querySelector('.shipping-result');
        const cep = input.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            alert("CEP incompleto! 💜");
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await response.json();

            if (dados.erro) {
                alert("CEP não encontrado! 🔍");
                return;
            }

            const bairro = dados.bairro.toLowerCase();
            let valorUber = 12.00;

            if (bairro.includes("centro") || bairro.includes("america") || bairro.includes("ateneu")) {
                valorUber = 8.00;
            } else if (bairro.includes("pirabeiraba") || bairro.includes("aventureiro") || bairro.includes("vila nova")) {
                valorUber = 18.00;
            }

            resultDiv.style.display = "block";
            resultDiv.innerHTML = `
                <div style="margin-bottom: 5px; color: #957DAD; font-weight: bold;">📍 Entrega para: ${dados.bairro}</div>
                <div class="shipping-option">
                    <span>🛵 Uber Moto (Hoje)</span>
                    <span>R$ ${valorUber.toFixed(2)}</span>
                </div>`;

            window.freteAtual = valorUber;
            atualizarContadorTotal(); // Atualiza o total do modal se ele já estiver aberto
            
        } catch (error) {
            alert("Erro ao calcular frete.");
        }
    };
});