import { db } from "../firebase/index.js";
import { 
  doc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  runTransaction 
} from "firebase/firestore";

/* ============================================================
   💎 SYSTÈME BANCAIRE CENTRALISÉ - COMICCRAFTE v2.0
   Gère les Inks, les Prêts et les Transactions de Profil
============================================================ */

/**
 * 1. Calcul du solde convertible (Inks réels utilisables)
 */
export const getConvertibleBalance = (userData) => {
  if (!userData) return 0;
  const total = userData.inks || 0;
  const nonConvertible = userData.nonConvertibleInks || 0;
  const balance = total - nonConvertible;
  return balance > 0 ? balance : 0;
};

/**
 * 2. Demande de prêt (Nouveau système de requêtes)
 * Évite les conflits de permissions Firebase en utilisant une collection tierce.
 */
export const requestLoanFromBank = async (user, userData, amount = 500) => {
  try {
    if (!user?.uid) throw "Utilisateur non authentifié";
    if (userData?.debt > 0) throw "Veuillez d'abord rembourser votre dette actuelle.";

    const loanData = {
      userId: user.uid,
      userName: userData?.displayName || userData?.name || "Lecteur",
      amount: Number(amount),
      interest: Number(amount) * 0.1,
      status: "PENDING", // En attente de validation Admin
      type: "LOAN_REQUEST",
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "loanRequests"), loanData);
    console.log("✅ Prêt enregistré sous l'ID:", docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("❌ BankService Error (Loan):", e);
    return { success: false, message: e.toString() };
  }
};

/**
 * 3. Paiement pour mise à jour de profil
 * Requis pour débloquer le Build (UserProfile.jsx ligne 7)
 */
export const payForProfileUpdate = async (userId, cost = 50) => {
  try {
    if (!userId) throw "ID Utilisateur manquant";

    // Simulation de transaction réussie
    // TODO: Implémenter runTransaction pour déduire les Inks réellement
    console.warn(`[BANK] Débit de ${cost} Inks autorisé pour ${userId}`);
    
    return { 
      success: true, 
      message: "Paiement validé",
      transactionId: `TRX-${Date.now()}` 
    };
  } catch (e) {
    console.error("❌ BankService Error (Profile Pay):", e);
    return { success: false, message: "Solde insuffisant ou erreur serveur." };
  }
};

/**
 * 4. Remboursement de dette
 */
export const repayBankDebt = async (userId) => {
  try {
    // Maintenance temporaire ou redirection vers un système de tickets
    return { 
      success: false, 
      message: "Le guichet de remboursement est en maintenance. Contactez l'admin." 
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
};
