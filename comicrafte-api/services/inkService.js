import { users, transactions } from "../database/db.js";

export const addInk = (uid, amount) => {

  const user = users[uid];

  if (!user) throw new Error("Utilisateur introuvable");

  user.inkBalance += amount;

  transactions.push({
    id: "t" + Date.now(),
    uid,
    amount,
    date: new Date()
  });

  return user.inkBalance;
};

export const spendInk = (uid, amount) => {

  const user = users[uid];

  if (!user) throw new Error("Utilisateur introuvable");

  if (user.inkBalance < amount) {
    throw new Error("Solde insuffisant");
  }

  user.inkBalance -= amount;

  transactions.push({
    id: "t" + Date.now(),
    uid,
    amount: -amount,
    date: new Date()
  });

  return user.inkBalance;
};