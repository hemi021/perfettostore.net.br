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

function aplicarScrollReveal() {
    if (typeof ScrollReveal === 'undefined') return;

    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '50px',
        duration: 1200,
        delay: 100,
        scale: 0.95,
        opacity: 0,
        reset: false // 'false' é melhor para performance em sites de vendas
    });

    // Revelar a nova seção de Categorias
    sr.reveal('.texto-parallax', { delay: 200 });
    sr.reveal('.parallax-item', { 
        interval: 150, // Faz as "bolinhas" aparecerem uma depois da outra
        scale: 0.8,
        distance: '30px'
    });

    // Cards de Produtos
    sr.reveal('.card', { 
        interval: 100, 
        distance: '40px' 
    });

    sr.reveal('.carousel', { delay: 200, scale: 1 });
    sr.reveal('.section-title', { origin: 'top', distance: '30px' });
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
/* ==========================================
    SISTEMA DE BUSCA INTELIGENTE (CORRIGIDO)
   ========================================== */
const meusProdutos = [
    { 
        nome: "Bata Elegance", 
        preco: "R$ 189,90", 
        img: "img/blusas/bata.jpg", 
        link: "produto.html" 
    },
    { 
        nome: "Cropped Amarração", 
        preco: "R$ 59,90", 
        img: "img/bata.jpg", 
        link: "produto.html" 
    },
    { 
        nome: "Bata Sonia", 
        preco: "R$ 69,90", 
        img: "img/batasonic.jpg", 
        link: "produto.html" 
    }
];

// Função auxiliar para encontrar a raiz do site e evitar erro 404
function getRootPath() {
    const path = window.location.pathname;
    if (path.includes('/perfetto-store/')) {
        return '/perfetto-store/';
    }
    return '/';
}

document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('search-in');
    const containerResultados = document.getElementById('search-results');

    if (inputBusca && containerResultados) {
        inputBusca.addEventListener('input', (e) => {
            const busca = e.target.value.toLowerCase().trim();
            containerResultados.innerHTML = "";

            if (busca.length > 0) {
                const filtrados = meusProdutos.filter(p => 
                    p.nome.toLowerCase().includes(busca)
                );
                
                if (filtrados.length > 0) {
                    filtrados.forEach(p => {
                        const item = document.createElement('div');
                        item.className = 'search-item-result';
                        
                        // --- LÓGICA DE CAMINHO REFORMULADA ---
                        // Verifica se estamos em qualquer página que NÃO seja a index.html na raiz
                        // Se o pathname contém pastas ou termina em algo que não seja a raiz, precisamos do ../
                        const pathSegments = window.location.pathname.split('/').filter(s => s.length > 0);
                        
                        // Se houver mais de um segmento (ex: perfetto-store/vestidos) 
                        // ou se estiver em uma pasta simples (ex: /vestidos/), precisamos subir um nível.
                        let prefixo = "";
                        const subpastasConhecidas = ['vestidos', 'calcas', 'saias', 'blusas', 'conjuntos'];
                        const atual = window.location.pathname.toLowerCase();
                        
                        if (subpastasConhecidas.some(pasta => atual.includes('/' + pasta + '/'))) {
                            prefixo = "../";
                        }

                        const imgSrc = prefixo + p.img;
                        const linkFinal = prefixo + p.link;

                        item.innerHTML = `
                            <img src="${imgSrc}" alt="${p.nome}" onerror="this.src='${prefixo}img/placeholder.jpg'">
                            <div class="info">
                                <span class="name">${p.nome}</span>
                                <span class="price">${p.preco}</span>
                            </div>
                        `;

                        item.onclick = () => {
                            window.location.href = linkFinal;
                        };
                        containerResultados.appendChild(item);
                    });
                    containerResultados.style.display = 'block';
                } else {
                    // Caso não encontre nada, limpa e esconde ou mostra aviso
                    containerResultados.innerHTML = `<div style="padding:15px; color:#999; font-size:12px; text-align:center;">Nenhum look encontrado 💜</div>`;
                    containerResultados.style.display = 'block';
                }
            } else {
                containerResultados.style.display = 'none';
            }
        });
    }
    
    // Fecha a busca ao clicar fora
    document.addEventListener('click', (e) => {
        if (!inputBusca.contains(e.target) && !containerResultados.contains(e.target)) {
            containerResultados.style.display = 'none';
        }
    });
});
/* ==========================================
    LÓGICA EXCLUSIVA DA PÁGINA DE PRODUTO
   ========================================== */
document.addEventListener('click', function(e) {
    // Lógica para trocar a imagem (Miniaturas)
    if (e.target.classList.contains('thumb-item')) {
        const mainImg = document.getElementById('mainImg');
        if (mainImg) {
            mainImg.src = e.target.src;
            
            // Atualiza a borda da miniatura ativa
            document.querySelectorAll('.thumb-item').forEach(img => img.classList.remove('active'));
            e.target.classList.add('active');
        }
    }

    // Lógica para selecionar o tamanho
    if (e.target.classList.contains('size-option')) {
        document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }
});
/* Lógica Parallax para Categorias (Suave e Controlada) */
window.addEventListener('scroll', function() {
    const section = document.querySelector('.categorias-parallax-modern');
    const items = document.querySelectorAll('.parallax-item');
    
    if (!section) return;

    // Verifica se a seção está visível na tela
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
        // O cálculo usa a posição da seção em relação ao topo da janela
        const scrollOffset = window.innerHeight - rect.top;

        items.forEach(item => {
            const speed = parseFloat(item.getAttribute('data-speed')) || 0.1;
            // Limita o movimento para não "fugir" do layout
            const yPos = (scrollOffset * speed);
            item.style.transform = `translateY(${yPos}px)`;
        });
    }
});
/* ==========================================
   EFEITO HEADER TRANSPARENTE -> BRANCO
   ========================================== */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.main-header');
    
    // Se rolar mais de 50px, adiciona a classe 'scrolled'
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
/* ==========================================
    FUNÇÃO DE COMPARTILHAMENTO
   ========================================== */
function compartilharProduto(nome) {
    const url = window.location.href;
    const texto = `Olha esse look que encontrei na Perfetto Store: ${nome} 💜`;

    if (navigator.share) {
        navigator.share({
            title: 'Perfetto Store',
            text: texto,
            url: url
        }).catch(console.error);
    } else {
        // Fallback para navegadores que não suportam (copiar link)
        navigator.clipboard.writeText(`${texto} - ${url}`);
        alert("Link copiado para a área de transferência! 💜");
    }
}
/* ==========================================
    CONTROLE DO PAINEL DO CARRINHO
   ========================================== */

function inicializarCarrinho() {
    // Ajustado para o ID 'cart-trigger' do seu HTML
    const btnAbrir = document.getElementById('cart-trigger'); 
    const btnFechar = document.getElementById('close-cart');
    const cartSide = document.getElementById('cart-side');
    const overlay = document.getElementById('cart-overlay');

    const toggleCart = () => {
        if (cartSide) cartSide.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        
        // Se abriu o carrinho, renderiza os itens
        if (cartSide && cartSide.classList.contains('active')) {
            renderizarItensCarrinho();
        }
    };

    if (btnAbrir) btnAbrir.onclick = toggleCart;
    if (btnFechar) btnFechar.onclick = toggleCart;
    if (overlay) overlay.onclick = toggleCart;
}

function renderizarItensCarrinho() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total-value');
    
    if (!container) return;

    // Se o carrinho estiver vazio
    if (!listaDeProdutos || listaDeProdutos.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding-top:50px;">
                <p style="color:#999; font-size: 14px;">Seu carrinho está vazio 🌸</p>
            </div>`;
        if (totalElement) totalElement.innerText = "R$ 0,00";
        return;
    }

    let html = "";
    let somaTotal = 0;

    // Detecta se precisa de prefixo ../ para as imagens (se estiver em subpastas)
    const prefixo = (window.location.pathname.includes('/vestidos/') || 
                     window.location.pathname.includes('/blusas/') ||
                     window.location.pathname.includes('/calcas/') ||
                     window.location.pathname.includes('/saias/') ||
                     window.location.pathname.includes('/conjuntos/')) ? '../' : '';

    listaDeProdutos.forEach((item, index) => {
        const subtotal = item.preco * item.qtd;
        somaTotal += subtotal;

        // Garante que o caminho da imagem esteja correto
        const imgSrc = item.img.startsWith('http') ? item.img : prefixo + item.img;

        html += `
            <div class="cart-item" style="display: flex; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <img src="${imgSrc}" alt="${item.nome}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 5px;">
                <div style="flex:1;">
                    <p style="font-weight:bold; margin:0; font-size:14px; color: #333;">${item.nome}</p>
                    <p style="color:#957DAD; font-size:13px; margin:5px 0; font-weight: 600;">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button onclick="alterarQtd(${index}, -1)" style="border:1px solid #ddd; background:#fff; border-radius:4px; width:24px; height:24px; cursor:pointer;">-</button>
                        <span style="font-size: 14px;">${item.qtd}</span>
                        <button onclick="alterarQtd(${index}, 1)" style="border:1px solid #ddd; background:#fff; border-radius:4px; width:24px; height:24px; cursor:pointer;">+</button>
                    </div>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size: 20px;">&times;</button>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalElement) totalElement.innerText = `R$ ${somaTotal.toFixed(2).replace('.', ',')}`;
}

function alterarQtd(index, valor) {
    listaDeProdutos[index].qtd += valor;
    
    if (listaDeProdutos[index].qtd <= 0) {
        listaDeProdutos.splice(index, 1);
    }
    
    salvarDados(); // Atualiza o localStorage
    renderizarItensCarrinho(); // Recarrega a lista visual
    atualizarContadorTotal(); // Atualiza o número no ícone do carrinho
}

function removerDoCarrinho(index) {
    listaDeProdutos.splice(index, 1);
    salvarDados();
    renderizarItensCarrinho();
    atualizarContadorTotal();
}

function finalizarCompra() {
    if(!listaDeProdutos || listaDeProdutos.length === 0) return alert("Seu carrinho está vazio!");
    
    let mensagem = "Olá Perfetto Store! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;

    listaDeProdutos.forEach(item => {
        mensagem += `• ${item.nome} (${item.qtd}x) - R$ ${(item.preco * item.qtd).toFixed(2)}\n`;
        total += item.preco * item.qtd;
    });
    
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;
    
    // Substitua pelo seu número real do WhatsApp
    const fone = "5547996302096"; 
    const url = `https://wa.me/${fone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Inicia as funções quando o site carrega
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrinho();
});