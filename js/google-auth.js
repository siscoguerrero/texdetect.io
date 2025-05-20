// Módulo de autenticación con Google OAuth
document.addEventListener('DOMContentLoaded', function() {
    // Configuración de la API de Google
    const googleAuth = {
        // Configuración de la API de Google
        config: {
            clientId: '123456789012-example.apps.googleusercontent.com', // Placeholder - se debe reemplazar con un ID real en producción
            scope: 'email profile',
            cookieName: 'textdetect_google_session'
        },
        
        // Estado de autenticación
        authState: {
            isAuthenticated: false,
            user: null,
            token: null
        },
        
        // Inicializar el módulo de autenticación
        init: function() {
            // Cargar la API de Google
            this.loadGoogleAPI();
            
            // Verificar si hay una sesión activa
            this.checkSession();
            
            // Configurar los botones de autenticación
            this.setupAuthButtons();
        },
        
        // Cargar la API de Google
        loadGoogleAPI: function() {
            // Verificar si el script ya existe
            if (document.getElementById('google-api-script')) {
                this.initGoogleClient();
                return;
            }
            
            // Crear el script de la API de Google
            const script = document.createElement('script');
            script.id = 'google-api-script';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            
            // Configurar el callback cuando la API esté cargada
            script.onload = () => {
                this.initGoogleClient();
            };
        },
        
        // Inicializar el cliente de Google
        initGoogleClient: function() {
            // Verificar si la API de Google está disponible
            if (typeof google === 'undefined' || !google.accounts) {
                console.log('La API de Google no está disponible todavía, reintentando en 1 segundo...');
                setTimeout(() => this.initGoogleClient(), 1000);
                return;
            }
            
            try {
                // Inicializar el cliente de Google
                google.accounts.id.initialize({
                    client_id: this.config.clientId,
                    callback: this.handleCredentialResponse.bind(this),
                    auto_select: false,
                    cancel_on_tap_outside: true
                });
                
                // Renderizar el botón de inicio de sesión
                const signInButton = document.getElementById('google-signin-button');
                if (signInButton) {
                    google.accounts.id.renderButton(
                        signInButton,
                        { theme: 'outline', size: 'large', width: 250 }
                    );
                }
                
                // Mostrar el One Tap UI si no hay sesión activa
                if (!this.authState.isAuthenticated) {
                    google.accounts.id.prompt();
                }
            } catch (error) {
                console.error('Error al inicializar el cliente de Google:', error);
                // Mostrar mensaje de error en la UI
                const authContainer = document.getElementById('auth-container');
                if (authContainer) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'auth-error';
                    errorMsg.textContent = 'Error al cargar la autenticación de Google. Por favor, recarga la página.';
                    authContainer.appendChild(errorMsg);
                }
            }
        },
        
        // Manejar la respuesta de credenciales de Google
        handleCredentialResponse: function(response) {
            // Verificar si hay un token de ID
            if (!response || !response.credential) {
                console.error('No se recibió un token de ID');
                return;
            }
            
            // Decodificar el token JWT
            const token = response.credential;
            const payload = this.decodeJWT(token);
            
            if (!payload) {
                console.error('No se pudo decodificar el token JWT');
                return;
            }
            
            // Guardar el estado de autenticación
            this.authState.isAuthenticated = true;
            this.authState.user = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            };
            this.authState.token = token;
            
            // Guardar la sesión en una cookie
            this.saveSession();
            
            // Actualizar la UI
            this.updateUI();
            
            // Notificar a otros módulos sobre la autenticación
            this.notifyAuthChange();
        },
        
        // Decodificar un token JWT
        decodeJWT: function(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error('Error al decodificar el token JWT:', error);
                return null;
            }
        },
        
        // Guardar la sesión en una cookie
        saveSession: function() {
            const sessionData = {
                isAuthenticated: this.authState.isAuthenticated,
                user: this.authState.user,
                token: this.authState.token
            };
            
            // Guardar en una cookie que expire en 1 hora
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + 60 * 60 * 1000);
            
            document.cookie = `${this.config.cookieName}=${JSON.stringify(sessionData)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
        },
        
        // Verificar si hay una sesión activa
        checkSession: function() {
            const cookieValue = this.getCookie(this.config.cookieName);
            
            if (cookieValue) {
                try {
                    const sessionData = JSON.parse(cookieValue);
                    
                    // Restaurar el estado de autenticación
                    this.authState.isAuthenticated = sessionData.isAuthenticated;
                    this.authState.user = sessionData.user;
                    this.authState.token = sessionData.token;
                    
                    // Actualizar la UI
                    this.updateUI();
                } catch (error) {
                    console.error('Error al parsear la sesión:', error);
                    this.clearSession();
                }
            }
        },
        
        // Obtener el valor de una cookie
        getCookie: function(name) {
            const cookies = document.cookie.split(';');
            
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            
            return null;
        },
        
        // Cerrar sesión
        signOut: function() {
            // Limpiar el estado de autenticación
            this.authState.isAuthenticated = false;
            this.authState.user = null;
            this.authState.token = null;
            
            // Limpiar la cookie de sesión
            this.clearSession();
            
            // Actualizar la UI
            this.updateUI();
            
            // Notificar a otros módulos sobre el cierre de sesión
            this.notifyAuthChange();
            
            // Revocar el token si la API de Google está disponible
            if (typeof google !== 'undefined' && google.accounts) {
                google.accounts.id.disableAutoSelect();
            }
        },
        
        // Limpiar la cookie de sesión
        clearSession: function() {
            document.cookie = `${this.config.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
        },
        
        // Configurar los botones de autenticación
        setupAuthButtons: function() {
            // Crear el contenedor de autenticación si no existe
            if (!document.getElementById('auth-container')) {
                const authContainer = document.createElement('div');
                authContainer.id = 'auth-container';
                authContainer.className = 'auth-container';
                
                // Crear el botón de inicio de sesión
                const signInButton = document.createElement('div');
                signInButton.id = 'google-signin-button';
                signInButton.className = 'google-signin-button';
                
                // Crear el contenedor de perfil
                const profileContainer = document.createElement('div');
                profileContainer.id = 'profile-container';
                profileContainer.className = 'profile-container';
                profileContainer.style.display = 'none';
                
                // Crear la imagen de perfil
                const profileImage = document.createElement('img');
                profileImage.id = 'profile-image';
                profileImage.className = 'profile-image';
                profileImage.alt = 'Foto de perfil';
                
                // Crear el nombre de usuario
                const profileName = document.createElement('span');
                profileName.id = 'profile-name';
                profileName.className = 'profile-name';
                
                // Crear el botón de cierre de sesión
                const signOutButton = document.createElement('button');
                signOutButton.id = 'sign-out-button';
                signOutButton.className = 'btn btn-outline-danger btn-sm';
                signOutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar sesión';
                signOutButton.addEventListener('click', () => {
                    this.signOut();
                });
                
                // Añadir elementos al contenedor de perfil
                profileContainer.appendChild(profileImage);
                profileContainer.appendChild(profileName);
                profileContainer.appendChild(signOutButton);
                
                // Añadir elementos al contenedor de autenticación
                authContainer.appendChild(signInButton);
                authContainer.appendChild(profileContainer);
                
                // Añadir el contenedor de autenticación a la página
                const header = document.querySelector('header');
                if (header) {
                    header.appendChild(authContainer);
                } else {
                    document.body.insertBefore(authContainer, document.body.firstChild);
                }
            }
        },
        
        // Actualizar la UI según el estado de autenticación
        updateUI: function() {
            const signInButton = document.getElementById('google-signin-button');
            const profileContainer = document.getElementById('profile-container');
            
            if (this.authState.isAuthenticated && this.authState.user) {
                // Ocultar el botón de inicio de sesión
                if (signInButton) {
                    signInButton.style.display = 'none';
                }
                
                // Mostrar el contenedor de perfil
                if (profileContainer) {
                    profileContainer.style.display = 'flex';
                    
                    // Actualizar la imagen de perfil
                    const profileImage = document.getElementById('profile-image');
                    if (profileImage && this.authState.user.picture) {
                        profileImage.src = this.authState.user.picture;
                    }
                    
                    // Actualizar el nombre de usuario
                    const profileName = document.getElementById('profile-name');
                    if (profileName && this.authState.user.name) {
                        profileName.textContent = this.authState.user.name;
                    }
                }
                
                // Mostrar el botón de comparación con Studocu si está disponible
                const studocuButton = document.getElementById('studocu-compare-button');
                if (studocuButton) {
                    studocuButton.style.display = 'block';
                }
            } else {
                // Mostrar el botón de inicio de sesión
                if (signInButton) {
                    signInButton.style.display = 'block';
                }
                
                // Ocultar el contenedor de perfil
                if (profileContainer) {
                    profileContainer.style.display = 'none';
                }
                
                // Ocultar el botón de comparación con Studocu si está disponible
                const studocuButton = document.getElementById('studocu-compare-button');
                if (studocuButton) {
                    studocuButton.style.display = 'none';
                }
            }
        },
        
        // Notificar a otros módulos sobre cambios en la autenticación
        notifyAuthChange: function() {
            // Crear un evento personalizado
            const event = new CustomEvent('authStateChanged', {
                detail: {
                    isAuthenticated: this.authState.isAuthenticated,
                    user: this.authState.user
                }
            });
            
            // Disparar el evento
            document.dispatchEvent(event);
        },
        
        // Obtener el token de autenticación actual
        getToken: function() {
            return this.authState.token;
        },
        
        // Verificar si el usuario está autenticado
        isAuthenticated: function() {
            return this.authState.isAuthenticated;
        },
        
        // Obtener la información del usuario autenticado
        getUser: function() {
            return this.authState.user;
        }
    };

    // Inicializar el módulo
    googleAuth.init();

    // Exponer el módulo globalmente
    window.googleAuth = googleAuth;
});
