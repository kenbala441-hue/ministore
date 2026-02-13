import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Terms({ setView, onAccept }) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Vérification Firebase prête
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseReady(true);
      if (!user) setView('login');
    });
    return () => unsubscribe();
  }, [setView]);

  const handleAccept = async () => {
    const user = auth.currentUser;
    if (!user) {
      setView('login');
      return;
    }

    setLoading(true);

    try {
      // 🔹 Mettre à jour Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          acceptedTerms: true,
          acceptedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log('Signature ComicCraft enregistrée');

      // 🔹 Notifier App.jsx
      if (onAccept) onAccept();

      // 🔹 Redirection immédiate
      setView('home');
    } catch (error) {
      console.error('Erreur Firestore :', error);
      alert("Impossible d'enregistrer votre accord.");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { title: "1. Propriété et Droits d'Auteur", content: "Tout contenu partagé appartient à la plateforme. Toute reproduction hors ComicCraft est interdite." },
    { title: "2. Anti-Piratage et Jailbreak", content: "Toute tentative de Jailbreak ou utilisation non autorisée est interdite. Bannissement immédiat." },
    { title: "3. Revenus et Cookies", content: "Partage de revenus selon votre grade (10%-45%). Cookies pour sécuriser vos transactions." },
    { title: "4. Clause de Non-Responsabilité", content: "App en développement. ComicCraft décline toute responsabilité en cas de cyber-attaque." },
    { title: "5. Résolution Amiable et Support", content: "Tout litige doit être réglé à l’amiable avant action en justice." },
    { title: "6. Politique de Bannissement", content: "En cas d’infraction, le compte est suspendu. Réclamation possible sous 7 jours." },
  ];

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.header}>
          <button onClick={async () => { await signOut(auth); setView('login'); }} style={s.back}>←</button>
          <h2 style={s.title}>PROTOCOLE COMICCRAFTE</h2>
        </div>

        <div style={s.scrollArea}>
          <p style={s.intro}>Accord contraignant entre l'utilisateur et ComicCraft Studios.</p>

          {sections.map((sec, i) => (
            <div key={i} style={s.section}>
              <h4 style={s.secTitle}>{sec.title}</h4>
              <p style={s.secContent}>{sec.content}</p>
            </div>
          ))}

          {/* 🔹 Bouton "Voir plus" redirige vers LegalDetails */}
          <button
            style={s.moreLink}
            onClick={() => setView('legal_details')}
          >
            Voir les 20+ autres règles détaillées (Confidentialité & Cookies)...
          </button>

        </div>

        <div style={s.footer}>
          <label style={s.checkboxContainer}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              style={s.checkbox}
            />
            <span style={s.checkText}>J'accepte les conditions et les risques technologiques</span>
          </label>

          <button
            disabled={!checked || !firebaseReady || loading}
            onClick={handleAccept}
            style={{ ...s.btn, opacity: checked && firebaseReady && !loading ? 1 : 0.3 }}
          >
            {loading ? 'EN COURS...' : 'SIGNER ET ENTRER'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================
// Styles BACKGROUND original
const s = {
  container: { minHeight: '100vh', background: 'radial-gradient(circle at center, #0a1128, #000)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { maxWidth: '450px', width: '100%', backgroundColor: 'rgba(10, 10, 20, 0.85)', backdropFilter: 'blur(15px)', borderRadius: '20px', border: '1px solid #a855f766', padding: '25px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  back: { background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' },
  title: { fontSize: '16px', letterSpacing: '3px', background: 'linear-gradient(90deg, #a855f7, #00f5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' },
  scrollArea: { overflowY: 'auto', paddingRight: '10px', marginBottom: '20px' },
  intro: { fontSize: '11px', color: '#555', marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase' },
  section: { marginBottom: '20px', borderLeft: '2px solid #a855f7', paddingLeft: '15px', background: 'rgba(255,255,255,0.02)', padding: '10px' },
  secTitle: { fontSize: '12px', color: '#a855f7', marginBottom: '5px', fontWeight: 'bold' },
  secContent: { fontSize: '11px', color: '#ccc', lineHeight: '1.5' },
  moreLink: { 
    textAlign: 'center', 
    color: '#00f5d4', 
    fontSize: '11px', 
    cursor: 'pointer', 
    margin: '15px 0', 
    textDecoration: 'underline',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit'
  },
  footer: { borderTop: '1px solid #222', paddingTop: '20px' },
  checkboxContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' },
  checkbox: { accentColor: '#a855f7', width: '18px', height: '18px' },
  checkText: { fontSize: '12px', color: '#eee' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(90deg, #a855f7, #6366f1)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' },
};