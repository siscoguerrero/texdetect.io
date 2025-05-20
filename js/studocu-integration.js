// Módulo de integración con Studocu para comparación de documentos
const studocuIntegration = {
    // Configuración
    config: {
        baseUrl: 'https://www.studocu.com',
        searchEndpoint: '/search?q=',
        resultsLimit: 5
    },
    
    // Estado de la comparación
    comparisonState: {
        isComparing: false,
        results: null,
        error: null
    },
    
    // Inicializar el módulo
    init: function() {
        // Verificar dependencia de autenticación
        if (typeof googleAuth === 'undefined') {
            console.error('El módulo de autenticación de Google no está disponible');
            return;
        }
        
        // Añadir botón de comparación con Studocu
        this.addCompareButton();
        
        // Escuchar cambios en el estado de autenticación
        document.addEventListener('authStateChanged', (event) => {
            this.updateUI(event.detail.isAuthenticated);
        });
        
        // Actualizar UI inicial
        this.updateUI(googleAuth.isAuthenticated());
    },
    
    // Añadir botón de comparación con Studocu
    addCompareButton: function() {
        // Verificar si el botón ya existe
        if (document.getElementById('studocu-compare-button')) return;
        
        // Crear el botón
        const compareButton = document.createElement('button');
        compareButton.id = 'studocu-compare-button';
        compareButton.className = 'btn btn-info mt-3';
        compareButton.innerHTML = '<i class="fas fa-search"></i> Comparar con documentos de Studocu';
        compareButton.style.display = 'none'; // Oculto por defecto hasta autenticación
        
        // Añadir evento de click
        compareButton.addEventListener('click', () => {
            this.compareWithStudocu();
        });
        
        // Añadir el botón después del botón de humanización
        const humanizeButton = document.getElementById('humanize-button');
        if (humanizeButton) {
            humanizeButton.parentNode.insertBefore(compareButton, humanizeButton.nextSibling);
        } else {
            // Si no existe el botón de humanización, añadir después de la sección de métricas
            const metricasSection = document.querySelector('.metricas-detalladas');
            if (metricasSection) {
                metricasSection.parentNode.insertBefore(compareButton, metricasSection.nextSibling);
            }
        }
    },
    
    // Actualizar UI según estado de autenticación
    updateUI: function(isAuthenticated) {
        const compareButton = document.getElementById('studocu-compare-button');
        if (compareButton) {
            compareButton.style.display = isAuthenticated ? 'block' : 'none';
        }
    },
    
    // Comparar texto con documentos de Studocu
    compareWithStudocu: function() {
        // Verificar autenticación
        if (!googleAuth.isAuthenticated()) {
            showNotification('Debes iniciar sesión con Google para comparar con Studocu', 'warning');
            return;
        }
        
        // Obtener el texto a comparar
        const textArea = document.getElementById('text-input');
        const text = textArea.value.trim();
        
        if (!text || text.length < 100) {
            showNotification('El texto debe tener al menos 100 caracteres para comparar', 'warning');
            return;
        }
        
        // Mostrar animación de carga
        this.comparisonState.isComparing = true;
        showLoadingAnimation('Comparando con documentos de Studocu...');
        
        // Simular búsqueda y comparación (en producción, esto sería una llamada real)
        setTimeout(() => {
            this.simulateStudocuComparison(text)
                .then(results => {
                    // Guardar resultados
                    this.comparisonState.results = results;
                    this.comparisonState.error = null;
                    
                    // Mostrar resultados
                    this.showComparisonResults(results);
                })
                .catch(error => {
                    // Guardar error
                    this.comparisonState.results = null;
                    this.comparisonState.error = error;
                    
                    // Mostrar error
                    showNotification('Error al comparar con Studocu: ' + error.message, 'error');
                })
                .finally(() => {
                    // Ocultar animación de carga
                    this.comparisonState.isComparing = false;
                    hideLoadingAnimation();
                });
        }, 3000);
    },
    
    // Simular búsqueda y comparación con Studocu
    simulateStudocuComparison: function(text) {
        return new Promise((resolve, reject) => {
            try {
                // En una implementación real, aquí se realizaría una llamada a la API o scraping
                // Para la simulación, generamos resultados basados en el texto
                
                // Extraer palabras clave del texto
                const keywords = this.extractKeywords(text);
                
                // Generar resultados simulados
                const results = this.generateSimulatedResults(keywords, text);
                
                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Extraer palabras clave del texto
    extractKeywords: function(text) {
        // Eliminar signos de puntuación y convertir a minúsculas
        const cleanText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
        
        // Dividir en palabras
        const words = cleanText.split(/\s+/);
        
        // Eliminar palabras comunes (stopwords)
        const stopwords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'a', 'ante', 'bajo', 'con', 'de', 'desde', 'en', 'entre', 'hacia', 'hasta', 'para', 'por', 'según', 'sin', 'sobre', 'tras', 'que', 'como', 'cuando', 'donde', 'si', 'no', 'al', 'del', 'lo', 'es', 'son', 'fue', 'ha', 'han', 'ser', 'estar', 'tener', 'hacer'];
        const filteredWords = words.filter(word => !stopwords.includes(word) && word.length > 3);
        
        // Contar frecuencia de palabras
        const wordCount = {};
        filteredWords.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        // Ordenar por frecuencia y obtener las 10 más comunes
        const sortedWords = Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(entry => entry[0]);
        
        return sortedWords;
    },
    
    // Generar resultados simulados
    generateSimulatedResults: function(keywords, originalText) {
        // Tipos de documentos comunes en Studocu
        const documentTypes = ['Examen', 'Resumen', 'Apuntes', 'Trabajo', 'Ensayo', 'Tesis', 'Proyecto', 'Presentación'];
        
        // Universidades comunes
        const universities = ['Universidad Complutense de Madrid', 'Universidad de Barcelona', 'Universidad Autónoma de Madrid', 'Universidad de Valencia', 'Universidad de Sevilla', 'Universidad de Granada', 'Universidad de Salamanca', 'Universidad de Zaragoza'];
        
        // Asignaturas comunes según palabras clave
        const subjects = {
            'tecnología': ['Informática', 'Programación', 'Sistemas Digitales', 'Redes', 'Bases de Datos'],
            'economía': ['Microeconomía', 'Macroeconomía', 'Contabilidad', 'Finanzas', 'Marketing'],
            'medicina': ['Anatomía', 'Fisiología', 'Patología', 'Farmacología', 'Cirugía'],
            'derecho': ['Derecho Civil', 'Derecho Penal', 'Derecho Administrativo', 'Derecho Constitucional', 'Derecho Mercantil'],
            'historia': ['Historia Antigua', 'Historia Medieval', 'Historia Moderna', 'Historia Contemporánea', 'Arqueología'],
            'literatura': ['Literatura Española', 'Literatura Universal', 'Teoría Literaria', 'Crítica Literaria', 'Lingüística'],
            'ciencia': ['Física', 'Química', 'Biología', 'Matemáticas', 'Estadística'],
            'arte': ['Historia del Arte', 'Dibujo', 'Pintura', 'Escultura', 'Arquitectura']
        };
        
        // Determinar tema principal basado en palabras clave
        let mainSubject = 'general';
        for (const [topic, _] of Object.entries(subjects)) {
            if (keywords.some(keyword => keyword.includes(topic) || topic.includes(keyword))) {
                mainSubject = topic;
                break;
            }
        }
        
        // Generar resultados
        const results = [];
        const numResults = Math.floor(Math.random() * 3) + 1; // 1-3 resultados
        
        for (let i = 0; i < numResults; i++) {
            // Seleccionar palabras clave aleatorias para el título
            const titleKeywords = [];
            for (let j = 0; j < Math.min(3, keywords.length); j++) {
                const randomIndex = Math.floor(Math.random() * keywords.length);
                titleKeywords.push(keywords[randomIndex]);
            }
            
            // Generar título
            const documentType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
            const title = `${documentType} de ${subjects[mainSubject][Math.floor(Math.random() * subjects[mainSubject].length)]}: ${titleKeywords.join(' ')}`;
            
            // Generar universidad
            const university = universities[Math.floor(Math.random() * universities.length)];
            
            // Generar fecha
            const currentYear = new Date().getFullYear();
            const year = Math.floor(Math.random() * 5) + (currentYear - 5);
            const month = Math.floor(Math.random() * 12) + 1;
            const day = Math.floor(Math.random() * 28) + 1;
            const date = `${day}/${month}/${year}`;
            
            // Generar URL
            const urlTitle = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
            const url = `${this.config.baseUrl}/es/document/${university.toLowerCase().replace(/\s+/g, '-')}/${subjects[mainSubject][0].toLowerCase().replace(/\s+/g, '-')}/${urlTitle}/${Math.floor(Math.random() * 100000000)}`;
            
            // Calcular similitud (simulada)
            const similarity = Math.floor(Math.random() * 30) + 10; // 10-40%
            
            // Generar fragmentos coincidentes
            const matchingFragments = this.generateMatchingFragments(originalText, 2);
            
            results.push({
                title: title,
                university: university,
                date: date,
                url: url,
                similarity: similarity,
                matchingFragments: matchingFragments
            });
        }
        
        // Ordenar por similitud
        results.sort((a, b) => b.similarity - a.similarity);
        
        return results;
    },
    
    // Generar fragmentos coincidentes
    generateMatchingFragments: function(text, numFragments) {
        const fragments = [];
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        
        if (sentences.length === 0) return fragments;
        
        // Seleccionar oraciones aleatorias
        for (let i = 0; i < Math.min(numFragments, sentences.length); i++) {
            const randomIndex = Math.floor(Math.random() * sentences.length);
            const sentence = sentences[randomIndex].trim();
            
            // Modificar ligeramente la oración para simular diferencias
            const modifiedSentence = this.slightlyModifySentence(sentence);
            
            fragments.push({
                original: sentence,
                matched: modifiedSentence
            });
        }
        
        return fragments;
    },
    
    // Modificar ligeramente una oración
    slightlyModifySentence: function(sentence) {
        // Lista de sinónimos comunes
        const synonyms = {
            'grande': 'amplio',
            'pequeño': 'reducido',
            'bueno': 'positivo',
            'malo': 'negativo',
            'rápido': 'veloz',
            'lento': 'pausado',
            'importante': 'relevante',
            'difícil': 'complicado',
            'fácil': 'sencillo',
            'interesante': 'atractivo',
            'aburrido': 'tedioso',
            'bonito': 'hermoso',
            'feo': 'desagradable',
            'alto': 'elevado',
            'bajo': 'reducido',
            'nuevo': 'reciente',
            'viejo': 'antiguo',
            'caro': 'costoso',
            'barato': 'económico',
            'feliz': 'contento',
            'triste': 'apenado'
        };
        
        // Reemplazar algunas palabras por sinónimos
        let modified = sentence;
        
        Object.entries(synonyms).forEach(([word, synonym]) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            if (regex.test(modified) && Math.random() > 0.5) {
                modified = modified.replace(regex, synonym);
            }
        });
        
        return modified;
    },
    
    // Mostrar resultados de la comparación
    showComparisonResults: function(results) {
        // Crear el contenedor de resultados si no existe
        let comparisonSection = document.getElementById('studocu-comparison-section');
        
        if (!comparisonSection) {
            comparisonSection = document.createElement('div');
            comparisonSection.id = 'studocu-comparison-section';
            comparisonSection.className = 'comparison-section mt-4';
            
            // Añadir después de la sección de resultados
            const resultadosSection = document.getElementById('resultados-section');
            if (resultadosSection) {
                resultadosSection.parentNode.insertBefore(comparisonSection, resultadosSection.nextSibling);
            }
        }
        
        // Generar HTML de resultados
        let html = `
            <h3 class="section-title">
                <i class="fas fa-search"></i> Comparación con Studocu
            </h3>
            <p class="section-description">
                Se encontraron ${results.length} documentos similares en Studocu.
            </p>
        `;
        
        if (results.length === 0) {
            html += `
                <div class="alert alert-info">
                    No se encontraron documentos similares en Studocu.
                </div>
            `;
        } else {
            html += `<div class="studocu-results">`;
            
            results.forEach(result => {
                html += `
                    <div class="studocu-result-card">
                        <div class="result-header">
                            <h4 class="result-title">
                                <a href="${result.url}" target="_blank">
                                    ${result.title}
                                </a>
                            </h4>
                            <div class="result-meta">
                                <span class="result-university">
                                    <i class="fas fa-university"></i> ${result.university}
                                </span>
                                <span class="result-date">
                                    <i class="fas fa-calendar-alt"></i> ${result.date}
                                </span>
                            </div>
                        </div>
                        <div class="result-similarity">
                            <div class="similarity-label">Similitud:</div>
                            <div class="similarity-bar">
                                <div class="similarity-fill" style="width: ${result.similarity}%"></div>
                            </div>
                            <div class="similarity-percentage">${result.similarity}%</div>
                        </div>
                        <div class="matching-fragments">
                            <h5>Fragmentos coincidentes:</h5>
                            <div class="fragments-container">
                `;
                
                result.matchingFragments.forEach(fragment => {
                    html += `
                        <div class="fragment-pair">
                            <div class="fragment original">
                                <div class="fragment-label">Tu texto:</div>
                                <div class="fragment-content">${fragment.original}</div>
                            </div>
                            <div class="fragment matched">
                                <div class="fragment-label">Documento:</div>
                                <div class="fragment-content">${fragment.matched}</div>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        // Añadir nota sobre la autenticación
        html += `
            <div class="studocu-note mt-3">
                <p><small>
                    <i class="fas fa-info-circle"></i> 
                    Los resultados se obtienen mediante tu cuenta de Google. Para ver los documentos completos, 
                    es posible que necesites iniciar sesión en Studocu.
                </small></p>
            </div>
        `;
        
        // Actualizar el contenido
        comparisonSection.innerHTML = html;
        
        // Hacer scroll a la sección
        comparisonSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// Inicializar el módulo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar después de un breve retraso para asegurar que googleAuth esté disponible
    setTimeout(() => {
        studocuIntegration.init();
    }, 1000);
});
