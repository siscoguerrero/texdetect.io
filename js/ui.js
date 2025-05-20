// Controlador de la interfaz de usuario
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar selector de idioma
    initLanguageSelector();
    
    // Inicializar animación de carga
    initLoadingAnimation();
    
    // Inicializar eventos de la interfaz
    initUIEvents();
});

// Inicializar selector de idioma
function initLanguageSelector() {
    const langEs = document.getElementById('lang-es');
    const langEn = document.getElementById('lang-en');
    
    // Cargar preferencia guardada o usar español por defecto
    const savedLang = localStorage.getItem('preferred-language') || 'es';
    setLanguage(savedLang);
    
    // Actualizar botones según idioma actual
    if (savedLang === 'es') {
        langEs.classList.add('active');
        langEn.classList.remove('active');
    } else {
        langEn.classList.add('active');
        langEs.classList.remove('active');
    }
    
    // Eventos de cambio de idioma
    langEs.addEventListener('click', () => {
        setLanguage('es');
        langEs.classList.add('active');
        langEn.classList.remove('active');
    });
    
    langEn.addEventListener('click', () => {
        setLanguage('en');
        langEn.classList.add('active');
        langEs.classList.remove('active');
    });
}

// Establecer idioma en la interfaz
function setLanguage(lang) {
    localStorage.setItem('preferred-language', lang);
    
    // Actualizar textos de la interfaz
    document.getElementById('analyze-btn').innerHTML = `<i class="fas fa-search"></i> ${translations[lang].analyzeBtn}`;
    document.getElementById('clear-btn').innerHTML = `<i class="fas fa-trash"></i> ${translations[lang].clearBtn}`;
    
    // Actualizar textos de carga
    const loadingText = document.querySelector('.loading-container p:first-child');
    const loadingSubtext = document.querySelector('.loading-container p.small');
    
    if (loadingText) loadingText.textContent = translations[lang].loadingText;
    if (loadingSubtext) loadingSubtext.textContent = translations[lang].loadingSubtext;
    
    // Actualizar textos de resultados si están visibles
    const resultsSection = document.getElementById('results-section');
    if (resultsSection && resultsSection.style.display !== 'none') {
        updateResultsLanguage(lang);
    }
}

// Actualizar textos en la sección de resultados
function updateResultsLanguage(lang) {
    // Títulos de secciones
    const sectionTitles = document.querySelectorAll('.results-container h2, .results-container h3');
    
    sectionTitles.forEach(title => {
        if (title.textContent.includes('Resultados') || title.textContent.includes('Analysis Results')) {
            title.textContent = translations[lang].resultsTitle;
        } else if (title.textContent.includes('Conclusión') || title.textContent.includes('Conclusion')) {
            title.textContent = translations[lang].conclusionTitle;
        } else if (title.textContent.includes('Comparación') || title.textContent.includes('Comparison')) {
            title.textContent = translations[lang].comparisonTitle;
        } else if (title.textContent.includes('Métricas') || title.textContent.includes('Detailed metrics')) {
            title.textContent = translations[lang].metricsTitle;
        } else if (title.textContent.includes('Análisis por oraciones') || title.textContent.includes('Sentence analysis')) {
            title.textContent = translations[lang].sentenceAnalysisTitle;
        } else if (title.textContent.includes('Recomendaciones') || title.textContent.includes('Recommendations')) {
            title.textContent = 'Recomendaciones';
        } else if (title.textContent.includes('Comparación con documentos') || title.textContent.includes('Comparison with Studocu')) {
            title.textContent = translations[lang].studocuTitle;
        }
    });
    
    // Leyenda de oraciones
    const sentenceLegend = document.querySelector('.sentence-legend');
    if (sentenceLegend) {
        const spans = sentenceLegend.querySelectorAll('span');
        if (spans.length >= 3) {
            spans[0].textContent = translations[lang].humanSentence;
            spans[1].textContent = translations[lang].aiSentence;
            spans[2].textContent = translations[lang].aiHighSentence;
        }
    }
    
    // Descripción de Studocu
    const studocuDesc = document.querySelector('#studocu-section p');
    if (studocuDesc) {
        studocuDesc.textContent = translations[lang].studocuDesc;
    }
    
    // Botón de Google
    const googleBtn = document.querySelector('.google-auth-btn');
    if (googleBtn) {
        googleBtn.innerHTML = `<i class="fab fa-google"></i> ${translations[lang].googleAuthBtn}`;
    }
    
    // Botón de nuevo análisis
    const newAnalysisBtn = document.getElementById('new-analysis-btn');
    if (newAnalysisBtn) {
        newAnalysisBtn.innerHTML = `<i class="fas fa-redo"></i> ${translations[lang].newAnalysisBtn}`;
    }
    
    // Botón de humanización
    const humanizeBtn = document.querySelector('button.secondary-btn:not(#clear-btn)');
    if (humanizeBtn && humanizeBtn.textContent.includes('Humanizar') || humanizeBtn && humanizeBtn.textContent.includes('Humanize')) {
        humanizeBtn.innerHTML = `<i class="fas fa-magic"></i> ${translations[lang].humanizeBtn}`;
    }
}

// Inicializar animación de carga
function initLoadingAnimation() {
    const clockLoader = document.querySelector('.clock-loader');
    if (!clockLoader) return;
    
    // Crear manecillas del reloj
    const hourHand = document.createElement('div');
    hourHand.classList.add('hour-hand');
    
    const minuteHand = document.createElement('div');
    minuteHand.classList.add('minute-hand');
    
    clockLoader.appendChild(hourHand);
    clockLoader.appendChild(minuteHand);
    
    // Animación de rotación
    let rotation = 0;
    
    function animateClock() {
        rotation += 6;
        minuteHand.style.transform = `rotate(${rotation}deg)`;
        hourHand.style.transform = `rotate(${rotation / 12}deg)`;
        
        if (document.querySelector('.loading-container').style.display !== 'none') {
            requestAnimationFrame(animateClock);
        }
    }
    
    // Iniciar animación cuando se muestre la pantalla de carga
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const loadingContainer = document.querySelector('.loading-container');
            if (loadingContainer && loadingContainer.style.display !== 'none') {
                requestAnimationFrame(animateClock);
            }
        });
    }
}

// Inicializar eventos de la interfaz
function initUIEvents() {
    // Cambiar entre pestañas de resultados
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase activa al botón clickeado
            button.classList.add('active');
            
            // Mostrar contenido correspondiente
            const tabId = button.getAttribute('data-tab');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabContents.forEach(content => {
                if (content.getAttribute('data-tab') === tabId) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
    
    // Mostrar/ocultar detalles de métricas
    document.addEventListener('click', (e) => {
        if (e.target.closest('.metric-card')) {
            const card = e.target.closest('.metric-card');
            card.classList.toggle('expanded');
        }
    });
}
