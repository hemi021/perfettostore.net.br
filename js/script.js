// Controle simples de carrinho
const cartCountEl = document.getElementById('cart-count');
let cartCount = 0;

document.querySelectorAll('.buy').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    cartCount++;
    cartCountEl.textContent = cartCount;

    // Feedback visual
    btn.textContent = 'Adicionado ✓';
    btn.disabled = true;
    setTimeout(()=>{
      btn.textContent = 'Comprar';
      btn.disabled = false;
    }, 1200);
  });
});
// ==========================
// CARROSSEL DE BANNERS
// ==========================
const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.carousel .slide');
const prevBtn = document.querySelector('.carousel .prev');
const nextBtn = document.querySelector('.carousel .next');
const indicatorsContainer = document.getElementById('indicators');

let currentIndex = 0;
let interval = setInterval(nextSlide, 4000); // muda a cada 4s

// Criar indicadores dinamicamente
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  indicatorsContainer.appendChild(dot);
});
const dots = indicatorsContainer.querySelectorAll('button');

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach(d => d.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

// Botões de navegação
nextBtn.addEventListener('click', () => {
  nextSlide();
  resetInterval();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetInterval();
});

// Reinicia o autoplay quando usuário interage
function resetInterval() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 4000);
}