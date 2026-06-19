// ================================================================
// DISTRO ANGOLA — Firebase Messaging Service Worker
// Ficheiro: firebase-messaging-sw.js
// Deve estar na raiz do site: distroangola.github.io/firebase-messaging-sw.js
// ================================================================

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBmHqjBfyNhRojcPecK-wkPC9u4RyNdv_4",
    authDomain: "distro-angola-app.firebaseapp.com",
    projectId: "distro-angola-app",
    messagingSenderId: "613587689368",
    appId: "1:613587689368:web:82b2e3e34d49b5d9a1d5ed"
});

const messaging = firebase.messaging();

// Notificação recebida com o app em segundo plano
messaging.onBackgroundMessage(function(payload) {
    console.log('[SW] Notificação em segundo plano:', payload);

    const title = payload.notification?.title || 'DISTRO ANGOLA';
    const body  = payload.notification?.body  || 'Tens uma nova notificação';
    const data  = payload.data || {};

    const options = {
        body: body,
        icon: '/app/icon-192.png',
        badge: '/app/icon-192.png',
        tag: data.type || 'distro-angola',
        data: data,
        vibrate: [200, 100, 200],
        actions: [
            { action: 'open', title: 'Abrir' },
            { action: 'close', title: 'Fechar' }
        ]
    };

    return self.registration.showNotification(title, options);
});

// Clique na notificação — abre a plataforma
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'close') return;

    const url = 'https://distroangola.github.io/app/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Se já tem a plataforma aberta, foca nela
            for (const client of clientList) {
                if (client.url.includes('distroangola.github.io') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Senão abre uma nova janela
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
