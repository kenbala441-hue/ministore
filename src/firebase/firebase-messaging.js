import { getToken, onMessage, isSupported } from "firebase/messaging";
import { messaging } from "./index";

// 🔔 Demande token FCM et active notifications si possible
export const requestForToken = async () => {
  try {
    // Vérifie si FCM est supporté
    const supported = await isSupported();
    if (!supported) {
      console.warn("🚫 FCM non supporté sur ce navigateur");
      return null;
    }

    // Vérifie si Notifications API existe
    if (!("Notification" in window)) {
      console.warn("🚫 Notifications API non disponible");
      return null;
    }

    // Permission bloquée
    if (Notification.permission === "denied") {
      console.warn("🚫 Notifications bloquées par l'utilisateur");
      return null;
    }

    // Demande permission si non accordée
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("🚫 Permission notifications refusée");
        return null;
      }
    }

    // Récupère token
    const token = await getToken(messaging, {
      vapidKey: "BBLWboipv830Pcf5jkc4FOmXbMHymJvIObhmpcEoqlWDNqGbQhOi-nM_-1C-MiC8S5M1Lj4XR2_Xum8GnD3fcQw",
    });

    if (token) {
      console.log("✅ FCM ACTIVÉ :", token);

      // ⚡ Crée une notification “punchy” de test
      if (Notification.permission === "granted") {
        new Notification("FCM activé ! 🔔", {
          body: "Vous recevrez maintenant les notifications push.",
          icon: "/icon192.png", // change selon ton icône
        });
      }

      return token;
    } else {
      console.warn("⚠️ Token non généré");
      return null;
    }
  } catch (error) {
    console.warn("⚠️ FCM ignoré :", error.message);
    return null;
  }
};

// Écoute notifications quand app ouverte
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Notification reçue :", payload);
      resolve(payload);
    });
  });