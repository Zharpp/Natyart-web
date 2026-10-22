// ==========================================
// 1. CONFIGURAÇÃO E DADOS DAS ARTES
// ==========================================
const TOTAL_FOTOS = 22; // Atualizado para corresponder ao total de itens abaixo

// Títulos e descrições personalizadas
const ARTES_CUSTOMIZADAS = {
    1: { titulo: 'Mãe Alternativa - 2026', descricao: 'Lápis de cor aquarelável sobre papel (22x13).' },
    2: { titulo: 'Maternidade é o Florescer de Outra Mulher - 2026', descricao: 'Lápis de cor aquarelável sobre papel (22x13).' },
    3: { titulo: 'Ser Forte por Mim - 2026', descricao: 'Lápis de cor aquarelável sobre papel (22x13).' },
    4: { titulo: 'Porto Seguro - 2026', descricao: 'Lápis de cor aquarelável sobre papel (22x13).' },
    5: { titulo: 'Tribulação - 2026', descricao: 'Lápis de cor aquarelável sobre papel (22x13).' },
    6: { titulo: 'Frustração - 2026', descricao: 'Lápis de cor aquarelável sobre papel (22x13).' },
    7: { titulo: 'Pequeno e Frágil - 2026', descricao: 'Técnica mista sobre papel (22x13).' },
    8: { titulo: 'Florescendo no Seu Crescimento - 2026', descricao: 'Técnica mista sobre papel (22x13).' },
    9: { titulo: 'O Abraço Laranja - 2026', descricao: 'Tinta guache (20x21).' },
    10: { titulo: 'A Mente de uma Puérpera - 2026', descricao: 'Técnica mista (21x15).' },
    11: { titulo: 'Dar à Luz - 2026', descricao: 'Giz pastel oleoso (21x30).' },
    12: { titulo: 'Meu Maior Medo - 2025', descricao: 'Lápis de cor aquarelável (21x30).' },
    13: { titulo: 'Suportar - 2026', descricao: 'Lápis de cor aquarelável (21x30).' },
    14: { titulo: 'Obrigado, Meu Filho - 2026', descricao: 'Lápis de cor aquarelável (21x30).' },
    15: { titulo: 'Eu - 2025', descricao: 'Tinta aquarela sobre papel (21x30).' },
    16: { titulo: 'Blá Blá Blá - 2024', descricao: 'Tinta aquarela sobre papel (21x30).' },
    17: { titulo: 'Confiança', descricao: 'Tinta acrílica sobre tela (15x20).' },
    18: { titulo: 'Afeto é Amamentar - 2026', descricao: 'Tinta acrílica sobre papel Paraná (40x50).' },
    19: { titulo: 'Dia das Mães - 2024', descricao: 'Arte digital (21x30).' },
    20: { titulo: 'Regar - 2026', descricao: 'Lápis de cor aquarelável (22x13).' }, 
    21: { titulo: 'Sexto mês da gravidez', descricao: 'Arte Digital (21x30).'},       
    22: { titulo: 'Parto', descricao: 'Técnica mista sobre tela.' },
};

// Geração do array de obras
const obras = Array.from({ length: TOTAL_FOTOS }, (_, index) => {
    const numero = index + 1;
    const custom = ARTES_CUSTOMIZADAS[numero];

    return {
        src: `extrair/arte${numero}.jpg`,
        titulo: custom?.titulo || `Obra NatArt #${numero}`,
        descricao: custom?.descricao || 'Ilustração autoral'
    };
});

// ==========================================
// 2. REFERÊNCIAS DO DOM E ESTADO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const carousel = document.getElementById('carousel');

    if (!track || !dotsContainer) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    const TEMPO_TROCA = 10000; // 10 segundos

    // ==========================================
    // 3. RENDERIZAÇÃO E NAVEGAÇÃO
    // ==========================================
    function renderCarousel() {
        track.innerHTML = obras.map(obra => `
            <div class="carousel-slide">
                <img src="${obra.src}" alt="${obra.titulo}">
                <div class="slide-caption">
                    <h3>${obra.titulo}</h3>
                    <p>${obra.descricao}</p>
                </div>
            </div>
        `).join('');

        dotsContainer.innerHTML = obras.map((_, i) => `
            <div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
        `).join('');
    }

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    const goToSlide = (index) => { currentIndex = index; updateCarousel(); };
    const nextSlide = () => { currentIndex = (currentIndex + 1) % obras.length; updateCarousel(); };
    const prevSlide = () => { currentIndex = (currentIndex - 1 + obras.length) % obras.length; updateCarousel(); };

    // ==========================================
    // 4. AUTOPLAY
    // ==========================================
    function startAutoPlay() {
        if (!autoPlayTimer) {
            autoPlayTimer = setInterval(nextSlide, TEMPO_TROCA);
        }
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // ==========================================
    // 5. EVENTOS
    // ==========================================
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            goToSlide(Number(e.target.dataset.index));
            resetAutoPlay();
        }
    });

    if (btnNext && btnPrev) {
        btnNext.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        btnPrev.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        let startX = 0;
        carousel.addEventListener('touchstart', (e) => { 
            stopAutoPlay();
            startX = e.touches[0].clientX; 
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const diffX = startX - e.changedTouches[0].clientX;
            if (Math.abs(diffX) > 50) {
                diffX > 0 ? nextSlide() : prevSlide();
            }
            startAutoPlay();
        }, { passive: true });
    }

    // Inicialização
    renderCarousel();
    startAutoPlay();
});