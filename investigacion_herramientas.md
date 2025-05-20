# Investigación de Herramientas de Detección de Texto IA

## GPTZero
- **Descripción**: Herramienta especializada en la detección de texto generado por IA como ChatGPT, GPT-4, Gemini y otros modelos.
- **Precisión declarada**: 99% según su sitio web
- **Métricas principales**:
  - Perplejidad (perplexity): Mide cuán "sorprendido" está el modelo por el texto, evaluando la predictibilidad.
  - Burstiness (ráfaga): Analiza la variabilidad en la estructura de las frases.
- **Características**:
  - Análisis a nivel de oración, identificando qué partes del texto tienen mayor probabilidad de ser generadas por IA
  - Interfaz visual con escala de colores para mostrar la probabilidad IA vs Humano
  - Capacidad para analizar hasta 50,000 caracteres
  - Soporte para múltiples idiomas
- **Enfoque**: Utiliza un modelo de 7 componentes que procesan el texto para determinar si fue escrito por IA, con énfasis en minimizar falsos positivos.

## Turnitin
- **Descripción**: Plataforma conocida por la detección de plagio que ha incorporado detección de texto generado por IA.
- **Características**:
  - Especializado para escritura académica y estudiantil
  - Integrado en su sistema de verificación de similitud
  - Detección de herramientas de parafraseo (text spinners)
  - Compatible con múltiples modelos de IA como ChatGPT, GPT-3, GPT-3.5
- **Enfoque**: Aprovecha sus 25 años de experiencia en comprensión y protección de escritura académica para distinguir contenido generado por IA.

## Copyleaks
- **Descripción**: Plataforma de detección de plagio y contenido generado por IA con alta precisión.
- **Precisión declarada**: Más del 99% según su sitio web
- **Métricas utilizadas**:
  - Matriz de confusión: Verdaderos positivos (TP), Falsos positivos (FP), Verdaderos negativos (TN), Falsos negativos (FN)
  - Precisión: Proporción de resultados verdaderos (TP + TN) entre el número total de textos
  - TNR (True Negative Rate): Precisión del modelo en textos humanos, calculada como TN/(TN+FP)
  - TPR (True Positive Rate/Recall): Precisión del modelo en textos generados por IA, calculada como TP/(TP+FN)
  - F-beta: Media armónica ponderada entre precisión y recuperación, favoreciendo la precisión para reducir falsos positivos
- **Características**:
  - Soporte para más de 30 idiomas
  - Detección de múltiples modelos de IA (ChatGPT, Gemini, Claude)
  - Metodología de prueba transparente y documentada

## Smodi
- **Descripción**: Herramienta de detección de texto IA con menos información técnica disponible públicamente.
- **Características**: Utiliza algoritmos para detectar patrones en textos generados por IA.

## Sampling
- **Descripción**: Posiblemente relacionado con Sapling AI, un detector de contenido IA.
- **Precisión declarada**: 97% según fuentes encontradas
- **Características**: Compatible con múltiples modelos como ChatGPT, Claude, Gemini y Llama.

## Métricas comunes entre detectores
1. **Precisión general**: Porcentaje de textos correctamente clasificados
2. **Tasa de falsos positivos**: Textos humanos incorrectamente identificados como IA
3. **Tasa de falsos negativos**: Textos IA incorrectamente identificados como humanos
4. **Análisis a nivel de oración**: Capacidad para identificar qué partes específicas del texto son más probablemente generadas por IA

## Algoritmos y técnicas comunes
1. **Análisis de patrones lingüísticos**: Evaluación de estructuras gramaticales y sintácticas
2. **Medición de variabilidad léxica**: Análisis de la diversidad de vocabulario
3. **Evaluación de predictibilidad**: Análisis de cuán predecible es la siguiente palabra o frase
4. **Aprendizaje automático**: Modelos entrenados con grandes conjuntos de datos de texto humano y generado por IA
5. **Análisis de coherencia**: Evaluación de la consistencia temática y lógica del texto
