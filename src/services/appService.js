import { db } from "../firebase/index.js";
import { 
  doc, 
  onSnapshot, 
  collection, 
  getDocs, 
  updateDoc, 
  increment,
  serverTimestamp 
} from "firebase/firestore";

/**
 * 1. ÉCOUTE EN TEMPS RÉEL LE SOLDE D'UN UTILISATEUR
 * Permet d'éviter les désynchronisations dans le profil
 */
export const listenToUserBalance = (uid, callback) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  
  // onSnapshot renvoie le solde en direct dès qu'une modification a lieu côté Firebase
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback(data.inks || 0);
    }
  });
};

/**
 * 2. RÉCUPÈRE LA LISTE DE TOUS LES COMPTES INSCRITS
 * Pour surveiller l'activité, les emails et les soldes globaux
 */
export const getAllRegisteredUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    
    const usersList = [];
    querySnapshot.forEach((doc) => {
      usersList.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: usersList };
  } catch (error) {
    console.error("Erreur récupération liste utilisateurs:", error);
    return { success: false, message: error.message };
  }
};

/**
 * 3. VALIDE ET TRAITE UNE TRANSACTION BANCAIRE (ACHAT/DÉBIT INKS)
 * Le composant envoie la requête, le service valide côté base de données
 */
export const processInkTransaction = async (uid, amount, type = "DEBIT") => {
  try {
    const userRef = doc(db, "users", uid);
    
    // Si c'est un débit, on passe le montant en négatif
    const valueChange = type === "DEBIT" ? -Math.abs(amount) : Math.abs(amount);
    
    await updateDoc(userRef, {
      inks: increment(valueChange),
      lastActivity: serverTimestamp()
    });
    
    return { success: true, message: "Transaction validée avec succès" };
  } catch (error) {
    console.error("Échec de la transaction bancaire:", error);
    return { success: false, message: "Erreur lors de la validation du solde" };
  }
};
