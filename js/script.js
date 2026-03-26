
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
   3. SISTEMA DE CARRINHO (LÓGICA E PRODUTOS)
   ========================================== */
const cartCountElement = document.getElementById('cart-count');
const buyButtons = document.querySelectorAll('.btn-buy');
let listaDeProdutos = []; 

function atualizarContadorTotal() {
    const totalItens = listaDeProdutos.reduce((soma, item) => soma + item.qtd, 0);
    if (cartCountElement) cartCountElement.innerText = totalItens;
}

buyButtons.forEach(btn => {
    btn.onclick = (e) => {
        // Impede abrir o modal direto ao clicar em comprar, apenas adiciona
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
            btn.innerHTML = "Adicionado! ✓";
            setTimeout(() => { btn.innerHTML = "Eu quero"; }, 800);
        }
    };
});

/* ==========================================
   4. CONTROLE DO MODAL (ABRIR / FECHAR / TROCAR TELAS)
   ========================================== */
const cartTrigger = document.getElementById('cart-trigger');
const modalCheckout = document.getElementById('modal-checkout');
const closeCheckout = document.getElementById('close-checkout');
const btnProximo = document.getElementById('ir-para-dados');
const camadaCarrinho = document.getElementById('camada-carrinho');
const camadaForm = document.getElementById('camada-formulario');

// Função para mostrar resumo na tela do carrinho
function mostrarResumo() {
    const resumo = document.getElementById('resumo-carrinho');
    if (!resumo) return;

    if (listaDeProdutos.length === 0) {
        resumo.innerHTML = "<p style='text-align:center;'>Seu carrinho está vazio.</p>";
        return;
    }

    let html = "";
    listaDeProdutos.forEach(item => {
        html += `<p style="margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <strong>${item.qtd}x</strong> ${item.nome} - 
                    <span style="color:#957DAD; font-weight:bold;">${item.preco}</span>
                 </p>`;
    });
    resumo.innerHTML = html;
}

// Abrir Modal
if (cartTrigger) {
    cartTrigger.onclick = (e) => {
        e.preventDefault();
        modalCheckout.style.setProperty('display', 'flex', 'important');
        modalCheckout.classList.add('active');
        camadaCarrinho.style.display = 'block';
        camadaForm.style.display = 'none';
        mostrarResumo();
    };
}

// Fechar Modal
if (closeCheckout) {
    closeCheckout.onclick = () => {
        modalCheckout.style.display = 'none';
        modalCheckout.classList.remove('active');
    };
}

// Ir para os dados de entrega
if (btnProximo) {
    btnProximo.onclick = () => {
        if (listaDeProdutos.length === 0) {
            alert("Adicione produtos antes de continuar! 💜");
            return;
        }
        camadaCarrinho.style.display = 'none';
        camadaForm.style.display = 'block';
    };
}

/* ==========================================
   5. FINALIZAÇÃO E CÁLCULOS
   ========================================== */
function atualizarParcelas() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const precoElemento = card.querySelector('.price');
        const parcelaElemento = card.querySelector('.parcela-valor');
        if (precoElemento && parcelaElemento) {
            let precoTexto = precoElemento.innerText.replace('R$', '').replace('.', '').replace(',', '.').trim();
            let valorParcela = (parseFloat(precoTexto) / 3).toFixed(2).replace('.', ',');
            parcelaElemento.innerText = `R$ ${valorParcela}`;
        }
    });
}

const btnFinish = document.getElementById('btn-finish');
if (btnFinish) {
    btnFinish.onclick = () => {
        const nome = document.getElementById('c-nome').value;
        const endereco = document.getElementById('c-end').value;

        if (!nome || !endereco) {
            alert("Preencha os dados para entrega! 💜");
            return;
        }
        alert("Redirecionando para o pagamento seguro...");
        window.location.href = "https://link.mercadopago.com.br/pedidoperfettostore"; 
    };
}

// Ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarParcelas();
});
/* ==========================================
   9. MOSTRAR RESUMO COM CONTROLES (+ / -)
   ========================================== */
function mostrarResumo() {
    const resumo = document.getElementById('resumo-carrinho');
    if (!resumo) return;

    if (listaDeProdutos.length === 0) {
        resumo.innerHTML = "<p style='text-align:center;'>Seu carrinho está vazio. 💜</p>";
        atualizarContadorTotal();
        return;
    }

    let html = "";
    listaDeProdutos.forEach((item, index) => {
        html += `
            <div class="item-carrinho" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <div>
                    <strong style="font-size: 14px;">${item.nome}</strong><br>
                    <span style="color: #957DAD; font-weight: bold;">${item.preco}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="alterarQtd(${index}, -1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer;">-</button>
                    <span>${item.qtd}</span>
                    <button onclick="alterarQtd(${index}, 1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #957DAD; background: #957DAD; color: #fff; cursor: pointer;">+</button>
                    <button onclick="removerItem(${index})" style="background: none; border: none; color: #ff4d4d; cursor: pointer; margin-left: 5px; font-size: 18px;">&times;</button>
                </div>
            </div>
        `;
    });
    resumo.innerHTML = html;
    atualizarContadorTotal();
}

/* ==========================================
   10. FUNÇÕES DE AJUSTE (MAIS, MENOS E REMOVER)
   ========================================== */
window.alterarQtd = function(index, delta) {
    listaDeProdutos[index].qtd += delta;

    if (listaDeProdutos[index].qtd <= 0) {
        removerItem(index);
    } else {
        mostrarResumo();
    }
};

window.removerItem = function(index) {
    listaDeProdutos.splice(index, 1);
    mostrarResumo();
};
/* ==========================================
   11. SISTEMA DE FAVORITOS (WISHLIST) - CORRIGIDO
   ========================================== */
let listaFavoritos = JSON.parse(localStorage.getItem('perfetto_favs')) || [];

// Função que liga/desliga o favorito (Coração)
window.toggleFavorito = function(btn, nomeProduto) {
    const card = btn.closest('.card');
    const preco = card.querySelector('.price').innerText;
    const imgUrl = card.querySelector('img').src;

    const index = listaFavoritos.findIndex(item => item.nome === nomeProduto);

    if (index > -1) {
        // Remove dos favoritos
        listaFavoritos.splice(index, 1);
        btn.classList.remove('active');
        btn.querySelector('i').classList.replace('fas', 'far'); 
    } else {
        // Adiciona aos favoritos
        listaFavoritos.push({ nome: nomeProduto, preco: preco, img: imgUrl });
        btn.classList.add('active');
        btn.querySelector('i').classList.replace('far', 'fas'); 
    }

    localStorage.setItem('perfetto_favs', JSON.stringify(listaFavoritos));
    renderizarFavoritos();
};

// Função ÚNICA para renderizar os favoritos no menu lateral
function renderizarFavoritos() {
    const container = document.getElementById('lista-favoritos');
    if (!container) return;

    if (listaFavoritos.length === 0) {
        container.innerHTML = `<p style="font-size: 12px; color: #999; text-align: center; padding: 20px;">Sua lista está vazia. 💜</p>`;
        return;
    }

    let html = "";
    listaFavoritos.forEach((item, index) => {
        html += `
            <div class="fav-item">
                <img src="${item.img}" alt="${item.nome}">
                <div class="fav-info">
                    <p>${item.nome}</p>
                    <span>${item.preco}</span>
                </div>
                <button class="btn-add-fav-to-cart" onclick="addFavParaCarrinho(${index})" title="Comprar agora">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        `;
    });

    // Botão de Limpar
    html += `<button class="btn-limpar-fav" onclick="limparTodosFavoritos()"><i class="far fa-trash-alt"></i> Limpar Favoritos</button>`;
    
    container.innerHTML = html;
}

// Move o favorito para o carrinho e abre o Checkout
window.addFavParaCarrinho = function(index) {
    const item = listaFavoritos[index];
    
    const itemExistente = listaDeProdutos.find(p => p.nome === item.nome);
    if (itemExistente) {
        itemExistente.qtd += 1;
    } else {
        listaDeProdutos.push({ nome: item.nome, preco: item.preco, qtd: 1 });
    }
    
    atualizarContadorTotal();
    mostrarResumo();

    // Fecha menu e abre checkout
    if (sideMenu) {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
    }

    if (modalCheckout) {
        modalCheckout.style.setProperty('display', 'flex', 'important');
        modalCheckout.classList.add('active');
        camadaCarrinho.style.display = 'block';
        camadaForm.style.display = 'none';
    }
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
            <div class="fav-item" style="position: relative; display: flex; align-items: center; gap: 10px; margin-bottom: 15px; background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
                
                <button onclick="removerFavoritoUnico(${index})" style="position: absolute; top: -5px; right: -5px; background: #ff4d4d; color: white; border: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; z-index: 10;">&times;</button>

                <img src="${item.img}" alt="${item.nome}" style="width: 50px; height: 60px; object-fit: cover; border-radius: 4px;">
                
                <div class="fav-info" style="flex: 1;">
                    <p style="font-size: 12px; margin: 0; font-weight: bold; color: #333;">${item.nome}</p>
                    <span style="font-size: 11px; color: #957DAD;">${item.preco}</span>
                </div>

                <button class="btn-add-fav-to-cart" onclick="addFavParaCarrinho(${index})" style="background: #f8f8f8; border: none; padding: 8px; border-radius: 50%; cursor: pointer; color: #957DAD;">
                    <i class="fas fa-shopping-cart" style="font-size: 12px;"></i>
                </button>
            </div>
        `;
    });

    // Botão Limpar Tudo (com estilo forçado para aparecer)
    html += `
        <div style="margin-top: 20px; padding-bottom: 20px;">
            <button onclick="limparTodosFavoritos()" style="width: 100%; padding: 10px; background: none; border: 1px dashed #ff4d4d; color: #ff4d4d; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: bold;">
                <i class="far fa-trash-alt"></i> Limpar Lista Toda
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

// Função para remover APENAS UM item dos favoritos
window.removerFavoritoUnico = function(index) {
    const produtoRemovido = listaFavoritos[index].nome;
    listaFavoritos.splice(index, 1);
    localStorage.setItem('perfetto_favs', JSON.stringify(listaFavoritos));

    // Desmarca o coração lá no card do produto se ele estiver visível
    document.querySelectorAll('.card').forEach(card => {
        if (card.querySelector('h3').innerText === produtoRemovido) {
            const btn = card.querySelector('.btn-fav');
            btn.classList.remove('active');
            btn.querySelector('i').classList.replace('fas', 'far');
        }
    });

    renderizarFavoritos();
};
window.limparTodosFavoritos = function() {
    if (confirm("Deseja remover todos os itens dos favoritos? 💜")) {
        // Limpa o array
        listaFavoritos = [];
        // Atualiza o banco de dados do navegador
        localStorage.setItem('perfetto_favs', JSON.stringify(listaFavoritos));
        
        // Reseta todos os corações da vitrine para "vazio"
        document.querySelectorAll('.btn-fav').forEach(btn => {
            btn.classList.remove('active');
            const icon = btn.querySelector('i');
            if (icon) icon.classList.replace('fas', 'far');
        });

        renderizarFavoritos();
    }
};
document.addEventListener('DOMContentLoaded', () => {
    atualizarParcelas();
    renderizarFavoritos(); // Garante que a lista apareça ao abrir o site

    // Sincroniza os corações dos cards com o que está salvo no localStorage
    document.querySelectorAll('.card').forEach(card => {
        const nomeNoCard = card.querySelector('h3').innerText;
        const estaFavoritado = listaFavoritos.some(fav => fav.nome === nomeNoCard);
        
        if (estaFavoritado) {
            const btn = card.querySelector('.btn-fav');
            btn.classList.add('active');
            btn.querySelector('i').classList.replace('far', 'fas');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('header-placeholder');
    
    if (placeholder) {
        // Busca o arquivo do template
        fetch('header-template.html')
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar header-template.html');
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                
                // --- ATIVAÇÃO DOS EVENTOS (Essencial para as categorias) ---
                const btnAbrir = document.getElementById('menu-toggle');
                const btnFechar = document.getElementById('close-menu');
                const menuSide = document.getElementById('menu-side');
                const overlay = document.getElementById('bg-overlay');

                if (btnAbrir && menuSide) {
                    btnAbrir.onclick = () => {
                        menuSide.classList.add('active');
                        overlay.classList.add('active');
                    };
                }

                if (btnFechar) {
                    btnFechar.onclick = () => {
                        menuSide.classList.remove('active');
                        overlay.classList.remove('active');
                    };
                }
                
                // Garante que o contador do carrinho atualize no novo header
                if (typeof atualizarContadorCarrinho === "function") {
                    atualizarContadorCarrinho();
                }
            })
            .catch(error => console.error('Falha crítica:', error));
    }
});
// Coloque isso no seu script.js
function inicializarTudo() {
    const btnAbrir = document.getElementById('menu-toggle');
    const btnFechar = document.getElementById('close-menu');
    const menu = document.getElementById('menu-side');
    const overlay = document.getElementById('bg-overlay');

    // Abre o menu
    if(btnAbrir) {
        btnAbrir.onclick = () => {
            menu.classList.add('active');
            overlay.classList.add('active');
        };
    }

    // Fecha o menu
    const fechar = () => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    };

    if(btnFechar) btnFechar.onclick = fechar;
    if(overlay) overlay.onclick = fechar;
}

// Roda sempre que qualquer página carregar
document.addEventListener('DOMContentLoaded', inicializarTudo);

// Função para Compartilhar o Produto (Sugestão da Amanda 💜)
function compartilharProduto(nome) {
    // Captura o link da página onde o usuário está
    const linkProduto = window.location.href;
    const mensagem = `Olha que lindo esse(a) ${nome} que vi na Perfetto Store! 💜`;

    if (navigator.share) {
        // Se for no celular ou navegador moderno
        navigator.share({
            title: 'Perfetto Store',
            text: mensagem,
            url: linkProduto,
        })
        .then(() => console.log('Compartilhado com sucesso!'))
        .catch((error) => console.log('Erro ao compartilhar', error));
    } else {
        // Caso o navegador seja antigo ou PC sem suporte, ele copia o link
        navigator.clipboard.writeText(`${mensagem} Link: ${linkProduto}`);
        alert("Link e mensagem copiados! Agora é só colar para sua amiga. ✨");
    }
}
function compartilharProduto(nome) {
    const linkLoja = window.location.href; // Pega o link da página atual
    const frase = `Olha que lindo esse(a) ${nome} que vi na Perfetto Store! 💜`;

    if (navigator.share) {
        // No Celular (WhatsApp, Insta, Face)
        navigator.share({
            title: 'Perfetto Store',
            text: frase,
            url: linkLoja,
        }).catch((err) => console.log("Erro ao compartilhar", err));
    } else {
        // No Computador (Copia o link)
        navigator.clipboard.writeText(`${frase} Link: ${linkLoja}`);
        alert("Link copiado! Agora é só colar para sua amiga. ✨");
    }
}
// Função de Compartilhamento (WhatsApp, Instagram, Facebook)
function compartilharProduto(nome) {
    const urlAtual = window.location.href;
    const mensagem = `Olha que lindo esse(a) ${nome} que vi na Perfetto Store! 💜`;

    if (navigator.share) {
        // Funciona em Celulares (Android/iOS)
        navigator.share({
            title: 'Perfetto Store',
            text: mensagem,
            url: urlAtual
        }).catch((err) => console.log("Erro ao compartilhar:", err));
    } else {
        // Fallback para Computador: Copia o link
        const textoCopiar = `${mensagem} Link: ${urlAtual}`;
        navigator.clipboard.writeText(textoCopiar);
        alert("Link e mensagem copiados! Agora é só colar para sua amiga. ✨");
    }
}