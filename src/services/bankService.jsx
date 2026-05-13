import { db } from "../firebase/index.js";

import {
  doc,
  collection,
  addDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

/* ============================================================
   💎 COMICCRAFTE BANK SYSTEM V3
   Secure • Stable • Firebase Ready • Offline Friendly
============================================================ */

/* ============================================================
   ⚡ CONFIG
============================================================ */

export const BANK_CONFIG = {
  PROFILE_UPDATE_PRICE: 150,
  MIN_LOAN: 100,
  MAX_LOAN: 10000,
  LOAN_INTEREST: 0.1,
  DAILY_REWARD: 50,
};

/* ============================================================
   🧠 SAFE NUMBER
============================================================ */

const safeNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

/* ============================================================
   💰 CALCUL DU SOLDE CONVERTIBLE
============================================================ */

export const getConvertibleBalance = (userData) => {
  if (!userData) return 0;

  const total = safeNumber(userData.inks);
  const locked = safeNumber(userData.nonConvertibleInks);

  return Math.max(0, total - locked);
};

/* ============================================================
   🔥 HISTORIQUE TRANSACTIONS
============================================================ */

export const createTransaction = async ({
  userId,
  type = "UNKNOWN",
  amount = 0,
  description = "",
  status = "SUCCESS",
}) => {
  try {
    if (!userId) return;

    await addDoc(collection(db, "transactions"), {
      userId,
      type,
      amount: safeNumber(amount),
      description,
      status,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Transaction Error:", error);
  }
};

/* ============================================================
   🏦 DEMANDE DE PRÊT
============================================================ */

export const requestLoanFromBank = async (
  user,
  userData,
  amount = 500
) => {
  try {
    if (!user?.uid) {
      throw new Error("Utilisateur invalide");
    }

    const safeAmount = safeNumber(amount);

    if (safeAmount < BANK_CONFIG.MIN_LOAN) {
      throw new Error("Montant trop faible");
    }

    if (safeAmount > BANK_CONFIG.MAX_LOAN) {
      throw new Error("Montant trop élevé");
    }

    if (safeNumber(userData?.debt) > 0) {
      throw new Error("Dette déjà existante");
    }

    await addDoc(collection(db, "loanRequests"), {
      userId: user.uid,
      userName: userData?.name || "Membre",
      amount: safeAmount,
      interest: safeAmount * BANK_CONFIG.LOAN_INTEREST,
      totalDebt:
        safeAmount +
        safeAmount * BANK_CONFIG.LOAN_INTEREST,
      status: "PENDING",
      createdAt: serverTimestamp(),
    });

    await createTransaction({
      userId: user.uid,
      type: "LOAN_REQUEST",
      amount: safeAmount,
      description: "Demande de prêt bancaire",
    });

    return {
      success: true,
      message: "Demande envoyée",
    };
  } catch (e) {
    console.error("❌ Loan Error:", e);

    return {
      success: false,
      message: e.message || "Erreur",
    };
  }
};

/* ============================================================
   💳 REMBOURSEMENT DETTE
============================================================ */

export const repayBankDebt = async (
  userId,
  amount = 0
) => {
  try {
    if (!userId) {
      throw new Error("Utilisateur manquant");
    }

    const safeAmount = safeNumber(amount);

    if (safeAmount <= 0) {
      throw new Error("Montant invalide");
    }

    const userRef = doc(db, "users", userId);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(userRef);

      if (!snap.exists()) {
        throw new Error("Compte introuvable");
      }

      const data = snap.data();

      const balance = safeNumber(data.inks);
      const debt = safeNumber(data.debt);

      if (debt <= 0) {
        throw new Error("Aucune dette");
      }

      if (balance < safeAmount) {
        throw new Error("Solde insuffisant");
      }

      const finalPayment = Math.min(debt, safeAmount);

      transaction.update(userRef, {
        inks: increment(-finalPayment),
        debt: increment(-finalPayment),
        updatedAt: serverTimestamp(),
      });
    });

    await createTransaction({
      userId,
      type: "DEBT_REPAYMENT",
      amount: safeAmount,
      description: "Remboursement bancaire",
    });

    return {
      success: true,
      message: "Dette remboursée",
    };
  } catch (error) {
    console.error("❌ Debt Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/* ============================================================
   🎁 DAILY REWARD
============================================================ */

export const claimDailyReward = async (
  userId
) => {
  try {
    if (!userId) {
      throw new Error("Utilisateur manquant");
    }

    const userRef = doc(db, "users", userId);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(userRef);

      if (!snap.exists()) {
        throw new Error("Utilisateur introuvable");
      }

      const data = snap.data();

      const lastClaim =
        data?.lastDailyReward?.toMillis?.() || 0;

      const now = Date.now();

      const hours =
        (now - lastClaim) / (1000 * 60 * 60);

      if (hours < 24) {
        throw new Error(
          "Récompense déjà récupérée"
        );
      }

      transaction.update(userRef, {
        inks: increment(
          BANK_CONFIG.DAILY_REWARD
        ),
        lastDailyReward: serverTimestamp(),
      });
    });

    await createTransaction({
      userId,
      type: "DAILY_REWARD",
      amount: BANK_CONFIG.DAILY_REWARD,
      description: "Récompense quotidienne",
    });

    return {
      success: true,
      amount: BANK_CONFIG.DAILY_REWARD,
    };
  } catch (error) {
    console.error("❌ Daily Reward Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/* ============================================================
   👑 PAY FOR PROFILE UPDATE
============================================================ */

export const payForProfileUpdate = async ({
  userId,
  updateData = {},
}) => {
  try {
    if (!userId) {
      throw new Error("Utilisateur invalide");
    }

    const userRef = doc(db, "users", userId);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(userRef);

      if (!snap.exists()) {
        throw new Error("Compte introuvable");
      }

      const data = snap.data();

      const balance = safeNumber(data.inks);

      if (
        balance <
        BANK_CONFIG.PROFILE_UPDATE_PRICE
      ) {
        throw new Error(
          "Solde insuffisant"
        );
      }

      transaction.update(userRef, {
        ...updateData,
        inks: increment(
          -BANK_CONFIG.PROFILE_UPDATE_PRICE
        ),
        updatedAt: serverTimestamp(),
      });
    });

    await createTransaction({
      userId,
      type: "PROFILE_UPDATE",
      amount:
        BANK_CONFIG.PROFILE_UPDATE_PRICE,
      description:
        "Modification du profil utilisateur",
    });

    return {
      success: true,
      message: "Profil mis à jour",
    };
  } catch (error) {
    console.error(
      "❌ Profile Update Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

/* ============================================================
   💸 TRANSFERT ENTRE UTILISATEURS
============================================================ */

export const transferInk = async ({
  senderId,
  receiverId,
  amount,
}) => {
  try {
    if (!senderId || !receiverId) {
      throw new Error("Utilisateur manquant");
    }

    if (senderId === receiverId) {
      throw new Error(
        "Transfert impossible"
      );
    }

    const safeAmount = safeNumber(amount);

    if (safeAmount <= 0) {
      throw new Error("Montant invalide");
    }

    const senderRef = doc(
      db,
      "users",
      senderId
    );

    const receiverRef = doc(
      db,
      "users",
      receiverId
    );

    await runTransaction(db, async (transaction) => {
      const senderSnap =
        await transaction.get(senderRef);

      const receiverSnap =
        await transaction.get(receiverRef);

      if (
        !senderSnap.exists() ||
        !receiverSnap.exists()
      ) {
        throw new Error(
          "Utilisateur introuvable"
        );
      }

      const senderBalance = safeNumber(
        senderSnap.data().inks
      );

      if (senderBalance < safeAmount) {
        throw new Error(
          "Solde insuffisant"
        );
      }

      transaction.update(senderRef, {
        inks: increment(-safeAmount),
      });

      transaction.update(receiverRef, {
        inks: increment(safeAmount),
      });
    });

    await createTransaction({
      userId: senderId,
      type: "TRANSFER_SENT",
      amount: safeAmount,
      description:
        "Transfert envoyé",
    });

    await createTransaction({
      userId: receiverId,
      type: "TRANSFER_RECEIVED",
      amount: safeAmount,
      description:
        "Transfert reçu",
    });

    return {
      success: true,
      message: "Transfert effectué",
    };
  } catch (error) {
    console.error(
      "❌ Transfer Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

/* ============================================================
   🤖 BOT ÉCONOMIQUE AUTOMATIQUE
============================================================ */

export const bankingBotSystem = async ({
  userId,
  type,
  amount = 0,
}) => {
  try {
    switch (type) {
      case "BONUS_LOGIN":
        await createTransaction({
          userId,
          type,
          amount,
          description:
            "Bonus de connexion",
        });
        break;

      case "PURCHASE":
        await createTransaction({
          userId,
          type,
          amount,
          description:
            "Achat dans l'application",
        });
        break;

      default:
        console.log(
          "🤖 Action bancaire:",
          type
        );
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Bot Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};