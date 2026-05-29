/* ============================================================
   SYSTÈME IMMUNITAIRE GLOBAL (ANTI-ABORT / ANTI-CRASH IMAGES)
============================================================ */

if (typeof window !== "undefined") {
  // 1. 🛡️ INTERCEPTION DES PROMISSES REJETÉES EN SILENCE (AbortError)
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;
    const msg = error?.message?.toLowerCase() || "";
    const name = error?.name || "";

    if (
      name === "AbortError" || 
      msg.includes("aborted") || 
      msg.includes("signal is aborted") ||
      msg.includes("cancel")
    ) {
      // Le système immunitaire intercepte l'erreur et l'étouffe avant le crash
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  });

  // 2. 💉 PATCH GLOBAL DE FETCH POUR IGNORER LES COMPOSANTS EN PANIQUE
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    try {
      return await originalFetch.apply(this, args);
    } catch (error) {
      // Si un composant annule brutalement son fetch d'image ou de données
      if (error.name === "AbortError" || error.message?.includes("aborted")) {
        // On renvoie une promesse vide infinie pour endormir le composant sans erreur
        return new Promise(() => {});
      }
      throw error; // On laisse passer les vraies grosses erreurs (ex: 404, 500)
    }
  };

  // 3. 🖼️ AUTO-REPAIR DES BALISES IMAGES QUI CRASHENT AU CHARGEMENT
  // Dès qu'une image bug en tâche de fond (lignes violettes / chargement infini), on la répare
  document.addEventListener("error", (event) => {
    if (event.target && event.target.tagName === "IMG") {
      const img = event.target;
      
      // Évite les boucles infinies de rechargement si l'image de secours bug aussi
      if (!img.dataset.repaired) {
        img.dataset.repaired = "true";
        
        // Option A : Remplacer par un pixel transparent transparent pour nettoyer l'écran
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        
        // Option B : Si tu veux forcer l'image à retenter le coup après la déconnexion
        // setTimeout(() => { img.src = img.src + '?retry=' + Date.now(); }, 1000);
      }
    }
  }, true); // Le "true" est capital ici pour intercepter l'erreur au vol (phase de capture)
}
