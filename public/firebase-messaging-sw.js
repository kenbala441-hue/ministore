/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAalUx5YEWq1Bs9HW_VFiqqqZpWenW69CA",
  authDomain: "comiccrafte-studio.firebaseapp.com",
  projectId: "comiccrafte-studio",
  storageBucket: "comiccrafte-studio.firebasestorage.app",
  messagingSenderId: "322099627324",
  appId: "1:322099627324:web:f3298dac6afcd3e0faca39"
});

const messaging = firebase.messaging();

// 🔔 Message reçu en arrière-plan
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification?.title || "Bienvenue sur Comiccrafte ✨";
  const notificationOptions = {
    body:
      payload.notification?.body ||
      "Merci de rejoindre Comiccrafte ! Découvrez des histoires exclusives et respectez nos conditions d'utilisation.",
    icon: "/logo192.png",
    badge: "/logo192.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 🔔 Notification automatique de bienvenue (si aucune notif envoyée depuis le serveur)
self.addEventListener("activate", function () {
  self.registration.showNotification("Bienvenue sur Comiccrafte ✨", {
    body:
      "Votre compte est prêt ! Consultez les termes d'utilisation dans votre profil et commencez à explorer.",
    icon: "/logo192.png",
    badge: "/logo192.png"
  });
});