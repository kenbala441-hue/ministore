import React, { useState } from 'react';

export default function Security2FA({ setView }) {
  const [code, setCode] = useState("");

  return (
    <div style={s.container}>
      <div style={s.shieldIcon}>🛡️</div>
      <h2 style={s.title}>Authentification à 2 facteurs</h2>
      <p style={s.subtitle}>Un code unique a été généré. Entrez le code pour valider l'accès à votre coffre-fort <b>Craft-Ink</b>.</p>
      
      <div style={s.inputContainer}>
        <input 
          type="text" 
          placeholder="000 000" 
          maxLength="6"
          style={s.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <button style={s.verifyBtn} onClick={() => {
        if(code.length === 6) {
          alert("Identité confirmée ! Accès autorisé.");
          setView('home');
        } else {
          alert("Code invalide.");
        }
      }}>
        Vérifier maintenant
      </button>

      <p style={s.footerText}>
        Cette sécurité est obligatoire pour les comptes <b>Business Max</b> et <b>Premium</b> contre l'usurpation d'identité.
      </p>
    </div>
  );
}

const s = {
  container: { backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center' },
  shieldIcon: { fontSize: '60px', marginBottom: '20px', filter: 'drop-shadow(0 0 10px #00f5d4)' },
  title: { fontSize: '22px', fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: '14px', color: '#666', margin: '15px 0' },
  inputContainer: { margin: '30px 0' },
  input: { backgroundColor: '#111', border: '2px solid #333', borderRadius: '12px', padding: '15px', color: '#00f5d4', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', width: '200px' },
  verifyBtn: { backgroundColor: '#00f5d4', color: '#000', border: 'none', padding: '15px 40px', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  footerText: { marginTop: '40px', fontSize: '10px', color: '#333' }
};
