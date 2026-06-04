function formatarPreco(valor) {
    return Number(valor).toFixed(2).replace('.', ',');
}

function getCarrinho() {
    return JSON.parse(localStorage.getItem('perfetto_cart')) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('perfetto_cart', JSON.stringify(carrinho));
}

function renderizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const totalDisplay = document.getElementById('valor-total');

    if (!lista) return;

    const carrinho = getCarrinho();
    lista.innerHTML = '';

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <p style="font-size: 1.2rem; color: #666;">Seu carrinho está vazio... 🌸</p>
                <a href="index.html" style="display:inline-block; margin-top:20px; color: #957DAD; font-weight: bold; text-decoration: underline;">
                    VOLTAR PARA A LOJA
                </a>
            </div>
        `;
        if (totalDisplay) totalDisplay.innerText = 'R$ 0,00';
        return;
    }

    let total = 0;

    carrinho.forEach((item, index) => {
        const preco = Number(item.preco) || 0;
        total += preco;

        lista.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem || 'img/PS/PS.png'}" alt="${item.nome}" onerror="this.src='img/PS/PS.png'">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p class="price">R$ ${formatarPreco(preco)}</p>
                    <button class="btn-remove" onclick="removerItem(${index})">
                        <i class="fas fa-trash-alt"></i> Remover
                    </button>
                </div>
            </div>
        `;
    });

    if (totalDisplay) {
        totalDisplay.innerText = `R$ ${formatarPreco(total)}`;
    }
}

function removerItem(index) {
    const carrinho = getCarrinho();
    carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}

function finalizarCompra() {
    const carrinho = getCarrinho();

    if (carrinho.length === 0) {
        alert('Adicione produtos antes de finalizar!');
        return;
    }

    let texto = '✨ *Novo Pedido - Perfetto Store* ✨\n\n';

    carrinho.forEach(item => {
        const preco = Number(item.preco) || 0;
        texto += `• ${item.nome} - R$ ${formatarPreco(preco)}\n`;
    });

    const total = carrinho.reduce((acc, item) => acc + (Number(item.preco) || 0), 0);
    texto += `\n💰 *Total: R$ ${formatarPreco(total)}*`;

    const url = `https://wa.me/5547991778060?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', renderizarCarrinho);