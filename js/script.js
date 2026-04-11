// Controle do Menu
const menuToggle = document.getElementById('menu-toggle');
const menuSide = document.getElementById('menu-side');
const closeMenu = document.getElementById('close-menu');

if(menuToggle) {
    menuToggle.onclick = () => menuSide.classList.add('active');
}
if(closeMenu) {
    closeMenu.onclick = () => menuSide.classList.remove('active');
}

// Lógica de Carrinho Persistente
let carrinho = JSON.parse(localStorage.getItem('perfetto_cart')) || [];

function adicionarAoCarrinho(nome, preco, imagem) {
    const item = { nome, preco, imagem };
    carrinho.push(item);
    localStorage.setItem('perfetto_cart', JSON.stringify(carrinho));
    
    atualizarBadge();
    showPush(`✨ ${nome} adicionado!`);
}

function atualizarBadge() {
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = carrinho.length;
}

// Notificação Push elegante
function showPush(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: white; border-left: 5px solid #957DAD;
        padding: 15px 25px; border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        z-index: 9999; font-family: sans-serif;
    `;
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}

// Inicia o contador ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarBadge);
// Função para trocar a imagem principal da galeria
function changeImage(element) {
    const mainImg = document.getElementById('mainImg');
    mainImg.src = element.src;
    
    // Atualiza a borda da miniatura ativa
    document.querySelectorAll('.thumb-item').forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

// Função para selecionar o tamanho
function selectSize(element) {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
    
    // Opcional: mostrar push confirmando o tamanho
    console.log("Tamanho selecionado: " + element.innerText);
}
function toggleFavorito(botao, nomeProduto) {
    const icone = botao.querySelector('i');
    
    botao.classList.toggle('active');
    
    if (botao.classList.contains('active')) {
        icone.classList.replace('far', 'fas'); // Muda para coração preenchido
        showPush(`💜 ${nomeProduto} adicionado aos favoritos!`);
    } else {
        icone.classList.replace('fas', 'far'); // Volta para coração vazio
        showPush(`💔 ${nomeProduto} removido dos favoritos.`);
    }
}

// Função showPush atualizada para ser elegante
function showPush(msg) {
    const toast = document.createElement('div');
    toast.className = 'push-toast';
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%;
        transform: translateX(-50%); background: #2e1f4a;
        color: white; padding: 12px 25px; border-radius: 50px;
        z-index: 10000; font-size: 14px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}