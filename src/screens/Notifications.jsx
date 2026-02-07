import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Notifications({ setView }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // On récupère toutes les notifications depuis Firestore
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = (notif) => {
    // Exemple : navigation vers un autre écran
    if (notif.targetView) setView(notif.targetView);
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>Notifications</h2>
      {notifications.length === 0 && <p style={s.empty}>Aucune notification pour le moment.</p>}

      <div style={s.list}>
        {notifications.map((notif) => (
          <div key={notif.id} style={s.card} onClick={() => handleClick(notif)}>
            <p style={s.message}>{notif.message}</p>
            {notif.timestamp && (
              <span style={s.date}>
                {new Date(notif.timestamp?.toDate()).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: { padding: 20, minHeight: '100vh', background: '#050505', color: 'white' },
  title: { fontSize: 20, marginBottom: 15 },
  empty: { color: '#888', fontStyle: 'italic' },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: {
    padding: 12,
    background: '#111',
    borderRadius: 8,
    cursor: 'pointer',
    border: '1px solid #222',
  },
  message: { fontSize: 14, marginBottom: 5 },
  date: { fontSize: 10, color: '#666' },
};