function renderizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const totalDisplay = document.getElementById('valor-total');
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    
    lista.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <p>Seu carrinho está vazio... 🌸</p>
                <a href="index.html" class="btn-buy" style="display:inline-block; text-decoration:none; margin-top:20px; width: auto; padding: 12px 30px;">VER PRODUTOS</a>
            </div>
        `;
        totalDisplay.innerText = "0,00";
        return;
    }

    carrinho.forEach((item, index) => {
        total += item.preco;
        lista.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p class="price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-remove" onclick="removerItem(${index})">
                        <i class="far fa-trash-alt"></i> Remover
                    </button>
                </div>
            </div>
        `;
    });
    
    totalDisplay.innerText = total.toFixed(2).replace('.', ',');
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('perfetto_cart', JSON.stringify(carrinho));
    renderizarCarrinho();
    
    // Atualiza o contador do header se ele existir nesta página
    if (typeof atualizarBadge === "function") {
        atualizarBadge();
    }
}

function finalizarCompra() {
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    if (carrinho.length === 0) return;
    
    let texto = "✨ *Novo Pedido - Perfetto Store* ✨\n\n";
    carrinho.forEach(item => {
        texto += `• ${item.nome} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
    });
    
    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    texto += `\n💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    
    const url = `https://wa.me/5547991778060?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', renderizarCarrinho);
function renderizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const totalDisplay = document.getElementById('valor-total');
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    
    lista.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <p>Seu carrinho está vazio... 🌸</p>
                <a href="index.html" class="btn-continue" style="margin-top:20px; color: #957DAD; font-weight: bold; text-decoration: underline;">
                    VOLTAR PARA A LOJA
                </a>
            </div>
        `;
        totalDisplay.innerText = "0,00";
        return;
    }

    carrinho.forEach((item, index) => {
        total += item.preco;
        lista.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p class="price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-remove" onclick="removerItem(${index})">
                        <i class="fas fa-trash-alt"></i> Remover
                    </button>
                </div>
            </div>
        `;
    });
    
    totalDisplay.innerText = total.toFixed(2).replace('.', ',');
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('perfetto_cart', JSON.stringify(carrinho));
    renderizarCarrinho();
}

function finalizarCompra() {
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    if (carrinho.length === 0) return;
    
    let texto = "✨ *Novo Pedido - Perfetto Store* ✨\n\n";
    carrinho.forEach(item => {
        texto += `• ${item.nome} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
    });
    
    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    texto += `\n💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    
    const url = `https://wa.me/5547991778060?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// Garante que a lista apareça assim que a página abrir
document.addEventListener('DOMContentLoaded', renderizarCarrinho);