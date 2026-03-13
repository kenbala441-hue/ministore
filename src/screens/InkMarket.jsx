import React, { useEffect, useState, lazy, Suspense } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setBalance(snap.data().ink || 0);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'ink_packs'));
    const unsub = onSnapshot(q, (snap) => {
      setPacks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'subscriptions'));
    const unsub = onSnapshot(q, (snap) => {
      setSubscriptions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const buyInk = async (amount) => {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { ink: increment(amount) });
  };

  const subscribe = async (plan) => {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { plan });
  };

  if (loading) {
    return (
      <div style={{ background: '#000', color: '#fff', padding: '40px', textAlign: 'center' }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.walletCard}>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
          💎 Votre solde Craft-Ink
        </p>
        <h1 style={{ margin: 0, color: '#00f5d4' }}>₵ {balance}</h1>
      </div>

      <h3 style={s.sectionTitle}>🎁 Gagner des Ink gratuitement</h3>
      <div style={s.freeRow}>
        <div style={s.adBox} onClick={() => buyInk(2)}>
          📺 Regarder une Pub
          <br />
          <span style={{ color: '#00f5d4' }}>+2 ₵</span>
        </div>
        <div style={s.adBox} onClick={() => buyInk(10)}>
          📝 Sondage rapide
          <br />
          <span style={{ color: '#00f5d4' }}>+10 ₵</span>
        </div>
      </div>

      <h3 style={s.sectionTitle}>🛒 Acheter des Craft-Ink</h3>
      <Suspense fallback={<div style={{ color: '#fff' }}>Chargement packs...</div>}>
        <PackGrid packs={packs} buyInk={buyInk} />
      </Suspense>

      <h3 style={s.sectionTitle}>👑 Certifications & Grades</h3>
      <Suspense fallback={<div style={{ color: '#fff' }}>Chargement abonnements...</div>}>
        <SubscriptionList
          subscriptions={subscriptions}
          subscribe={subscribe}
        />
      </Suspense>

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
  securityBox: {
    marginTop: '40px',
    padding: '15px',
    border: '1px dashed #333',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '11px',
  },
};