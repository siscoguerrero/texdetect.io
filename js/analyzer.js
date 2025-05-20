// Controlador principal para el análisis de texto
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado completamente, inicializando analizador de texto");
    
    // Referencias a elementos del DOM
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const charCount = document.querySelector('.char-count');
    const loadingSection = document.getElementById('loading-section');
    const sourceButtons = document.querySelectorAll('.source-btn');
    
    console.log("Elementos del DOM:", {
        textInput: textInput ? "Encontrado" : "No encontrado",
        analyzeBtn: analyzeBtn ? "Encontrado" : "No encontrado",
        clearBtn: clearBtn ? "Encontrado" : "No encontrado",
        charCount: charCount ? "Encontrado" : "No encontrado",
        loadingSection: loadingSection ? "Encontrado" : "No encontrado",
        sourceButtons: sourceButtons.length
    });
    
    // Variables de estado
    let selectedSource = null;
    let isAnalyzing = false;
    let progressInterval = null;
    
    // Inicializar la aplicación
    init();
    
    // Función de inicialización
    function init() {
        console.log("Inicializando eventos");
        
        // Configurar eventos
        if (textInput) {
            textInput.addEventListener('input', updateCharCount);
            console.log("Evento input registrado para textInput");
        }
        
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', function() {
                console.log("Botón de análisis clickeado");
                analyzeText();
            });
            console.log("Evento click registrado para analyzeBtn");
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', clearText);
            console.log("Evento click registrado para clearBtn");
        }
        
        // Configurar botones de fuente
        if (sourceButtons) {
            sourceButtons.forEach(button => {
                button.addEventListener('click', function() {
                    selectSource(this);
                });
            });
            console.log("Eventos click registrados para sourceButtons");
        }
        
        // Cargar ejemplos predefinidos
        loadExamples();
        console.log("Ejemplos cargados");
    }
    
    // Actualizar contador de caracteres
    function updateCharCount() {
        if (textInput && charCount) {
            const count = textInput.value.length;
            charCount.textContent = `${count}/50000 caracteres`;
        }
    }
    
    // Seleccionar fuente de texto
    function selectSource(button) {
        if (!button) return;
        
        // Eliminar selección anterior
        sourceButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Seleccionar nueva fuente
        button.classList.add('active');
        selectedSource = button.id;
        
        // Cargar ejemplo correspondiente
        loadSourceExample(selectedSource);
    }
    
    // Cargar ejemplos predefinidos
    function loadExamples() {
        // Ejemplos predefinidos para cada fuente
        window.textExamples = {
            'source-chatgpt': `La inteligencia artificial (IA) es una rama de la informática que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Estas tareas incluyen el aprendizaje, el razonamiento, la resolución de problemas, la percepción y la comprensión del lenguaje natural.

En las últimas décadas, la IA ha experimentado avances significativos, impulsados por el aumento de la potencia computacional, la disponibilidad de grandes conjuntos de datos y los avances en algoritmos de aprendizaje automático. Estos avances han permitido el desarrollo de aplicaciones prácticas en diversos campos, como la medicina, las finanzas, el transporte y el entretenimiento.

Uno de los enfoques más prometedores en la IA actual es el aprendizaje profundo, que utiliza redes neuronales artificiales con múltiples capas para procesar datos y aprender representaciones jerárquicas. Este enfoque ha demostrado ser particularmente eficaz en tareas como el reconocimiento de imágenes, la traducción automática y el procesamiento del lenguaje natural.`,
            
            'source-human': `¡Vaya día más raro! Salí de casa esta mañana y me encontré con que mi coche no arrancaba. Justo hoy que tenía esa reunión tan importante... En fin, llamé a un taxi, pero el tráfico era horrible y llegué 20 minutos tarde.

Mi jefe no parecía muy contento, aunque intentó disimularlo. La presentación salió bastante bien, a pesar de todo. María me ayudó con los gráficos a última hora (¡gracias, María!) y creo que convencimos al cliente.

Después fuimos a comer a ese restaurante nuevo del que todos hablan. La comida estaba buena, pero no para el precio que tiene... ¡40€ por un menú del día! No volveré, eso seguro.

Por la tarde tuve que pasar por el taller. El mecánico dice que es la batería, que tiene ya 5 años y está para cambiarla. 180€ más que se van volando de mi cuenta. Este mes va a ser complicado llegar a fin de mes.`,
            
            'source-mixed': `El cambio climático representa uno de los mayores desafíos a los que se enfrenta la humanidad en el siglo XXI. Yo he estado investigando este tema durante años y cada vez me preocupa más lo que veo.

Los datos científicos son claros: la temperatura media global ha aumentado aproximadamente 1,1°C desde la era preindustrial, principalmente debido a las emisiones de gases de efecto invernadero producidas por actividades humanas. Este calentamiento está provocando cambios significativos en los patrones climáticos de todo el mundo.

El otro día, mientras paseaba por el parque cerca de mi casa, me di cuenta de que los árboles están floreciendo casi tres semanas antes que cuando era niño. Es algo que me impactó personalmente, ver cómo el cambio climático afecta incluso a mi entorno más cercano.

Las consecuencias del cambio climático incluyen el aumento del nivel del mar, eventos climáticos extremos más frecuentes e intensos, y alteraciones en los ecosistemas. Estos cambios tienen implicaciones profundas para la biodiversidad, la seguridad alimentaria, la salud humana y la economía global.`
        };
    }
    
    // Cargar ejemplo según la fuente seleccionada
    function loadSourceExample(source) {
        if (!textInput || !window.textExamples) return;
        
        const exampleText = window.textExamples[source];
        if (exampleText) {
            textInput.value = exampleText;
            updateCharCount();
        }
    }
    
    // Actualizar la barra de progreso 3D
    function updateProgressBar3D(percent) {
        const progressFill = document.querySelector('.progress-bar-3d-fill');
        const progressText = document.querySelector('.progress-text-3d');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${percent}%`;
            progressText.textContent = `${percent}%`;
        }
    }
    
    // Iniciar animación de progreso 3D
    function startProgressAnimation3D() {
        // Limpiar intervalo anterior si existe
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        // Reiniciar progreso
        updateProgressBar3D(0);
        
        // Configurar intervalo para actualizar cada segundo (10 pasos en 10 segundos)
        let progress = 0;
        progressInterval = setInterval(() => {
            progress += 10;
            updateProgressBar3D(progress);
            
            // Detener cuando llegue al 100%
            if (progress >= 100) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
        }, 1000);
    }
    
    // Analizar texto
    function analyzeText() {
        console.log("Función analyzeText ejecutada");
        
        if (!textInput) {
            console.error("No se encontró el elemento textInput");
            return;
        }
        
        const text = textInput.value.trim();
        console.log("Texto a analizar:", text.substring(0, 50) + "...");
        
        // Validar longitud mínima
        if (text.length < 100) {
            showNotification('El texto debe tener al menos 100 caracteres para ser analizado.', 'warning');
            console.log("Texto demasiado corto");
            return;
        }
        
        // Evitar análisis múltiples simultáneos
        if (isAnalyzing) {
            console.log("Ya hay un análisis en curso");
            return;
        }
        
        // Iniciar análisis
        isAnalyzing = true;
        console.log("Iniciando análisis");
        
        // Mostrar animación de carga
        if (loadingSection) {
            // Crear o actualizar el contenido de la sección de carga con la barra de progreso 3D
            loadingSection.innerHTML = `
                <div class="loading-animation">
                    <div class="progress-bar-3d">
                        <div class="progress-bar-3d-container">
                            <div class="progress-bar-3d-fill"></div>
                            <div class="progress-bar-3d-shine"></div>
                            <div class="progress-text-3d">0%</div>
                        </div>
                        <div class="progress-bar-3d-reflection"></div>
                    </div>
                </div>
                <div class="loading-text">Analizando texto...</div>
            `;
            
            loadingSection.style.display = 'block';
            console.log("Animación de carga 3D mostrada");
            
            // Iniciar animación de progreso 3D
            startProgressAnimation3D();
        } else {
            console.error("No se encontró la sección de carga");
        }
        
        // Simular tiempo de análisis (10 segundos)
        console.log("Iniciando temporizador de 10 segundos");
        setTimeout(function() {
            console.log("Temporizador completado, realizando análisis");
            
            try {
                // Realizar análisis
                const results = performAnalysis(text);
                console.log("Análisis completado:", results);
                
                // Mostrar resultados
                displayResults(results, text);
                console.log("Resultados mostrados");
            } catch (error) {
                console.error("Error durante el análisis:", error);
                showNotification('Ocurrió un error durante el análisis. Por favor, inténtalo de nuevo.', 'error');
            }
            
            // Ocultar animación de carga
            if (loadingSection) {
                loadingSection.style.display = 'none';
                console.log("Animación de carga ocultada");
            }
            
            // Finalizar análisis
            isAnalyzing = false;
            console.log("Análisis finalizado");
        }, 10000);
    }
    
    // Realizar análisis del texto
    function performAnalysis(text) {
        console.log("Ejecutando performAnalysis");
        
        // Obtener métricas
        const metrics = calculateMetrics(text);
        console.log("Métricas calculadas");
        
        // Calcular probabilidades para cada plataforma
        const platforms = {
            'GPTZero': calculatePlatformScore(metrics, 'gptzero'),
            'Turnitin': calculatePlatformScore(metrics, 'turnitin'),
            'Copyleaks': calculatePlatformScore(metrics, 'copyleaks'),
            'Smodi': calculatePlatformScore(metrics, 'smodi'),
            'Sampling': calculatePlatformScore(metrics, 'sampling')
        };
        console.log("Puntuaciones de plataformas calculadas");
        
        // Calcular promedio general
        const avgHumanProb = Object.values(platforms).reduce((sum, p) => sum + p.humanProb, 0) / Object.keys(platforms).length;
        const avgAIProb = Object.values(platforms).reduce((sum, p) => sum + p.aiProb, 0) / Object.keys(platforms).length;
        
        // Analizar oraciones
        const sentences = analyzeSentences(text, metrics);
        console.log("Oraciones analizadas");
        
        // Determinar conclusión
        let conclusion = '';
        let conclusionType = '';
        
        if (avgHumanProb >= 80) {
            conclusion = 'Este texto fue muy probablemente escrito por un humano.';
            conclusionType = 'human';
        } else if (avgHumanProb >= 60) {
            conclusion = 'Este texto fue probablemente escrito por un humano, aunque contiene algunos patrones típicos de IA.';
            conclusionType = 'mostly-human';
        } else if (avgHumanProb >= 40) {
            conclusion = 'Este texto contiene una mezcla de escritura humana y generada por IA.';
            conclusionType = 'mixed';
        } else if (avgHumanProb >= 20) {
            conclusion = 'Este texto fue probablemente generado por IA, aunque contiene algunos patrones humanos.';
            conclusionType = 'mostly-ai';
        } else {
            conclusion = 'Este texto fue muy probablemente generado por IA.';
            conclusionType = 'ai';
        }
        
        // Generar explicación detallada
        const explanation = generateExplanation(metrics, avgHumanProb, avgAIProb, conclusionType);
        console.log("Explicación generada");
        
        return {
            humanProb: avgHumanProb,
            aiProb: avgAIProb,
            metrics: metrics,
            platforms: platforms,
            sentences: sentences,
            conclusion: conclusion,
            conclusionType: conclusionType,
            explanation: explanation
        };
    }
    
    // Calcular métricas para el análisis
    function calculateMetrics(text) {
        console.log("Calculando métricas");
        
        // Implementación básica de métricas para demostración
        // En una implementación real, estas métricas serían más sofisticadas
        
        // Perplejidad (imprevisibilidad del texto)
        const perplexity = {
            value: Math.random() * 50 + 30, // Valor aleatorio entre 30 y 80
            normalized: Math.random() * 0.6 + 0.2 // Valor normalizado entre 0.2 y 0.8
        };
        
        // Burstiness (variabilidad en la estructura)
        const burstiness = {
            value: Math.random() * 40 + 40, // Valor aleatorio entre 40 y 80
            normalized: Math.random() * 0.5 + 0.3 // Valor normalizado entre 0.3 y 0.8
        };
        
        // Entropía (complejidad y aleatoriedad)
        const entropy = {
            value: Math.random() * 3 + 2, // Valor aleatorio entre 2 y 5
            normalized: Math.random() * 0.6 + 0.2 // Valor normalizado entre 0.2 y 0.8
        };
        
        // Coherencia (consistencia temática)
        const coherence = {
            value: Math.random() * 60 + 30, // Valor aleatorio entre 30 y 90
            normalized: Math.random() * 0.7 + 0.2 // Valor normalizado entre 0.2 y 0.9
        };
        
        // Variedad léxica
        const lexicalVariety = {
            value: Math.random() * 50 + 30, // Valor aleatorio entre 30 y 80
            normalized: Math.random() * 0.6 + 0.2 // Valor normalizado entre 0.2 y 0.8
        };
        
        // Complejidad de oraciones
        const sentenceComplexity = {
            value: Math.random() * 40 + 40, // Valor aleatorio entre 40 y 80
            normalized: Math.random() * 0.5 + 0.3 // Valor normalizado entre 0.3 y 0.8
        };
        
        // Varianza emocional
        const emotionalVariance = {
            value: Math.random() * 50 + 20, // Valor aleatorio entre 20 y 70
            normalized: Math.random() * 0.5 + 0.2 // Valor normalizado entre 0.2 y 0.7
        };
        
        // Coherencia temática
        const topicalCoherence = {
            value: Math.random() * 60 + 30, // Valor aleatorio entre 30 y 90
            normalized: Math.random() * 0.6 + 0.3 // Valor normalizado entre 0.3 y 0.9
        };
        
        return {
            perplexity,
            burstiness,
            entropy,
            coherence,
            lexicalVariety,
            sentenceComplexity,
            emotionalVariance,
            topicalCoherence
        };
    }
    
    // Calcular puntuación para cada plataforma
    function calculatePlatformScore(metrics, platform) {
        // Simulación de puntuaciones para demostración
        // En una implementación real, estas puntuaciones se basarían en algoritmos específicos
        
        let humanProb;
        
        switch (platform) {
            case 'gptzero':
                humanProb = Math.round(Math.random() * 30 + 20); // 20-50%
                break;
            case 'turnitin':
                humanProb = Math.round(Math.random() * 40 + 30); // 30-70%
                break;
            case 'copyleaks':
                humanProb = Math.round(Math.random() * 35 + 25); // 25-60%
                break;
            case 'smodi':
                humanProb = Math.round(Math.random() * 45 + 20); // 20-65%
                break;
            case 'sampling':
                humanProb = Math.round(Math.random() * 40 + 25); // 25-65%
                break;
            default:
                humanProb = Math.round(Math.random() * 40 + 30); // 30-70%
        }
        
        return {
            humanProb: humanProb,
            aiProb: 100 - humanProb
        };
    }
    
    // Analizar oraciones individuales
    function analyzeSentences(text, metrics) {
        // Dividir en oraciones
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const sentencesText = text.match(sentenceRegex) || [];
        
        // Analizar cada oración (simulación para demostración)
        return sentencesText.map(sentence => {
            // Generar probabilidad aleatoria para demostración
            const humanProb = Math.round(Math.random() * 100);
            const aiProb = 100 - humanProb;
            
            // Determinar categoría
            let category = '';
            if (humanProb >= 70) {
                category = 'human';
            } else if (humanProb >= 40) {
                category = 'ai';
            } else {
                category = 'high-ai';
            }
            
            return {
                text: sentence.trim(),
                humanProb: humanProb,
                aiProb: aiProb,
                category: category
            };
        });
    }
    
    // Generar explicación detallada
    function generateExplanation(metrics, humanProb, aiProb, conclusionType) {
        let explanation = '';
        
        // Explicación basada en el tipo de conclusión
        switch (conclusionType) {
            case 'human':
                explanation = `Este texto muestra características muy propias de la escritura humana. La alta perplejidad (${metrics.perplexity.value.toFixed(2)}) indica una gran variabilidad e imprevisibilidad en el uso del lenguaje. La explosividad (${metrics.burstiness.value.toFixed(2)}) muestra patrones irregulares típicos de escritores humanos. La variedad léxica (${metrics.lexicalVariety.value.toFixed(2)}) es natural y no muestra la uniformidad típica de los textos generados por IA.`;
                break;
            case 'mostly-human':
                explanation = `Este texto presenta principalmente características de escritura humana, aunque con algunos patrones que podrían ser generados por IA. La perplejidad (${metrics.perplexity.value.toFixed(2)}) y explosividad (${metrics.burstiness.value.toFixed(2)}) son relativamente altas, lo que sugiere variabilidad humana. Sin embargo, la coherencia (${metrics.coherence.value.toFixed(2)}) muestra cierta uniformidad que podría indicar edición o asistencia de IA en algunas partes.`;
                break;
            case 'mixed':
                explanation = `Este texto muestra una mezcla de características humanas y de IA. La perplejidad (${metrics.perplexity.value.toFixed(2)}) y explosividad (${metrics.burstiness.value.toFixed(2)}) están en rangos intermedios, lo que sugiere que partes del texto podrían ser generadas por IA y otras escritas o editadas por humanos. La entropía (${metrics.entropy.value.toFixed(2)}) también indica esta mezcla de fuentes.`;
                break;
            case 'mostly-ai':
                explanation = `Este texto presenta principalmente características de escritura generada por IA, aunque con algunos elementos humanos. La baja perplejidad (${metrics.perplexity.value.toFixed(2)}) y explosividad (${metrics.burstiness.value.toFixed(2)}) sugieren patrones predecibles típicos de IA. La coherencia (${metrics.coherence.value.toFixed(2)}) es alta, lo que indica una estructura muy uniforme. Sin embargo, hay algunas variaciones que podrían indicar edición humana.`;
                break;
            case 'ai':
                explanation = `Este texto muestra características muy claras de generación por IA. La baja perplejidad (${metrics.perplexity.value.toFixed(2)}) indica patrones predecibles y repetitivos. La explosividad (${metrics.burstiness.value.toFixed(2)}) es baja, mostrando una distribución demasiado uniforme de la complejidad. La coherencia (${metrics.coherence.value.toFixed(2)}) y entropía (${metrics.entropy.value.toFixed(2)}) también son consistentes con los patrones estadísticos típicos de los modelos de lenguaje de IA.`;
                break;
        }
        
        // Añadir recomendaciones según el resultado
        if (aiProb > 70) {
            explanation += `\n\nEste texto tiene una alta probabilidad (${aiProb}%) de haber sido generado por IA. Si se presentó como trabajo original humano, recomendamos una revisión más detallada.`;
        } else if (aiProb > 40) {
            explanation += `\n\nEste texto muestra una mezcla de características, con una probabilidad significativa (${aiProb}%) de contener contenido generado por IA. Recomendamos revisar las secciones destacadas.`;
        } else {
            explanation += `\n\nEste texto tiene una alta probabilidad (${humanProb}%) de haber sido escrito por un humano, mostrando las variaciones naturales y la imprevisibilidad propias de la escritura humana.`;
        }
        
        return explanation;
    }
    
    // Mostrar resultados del análisis
    function displayResults(results, originalText) {
        console.log("Mostrando resultados");
        
        // Crear sección de resultados si no existe
        let resultsSection = document.getElementById('resultados-section');
        
        if (!resultsSection) {
            resultsSection = document.createElement('div');
            resultsSection.id = 'resultados-section';
            resultsSection.className = 'results-section';
            
            // Añadir después de la sección de carga
            const container = document.querySelector('.container');
            if (container && loadingSection) {
                container.insertBefore(resultsSection, loadingSection.nextSibling);
            } else if (container) {
                container.appendChild(resultsSection);
            }
            
            console.log("Sección de resultados creada");
        }
        
        // Generar HTML de resultados
        let html = `
            <div class="results-header">
                <h3 class="results-title">
                    <i class="fas fa-chart-pie"></i> Resultados del análisis
                </h3>
            </div>
            
            <div class="conclusion">
                <div class="probability-circle" style="background: conic-gradient(var(--success-color) 0% ${results.humanProb}%, var(--warning-color) ${results.humanProb}% 100%);">
                    <span class="probability-value">${results.humanProb}%</span>
                    <span class="probability-label">Humano</span>
                </div>
                <div class="conclusion-text">
                    <h3>Conclusión</h3>
                    <p>${results.conclusion}</p>
                    <p class="explanation">${results.explanation}</p>
                </div>
            </div>
            
            <h4 class="comparison-title">Comparación con plataformas de detección</h4>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Plataforma</th>
                        <th>Probabilidad Humano</th>
                        <th>Probabilidad IA</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Añadir filas para cada plataforma
        for (const [platform, scores] of Object.entries(results.platforms)) {
            html += `
                <tr>
                    <td>${platform}</td>
                    <td>${scores.humanProb}%</td>
                    <td>${scores.aiProb}%</td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
            
            <h4 class="metrics-title">Métricas detalladas</h4>
            <div class="metrics-grid metricas-detalladas">
        `;
        
        // Añadir tarjetas para cada métrica
        const metricsInfo = {
            perplexity: {
                name: 'Perplejidad',
                description: 'Mide la imprevisibilidad del texto. Valores altos indican escritura humana.'
            },
            burstiness: {
                name: 'Explosividad',
                description: 'Mide la variabilidad en la complejidad de las oraciones. Valores altos son típicos de humanos.'
            },
            entropy: {
                name: 'Entropía',
                description: 'Mide la aleatoriedad en la distribución de palabras. Valores intermedios son típicos de humanos.'
            },
            coherence: {
                name: 'Coherencia',
                description: 'Mide la consistencia temática. La IA tiende a ser más coherente que los humanos.'
            },
            lexicalVariety: {
                name: 'Variedad Léxica',
                description: 'Mide la diversidad de vocabulario. Los humanos suelen tener mayor variedad.'
            },
            sentenceComplexity: {
                name: 'Complejidad de Oraciones',
                description: 'Mide la estructura sintáctica. La IA tiende a usar estructuras más simples y repetitivas.'
            },
            emotionalVariance: {
                name: 'Varianza Emocional',
                description: 'Mide los cambios de tono emocional. Los humanos suelen mostrar mayor variabilidad.'
            },
            topicalCoherence: {
                name: 'Coherencia Temática',
                description: 'Mide la consistencia en el desarrollo de temas. La IA suele ser más lineal.'
            }
        };
        
        for (const [key, metric] of Object.entries(results.metrics)) {
            if (metricsInfo[key]) {
                const info = metricsInfo[key];
                html += `
                    <div class="metric-card">
                        <div class="metric-name">${info.name}</div>
                        <div class="metric-value">${metric.value.toFixed(2)}</div>
                        <div class="metric-description">${info.description}</div>
                    </div>
                `;
            }
        }
        
        html += `
            </div>
            
            <h4 class="sentences-title">Análisis por oraciones</h4>
            <div class="sentences-legend">
                <div class="legend-item">
                    <div class="legend-color human"></div>
                    <span>Probablemente humano</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color ai"></div>
                    <span>Posiblemente IA</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color high-ai"></div>
                    <span>Alta probabilidad de IA</span>
                </div>
            </div>
            <div class="sentences-container">
        `;
        
        // Añadir análisis de oraciones
        results.sentences.forEach(sentence => {
            html += `
                <div class="sentence ${sentence.category}">
                    ${sentence.text} <small>(${sentence.humanProb}% humano)</small>
                </div>
            `;
        });
        
        html += `
            </div>
            
            <div class="action-buttons mt-4">
                <button id="humanize-button" class="btn btn-success">
                    <i class="fas fa-magic"></i> Humanizar texto
                </button>
            </div>
        `;
        
        // Actualizar contenido
        resultsSection.innerHTML = html;
        console.log("HTML de resultados generado");
        
        // Configurar botón de humanización
        const humanizeButton = document.getElementById('humanize-button');
        if (humanizeButton) {
            humanizeButton.addEventListener('click', function() {
                console.log("Botón de humanización clickeado");
                humanizeText(originalText, results);
            });
            console.log("Evento click registrado para humanizeButton");
        }
    }
    
    // Humanizar texto
    function humanizeText(text, results) {
        console.log("Intentando humanizar texto");
        
        // Verificar si el módulo de humanización está disponible
        if (typeof textHumanizer !== 'undefined') {
            console.log("Módulo de humanización encontrado, ejecutando");
            textHumanizer.humanize(text, results);
        } else {
            console.error("Módulo de humanización no disponible");
            showNotification('El módulo de humanización no está disponible.', 'error');
        }
    }
    
    // Limpiar texto
    function clearText() {
        console.log("Limpiando texto");
        
        if (textInput) {
            textInput.value = '';
            updateCharCount();
        }
        
        // Eliminar resultados si existen
        const resultsSection = document.getElementById('resultados-section');
        if (resultsSection) {
            resultsSection.remove();
            console.log("Sección de resultados eliminada");
        }
        
        // Eliminar sección de comparación si existe
        const comparisonSection = document.getElementById('studocu-comparison-section');
        if (comparisonSection) {
            comparisonSection.remove();
            console.log("Sección de comparación eliminada");
        }
        
        // Eliminar sección de humanización si existe
        const humanizationSection = document.getElementById('humanization-section');
        if (humanizationSection) {
            humanizationSection.remove();
            console.log("Sección de humanización eliminada");
        }
    }
});

// Función global para mostrar notificaciones
function showNotification(message, type = 'info') {
    console.log(`Mostrando notificación: ${message} (${type})`);
    
    const notification = document.getElementById('notification');
    if (!notification) {
        console.error("Elemento de notificación no encontrado");
        return;
    }
    
    // Configurar notificación
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    
    // Ocultar después de 5 segundos
    setTimeout(function() {
        notification.classList.remove('show');
    }, 5000);
}

// Funciones globales para la animación de carga
function showLoadingAnimation(message = 'Analizando texto...') {
    console.log(`Mostrando animación de carga: ${message}`);
    
    const loadingSection = document.getElementById('loading-section');
    if (!loadingSection) {
        console.error("Sección de carga no encontrada");
        return;
    }
    
    // Crear o actualizar el contenido de la sección de carga con la barra de progreso 3D
    loadingSection.innerHTML = `
        <div class="loading-animation">
            <div class="progress-bar-3d">
                <div class="progress-bar-3d-container">
                    <div class="progress-bar-3d-fill"></div>
                    <div class="progress-bar-3d-shine"></div>
                    <div class="progress-text-3d">0%</div>
                </div>
                <div class="progress-bar-3d-reflection"></div>
            </div>
        </div>
        <div class="loading-text">${message}</div>
    `;
    
    loadingSection.style.display = 'block';
}

function hideLoadingAnimation() {
    console.log("Ocultando animación de carga");
    
    const loadingSection = document.getElementById('loading-section');
    if (!loadingSection) {
        console.error("Sección de carga no encontrada");
        return;
    }
    
    loadingSection.style.display = 'none';
}

// Asegurarse de que las funciones estén disponibles globalmente
window.showNotification = showNotification;
window.showLoadingAnimation = showLoadingAnimation;
window.hideLoadingAnimation = hideLoadingAnimation;
