import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../../../firebase/config"; // Assure-toi que le chemin est bon
import { doc, getDoc } from "firebase/firestore";

export default function AdminGuard({ children }) {
  const [step, setStep] = useState("warning"); // warning -> login -> authorized
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ÉTAPE 1: Vérification si déjà connecté et Admin dans Firestore
  const checkAdminStatus = async (user) => {
    setLoading(true);
    try {
      const docRef = doc(db, "admins", user.uid); // Collection sécurisée
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role === "super_admin") {
        setStep("authorized");
      } else {
        setError("ACCÈS REFUSÉ : Votre compte n'a pas les privilèges requis.");
        auth.signOut();
      }
    } catch (err) {
      setError("Erreur de validation système.");
    }
    setLoading(false);
  };

  const handleAcceptWarning = () => setStep("login");

  if (step === "authorized") return <>{children}</>;

  return (
    <div style={s.overlay}>
      <AnimatePresence mode="wait">
        {/* PHASE 1 : L'AVERTISSEMENT SÉVÈRE */}
        {step === "warning" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={s.card}
          >
            <div style={s.iconWarn}>⚠️</div>
            <h2 style={s.titleWarn}>ACCÈS RESTREINT</h2>
            <p style={s.textWarn}>
              Vous tentez d'accéder à la zone d'administration de <b>ComicCrafte Studio</b>. 
              Cet espace est réservé au personnel autorisé uniquement.
            </p>
            <div style={s.alertBox}>
              TOUTE TENTATIVE D'INTRUSION OU DE FRAUDE ENTRAÎNERA :
              <ul>
                <li>Suspension immédiate du compte</li>
                <li>Bannissement définitif de l'appareil</li>
                <li>Poursuites selon les conditions d'utilisation</li>
              </ul>
            </div>
            <div style={s.btnGroup}>
              <button style={s.btnExit} onClick={() => window.location.href = "/"}>QUITTER</button>
              <button style={s.btnCont} onClick={handleAcceptWarning}>J'AI COMPRIS</button>
            </div>
          </motion.div>
        )}

        {/* PHASE 2 : LE LOGIN SÉCURISÉ (Firebase) */}
        {step === "login" && (
          <motion.div style={s.card}>
            <h3 style={{color: '#00f7ff', marginBottom: '20px'}}>AUTHENTIFICATION ADMIN</h3>
            {error && <div style={s.error}>{error}</div>}
            
            <p style={s.label}>Veuillez vous connecter avec votre compte Gmail certifié.</p>
            
            <button 
              disabled={loading}
              onClick={() => {/* Ici ta fonction Google Login */}}
              style={s.btnLogin}
            >
              {loading ? "VÉRIFICATION..." : "CONNEXION SÉCURISÉE"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 10000, padding: '20px'
  },
  card: {
    backgroundColor: '#151515', padding: '30px', borderRadius: '15px',
    maxWidth: '400px', width: '100%', textAlign: 'center',
    border: '1px solid #333', boxShadow: '0 0 30px rgba(0,0,0,0.5)'
  },
  iconWarn: { fontSize: '50px', marginBottom: '10px' },
  titleWarn: { color: '#ff003c', fontSize: '20px', fontWeight: '900' },
  textWarn: { color: '#bbb', fontSize: '14px', margin: '15px 0', lineHeight: '1.5' },
  alertBox: {
    backgroundColor: 'rgba(255, 0, 60, 0.1)', border: '1px solid #ff003c',
    borderRadius: '8px', padding: '15px', color: '#ff4d4d',
    fontSize: '11px', textAlign: 'left', margin: '20px 0'
  },
  btnGroup: { display: 'flex', gap: '10px' },
  btnExit: {
    flex: 1, padding: '12px', background: '#333', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 'bold'
  },
  btnCont: {
    flex: 1, padding: '12px', background: '#ff003c', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
  },
  btnLogin: {
    width: '100%', padding: '15px', background: '#00f7ff', color: '#000',
    border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer'
  },
  error: { color: '#ff003c', marginBottom: '15px', fontSize: '12px', fontWeight: 'bold' }
};
