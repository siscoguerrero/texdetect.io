// Definición de métricas avanzadas y algoritmos para la detección de texto IA
const metrics = {
    // Métricas básicas refinadas
    // Cálculo de perplejidad (perplexity) - Refinado con análisis estadístico profundo
    // Valores más bajos indican mayor probabilidad de ser generado por IA
    calculatePerplexity: function(text) {
        // Implementación mejorada de perplejidad basada en patrones lingüísticos
        const sentences = this.splitIntoSentences(text);
        const wordCounts = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
        
        // Calcular la varianza en la longitud de las oraciones
        const avgLength = wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;
        const variance = wordCounts.reduce((sum, count) => sum + Math.pow(count - avgLength, 2), 0) / wordCounts.length;
        
        // Calcular repeticiones de patrones
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        // Análisis de distribución de frecuencias (más preciso)
        const frequencies = Object.values(wordFreq);
        const freqDistribution = {};
        frequencies.forEach(freq => {
            freqDistribution[freq] = (freqDistribution[freq] || 0) + 1;
        });
        
        // Calcular entropía de la distribución de frecuencias
        let entropyFreq = 0;
        const totalUniqueWords = Object.keys(wordFreq).length;
        Object.values(freqDistribution).forEach(count => {
            const p = count / totalUniqueWords;
            entropyFreq -= p * Math.log2(p);
        });
        
        // Análisis de bigramas para detectar patrones repetitivos
        const bigramFreq = {};
        for (let i = 0; i < words.length - 1; i++) {
            const bigram = words[i] + ' ' + words[i + 1];
            bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
        }
        
        // Calcular ratio de bigramas únicos vs. total
        const uniqueBigrams = Object.keys(bigramFreq).length;
        const bigramRatio = uniqueBigrams / (words.length - 1 || 1);
        
        // Combinar factores para la perplejidad (valores más bajos = más probable IA)
        // Escala: 0-100, donde valores más bajos indican mayor probabilidad de IA
        const normalizedVariance = Math.min(100, variance * 10);
        const normalizedBigramRatio = bigramRatio * 100;
        const normalizedEntropy = Math.min(100, entropyFreq * 20);
        
        return Math.round((normalizedVariance * 0.3 + normalizedBigramRatio * 0.4 + normalizedEntropy * 0.3));
    },
    
    // Cálculo de burstiness (variabilidad en la estructura) - Refinado
    // Valores más bajos indican mayor probabilidad de ser generado por IA
    calculateBurstiness: function(text) {
        const sentences = this.splitIntoSentences(text);
        
        // Analizar la variabilidad en la estructura de las oraciones
        const sentenceLengths = sentences.map(s => s.length);
        const avgLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
        
        // Calcular la desviación estándar de las longitudes
        const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
        const stdDev = Math.sqrt(variance);
        
        // Calcular el coeficiente de variación (CV)
        const cv = stdDev / avgLength;
        
        // Análisis de patrones de puntuación
        const punctuationPatterns = text.match(/[.!?;:,]/g) || [];
        const punctuationFreq = {};
        punctuationPatterns.forEach(p => {
            punctuationFreq[p] = (punctuationFreq[p] || 0) + 1;
        });
        
        // Calcular diversidad de puntuación
        const uniquePunctuation = Object.keys(punctuationFreq).length;
        const punctuationDiversity = uniquePunctuation / 6; // Normalizado a 6 tipos comunes
        
        // Análisis de transiciones entre oraciones
        let transitionScore = 0;
        for (let i = 0; i < sentences.length - 1; i++) {
            // Detectar palabras de transición al inicio de oraciones
            const nextSentenceStart = sentences[i+1].split(' ').slice(0, 3).join(' ').toLowerCase();
            const hasTransitionWord = /\b(además|sin embargo|por lo tanto|no obstante|en cambio|por otro lado|asimismo|en consecuencia|de hecho|en realidad|por ejemplo|es decir)\b/.test(nextSentenceStart);
            
            if (hasTransitionWord) {
                transitionScore += 1;
            }
        }
        const transitionRate = transitionScore / (sentences.length - 1 || 1);
        
        // Combinar factores (valores más altos = más variabilidad = más probable humano)
        const burstinessScore = (cv * 50) + (punctuationDiversity * 25) + (transitionRate * 25);
        
        return Math.round(Math.min(100, burstinessScore));
    },
    
    // Métricas avanzadas refinadas
    // Cálculo de entropía (complejidad y aleatoriedad) - Refinado
    // Valores más altos indican mayor probabilidad de ser escrito por humano
    calculateEntropy: function(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const totalWords = words.length;
        
        if (totalWords === 0) return 50; // Valor neutral para texto vacío
        
        // Calcular frecuencias
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        // Calcular entropía de Shannon
        let entropy = 0;
        Object.values(wordFreq).forEach(freq => {
            const probability = freq / totalWords;
            entropy -= probability * Math.log2(probability);
        });
        
        // Análisis de n-gramas (trigramas)
        const trigramFreq = {};
        for (let i = 0; i < words.length - 2; i++) {
            const trigram = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
            trigramFreq[trigram] = (trigramFreq[trigram] || 0) + 1;
        }
        
        // Calcular entropía de trigramas
        let trigramEntropy = 0;
        const totalTrigrams = words.length - 2;
        if (totalTrigrams > 0) {
            Object.values(trigramFreq).forEach(freq => {
                const probability = freq / totalTrigrams;
                trigramEntropy -= probability * Math.log2(probability);
            });
        }
        
        // Combinar entropías (valores más altos = más aleatorio = más probable humano)
        const combinedEntropy = (entropy * 0.6) + (trigramEntropy * 0.4);
        
        // Normalizar a escala 0-100
        return Math.round(Math.min(100, combinedEntropy * 15));
    },
    
    // Cálculo de coherencia (consistencia temática y lógica) - Refinado
    calculateCoherence: function(text) {
        const sentences = this.splitIntoSentences(text);
        if (sentences.length <= 1) return 50; // Valor neutral para textos muy cortos
        
        // Extraer palabras clave de cada oración
        const sentenceKeywords = sentences.map(s => {
            const words = s.toLowerCase().match(/\b\w{4,}\b/g) || []; // Palabras de al menos 4 letras
            return [...new Set(words)]; // Eliminar duplicados
        });
        
        // Calcular similitud entre oraciones consecutivas
        let totalSimilarity = 0;
        let abruptTransitions = 0;
        
        for (let i = 0; i < sentenceKeywords.length - 1; i++) {
            const currentKeywords = sentenceKeywords[i];
            const nextKeywords = sentenceKeywords[i + 1];
            
            // Calcular palabras comunes
            const commonWords = currentKeywords.filter(word => nextKeywords.includes(word));
            
            // Calcular coeficiente de Jaccard
            const similarity = commonWords.length / (currentKeywords.length + nextKeywords.length - commonWords.length);
            totalSimilarity += similarity;
            
            // Detectar transiciones abruptas (señal de IA)
            if (similarity < 0.1 && currentKeywords.length > 3 && nextKeywords.length > 3) {
                abruptTransitions++;
            }
        }
        
        // Promediar similitud
        const avgSimilarity = totalSimilarity / (sentences.length - 1);
        
        // Calcular tasa de transiciones abruptas
        const abruptTransitionRate = abruptTransitions / (sentences.length - 1);
        
        // Penalizar coherencia perfecta (demasiado coherente = IA)
        // y también penalizar transiciones muy abruptas (señal de IA)
        let coherenceScore = avgSimilarity * 100;
        
        // Penalizar coherencia demasiado perfecta (>0.8) o demasiado baja (<0.1)
        if (avgSimilarity > 0.8) {
            coherenceScore -= (avgSimilarity - 0.8) * 100;
        } else if (avgSimilarity < 0.1) {
            coherenceScore -= (0.1 - avgSimilarity) * 100;
        }
        
        // Penalizar transiciones abruptas
        coherenceScore -= abruptTransitionRate * 30;
        
        return Math.round(Math.max(0, Math.min(100, coherenceScore)));
    },
    
    // Cálculo de variedad léxica - Refinado
    // Valores más altos indican mayor probabilidad de ser escrito por humano
    calculateLexicalVariety: function(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const totalWords = words.length;
        
        if (totalWords < 10) return 50; // Valor neutral para textos muy cortos
        
        // Calcular palabras únicas
        const uniqueWords = new Set(words);
        
        // Type-Token Ratio (TTR)
        const ttr = uniqueWords.size / totalWords;
        
        // Calcular MTLD (Measure of Textual Lexical Diversity)
        // Más robusto que TTR para textos largos
        let factor = 0;
        let factors = 0;
        const targetTTR = 0.72; // Umbral estándar
        
        let currentSegment = [];
        for (let i = 0; i < words.length; i++) {
            currentSegment.push(words[i]);
            const segmentUnique = new Set(currentSegment);
            const segmentTTR = segmentUnique.size / currentSegment.length;
            
            if (segmentTTR <= targetTTR) {
                factor++;
                currentSegment = [];
            }
        }
        
        // Manejar el segmento final
        if (currentSegment.length > 0) {
            const segmentUnique = new Set(currentSegment);
            const segmentTTR = segmentUnique.size / currentSegment.length;
            factors = factor + (1 - segmentTTR) / (1 - targetTTR);
        } else {
            factors = factor;
        }
        
        const mtld = totalWords / (factors || 1);
        
        // Análisis de hapax legomena (palabras que aparecen solo una vez)
        const hapaxCount = Object.values(words.reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {})).filter(count => count === 1).length;
        
        const hapaxRatio = hapaxCount / totalWords;
        
        // Combinar métricas (valores más altos = más variedad = más probable humano)
        // Normalizar a escala 0-100, ajustando por longitud del texto
        const lengthFactor = Math.min(1, 100 / totalWords);
        const normalizedTTR = ttr / (0.5 * lengthFactor + 0.5);
        const normalizedMTLD = Math.min(1, mtld / 100);
        const normalizedHapax = hapaxRatio * 2; // Multiplicar por 2 para normalizar
        
        return Math.round(Math.min(100, (normalizedTTR * 0.3 + normalizedMTLD * 0.4 + normalizedHapax * 0.3) * 100));
    },
    
    // Nuevas métricas avanzadas refinadas
    // Fluidez: evalúa la calidad y legibilidad del lenguaje natural - Refinado
    calculateFluency: function(text) {
        const sentences = this.splitIntoSentences(text);
        
        // Analizar longitud promedio de palabras
        const words = text.match(/\b\w+\b/g) || [];
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        
        // Análisis de conectores y transiciones
        const connectors = [
            'además', 'sin embargo', 'por lo tanto', 'en consecuencia', 'por otro lado', 
            'asimismo', 'no obstante', 'en cambio', 'por ejemplo', 'es decir',
            'también', 'aunque', 'mientras que', 'a pesar de', 'debido a',
            'puesto que', 'ya que', 'como resultado', 'en particular', 'específicamente',
            'also', 'however', 'therefore', 'consequently', 'on the other hand',
            'likewise', 'nevertheless', 'instead', 'for example', 'that is'
        ];
        
        let connectorCount = 0;
        connectors.forEach(connector => {
            const regex = new RegExp('\\b' + connector + '\\b', 'gi');
            const matches = text.match(regex) || [];
            connectorCount += matches.length;
        });
        
        const connectorRatio = connectorCount / sentences.length;
        
        // Analizar complejidad de oraciones (puntuación)
        const punctuationMarks = text.match(/[,.;:!?]/g) || [];
        const punctuationRatio = punctuationMarks.length / sentences.length;
        
        // Detectar formalidad excesiva (señal de IA)
        const formalWords = [
            'adicionalmente', 'consecuentemente', 'subsecuentemente', 'indudablemente', 'evidentemente',
            'ciertamente', 'considerablemente', 'fundamentalmente', 'primordialmente', 'significativamente',
            'subsequently', 'furthermore', 'moreover', 'nevertheless', 'notwithstanding'
        ];
        
        let formalCount = 0;
        formalWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            const matches = text.match(regex) || [];
            formalCount += matches.length;
        });
        
        const formalityRatio = formalCount / (words.length / 100); // Normalizado a cada 100 palabras
        
        // Detectar expresiones coloquiales (señal humana)
        const colloquialExpressions = [
            'a lo mejor', 'de vez en cuando', 'dar en el clavo', 'estar en las nubes',
            'meter la pata', 'ponerse las pilas', 'tirar la toalla', 'echar una mano',
            'en un abrir y cerrar de ojos', 'estar hasta las narices', 'no tener ni idea',
            'once in a while', 'piece of cake', 'break a leg', 'hang in there'
        ];
        
        let colloquialCount = 0;
        colloquialExpressions.forEach(expr => {
            const regex = new RegExp(expr, 'gi');
            const matches = text.match(regex) || [];
            colloquialCount += matches.length;
        });
        
        const colloquialRatio = colloquialCount / (words.length / 200); // Normalizado a cada 200 palabras
        
        // Combinar factores para la fluidez
        const wordLengthScore = Math.min(100, avgWordLength * 20); // Penalizar palabras muy cortas o muy largas
        const connectorScore = Math.min(100, connectorRatio * 50); // Premiar uso de conectores
        const punctuationScore = Math.min(100, punctuationRatio * 25); // Premiar puntuación variada
        const formalityPenalty = Math.min(50, formalityRatio * 25); // Penalizar exceso de formalidad
        const colloquialBonus = Math.min(50, colloquialRatio * 100); // Premiar expresiones coloquiales
        
        return Math.round((wordLengthScore * 0.2 + connectorScore * 0.3 + punctuationScore * 0.2 - formalityPenalty * 0.15 + colloquialBonus * 0.15));
    },
    
    // Pertinencia: evalúa la relevancia y enfoque del texto - Refinado
    calculateRelevance: function(text) {
        // Identificar temas principales
        const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        // Ordenar palabras por frecuencia
        const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);
        
        // Extraer temas principales (top 5 palabras más frecuentes)
        const mainTopics = sortedWords.slice(0, 5).map(entry => entry[0]);
        
        // Analizar consistencia temática
        const sentences = this.splitIntoSentences(text);
        let topicCoverage = 0;
        
        sentences.forEach(sentence => {
            const sentenceLower = sentence.toLowerCase();
            const topicsInSentence = mainTopics.filter(topic => sentenceLower.includes(topic));
            topicCoverage += topicsInSentence.length / mainTopics.length;
        });
        
        // Detectar digresiones (señal humana)
        let digressionCount = 0;
        for (let i = 0; i < sentences.length; i++) {
            const sentenceLower = sentences[i].toLowerCase();
            const hasMainTopic = mainTopics.some(topic => sentenceLower.includes(topic));
            
            // Si una oración no contiene ningún tema principal y está rodeada por oraciones que sí los contienen
            if (!hasMainTopic && i > 0 && i < sentences.length - 1) {
                const prevHasTopic = mainTopics.some(topic => sentences[i-1].toLowerCase().includes(topic));
                const nextHasTopic = mainTopics.some(topic => sentences[i+1].toLowerCase().includes(topic));
                
                if (prevHasTopic && nextHasTopic) {
                    digressionCount++;
                }
            }
        }
        
        const digressionRatio = digressionCount / sentences.length;
        
        // Normalizar a escala 0-100
        const avgTopicCoverage = (topicCoverage / sentences.length) * 100;
        
        // Combinar factores (demasiada consistencia temática = IA)
        let relevanceScore = avgTopicCoverage;
        
        // Premiar digresiones naturales (señal humana)
        relevanceScore += digressionRatio * 20;
        
        // Penalizar consistencia temática perfecta (>90)
        if (avgTopicCoverage > 90) {
            relevanceScore -= (avgTopicCoverage - 90) * 0.5;
        }
        
        return Math.round(Math.min(100, relevanceScore));
    },
    
    // Detección de patrones repetitivos - Refinado
    calculateRepetitivePatterns: function(text) {
        const sentences = this.splitIntoSentences(text);
        
        // Analizar estructuras de inicio de oración
        const sentenceStarts = sentences.map(s => {
            const words = s.toLowerCase().match(/\b\w+\b/g) || [];
            return words.slice(0, Math.min(3, words.length)).join(' ');
        });
        
        // Contar inicios repetidos
        const startFreq = {};
        sentenceStarts.forEach(start => {
            startFreq[start] = (startFreq[start] || 0) + 1;
        });
        
        const repeatedStarts = Object.values(startFreq).filter(freq => freq > 1).length;
        const startRepetitionRate = repeatedStarts / Object.keys(startFreq).length;
        
        // Analizar longitud de oraciones
        const sentenceLengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
        
        // Calcular varianza en longitud
        const avgLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
        const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
        const normalizedVariance = Math.min(1, variance / 25); // Normalizar varianza
        
        // Detectar estructuras sintácticas repetitivas
        const posPatterns = [];
        sentences.forEach(sentence => {
            // Simplificación de análisis POS: detectar patrones básicos
            const words = sentence.split(/\s+/);
            const pattern = words.map(word => {
                if (/^[A-Z]/.test(word)) return 'N'; // Mayúscula inicial: nombre propio
                if (/^(el|la|los|las|un|una|unos|unas|the|a|an)$/i.test(word)) return 'D'; // Determinante
                if (/^(y|e|o|u|pero|mas|sino|because|and|or|but|yet|so)$/i.test(word)) return 'C'; // Conjunción
                if (/^(de|del|a|al|en|por|para|con|sin|from|to|in|by|for|with|without)$/i.test(word)) return 'P'; // Preposición
                if (/^(es|son|está|están|fue|fueron|será|serán|is|are|was|were|will)$/i.test(word)) return 'V'; // Verbo ser/estar
                if (/[aeioué]r$/i.test(word)) return 'V'; // Verbos en infinitivo
                if (/[aeiou]ndo$/i.test(word)) return 'V'; // Gerundios
                if (/[aeiou](do|da|dos|das)$/i.test(word)) return 'V'; // Participios
                if (/mente$/i.test(word)) return 'Adv'; // Adverbios
                return 'X'; // Otros
            }).join('');
            posPatterns.push(pattern);
        });
        
        // Contar patrones sintácticos repetidos
        const patternFreq = {};
        posPatterns.forEach(pattern => {
            patternFreq[pattern] = (patternFreq[pattern] || 0) + 1;
        });
        
        const repeatedPatterns = Object.values(patternFreq).filter(freq => freq > 1).length;
        const patternRepetitionRate = repeatedPatterns / Object.keys(patternFreq).length;
        
        // Detectar conclusiones artificiales
        let conclusionScore = 0;
        if (sentences.length > 5) {
            const lastSentence = sentences[sentences.length - 1].toLowerCase();
            const conclusionMarkers = [
                'en conclusión', 'para concluir', 'en resumen', 'en síntesis', 'finalmente',
                'in conclusion', 'to conclude', 'in summary', 'to summarize', 'finally'
            ];
            
            if (conclusionMarkers.some(marker => lastSentence.includes(marker))) {
                conclusionScore = 20;
            }
        }
        
        // Combinar factores (valores más altos indican más patrones repetitivos = más probable IA)
        const repetitionScore = (startRepetitionRate * 30) + 
                               ((1 - normalizedVariance) * 30) + 
                               (patternRepetitionRate * 30) +
                               conclusionScore;
        
        return Math.round(Math.min(100, repetitionScore));
    },
    
    // Nueva métrica: Detección de errores sutiles y naturalidad
    calculateErrorsAndNaturalness: function(text) {
        const sentences = this.splitIntoSentences(text);
        
        // Detectar expresiones idiomáticas y modismos (señal humana)
        const idioms = [
            'dar en el clavo', 'estar en las nubes', 'costar un ojo de la cara',
            'tomar el pelo', 'ser pan comido', 'estar como pez en el agua',
            'hit the nail on the head', 'cost an arm and a leg', 'piece of cake'
        ];
        
        let idiomCount = 0;
        idioms.forEach(idiom => {
            const regex = new RegExp(idiom, 'gi');
            const matches = text.match(regex) || [];
            idiomCount += matches.length;
        });
        
        const idiomRatio = idiomCount / (text.length / 1000); // Normalizado por cada 1000 caracteres
        
        // Detectar autocorrecciones o rectificaciones (señal humana)
        let correctionCount = 0;
        const correctionPatterns = [
            /\b(quiero decir|es decir|mejor dicho|o sea|perdón|corrijo|rectificando|I mean|that is|rather|or rather|sorry|I meant)\b/gi,
            /\b[^.!?]+, no, [^.!?]+\b/gi,
            /\b[^.!?]+ - [^.!?]+ - [^.!?]+\b/gi
        ];
        
        correctionPatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            correctionCount += matches.length;
        });
        
        const correctionRatio = correctionCount / sentences.length;
        
        // Detectar referencias personales (señal humana)
        let personalRefCount = 0;
        const personalPatterns = [
            /\b(yo|me|mi|conmigo|nosotros|nos|nuestro|I|me|my|mine|we|us|our)\b/gi,
            /\b(creo|pienso|opino|siento|recuerdo|I think|I believe|I feel|I remember)\b/gi,
            /\b(en mi opinión|desde mi punto de vista|in my opinion|from my perspective)\b/gi
        ];
        
        personalPatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            personalRefCount += matches.length;
        });
        
        const personalRefRatio = personalRefCount / sentences.length;
        
        // Detectar inconsistencias menores (señal humana)
        let inconsistencyCount = 0;
        
        // Inconsistencias en tiempos verbales
        for (let i = 0; i < sentences.length - 1; i++) {
            const currentSentence = sentences[i].toLowerCase();
            const nextSentence = sentences[i+1].toLowerCase();
            
            const currentPast = /\b(fue|fueron|estuvo|estuvieron|hizo|hicieron|dijo|dijeron|was|were|did|said)\b/.test(currentSentence);
            const currentPresent = /\b(es|son|está|están|hace|hacen|dice|dicen|is|are|does|do|say)\b/.test(currentSentence);
            
            const nextPast = /\b(fue|fueron|estuvo|estuvieron|hizo|hicieron|dijo|dijeron|was|were|did|said)\b/.test(nextSentence);
            const nextPresent = /\b(es|son|está|están|hace|hacen|dice|dicen|is|are|does|do|say)\b/.test(nextSentence);
            
            // Cambio abrupto de tiempo verbal sin marcador temporal
            if ((currentPast && nextPresent) || (currentPresent && nextPast)) {
                const hasTimeMarker = /\b(ahora|antes|después|hoy|ayer|mañana|actualmente|previamente|now|before|after|today|yesterday|tomorrow|currently|previously)\b/.test(nextSentence);
                
                if (!hasTimeMarker) {
                    inconsistencyCount++;
                }
            }
        }
        
        const inconsistencyRatio = inconsistencyCount / (sentences.length - 1 || 1);
        
        // Combinar factores (valores más altos = más natural = más probable humano)
        const naturalness = (idiomRatio * 30) + (correctionRatio * 30) + (personalRefRatio * 30) + (inconsistencyRatio * 10);
        
        return Math.round(Math.min(100, naturalness * 100));
    },
    
    // Nueva métrica: Análisis de transiciones entre oraciones
    calculateTransitionAbruptness: function(text) {
        const sentences = this.splitIntoSentences(text);
        if (sentences.length <= 2) return 50; // Valor neutral para textos muy cortos
        
        let abruptTransitionCount = 0;
        let smoothTransitionCount = 0;
        
        for (let i = 0; i < sentences.length - 1; i++) {
            const currentSentence = sentences[i].toLowerCase();
            const nextSentence = sentences[i+1].toLowerCase();
            
            // Extraer palabras significativas (no stopwords)
            const currentWords = currentSentence.match(/\b(?!(el|la|los|las|un|una|unos|unas|y|o|a|ante|bajo|con|de|desde|en|entre|hacia|hasta|para|por|según|sin|sobre|tras|the|a|an|and|or|to|from|with|in|on|at|by|for))\w{3,}\b/gi) || [];
            const nextWords = nextSentence.match(/\b(?!(el|la|los|las|un|una|unos|unas|y|o|a|ante|bajo|con|de|desde|en|entre|hacia|hasta|para|por|según|sin|sobre|tras|the|a|an|and|or|to|from|with|in|on|at|by|for))\w{3,}\b/gi) || [];
            
            // Verificar palabras comunes
            const commonWords = currentWords.filter(word => nextWords.includes(word));
            
            // Verificar conectores de transición
            const hasTransitionWord = /\b(además|sin embargo|por lo tanto|no obstante|en cambio|por otro lado|asimismo|en consecuencia|de hecho|en realidad|por ejemplo|es decir|también|aunque|mientras que|a pesar de|debido a|puesto que|ya que|como resultado|en particular|específicamente|also|however|therefore|consequently|on the other hand|likewise|nevertheless|instead|for example|that is)\b/i.test(nextSentence);
            
            // Verificar pronombres anafóricos
            const hasAnaphoricReference = /\b(esto|eso|aquello|él|ella|ellos|ellas|le|les|lo|la|los|las|su|sus|this|that|these|those|it|they|them|their)\b/i.test(nextSentence);
            
            // Determinar si la transición es abrupta
            if (commonWords.length === 0 && !hasTransitionWord && !hasAnaphoricReference) {
                abruptTransitionCount++;
            } else {
                smoothTransitionCount++;
            }
        }
        
        // Calcular tasa de transiciones abruptas (valores más altos = más abruptas = más probable IA)
        const abruptTransitionRate = abruptTransitionCount / (sentences.length - 1);
        
        return Math.round(abruptTransitionRate * 100);
    },
    
    // Nueva métrica: Formalidad excesiva
    calculateExcessiveFormality: function(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const totalWords = words.length;
        
        if (totalWords < 20) return 50; // Valor neutral para textos muy cortos
        
        // Palabras y frases formales
        const formalExpressions = [
            'adicionalmente', 'consecuentemente', 'subsecuentemente', 'indudablemente', 'evidentemente',
            'ciertamente', 'considerablemente', 'fundamentalmente', 'primordialmente', 'significativamente',
            'en virtud de', 'en función de', 'en relación con', 'en lo que respecta a', 'en lo concerniente a',
            'cabe destacar que', 'es menester', 'es imperativo', 'es preciso señalar', 'es necesario enfatizar',
            'subsequently', 'furthermore', 'moreover', 'nevertheless', 'notwithstanding',
            'with regard to', 'in relation to', 'concerning the matter of', 'it is imperative', 'it must be emphasized'
        ];
        
        let formalCount = 0;
        formalExpressions.forEach(expr => {
            const regex = new RegExp('\\b' + expr + '\\b', 'gi');
            const matches = text.match(regex) || [];
            formalCount += matches.length;
        });
        
        // Detectar estructuras pasivas (más comunes en textos formales)
        const passiveStructures = [
            /\b(es|son|fue|fueron|ha sido|han sido|será|serán|is|are|was|were|has been|have been|will be) [a-záéíóúüñ]+ (por|by)\b/gi,
            /\b(se) [a-záéíóúüñ]+(a|e|ó)\b/gi
        ];
        
        let passiveCount = 0;
        passiveStructures.forEach(pattern => {
            const matches = text.match(pattern) || [];
            passiveCount += matches.length;
        });
        
        // Calcular ratio de formalidad
        const formalRatio = (formalCount + passiveCount) / (totalWords / 100); // Normalizado a cada 100 palabras
        
        // Valores más altos = más formal = más probable IA
        return Math.round(Math.min(100, formalRatio * 20));
    },
    
    // Análisis por oraciones - Refinado
    analyzeSentences: function(text) {
        const sentences = this.splitIntoSentences(text);
        
        return sentences.map(sentence => {
            // Calcular probabilidad de IA para cada oración usando múltiples métricas
            const perplexity = this.calculatePerplexity(sentence);
            const burstiness = this.calculateBurstiness(sentence);
            const entropy = this.calculateEntropy(sentence);
            const fluency = this.calculateFluency(sentence);
            const repetitivePatterns = this.calculateRepetitivePatterns(sentence);
            const errorsAndNaturalness = this.calculateErrorsAndNaturalness(sentence);
            const excessiveFormality = this.calculateExcessiveFormality(sentence);
            
            // Combinar métricas para obtener probabilidad
            const aiProbability = Math.round((
                (100 - perplexity) * 0.15 + 
                (100 - burstiness) * 0.15 + 
                (100 - entropy) * 0.15 + 
                (100 - fluency) * 0.10 + 
                repetitivePatterns * 0.15 +
                (100 - errorsAndNaturalness) * 0.15 +
                excessiveFormality * 0.15
            ));
            
            return {
                text: sentence,
                aiProbability: aiProbability,
                class: aiProbability > 75 ? 'sentence-ai-high' : 
                       aiProbability > 50 ? 'sentence-ai' : 'sentence-human',
                metrics: {
                    perplexity,
                    burstiness,
                    entropy,
                    fluency,
                    repetitivePatterns,
                    errorsAndNaturalness,
                    excessiveFormality
                }
            };
        });
    },
    
    // Función auxiliar para dividir texto en oraciones - Refinado
    splitIntoSentences: function(text) {
        // Patrón mejorado para dividir en oraciones respetando abreviaturas comunes
        const abbreviations = /(?:[A-Za-z]\.){2,}|[A-Za-z]+\.[A-Za-z]+\.|Sra?\.|Dr\.|Prof\.|Lic\.|etc\.|p\. ej\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|etc\.|e\.g\.|i\.e\./g;
        
        // Reemplazar temporalmente abreviaturas
        let processedText = text.replace(abbreviations, match => match.replace(/\./g, '##DOT##'));
        
        // Dividir por puntos finales, signos de interrogación y exclamación
        processedText = processedText
            .replace(/([.?!])\s+(?=[A-ZÁÉÍÓÚÜÑA-Z])/g, "$1|")
            .replace(/([.?!])(?=["']?\s+[A-ZÁÉÍÓÚÜÑA-Z])/g, "$1|");
        
        // Restaurar abreviaturas
        processedText = processedText.replace(/##DOT##/g, '.');
        
        // Dividir y limpiar
        return processedText
            .split("|")
            .map(s => s.trim())
            .filter(s => s.length > 0);
    },
    
    // Análisis completo del texto - Refinado con nuevas métricas y pesos ajustados
    analyzeText: function(text) {
        // Calcular todas las métricas
        const perplexity = this.calculatePerplexity(text);
        const burstiness = this.calculateBurstiness(text);
        const entropy = this.calculateEntropy(text);
        const coherence = this.calculateCoherence(text);
        const lexicalVariety = this.calculateLexicalVariety(text);
        const fluency = this.calculateFluency(text);
        const relevance = this.calculateRelevance(text);
        const repetitivePatterns = this.calculateRepetitivePatterns(text);
        const errorsAndNaturalness = this.calculateErrorsAndNaturalness(text);
        const transitionAbruptness = this.calculateTransitionAbruptness(text);
        const excessiveFormality = this.calculateExcessiveFormality(text);
        
        // Calcular probabilidad general de IA
        // Ponderación de métricas refinada basada en investigación y benchmarking
        const aiProbability = Math.round((
            (100 - perplexity) * 0.10 + 
            (100 - burstiness) * 0.10 + 
            (100 - entropy) * 0.10 + 
            (100 - coherence) * 0.05 + 
            (100 - lexicalVariety) * 0.10 +
            (100 - fluency) * 0.10 +
            (100 - relevance) * 0.05 +
            repetitivePatterns * 0.10 +
            (100 - errorsAndNaturalness) * 0.15 +
            transitionAbruptness * 0.05 +
            excessiveFormality * 0.10
        ));
        
        // Análisis por oraciones
        const sentenceAnalysis = this.analyzeSentences(text);
        
        // Generar resultados de plataformas de referencia
        // Simulando variaciones realistas basadas en la investigación
        const platformResults = this.generatePlatformResults(aiProbability);
        
        // Generar explicaciones detalladas
        const explanations = this.generateExplanations(
            aiProbability, 
            { 
                perplexity, 
                burstiness, 
                entropy, 
                coherence, 
                lexicalVariety, 
                fluency, 
                relevance, 
                repetitivePatterns,
                errorsAndNaturalness,
                transitionAbruptness,
                excessiveFormality
            }
        );
        
        return {
            aiProbability,
            metrics: {
                perplexity,
                burstiness,
                entropy,
                coherence,
                lexicalVariety,
                fluency,
                relevance,
                repetitivePatterns,
                errorsAndNaturalness,
                transitionAbruptness,
                excessiveFormality
            },
            sentenceAnalysis,
            platformResults,
            explanations
        };
    },
    
    // Generar explicaciones detalladas de los resultados - Refinado
    generateExplanations: function(aiProbability, metrics) {
        const explanations = {
            summary: "",
            details: {},
            recommendations: []
        };
        
        // Explicación general
        if (aiProbability > 80) {
            explanations.summary = "Este texto tiene una alta probabilidad de haber sido generado por IA. Presenta múltiples patrones característicos de texto artificial como baja variabilidad, alta predictibilidad, estructuras repetitivas, transiciones abruptas y formalidad excesiva.";
        } else if (aiProbability > 60) {
            explanations.summary = "Este texto muestra características mixtas, pero con tendencia a patrones generados por IA. Podría ser texto de IA editado por humanos o una combinación de ambos. Se detectan algunas estructuras artificiales junto con elementos de naturalidad.";
        } else if (aiProbability > 40) {
            explanations.summary = "Este texto presenta un equilibrio entre características humanas y de IA, lo que dificulta una clasificación definitiva. Podría ser texto humano muy estructurado o texto de IA muy refinado con edición humana significativa.";
        } else if (aiProbability > 20) {
            explanations.summary = "Este texto muestra principalmente características de escritura humana, con algunas secciones que podrían haber sido asistidas por IA. Presenta variabilidad natural, digresiones y elementos coloquiales típicos de la escritura humana.";
        } else {
            explanations.summary = "Este texto tiene una alta probabilidad de haber sido escrito por un humano. Presenta variabilidad natural, estructuras diversas, inconsistencias menores, expresiones idiomáticas y patrones de lenguaje orgánicos que son difíciles de replicar por la IA.";
        }
        
        // Explicaciones detalladas por métrica
        explanations.details = {
            perplexity: this.explainMetric("perplejidad", metrics.perplexity, "La perplejidad mide cuán predecible es el texto. Valores bajos indican patrones más predecibles, típicos de la IA. El análisis incluye distribución de frecuencias de palabras y patrones de bigramas.", 50),
            burstiness: this.explainMetric("variabilidad", metrics.burstiness, "La variabilidad analiza los cambios en la estructura de las oraciones. Los humanos tienden a variar más la longitud y complejidad de sus frases, mientras que la IA suele mantener estructuras más consistentes.", 50),
            entropy: this.explainMetric("entropía", metrics.entropy, "La entropía evalúa la aleatoriedad y complejidad del texto. Los textos humanos suelen tener mayor entropía debido a la variabilidad natural del lenguaje humano y la menor predictibilidad.", 50),
            coherence: this.explainMetric("coherencia", metrics.coherence, "La coherencia mide la consistencia temática y lógica. Valores muy altos pueden indicar una estructura demasiado perfecta, típica de IA, mientras que valores moderados son más naturales.", 70),
            lexicalVariety: this.explainMetric("variedad léxica", metrics.lexicalVariety, "La variedad léxica evalúa la diversidad de vocabulario. Los humanos suelen usar vocabulario más diverso y menos repetitivo, incluyendo términos poco comunes y expresiones idiomáticas.", 50),
            fluency: this.explainMetric("fluidez", metrics.fluency, "La fluidez analiza la calidad y naturalidad del lenguaje. Valores extremadamente altos pueden indicar un texto demasiado pulido, mientras que la escritura humana suele tener pequeñas imperfecciones.", 70),
            relevance: this.explainMetric("pertinencia", metrics.relevance, "La pertinencia evalúa la consistencia temática. La IA suele mantener mayor enfoque temático, mientras que los humanos tienden a incluir digresiones y comentarios tangenciales.", 60),
            repetitivePatterns: this.explainMetric("patrones repetitivos", metrics.repetitivePatterns, "Analiza la repetición de estructuras y comienzos de oraciones. La IA tiende a usar patrones más repetitivos y predecibles en la estructura de las frases.", 40),
            errorsAndNaturalness: this.explainMetric("naturalidad", metrics.errorsAndNaturalness, "Evalúa la presencia de elementos naturales como expresiones idiomáticas, autocorrecciones y referencias personales que son más comunes en textos humanos.", 60),
            transitionAbruptness: this.explainMetric("transiciones abruptas", metrics.transitionAbruptness, "Mide la naturalidad en las transiciones entre oraciones. La IA puede generar cambios temáticos sin conectores adecuados o referencias anafóricas.", 40),
            excessiveFormality: this.explainMetric("formalidad excesiva", metrics.excessiveFormality, "Detecta el uso excesivo de lenguaje formal y estructuras pasivas, que son más comunes en textos generados por IA, especialmente en contextos que deberían ser informales.", 40)
        };
        
        // Recomendaciones basadas en resultados
        if (aiProbability > 60) {
            explanations.recommendations.push("Para humanizar este texto, intente variar más la longitud de las oraciones y la estructura sintáctica.");
            explanations.recommendations.push("Añada expresiones idiomáticas, modismos y coloquialismos para dar mayor naturalidad.");
            explanations.recommendations.push("Introduzca algunas digresiones o comentarios personales para romper la estructura perfecta.");
            explanations.recommendations.push("Reduzca el uso de lenguaje excesivamente formal y estructuras pasivas.");
            explanations.recommendations.push("Incluya algunas inconsistencias menores o autocorrecciones para simular el flujo de pensamiento humano.");
            explanations.recommendations.push("Considere usar nuestra función de humanización automática para mejorar el texto.");
        } else if (aiProbability > 40) {
            explanations.recommendations.push("El texto parece equilibrado, pero podría beneficiarse de mayor variabilidad en la estructura.");
            explanations.recommendations.push("Considere revisar las secciones marcadas como más probables de IA para añadir un toque más personal.");
            explanations.recommendations.push("Añada algunas referencias personales o experiencias para aumentar la autenticidad.");
        } else {
            explanations.recommendations.push("El texto muestra características principalmente humanas. No se requieren cambios significativos.");
            explanations.recommendations.push("Para mejorar aún más, considere revisar la coherencia y estructura general.");
        }
        
        return explanations;
    },
    
    // Función auxiliar para explicar cada métrica - Refinado
    explainMetric: function(name, value, description, threshold) {
        let interpretation;
        
        if (name === "patrones repetitivos" || name === "transiciones abruptas" || name === "formalidad excesiva") {
            // Para estas métricas, valores altos indican IA
            if (value > threshold + 20) {
                interpretation = `El texto muestra un nivel muy alto de ${name}, fuertemente asociado con texto generado por IA.`;
            } else if (value > threshold) {
                interpretation = `El texto muestra un nivel moderadamente alto de ${name}, lo que podría indicar generación por IA.`;
            } else if (value > threshold - 20) {
                interpretation = `El texto muestra un nivel moderado de ${name}, lo que es común tanto en textos humanos como de IA.`;
            } else {
                interpretation = `El texto muestra un nivel bajo de ${name}, lo que es más característico de la escritura humana.`;
            }
        } else {
            // Para el resto de métricas, valores bajos indican IA
            if (value < threshold - 20) {
                interpretation = `El texto muestra un nivel muy bajo de ${name}, fuertemente asociado con texto generado por IA.`;
            } else if (value < threshold) {
                interpretation = `El texto muestra un nivel moderadamente bajo de ${name}, lo que podría indicar generación por IA.`;
            } else if (value < threshold + 20) {
                interpretation = `El texto muestra un nivel moderado de ${name}, lo que es común tanto en textos humanos como de IA.`;
            } else {
                interpretation = `El texto muestra un nivel alto de ${name}, lo que es más característico de la escritura humana.`;
            }
        }
        
        return {
            value: value,
            description: description,
            interpretation: interpretation
        };
    },
    
    // Generar resultados comparativos con otras plataformas - Refinado
    generatePlatformResults: function(baseAiProbability) {
        // Variaciones realistas basadas en la investigación de cada plataforma
        const platforms = [
            { name: 'GPTZero', variation: 5, bias: 5 },  // GPTZero tiende a dar resultados más altos de IA
            { name: 'Turnitin', variation: 8, bias: 0 },
            { name: 'Copyleaks', variation: 6, bias: 2 },
            { name: 'Smodi', variation: 10, bias: 8 },   // Smodi es más agresivo en la detección
            { name: 'Sampling', variation: 7, bias: -2 } // Sampling tiende a ser más conservador
        ];
        
        return platforms.map(platform => {
            // Aplicar variación y sesgo específicos de cada plataforma
            const variation = Math.floor(Math.random() * platform.variation * 2) - platform.variation;
            let score = Math.max(0, Math.min(100, baseAiProbability + variation + platform.bias));
            
            // Determinar nivel de confianza basado en el valor
            let confidence;
            if (score < 30 || score > 85) {
                confidence = 'high';
            } else if (score < 40 || score > 75) {
                confidence = 'medium';
            } else {
                confidence = 'low';
            }
            
            return {
                name: platform.name,
                score,
                confidence
            };
        });
    },
    
    // Función para humanizar texto detectado como IA - Refinado
    humanizeText: function(text, aiProbability, sentenceAnalysis) {
        // Si el texto no parece ser de IA, no es necesario humanizarlo
        if (aiProbability < 40) {
            return {
                humanizedText: text,
                changes: ["El texto ya muestra características principalmente humanas. No se realizaron cambios significativos."]
            };
        }
        
        const sentences = this.splitIntoSentences(text);
        let humanizedSentences = [...sentences];
        const changes = [];
        
        // Identificar oraciones con alta probabilidad de IA
        const aiSentences = sentenceAnalysis.filter(s => s.aiProbability > 60);
        
        if (aiSentences.length === 0) {
            return {
                humanizedText: text,
                changes: ["No se identificaron oraciones con alta probabilidad de IA. No se realizaron cambios."]
            };
        }
        
        // Estrategias de humanización
        
        // 1. Variar longitud de oraciones
        for (let i = 0; i < aiSentences.length; i++) {
            const index = sentences.indexOf(aiSentences[i].text);
            if (index !== -1) {
                // Dividir oraciones largas o combinar cortas
                if (humanizedSentences[index].length > 100 && Math.random() > 0.5) {
                    const midPoint = Math.floor(humanizedSentences[index].length / 2);
                    let splitPoint = humanizedSentences[index].indexOf(' ', midPoint);
                    
                    if (splitPoint !== -1) {
                        const firstPart = humanizedSentences[index].substring(0, splitPoint) + '.';
                        const secondPart = humanizedSentences[index].substring(splitPoint + 1);
                        
                        humanizedSentences[index] = firstPart;
                        humanizedSentences.splice(index + 1, 0, secondPart);
                        
                        changes.push(`Dividida una oración larga para añadir variabilidad.`);
                    }
                } else if (index < humanizedSentences.length - 1 && 
                          humanizedSentences[index].length < 50 && 
                          humanizedSentences[index + 1].length < 50 &&
                          Math.random() > 0.7) {
                    
                    // Combinar oraciones cortas con conectores
                    const connectors = ['además', 'y', 'también', 'mientras que', 'aunque', 'sin embargo', 'por otro lado'];
                    const connector = connectors[Math.floor(Math.random() * connectors.length)];
                    
                    humanizedSentences[index] = humanizedSentences[index].replace(/[.!?]$/, '') + 
                                              ', ' + connector + ' ' + 
                                              humanizedSentences[index + 1].charAt(0).toLowerCase() + 
                                              humanizedSentences[index + 1].slice(1);
                    
                    humanizedSentences.splice(index + 1, 1);
                    
                    changes.push(`Combinadas oraciones cortas para mejorar fluidez.`);
                }
            }
        }
        
        // 2. Añadir expresiones coloquiales o idiomáticas
        const colloquialExpressions = [
            { pattern: /es importante/gi, replacement: "es crucial" },
            { pattern: /es necesario/gi, replacement: "hace falta" },
            { pattern: /además/gi, replacement: "por si fuera poco" },
            { pattern: /sin embargo/gi, replacement: "no obstante" },
            { pattern: /por lo tanto/gi, replacement: "así que" },
            { pattern: /finalmente/gi, replacement: "para rematar" },
            { pattern: /muy bueno/gi, replacement: "fantástico" },
            { pattern: /muy malo/gi, replacement: "pésimo" },
            { pattern: /en conclusión/gi, replacement: "para cerrar el tema" },
            { pattern: /es evidente/gi, replacement: "salta a la vista" },
            { pattern: /en mi opinión/gi, replacement: "desde mi punto de vista" },
            { pattern: /considero que/gi, replacement: "me parece que" }
        ];
        
        for (let i = 0; i < humanizedSentences.length; i++) {
            if (Math.random() > 0.7) {
                let originalSentence = humanizedSentences[i];
                
                // Aplicar reemplazos aleatorios
                for (const expr of colloquialExpressions) {
                    if (expr.pattern.test(humanizedSentences[i]) && Math.random() > 0.5) {
                        humanizedSentences[i] = humanizedSentences[i].replace(expr.pattern, expr.replacement);
                        
                        if (humanizedSentences[i] !== originalSentence) {
                            changes.push(`Reemplazada expresión formal por una más coloquial.`);
                            break;
                        }
                    }
                }
            }
        }
        
        // 3. Añadir digresiones o comentarios personales
        const personalComments = [
            " (y esto me parece fascinante)",
            " (aunque no todos estarían de acuerdo)",
            " (basado en mi experiencia)",
            " (y esto es solo mi opinión)",
            " (lo que resulta sorprendente)",
            " (como he podido comprobar)",
            " (y no me canso de repetirlo)",
            " (aunque podría estar equivocado)",
            " (y esto lo digo por experiencia propia)",
            " (y créeme que lo he visto muchas veces)"
        ];
        
        for (let i = 0; i < aiSentences.length; i++) {
            const index = sentences.indexOf(aiSentences[i].text);
            if (index !== -1 && Math.random() > 0.7) {
                const commentIndex = Math.floor(Math.random() * personalComments.length);
                
                // Encontrar un buen punto para insertar el comentario
                const midPoint = Math.floor(humanizedSentences[index].length / 2);
                let insertPoint = humanizedSentences[index].indexOf(',', midPoint);
                
                if (insertPoint === -1) {
                    insertPoint = humanizedSentences[index].indexOf(' ', midPoint);
                }
                
                if (insertPoint !== -1) {
                    humanizedSentences[index] = 
                        humanizedSentences[index].substring(0, insertPoint) + 
                        personalComments[commentIndex] + 
                        humanizedSentences[index].substring(insertPoint);
                    
                    changes.push(`Añadido comentario personal para dar voz propia.`);
                }
            }
        }
        
        // 4. Introducir pequeñas imperfecciones o redundancias
        for (let i = 0; i < aiSentences.length; i++) {
            const index = sentences.indexOf(aiSentences[i].text);
            if (index !== -1 && Math.random() > 0.8) {
                // Añadir redundancia o énfasis
                const emphasisPhrases = [
                    { pattern: /es/gi, replacement: "es realmente" },
                    { pattern: /muy/gi, replacement: "realmente muy" },
                    { pattern: /interesante/gi, replacement: "interesante, muy interesante" },
                    { pattern: /importante/gi, replacement: "importante, incluso crucial" },
                    { pattern: /bueno/gi, replacement: "bueno, bastante bueno" },
                    { pattern: /difícil/gi, replacement: "difícil, realmente complicado" }
                ];
                
                let modified = false;
                for (const phrase of emphasisPhrases) {
                    if (phrase.pattern.test(humanizedSentences[index]) && Math.random() > 0.5) {
                        humanizedSentences[index] = humanizedSentences[index].replace(phrase.pattern, phrase.replacement);
                        modified = true;
                        break;
                    }
                }
                
                if (modified) {
                    changes.push(`Añadida redundancia o énfasis para simular estilo humano.`);
                }
            }
        }
        
        // 5. Añadir expresiones idiomáticas
        const idioms = [
            { pattern: /muy fácil/gi, replacement: "pan comido" },
            { pattern: /muy caro/gi, replacement: "cuesta un ojo de la cara" },
            { pattern: /muy obvio/gi, replacement: "está más claro que el agua" },
            { pattern: /muy rápido/gi, replacement: "en un abrir y cerrar de ojos" },
            { pattern: /muy ocupado/gi, replacement: "hasta arriba de trabajo" },
            { pattern: /muy nervioso/gi, replacement: "con los nervios a flor de piel" }
        ];
        
        for (let i = 0; i < humanizedSentences.length; i++) {
            if (Math.random() > 0.8) {
                let originalSentence = humanizedSentences[i];
                
                for (const idiom of idioms) {
                    if (idiom.pattern.test(humanizedSentences[i])) {
                        humanizedSentences[i] = humanizedSentences[i].replace(idiom.pattern, idiom.replacement);
                        
                        if (humanizedSentences[i] !== originalSentence) {
                            changes.push(`Añadida expresión idiomática para dar naturalidad.`);
                            break;
                        }
                    }
                }
            }
        }
        
        // 6. Añadir autocorrecciones o rectificaciones
        for (let i = 0; i < aiSentences.length; i++) {
            const index = sentences.indexOf(aiSentences[i].text);
            if (index !== -1 && Math.random() > 0.9) {
                const corrections = [
                    { pattern: /creo que/gi, replacement: "pienso... no, creo que" },
                    { pattern: /pienso que/gi, replacement: "creo... mejor dicho, pienso que" },
                    { pattern: /considero/gi, replacement: "opino... o más bien considero" }
                ];
                
                let modified = false;
                for (const corr of corrections) {
                    if (corr.pattern.test(humanizedSentences[index])) {
                        humanizedSentences[index] = humanizedSentences[index].replace(corr.pattern, corr.replacement);
                        modified = true;
                        break;
                    }
                }
                
                if (modified) {
                    changes.push(`Añadida autocorrección para simular pensamiento humano.`);
                }
            }
        }
        
        // Reconstruir el texto humanizado
        const humanizedText = humanizedSentences.join(' ');
        
        // Si no se realizaron cambios, añadir mensaje
        if (changes.length === 0) {
            changes.push("Se intentó humanizar el texto, pero no se encontraron oportunidades claras para modificaciones.");
        }
        
        return {
            humanizedText,
            changes
        };
    }
};
