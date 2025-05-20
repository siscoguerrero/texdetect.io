// Integración del humanizador con la interfaz principal
document.addEventListener('DOMContentLoaded', function() {
    // Añadir botón de humanización en la sección de resultados
    const addHumanizationButton = function() {
        // Verificar si ya existe la sección de resultados
        const resultadosSection = document.getElementById('resultados-section');
        if (!resultadosSection) return;
        
        // Verificar si ya existe el botón
        if (document.getElementById('humanize-button')) return;
        
        // Crear el botón de humanización
        const humanizeButton = document.createElement('button');
        humanizeButton.id = 'humanize-button';
        humanizeButton.className = 'btn btn-success mt-4';
        humanizeButton.innerHTML = '<i class="fas fa-magic"></i> Humanizar texto';
        
        // Añadir el botón después de la sección de métricas
        const metricasSection = document.querySelector('.metricas-detalladas');
        if (metricasSection) {
            metricasSection.parentNode.insertBefore(humanizeButton, metricasSection.nextSibling);
            
            // Añadir evento de click
            humanizeButton.addEventListener('click', function() {
                humanizeText();
            });
        }
    };
    
    // Función para humanizar el texto
    const humanizeText = function() {
        // Obtener el texto original
        const textArea = document.getElementById('text-input');
        const originalText = textArea.value;
        
        // Obtener la probabilidad de IA del resultado
        const probabilidadIA = parseFloat(document.querySelector('.probabilidad-ia').textContent) || 0;
        
        // Mostrar animación de carga
        showLoadingAnimation('Humanizando texto...');
        
        // Simular un retraso para el proceso de humanización
        setTimeout(function() {
            // Humanizar el texto usando el módulo de humanización
            const resultado = humanizer.humanizeText(originalText, probabilidadIA);
            
            // Mostrar el resultado en un modal
            showHumanizationResult(resultado);
            
            // Ocultar animación de carga
            hideLoadingAnimation();
        }, 3000);
    };
    
    // Función para mostrar el resultado de la humanización
    const showHumanizationResult = function(resultado) {
        // Crear el modal si no existe
        if (!document.getElementById('humanize-modal')) {
            const modalHTML = `
                <div id="humanize-modal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2>Texto Humanizado</h2>
                        <div class="tabs">
                            <button class="tab-button active" data-tab="humanized">Texto Humanizado</button>
                            <button class="tab-button" data-tab="changes">Cambios Realizados</button>
                            <button class="tab-button" data-tab="compare">Comparación</button>
                        </div>
                        <div id="humanized-tab" class="tab-content active">
                            <p class="mb-2">Este texto ha sido modificado para parecer más humano:</p>
                            <div class="humanized-text-container">
                                <textarea id="humanized-text" rows="10" readonly></textarea>
                            </div>
                            <button id="copy-humanized" class="btn btn-primary mt-2">
                                <i class="fas fa-copy"></i> Copiar texto humanizado
                            </button>
                            <button id="use-humanized" class="btn btn-success mt-2 ml-2">
                                <i class="fas fa-check"></i> Usar este texto
                            </button>
                        </div>
                        <div id="changes-tab" class="tab-content">
                            <p class="mb-2">Cambios realizados para humanizar el texto:</p>
                            <ul id="changes-list"></ul>
                        </div>
                        <div id="compare-tab" class="tab-content">
                            <div class="comparison-container">
                                <div class="comparison-column">
                                    <h3>Texto Original</h3>
                                    <div class="comparison-text" id="original-text-compare"></div>
                                </div>
                                <div class="comparison-column">
                                    <h3>Texto Humanizado</h3>
                                    <div class="comparison-text" id="humanized-text-compare"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer.firstElementChild);
            
            // Configurar eventos del modal
            const modal = document.getElementById('humanize-modal');
            const closeBtn = modal.querySelector('.close');
            
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
            
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            };
            
            // Configurar eventos de las pestañas
            const tabButtons = modal.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Desactivar todas las pestañas
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    const tabContents = modal.querySelectorAll('.tab-content');
                    tabContents.forEach(tab => tab.classList.remove('active'));
                    
                    // Activar la pestaña seleccionada
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab') + '-tab';
                    document.getElementById(tabId).classList.add('active');
                });
            });
            
            // Configurar evento del botón de copiar
            document.getElementById('copy-humanized').addEventListener('click', function() {
                const humanizedText = document.getElementById('humanized-text');
                humanizedText.select();
                document.execCommand('copy');
                
                // Mostrar mensaje de copiado
                this.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> Copiar texto humanizado';
                }, 2000);
            });
            
            // Configurar evento del botón de usar texto
            document.getElementById('use-humanized').addEventListener('click', function() {
                const humanizedText = document.getElementById('humanized-text').value;
                document.getElementById('text-input').value = humanizedText;
                modal.style.display = 'none';
                
                // Limpiar resultados anteriores
                const resultadosSection = document.getElementById('resultados-section');
                if (resultadosSection) {
                    resultadosSection.remove();
                }
                
                // Mostrar mensaje de éxito
                showNotification('Texto humanizado aplicado. Puedes analizarlo de nuevo para verificar los cambios.', 'success');
            });
        }
        
        // Actualizar el contenido del modal
        const modal = document.getElementById('humanize-modal');
        document.getElementById('humanized-text').value = resultado.textoHumanizado;
        
        // Actualizar la lista de cambios
        const changesList = document.getElementById('changes-list');
        changesList.innerHTML = '';
        resultado.cambiosRealizados.forEach(cambio => {
            const li = document.createElement('li');
            li.textContent = cambio;
            changesList.appendChild(li);
        });
        
        // Actualizar la comparación
        document.getElementById('original-text-compare').textContent = resultado.textoOriginal;
        document.getElementById('humanized-text-compare').textContent = resultado.textoHumanizado;
        
        // Mostrar el modal
        modal.style.display = 'block';
    };
    
    // Observar cambios en el DOM para añadir el botón cuando se muestren los resultados
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.id === 'resultados-section') {
                        addHumanizationButton();
                        break;
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});
