import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
  collection,
  query,
} from 'firebase/firestore';

export default function InkMarket({ setView }) {
  const [balance, setBalance] = useState(0);
  const [packs, setPacks] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  // 🔥 Récupération temps réel du solde utilisateur
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        setBalance(snap.data().ink || 0);
      }
    });

    return () => unsub();
  }, []);

  // 🔥 Packs Ink dynamiques (Firestore)
  useEffect(() => {
    const q = query(collection(db, 'ink_packs'));
    const unsub = onSnapshot(q, (snap) => {
      setPacks(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });
    return () => unsub();
  }, []);

  // 🔥 Abonnements dynamiques (Firestore)
  useEffect(() => {
    const q = query(collection(db, 'subscriptions'));
    const unsub = onSnapshot(q, (snap) => {
      setSubscriptions(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });
    return () => unsub();
  }, []);

  const buyInk = async (amount) => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      ink: increment(amount),
    });
  };

  const subscribe = async (plan) => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      plan,
    });
  };

  return (
    <div style={s.container}>
      {/* WALLET */}
      <div style={s.walletCard}>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
          💎 Votre solde Craft-Ink
        </p>
        <h1 style={{ margin: 0, color: '#00f5d4' }}>₵ {balance}</h1>
      </div>

      {/* FREE INK */}
      <h3 style={s.sectionTitle}>🎁 Gagner des Ink gratuitement</h3>
      <div style={s.freeRow}>
        <div
          style={s.adBox}
          onClick={() => buyInk(2)}
        >
          📺 Regarder une Pub
          <br />
          <span style={{ color: '#00f5d4' }}>+2 ₵</span>
        </div>
        <div
          style={s.adBox}
          onClick={() => buyInk(10)}
        >
          📝 Sondage rapide
          <br />
          <span style={{ color: '#00f5d4' }}>+10 ₵</span>
        </div>
      </div>

      {/* PACKS */}
      <h3 style={s.sectionTitle}>🛒 Acheter des Craft-Ink</h3>
      <div style={s.grid}>
        {packs.map((p) => (
          <div key={p.id} style={s.packCard}>
            <div style={s.inkQty}>₵ {p.amount}</div>
            <div style={s.inkBonus}>{p.bonus}</div>
            <button
              style={s.buyBtn}
              onClick={() => buyInk(p.amount)}
            >
              {p.price}
            </button>
          </div>
        ))}
      </div>

      {/* SUBSCRIPTIONS */}
      <h3 style={s.sectionTitle}>👑 Certifications & Grades</h3>
      <div style={s.subList}>
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            style={{ ...s.subCard, borderColor: sub.color || '#222' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0, color: sub.color }}>
                {sub.name}
              </h4>
              <span style={s.priceTag}>{sub.price}</span>
            </div>
            <p style={s.perksText}>{sub.perks}</p>
            <button
              style={{ ...s.subBtn, backgroundColor: sub.color || '#333' }}
              onClick={() => subscribe(sub.plan)}
            >
              🚀 Activer
            </button>
          </div>
        ))}
      </div>

      {/* SECURITY */}
      <div style={s.securityBox}>
        <p>🔐 Sécurité activée : 2FA + Cloud</p>
        <p style={{ fontSize: '10px', opacity: 0.5 }}>
          Protection type Telegram • Chiffrement • Badges vérifiés
        </p>
      </div>
    </div>
  );
}

const s = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
    paddingBottom: '100px',
  },
  walletCard: {
    background: 'linear-gradient(45deg, #1a1a1a, #0a0a0a)',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid #a855f7',
    textAlign: 'center',
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '15px',
    color: '#a855f7',
    marginBottom: '15px',
    marginTop: '20px',
  },
  freeRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  adBox: {
    flex: 1,
    backgroundColor: '#111',
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '11px',
    border: '1px solid #222',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
  },
  packCard: {
    backgroundColor: '#0a0a0a',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #1a1a1a',
  },
  inkQty: { fontSize: '16px', fontWeight: 'bold' },
  inkBonus: { fontSize: '8px', color: '#555', margin: '5px 0' },
  buyBtn: {
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    padding: '6px',
    borderRadius: '6px',
    width: '100%',
    fontWeight: 'bold',
    fontSize: '10px',
    cursor: 'pointer',
  },
  subList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  subCard: {
    backgroundColor: '#0a0a0a',
    padding: '20px',
    borderRadius: '15px',
    borderLeft: '5px solid',
  },
  priceTag: { fontSize: '12px', fontWeight: 'bold' },
  perksText: { fontSize: '11px', color: '#888', margin: '10px 0' },
  subBtn: {
    width: '100%',
    border: 'none',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  securityBox: {
    marginTop: '40px',
    padding: '15px',
    border: '1px dashed #333',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '11px',
  },
};