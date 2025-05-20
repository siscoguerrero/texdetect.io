// Módulo de humanización avanzada de texto
const textHumanizer = {
    // Configuración
    config: {
        maxIterations: 3,
        minHumanScore: 70
    },
    
    // Estado
    state: {
        originalText: '',
        humanizedText: '',
        results: null,
        isHumanizing: false
    },
    
    // Inicializar humanizador
    init: function() {
        console.log("Inicializando módulo de humanización");
        
        // Escuchar eventos de autenticación
        document.addEventListener('authStateChanged', function(event) {
            console.log("Estado de autenticación cambiado:", event.detail);
        });
    },
    
    // Humanizar texto
    humanize: function(text, results) {
        console.log("Iniciando humanización de texto");
        
        // Guardar estado
        this.state.originalText = text;
        this.state.results = results;
        this.state.isHumanizing = true;
        
        // Mostrar interfaz de humanización
        this.showHumanizationInterface();
        
        // Procesar texto
        this.processText(text, results);
    },
    
    // Mostrar interfaz de humanización
    showHumanizationInterface: function() {
        console.log("Mostrando interfaz de humanización");
        
        // Crear sección de humanización si no existe
        let humanizationSection = document.getElementById('humanization-section');
        
        if (!humanizationSection) {
            humanizationSection = document.createElement('div');
            humanizationSection.id = 'humanization-section';
            humanizationSection.className = 'humanization-section';
            
            // Añadir después de la sección de resultados
            const resultsSection = document.getElementById('resultados-section');
            if (resultsSection) {
                resultsSection.parentNode.insertBefore(humanizationSection, resultsSection.nextSibling);
            } else {
                const container = document.querySelector('.container');
                if (container) {
                    container.appendChild(humanizationSection);
                }
            }
        }
        
        // Mostrar animación de carga
        humanizationSection.innerHTML = `
            <div class="humanization-header">
                <h3 class="humanization-title">
                    <i class="fas fa-magic"></i> Humanización de Texto
                </h3>
            </div>
            
            <div class="humanization-loading">
                <div class="loading-spinner"></div>
                <p>Aplicando técnicas avanzadas de humanización...</p>
            </div>
        `;
    },
    
    // Procesar texto para humanizarlo
    processText: function(text, results) {
        console.log("Procesando texto para humanización");
        
        // Simular tiempo de procesamiento
        setTimeout(() => {
            try {
                // Aplicar técnicas de humanización
                const humanizedText = this.applyHumanizationTechniques(text, results);
                
                // Actualizar estado
                this.state.humanizedText = humanizedText;
                this.state.isHumanizing = false;
                
                // Mostrar resultados
                this.showHumanizationResults(text, humanizedText, results);
            } catch (error) {
                console.error("Error durante la humanización:", error);
                this.showHumanizationError();
            }
        }, 3000);
    },
    
    // Aplicar técnicas de humanización
    applyHumanizationTechniques: function(text, results) {
        console.log("Aplicando técnicas de humanización");
        
        // Dividir en oraciones
        const sentences = this.splitIntoSentences(text);
        
        // Aplicar técnicas a cada oración según su probabilidad de IA
        const humanizedSentences = sentences.map((sentence, index) => {
            // Obtener probabilidad de IA para la oración
            const sentenceResult = results.sentences[index] || { aiProb: 80, category: 'ai' };
            
            // Aplicar técnicas según la probabilidad
            if (sentenceResult.aiProb > 80) {
                // Alta probabilidad de IA - aplicar múltiples técnicas
                return this.applyMultipleTechniques(sentence);
            } else if (sentenceResult.aiProb > 60) {
                // Probabilidad media de IA - aplicar algunas técnicas
                return this.applySomeTechniques(sentence);
            } else {
                // Baja probabilidad de IA - mantener casi igual
                return this.applyMinimalTechniques(sentence);
            }
        });
        
        // Unir oraciones humanizadas
        return humanizedSentences.join(' ');
    },
    
    // Aplicar múltiples técnicas de humanización
    applyMultipleTechniques: function(sentence) {
        // Aplicar varias técnicas para oraciones con alta probabilidad de IA
        
        // 1. Introducir marcas de oralidad
        sentence = this.addOralityMarkers(sentence);
        
        // 2. Variar estructura sintáctica
        sentence = this.varyStructure(sentence);
        
        // 3. Añadir expresiones coloquiales
        sentence = this.addColloquialExpressions(sentence);
        
        // 4. Introducir variabilidad léxica
        sentence = this.increaseVariability(sentence);
        
        // 5. Añadir elementos personales
        sentence = this.addPersonalElements(sentence);
        
        return sentence;
    },
    
    // Aplicar algunas técnicas de humanización
    applySomeTechniques: function(sentence) {
        // Aplicar algunas técnicas para oraciones con probabilidad media de IA
        
        // Seleccionar aleatoriamente 2-3 técnicas
        const techniques = [
            this.addOralityMarkers,
            this.varyStructure,
            this.addColloquialExpressions,
            this.increaseVariability,
            this.addPersonalElements
        ];
        
        // Barajar técnicas
        const shuffledTechniques = techniques.sort(() => 0.5 - Math.random());
        
        // Aplicar 2-3 técnicas aleatorias
        const numTechniques = Math.floor(Math.random() * 2) + 2; // 2-3
        
        let modifiedSentence = sentence;
        for (let i = 0; i < numTechniques; i++) {
            modifiedSentence = shuffledTechniques[i].call(this, modifiedSentence);
        }
        
        return modifiedSentence;
    },
    
    // Aplicar técnicas mínimas de humanización
    applyMinimalTechniques: function(sentence) {
        // Aplicar técnicas mínimas para oraciones con baja probabilidad de IA
        
        // Seleccionar aleatoriamente 0-1 técnicas
        const techniques = [
            this.addOralityMarkers,
            this.addColloquialExpressions,
            this.addPersonalElements
        ];
        
        // Decidir si aplicar alguna técnica
        if (Math.random() > 0.5) {
            const techniqueIndex = Math.floor(Math.random() * techniques.length);
            return techniques[techniqueIndex].call(this, sentence);
        }
        
        return sentence;
    },
    
    // Técnica: Añadir marcas de oralidad
    addOralityMarkers: function(sentence) {
        // Marcas de oralidad en español
        const oralityMarkers = [
            { marker: ", bueno, ", position: "middle" },
            { marker: ", pues, ", position: "middle" },
            { marker: ", vamos, ", position: "middle" },
            { marker: ", o sea, ", position: "middle" },
            { marker: ", ya sabes, ", position: "middle" },
            { marker: ", claro, ", position: "middle" },
            { marker: "Mira, ", position: "start" },
            { marker: "Pues ", position: "start" },
            { marker: "Bueno, ", position: "start" },
            { marker: "Vamos, ", position: "start" },
            { marker: "La verdad es que ", position: "start" },
            { marker: ", ¿no?", position: "end" },
            { marker: ", ¿sabes?", position: "end" },
            { marker: ", ¿entiendes?", position: "end" },
            { marker: ", claro está", position: "end" },
            { marker: ", por así decirlo", position: "end" }
        ];
        
        // Seleccionar aleatoriamente una marca de oralidad
        const randomMarker = oralityMarkers[Math.floor(Math.random() * oralityMarkers.length)];
        
        // Aplicar según la posición
        if (randomMarker.position === "start") {
            return randomMarker.marker + sentence.charAt(0).toLowerCase() + sentence.slice(1);
        } else if (randomMarker.position === "end") {
            // Eliminar el punto final si existe
            const withoutFinalPeriod = sentence.replace(/\.$/, "");
            return withoutFinalPeriod + randomMarker.marker + ".";
        } else { // middle
            // Dividir la oración aproximadamente por la mitad
            const words = sentence.split(" ");
            const middleIndex = Math.floor(words.length / 2);
            
            // Insertar la marca en el medio
            return words.slice(0, middleIndex).join(" ") + randomMarker.marker + words.slice(middleIndex).join(" ");
        }
    },
    
    // Técnica: Variar estructura sintáctica
    varyStructure: function(sentence) {
        // Detectar si es una oración declarativa simple
        if (/^[A-Z][^.!?]*[.!?]$/.test(sentence) && !sentence.includes(",")) {
            // Convertir a estructura enfática o interrogativa retórica
            const structures = [
                // Estructura enfática
                (s) => {
                    const withoutFinalPeriod = s.replace(/[.!?]$/, "");
                    return "¡" + withoutFinalPeriod + "!";
                },
                // Interrogativa retórica
                (s) => {
                    const withoutFinalPeriod = s.replace(/[.!?]$/, "");
                    return "¿" + withoutFinalPeriod + "?";
                },
                // Inversión de orden
                (s) => {
                    const parts = s.split(/\s+/);
                    if (parts.length > 5) {
                        const firstPart = parts.slice(0, Math.floor(parts.length / 2)).join(" ");
                        const secondPart = parts.slice(Math.floor(parts.length / 2)).join(" ");
                        return secondPart + ", " + firstPart.charAt(0).toLowerCase() + firstPart.slice(1);
                    }
                    return s;
                }
            ];
            
            // Seleccionar aleatoriamente una estructura
            const randomStructure = structures[Math.floor(Math.random() * structures.length)];
            return randomStructure(sentence);
        }
        
        return sentence;
    },
    
    // Técnica: Añadir expresiones coloquiales
    addColloquialExpressions: function(sentence) {
        // Expresiones coloquiales en español
        const colloquialExpressions = [
            { expr: "a lo mejor", replacement: "quizás" },
            { expr: "de vez en cuando", replacement: "ocasionalmente" },
            { expr: "dar en el clavo", replacement: "acertar" },
            { expr: "estar en las nubes", replacement: "distraído" },
            { expr: "meter la pata", replacement: "equivocarse" },
            { expr: "ponerse las pilas", replacement: "esforzarse" },
            { expr: "tirar la toalla", replacement: "rendirse" },
            { expr: "echar una mano", replacement: "ayudar" },
            { expr: "en un abrir y cerrar de ojos", replacement: "rápidamente" },
            { expr: "estar hasta las narices", replacement: "estar harto" },
            { expr: "no tener ni idea", replacement: "desconocer" }
        ];
        
        // Buscar palabras formales que puedan ser reemplazadas
        for (const expr of colloquialExpressions) {
            if (sentence.includes(expr.replacement)) {
                return sentence.replace(expr.replacement, expr.expr);
            }
        }
        
        // Si no se encuentra ninguna palabra para reemplazar, añadir una expresión al final
        if (Math.random() > 0.7) {
            const finalExpressions = [
                " Y eso es lo que hay.",
                " Así son las cosas.",
                " No hay más que hablar.",
                " Y punto.",
                " Sin más vueltas."
            ];
            
            const randomExpr = finalExpressions[Math.floor(Math.random() * finalExpressions.length)];
            return sentence.replace(/[.!?]$/, "") + randomExpr;
        }
        
        return sentence;
    },
    
    // Técnica: Aumentar variabilidad
    increaseVariability: function(sentence) {
        // Reemplazar palabras formales por sinónimos más coloquiales
        const formalToColloquial = {
            "además": ["también", "encima", "aparte"],
            "sin embargo": ["pero", "aunque", "igual"],
            "por lo tanto": ["así que", "entonces", "por eso"],
            "debido a": ["por", "gracias a", "culpa de"],
            "aproximadamente": ["más o menos", "cerca de", "por ahí"],
            "finalizar": ["acabar", "terminar", "rematar"],
            "iniciar": ["empezar", "arrancar", "comenzar"],
            "obtener": ["conseguir", "pillar", "lograr"],
            "realizar": ["hacer", "currar", "trabajar"],
            "manifestar": ["decir", "soltar", "comentar"],
            "efectuar": ["hacer", "realizar", "llevar a cabo"]
        };
        
        let modifiedSentence = sentence;
        
        // Reemplazar palabras formales
        for (const [formal, colloquials] of Object.entries(formalToColloquial)) {
            if (modifiedSentence.includes(formal)) {
                const randomColloquial = colloquials[Math.floor(Math.random() * colloquials.length)];
                modifiedSentence = modifiedSentence.replace(formal, randomColloquial);
                break; // Solo reemplazar una palabra por oración
            }
        }
        
        return modifiedSentence;
    },
    
    // Técnica: Añadir elementos personales
    addPersonalElements: function(sentence) {
        // Elementos personales para añadir
        const personalElements = [
            { marker: "Yo creo que ", position: "start" },
            { marker: "En mi opinión, ", position: "start" },
            { marker: "Personalmente, ", position: "start" },
            { marker: "Desde mi punto de vista, ", position: "start" },
            { marker: "Por lo que he visto, ", position: "start" },
            { marker: ", creo yo", position: "end" },
            { marker: ", en mi experiencia", position: "end" },
            { marker: ", por lo que sé", position: "end" },
            { marker: ", me parece", position: "end" }
        ];
        
        // Seleccionar aleatoriamente un elemento personal
        const randomElement = personalElements[Math.floor(Math.random() * personalElements.length)];
        
        // Aplicar según la posición
        if (randomElement.position === "start") {
            return randomElement.marker + sentence.charAt(0).toLowerCase() + sentence.slice(1);
        } else { // end
            // Eliminar el punto final si existe
            const withoutFinalPeriod = sentence.replace(/\.$/, "");
            return withoutFinalPeriod + randomElement.marker + ".";
        }
    },
    
    // Mostrar resultados de humanización
    showHumanizationResults: function(originalText, humanizedText, results) {
        console.log("Mostrando resultados de humanización");
        
        // Obtener sección de humanización
        const humanizationSection = document.getElementById('humanization-section');
        if (!humanizationSection) return;
        
        // Generar HTML de resultados
        let html = `
            <div class="humanization-header">
                <h3 class="humanization-title">
                    <i class="fas fa-magic"></i> Texto Humanizado
                </h3>
            </div>
            
            <div class="humanization-results">
                <div class="humanization-explanation">
                    <h4>¿Qué se ha modificado?</h4>
                    <p>Se han aplicado las siguientes técnicas para hacer que el texto parezca más escrito por un humano:</p>
                    <ul>
                        <li><strong>Marcas de oralidad:</strong> Añadidas expresiones típicas del lenguaje hablado.</li>
                        <li><strong>Variación estructural:</strong> Modificada la estructura de algunas oraciones para hacerlas menos predecibles.</li>
                        <li><strong>Expresiones coloquiales:</strong> Incorporadas frases y modismos propios del lenguaje natural.</li>
                        <li><strong>Elementos personales:</strong> Añadidas marcas de subjetividad y opinión personal.</li>
                        <li><strong>Variabilidad léxica:</strong> Reemplazadas palabras formales por equivalentes más coloquiales.</li>
                    </ul>
                </div>
                
                <div class="text-comparison">
                    <div class="original-text">
                        <h4>Texto Original</h4>
                        <div class="text-content">
                            ${this.formatTextForDisplay(originalText)}
                        </div>
                    </div>
                    
                    <div class="humanized-text">
                        <h4>Texto Humanizado</h4>
                        <div class="text-content">
                            ${this.formatTextForDisplay(humanizedText)}
                        </div>
                    </div>
                </div>
                
                <div class="action-buttons mt-4">
                    <button id="copy-humanized-btn" class="btn btn-primary">
                        <i class="fas fa-copy"></i> Copiar texto humanizado
                    </button>
                    <button id="download-humanized-btn" class="btn btn-secondary">
                        <i class="fas fa-download"></i> Descargar como TXT
                    </button>
                </div>
                
                <div class="humanization-disclaimer">
                    <p><strong>Nota:</strong> Este texto ha sido modificado para parecer más humano, pero sigue siendo importante revisarlo y personalizarlo antes de presentarlo como trabajo propio.</p>
                </div>
            </div>
        `;
        
        // Actualizar contenido
        humanizationSection.innerHTML = html;
        
        // Configurar botones
        const copyBtn = document.getElementById('copy-humanized-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard(humanizedText);
                showNotification('Texto humanizado copiado al portapapeles', 'success');
            });
        }
        
        const downloadBtn = document.getElementById('download-humanized-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadText(humanizedText, 'texto_humanizado.txt');
                showNotification('Texto humanizado descargado', 'success');
            });
        }
    },
    
    // Mostrar error de humanización
    showHumanizationError: function() {
        console.log("Mostrando error de humanización");
        
        // Obtener sección de humanización
        const humanizationSection = document.getElementById('humanization-section');
        if (!humanizationSection) return;
        
        // Mostrar mensaje de error
        humanizationSection.innerHTML = `
            <div class="humanization-header">
                <h3 class="humanization-title">
                    <i class="fas fa-exclamation-triangle"></i> Error de Humanización
                </h3>
            </div>
            
            <div class="humanization-error">
                <p>Ocurrió un error durante el proceso de humanización. Por favor, inténtalo de nuevo.</p>
                <button id="retry-humanization-btn" class="btn btn-primary">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
        
        // Configurar botón de reintento
        const retryBtn = document.getElementById('retry-humanization-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.humanize(this.state.originalText, this.state.results);
            });
        }
    },
    
    // Utilidades
    
    // Dividir texto en oraciones
    splitIntoSentences: function(text) {
        // Patrón para dividir en oraciones respetando abreviaturas comunes
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        return text.match(sentenceRegex) || [text];
    },
    
    // Formatear texto para mostrar
    formatTextForDisplay: function(text) {
        // Reemplazar saltos de línea por <br>
        return text.replace(/\n/g, '<br>');
    },
    
    // Copiar texto al portapapeles
    copyToClipboard: function(text) {
        // Crear elemento temporal
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        
        // Seleccionar y copiar
        textarea.select();
        document.execCommand('copy');
        
        // Eliminar elemento temporal
        document.body.removeChild(textarea);
    },
    
    // Descargar texto como archivo
    downloadText: function(text, filename) {
        // Crear elemento de enlace
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        
        // Ocultar elemento
        element.style.display = 'none';
        document.body.appendChild(element);
        
        // Simular clic
        element.click();
        
        // Eliminar elemento
        document.body.removeChild(element);
    }
};

// Inicializar el módulo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    textHumanizer.init();
});

// Exponer el módulo globalmente
window.textHumanizer = textHumanizer;
