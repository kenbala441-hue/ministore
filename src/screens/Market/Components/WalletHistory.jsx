import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function WalletHistory({ user }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(data);
      },
      (error) => {
        console.error("Erreur transactions:", error);
      }
    );

    return () => unsub();
  }, [user]);

  return (
    <div>
      <h2>Historique</h2>
      {transactions.map(t => (
        <div key={t.id}>
          {t.type} - {t.amountInk} ₵
        </div>
      ))}
    </div>
  );
}