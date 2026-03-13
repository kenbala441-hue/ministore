export function formatDate(timestamp) {
  try {
    if (!timestamp) return "";

    let date;

    // 🔒 Gestion sécurisée des différents formats possibles
    if (typeof timestamp === "object" && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (!isNaN(timestamp)) {
      date = new Date(timestamp);
    } else {
      return "";
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);

    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `${diffMinutes} min`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} h`;

    return date.toLocaleDateString();
  } catch (error) {
    console.error("Erreur formatDate:", error);
    return "";
  }
}