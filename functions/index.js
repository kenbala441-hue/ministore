const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall } = require("firebase-functions/v2/https");
const { HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ maxInstances: 10 });

/**
 * Ajouter une transaction + mettre à jour le wallet
 */
exports.addTransaction = onCall(async (request) => {
  const { auth, data } = request;

  // 🔒 Vérification utilisateur connecté
  if (!auth) {
    throw new HttpsError("unauthenticated", "Utilisateur non connecté");
  }

  const uid = auth.uid;
  const { type, amountInk, amountEuro, provider } = data;

  // 🔎 Validation des données
  if (!type || !amountInk || !amountEuro || !provider) {
    throw new HttpsError("invalid-argument", "Données manquantes");
  }

  if (amountInk <= 0 || amountEuro <= 0) {
    throw new HttpsError("invalid-argument", "Montants invalides");
  }

  try {
    // 📝 Création transaction
    const transactionRef = await db.collection("transactions").add({
      uid,
      type,
      amountInk,
      amountEuro,
      provider,
      status: "completed",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 💰 Mise à jour wallet utilisateur
    const userRef = db.collection("users").doc(uid);

    await userRef.update({
      inkBalance: admin.firestore.FieldValue.increment(amountInk),
    });

    return {
      success: true,
      transactionId: transactionRef.id,
    };
  } catch (error) {
    console.error(error);
    throw new HttpsError("internal", "Erreur serveur");
  }
});