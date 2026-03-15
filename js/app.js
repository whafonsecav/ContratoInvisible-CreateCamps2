// app.js

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // APLICAR CONFIGURACIÓN DE VIDEOS ODS 12 (Si existe config.js)
    // --------------------------------------------------
    function getYoutubeEmbed(urlOrId) {
        if (!urlOrId) return '';
        if (urlOrId.includes('/embed/')) return urlOrId;
        
        let videoId = urlOrId;
        const match = urlOrId.match(/(?:youtu\.be\/|v=)([^&]+)/);
        if (match && match[1]) {
            videoId = match[1];
        }
        // Usamos youtube-nocookie y pasamos parámetros de seguridad para prevenir Error 153
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
    }

    if (typeof CONFIG_VIDEOS !== 'undefined') {
        const v1_iframe = document.getElementById('iframe-video-1');
        const v1_link = document.getElementById('link-video-1');
        const v1_titulo = document.getElementById('titulo-video-1');
        if (v1_iframe && (CONFIG_VIDEOS.video1.url || CONFIG_VIDEOS.video1.youtube_id)) {
            const source = CONFIG_VIDEOS.video1.url || CONFIG_VIDEOS.video1.youtube_id;
            v1_iframe.src = getYoutubeEmbed(source);
            if (v1_link) v1_link.href = source.includes('http') ? source : `https://www.youtube.com/watch?v=${source}`;
        }
        if (v1_titulo && CONFIG_VIDEOS.video1.titulo) v1_titulo.textContent = CONFIG_VIDEOS.video1.titulo;

        const v2_iframe = document.getElementById('iframe-video-2');
        const v2_link = document.getElementById('link-video-2');
        const v2_titulo = document.getElementById('titulo-video-2');
        if (v2_iframe && (CONFIG_VIDEOS.video2.url || CONFIG_VIDEOS.video2.youtube_id)) {
            const source = CONFIG_VIDEOS.video2.url || CONFIG_VIDEOS.video2.youtube_id;
            v2_iframe.src = getYoutubeEmbed(source);
            if (v2_link) v2_link.href = source.includes('http') ? source : `https://www.youtube.com/watch?v=${source}`;
        }
        if (v2_titulo && CONFIG_VIDEOS.video2.titulo) v2_titulo.textContent = CONFIG_VIDEOS.video2.titulo;

        const v3_iframe = document.getElementById('iframe-video-3');
        const v3_link = document.getElementById('link-video-3');
        const v3_titulo = document.getElementById('titulo-video-3');
        if (v3_iframe && (CONFIG_VIDEOS.video3.url || CONFIG_VIDEOS.video3.youtube_id)) {
            const source = CONFIG_VIDEOS.video3.url || CONFIG_VIDEOS.video3.youtube_id;
            v3_iframe.src = getYoutubeEmbed(source);
            if (v3_link) v3_link.href = source.includes('http') ? source : `https://www.youtube.com/watch?v=${source}`;
        }
        if (v3_titulo && CONFIG_VIDEOS.video3.titulo) v3_titulo.textContent = CONFIG_VIDEOS.video3.titulo;
    }

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

    // LISTAS DE PASOS PARA LAMINA ALFABETISMO (Slide 3)
    const alfabetismoVisualSteps = [
        document.getElementById('a-step-0'),
        document.getElementById('a-step-1'),
        document.getElementById('a-step-2'),
        document.getElementById('a-step-3'),
        document.getElementById('a-step-4'),
        document.getElementById('a-step-5'),
        document.getElementById('a-step-6'),
        document.getElementById('a-step-7')
    ];

    const alfabetismoTextSteps = [
        document.getElementById('at-step-0'),
        document.getElementById('at-step-1'),
        document.getElementById('at-step-2'),
        document.getElementById('at-step-3'),
        document.getElementById('at-step-4'),
        document.getElementById('at-step-5'),
        document.getElementById('at-step-6'),
        document.getElementById('at-step-7')
    ];

    let currentAlfStep = 0;
    const totalAlfSteps = 8;

    // LISTAS DE PASOS PARA LAMINA DIAGNÓSTICO (Slide 4)
    const diagnosticoVisualSteps = [
        document.getElementById('d-step-0'),
        document.getElementById('d-step-1'),
        document.getElementById('d-step-2'),
        document.getElementById('d-step-3'),
        document.getElementById('d-step-4')
    ];

    const diagnosticoTextSteps = [
        document.getElementById('dt-step-0'),
        document.getElementById('dt-step-1'),
        document.getElementById('dt-step-2'),
        document.getElementById('dt-step-3'),
        document.getElementById('dt-step-4')
    ];

    let currentDiagStep = 0;
    const totalDiagSteps = 5;
    let diagTimerInterval = null;

    // LISTAS DE PASOS PARA LAMINA CIERRE (Slide 5)
    const cierreVisualSteps = [
        document.getElementById('cv-step-0'),
        document.getElementById('cv-step-1'),
        document.getElementById('cv-step-2'),
        document.getElementById('cv-step-3')
    ];

    const cierreTextSteps = [
        document.getElementById('ct-step-0'),
        document.getElementById('ct-step-1'),
        document.getElementById('ct-step-2'),
        document.getElementById('ct-step-3')
    ];

    let currentCierreStep = 0;
    const totalCierreSteps = 4;

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
        } else if (currentSlide === 3) {
            updateAlfabetismoSteps();
            if (currentAlfStep > 0) dots[3].classList.add('substep-active');
        } else if (currentSlide === 4) {
            updateDiagnosticoSteps();
            if (currentDiagStep > 0) dots[4].classList.add('substep-active');
        } else if (currentSlide === 5) {
            updateCierreSteps();
        } else {
            document.getElementById('slide-0').classList.remove('is-ironic');
        }

        // Si salimos del Slide 3, apagar videos
        if (currentSlide !== 3) {
            const slide3 = document.getElementById('slide-3');
            if (slide3) {
                const iframes = slide3.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    const src = iframe.src;
                    iframe.src = src;
                });
            }
        }
    }

    function updateAlfabetismoSteps() {
        // Reset Texts y Visuals generales
        alfabetismoTextSteps.forEach(ts => ts && ts.classList.remove('active'));
        alfabetismoVisualSteps.forEach(vs => {
            if (vs) {
                vs.classList.remove('active');
                // Detener videos embebidos cuando salen de la pantalla
                const iframe = vs.querySelector('iframe');
                if (iframe) {
                    const src = iframe.src;
                    iframe.src = src;
                }
            }
        });

        // Reactivar actual texto y visual
        if (alfabetismoTextSteps[currentAlfStep]) alfabetismoTextSteps[currentAlfStep].classList.add('active');
        if (alfabetismoVisualSteps[currentAlfStep]) alfabetismoVisualSteps[currentAlfStep].classList.add('active');

        if (currentAlfStep > 0) dots[3].classList.add('substep-active');
        else dots[3].classList.remove('substep-active');
    }

    function updateDiagnosticoSteps() {
        // Reset Texts y Visuals globales para Diag
        diagnosticoTextSteps.forEach(ts => ts && ts.classList.remove('active'));
        diagnosticoVisualSteps.forEach(vs => vs && vs.classList.remove('active'));

        // Reactivar actual texto y visual
        if (diagnosticoTextSteps[currentDiagStep]) diagnosticoTextSteps[currentDiagStep].classList.add('active');
        if (diagnosticoVisualSteps[currentDiagStep]) diagnosticoVisualSteps[currentDiagStep].classList.add('active');

        // Logic para el Reloj 10 Minutos Automático
        const clockEl = document.getElementById('diag-clock');
        if (currentDiagStep === 1 && currentSlide === 4) {
            clearInterval(diagTimerInterval);
            clockEl.textContent = "00:00";
            let seconds = 0;
            const targetSeconds = 600; // 10 minutes

            // Hacker-style decrypt effect
            const tickRate = 50; // ms per frame
            const duration = 5000; // 5 seconds duration
            let elapsed = 0;

            setTimeout(() => {
                diagTimerInterval = setInterval(() => {
                    elapsed += tickRate;
                    
                    if (elapsed >= duration) {
                        clockEl.textContent = "10:00";
                        clearInterval(diagTimerInterval);
                    } else {
                        // Random time like 08:43, 02:99, etc.
                        const rm = Math.floor(Math.random() * 99).toString().padStart(2, '0');
                        const rs = Math.floor(Math.random() * 99).toString().padStart(2, '0');
                        clockEl.textContent = `${rm}:${rs}`;
                    }
                }, tickRate);
            }, 800); // Wait for the number to finish sliding up
        } else {
            clearInterval(diagTimerInterval);
            if (clockEl) clockEl.textContent = "00:00";
        }

        if (currentDiagStep > 0) dots[4].classList.add('substep-active');
        else dots[4].classList.remove('substep-active');
    }

    function updateCierreSteps() {
        cierreTextSteps.forEach(ts => ts && ts.classList.remove('active'));
        cierreVisualSteps.forEach(vs => vs && vs.classList.remove('active'));

        if (cierreTextSteps[currentCierreStep]) cierreTextSteps[currentCierreStep].classList.add('active');
        if (cierreVisualSteps[currentCierreStep]) cierreVisualSteps[currentCierreStep].classList.add('active');
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
                currentSlide++;
                updateNav();
            }
        } else if (currentSlide === 3) {
            if (currentAlfStep < totalAlfSteps - 1) {
                currentAlfStep++;
                updateAlfabetismoSteps();
            } else {
                if (currentSlide < slides.length - 1) {
                    currentSlide++;
                    updateNav();
                }
            }
        } else if (currentSlide === 4) {
            if (currentDiagStep < totalDiagSteps - 1) {
                currentDiagStep++;
                updateDiagnosticoSteps();
            } else {
                if (currentSlide < slides.length - 1) {
                    currentSlide++;
                    updateNav();
                }
            }
        } else if (currentSlide === 5) {
            if (currentCierreStep < totalCierreSteps - 1) {
                currentCierreStep++;
                updateCierreSteps();
            } else {
                // Already on last step of last slide
            }
        } else if (currentSlide !== 2 && currentSlide < slides.length - 1) {
            currentSlide++;
            updateNav();
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
        } else if (currentSlide === 3) {
            if (currentAlfStep > 0) {
                currentAlfStep--;
                updateAlfabetismoSteps();
            } else {
                currentSlide--;
                updateNav();
            }
        } else if (currentSlide === 4) {
            if (currentDiagStep > 0) {
                currentDiagStep--;
                updateDiagnosticoSteps();
            } else {
                currentSlide--;
                updateNav();
            }
        } else if (currentSlide === 5) {
            if (currentCierreStep > 0) {
                currentCierreStep--;
                updateCierreSteps();
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
