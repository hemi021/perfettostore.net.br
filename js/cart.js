function renderizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const totalDisplay = document.getElementById('valor-total');
    
    // Pega os itens salvos no computador do cliente
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    
    if (!lista) return;

    lista.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <p style="font-size: 1.2rem; color: #666;">Seu carrinho está vazio... 🌸</p>
                <a href="index.html" style="display:inline-block; margin-top:20px; color: #957DAD; font-weight: bold; text-decoration: underline;">
                    VOLTAR PARA A LOJA
                </a>
            </div>
        `;
        if (totalDisplay) totalDisplay.innerText = "R$ 0,00";
        return;
    }

    // Criando os cards um por um
    carrinho.forEach((item, index) => {
        total += item.preco;
        
        // Criando o HTML do card com foto, info e botão de remover
        const cardHTML = `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='img/PS/PS.png'">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p class="price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-remove" onclick="removerItem(${index})">
                        <i class="fas fa-trash-alt"></i> Remover
                    </button>
                </div>
            </div>
        `;
        lista.innerHTML += cardHTML;
    });
    
    // Atualiza o valor total na tela
    if (totalDisplay) {
        totalDisplay.innerText = "R$ " + total.toFixed(2).replace('.', ',');
    }
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('perfetto_cart', JSON.stringify(carrinho));
    renderizarCarrinho(); // Atualiza a tela na hora
}

function finalizarCompra() {
    let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];
    if (carrinho.length === 0) {
        alert("Adicione produtos antes de finalizar!");
        return;
    }
    
    let texto = "✨ *Novo Pedido - Perfetto Store* ✨\n\n";
    carrinho.forEach(item => {
        texto += `• ${item.nome} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
    });
    
    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    texto += `\n💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    
    const url = `https://wa.me/5547991778060?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// Executa assim que abrir a página
document.addEventListener('DOMContentLoaded', renderizarCarrinho);