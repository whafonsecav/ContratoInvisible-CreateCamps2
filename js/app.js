// app.js

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const slides = document.querySelectorAll('.slide');
    const headerNavItems = document.querySelectorAll('.nav-item');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicatorsContainer = document.getElementById('slide-indicators');

    let currentSlide = 0;

    // --- GENERAR SILUETAS (Slide 1) ---
    const silhouettesContainer = document.getElementById('silhouettes-container');
    const silhouettesList = [];
    if (silhouettesContainer) {
        // 16 estudiantes, 1 docente = 17 en total
        for (let i = 0; i < 17; i++) {
            const isTeacher = i === 16;
            const wrap = document.createElement('div');
            wrap.className = `silhouette-wrap ${isTeacher ? 'sil-teacher' : ''}`;
            wrap.style.animationDelay = `${i * 0.3}s`; // ANIMACION LENTA: 0.3 x 17 = ~5 segundos

            const coin = document.createElement('div');
            coin.className = 'sil-coin-static';
            coin.textContent = '$20';
            coin.style.transitionDelay = `${i * 0.25}s`;

            const icon = document.createElement('i');
            icon.setAttribute('data-lucide', 'user');
            icon.className = 'sil-icon';

            wrap.appendChild(coin);
            wrap.appendChild(icon);
            silhouettesContainer.appendChild(wrap);
            silhouettesList.push(wrap);
        }
        lucide.createIcons();
    }

    // LISTAS DE PASOS PARA LAMINA DE MECANICA (Slide 1)
    const mechanicsVisualSteps = [
        document.getElementById('v-step-0'), // 0. Participantes
        document.getElementById('v-step-0'), // 1. Monedas (mismo div, diferente clase visual)
        document.getElementById('v-step-2'), // 2. 10 Productos
        document.getElementById('v-step-3'), // 3. Base $1
        document.getElementById('v-step-4'), // 4. Llamados
        document.getElementById('v-step-5'), // 5. Pago
        document.getElementById('v-step-6')  // 6. Reglas
    ];

    const mechanicsTextSteps = [
        document.getElementById('t-step-0'),
        document.getElementById('t-step-1'),
        document.getElementById('t-step-2'),
        document.getElementById('t-step-3'),
        document.getElementById('t-step-4'),
        document.getElementById('t-step-5'),
        document.getElementById('t-step-6')
    ];

    let currentMechStep = 0;
    const totalMechSteps = 7;

    // INDICADORES (DOTS)
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    // ESTADO DEL CONTADOR BASE
    let counterInterval = null;

    // NAVEGACION (SLIDES Y STEPS)
    function updateNav() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) slide.classList.add('active');
            else slide.classList.remove('active');
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
            dot.classList.remove('substep-active');
        });

        headerNavItems.forEach(item => {
            const sec = parseInt(item.dataset.section);
            item.classList.toggle('active', sec === currentSlide);
        });

        if (currentSlide === 1) {
            updateMechanicsSteps();
            if (currentMechStep > 0) dots[1].classList.add('substep-active');
        } else {
            document.getElementById('slide-0').classList.remove('is-ironic');
        }
    }

    function updateMechanicsSteps() {
        // Reset Texts y Visuals generales
        mechanicsTextSteps.forEach(ts => ts && ts.classList.remove('active'));
        mechanicsVisualSteps.forEach(vs => vs && vs.classList.remove('active'));

        // Reactivar actual texto
        if (mechanicsTextSteps[currentMechStep]) mechanicsTextSteps[currentMechStep].classList.add('active');

        // Manejo Específico JS de Animations Visuales por Paso
        if (currentMechStep === 0) {
            // STEP 0: Entran Participantes Lento (5s)
            mechanicsVisualSteps[0].classList.add('active');
            mechanicsVisualSteps[0].classList.remove('show-coins', 'show-coins-static');

        } else if (currentMechStep === 1) {
            // STEP 1: Explosión de Monedas 20 Central
            mechanicsVisualSteps[0].classList.add('active');
            mechanicsVisualSteps[0].classList.add('show-coins'); // Trigger vault anim CSS

            // Timeout para mostrar estáticas en sus cabezas
            setTimeout(() => {
                if (currentSlide === 1 && currentMechStep === 1) {
                    mechanicsVisualSteps[0].classList.add('show-coins-static');
                }
            }, 800);

        } else {
            mechanicsVisualSteps[0].classList.remove('show-coins', 'show-coins-static');

            if (mechanicsVisualSteps[currentMechStep]) {
                const activeVs = mechanicsVisualSteps[currentMechStep];
                activeVs.classList.add('active');

                // STEP 3: Logic de Contador de 10 Segundos (ahora es el paso 3)
                if (currentMechStep === 3) {
                    const counterEl = document.getElementById('base-counter');
                    counterEl.textContent = "1";
                    let count = 1;
                    clearInterval(counterInterval);
                    // Arranca y dura 10 segundos en llegar a 20 (500ms por iteracion)
                    setTimeout(() => {
                        if (currentSlide === 1 && currentMechStep === 3) {
                            counterInterval = setInterval(() => {
                                count++;
                                counterEl.textContent = count;
                                if (count >= 20) clearInterval(counterInterval);
                            }, 500);
                        }
                    }, 500);
                } else {
                    clearInterval(counterInterval);
                    const counterEl = document.getElementById('base-counter');
                    if (counterEl) counterEl.textContent = "1";
                }

                // STEP 4: Sub-Cantos "A La 1... A Las 2..." Sequence Rediseñado (ahora paso 4)
                if (currentMechStep === 4) {
                    activeVs.classList.remove('show-c1', 'show-c2', 'show-c3', 'show-hammer', 'show-vendido');

                    setTimeout(() => activeVs.classList.add('show-c1'), 200);
                    setTimeout(() => { activeVs.classList.remove('show-c1'); activeVs.classList.add('show-c2'); }, 1800);
                    setTimeout(() => { activeVs.classList.remove('show-c2'); activeVs.classList.add('show-c3'); }, 3600);
                    setTimeout(() => activeVs.classList.add('show-hammer'), 4800);
                    setTimeout(() => activeVs.classList.add('show-vendido'), 4950);
                } else {
                    activeVs.classList.remove('show-c1', 'show-c2', 'show-c3', 'show-hammer', 'show-vendido');
                }
            }
        }

        if (currentMechStep > 0) dots[1].classList.add('substep-active');
        else dots[1].classList.remove('substep-active');
    }

    function next() {
        if (currentSlide === 0) {
            currentSlide++;
            updateNav();
        } else if (currentSlide === 1) {
            if (currentMechStep < totalMechSteps - 1) {
                currentMechStep++;
                updateMechanicsSteps();
            } else {
                console.log("End of mechanics slide");
            }
        }
    }

    function prev() {
        if (currentSlide === 1) {
            if (currentMechStep > 0) {
                currentMechStep--;
                updateMechanicsSteps();
            } else {
                currentSlide--;
                updateNav();
            }
        } else if (currentSlide > 0) {
            currentSlide--;
            updateNav();
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        updateNav();
    }

    // LISTNERS
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    headerNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const sec = parseInt(item.dataset.section);
            if (document.getElementById(`slide-${sec}`)) goToSlide(sec);
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    });

    let touchstartX = 0; let touchendX = 0;
    document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    document.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX - 50) next();
        if (touchendX > touchstartX + 50) prev();
    }, { passive: true });

    // GLITCH INTERACTION
    const introSlide = document.getElementById('slide-0');
    introSlide.addEventListener('pointerdown', (e) => {
        introSlide.classList.toggle('is-ironic');
    });

    // INIT
    updateNav();
});
