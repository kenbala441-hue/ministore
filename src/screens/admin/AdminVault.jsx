import React, { useState } from 'react';
// import { vaultTrap } from './vault/vault.guard'; // Décommenter si tu utilises le trap

export default function AdminVault({ setView }) {
  const [confirmed, setConfirmed] = useState(false);

  // Exemple de trap pour bot (décommenter si implémenté)
  // const triggerAlert = () => alert('🚨 Action suspecte détectée !');

  return (
    <div style={s.bg}>
      <div style={s.box}>

        <h1 style={s.title}>ADMIN VAULT</h1>
        <p style={s.brand}>Comiccrafte • Coffre Sécurisé</p>

        {!confirmed ? (
          <>
            <div style={s.alertBox}>
              <p style={s.alertText}>
                Vous êtes sur le point d'entrer dans le <strong>coffre interne</strong>.
              </p>
              <p style={s.alertText}>
                Cette zone contient :
              </p>
              <ul style={s.list}>
                <li>• Clés système</li>
                <li>• Rôles administrateurs</li>
                <li>• Paramètres irréversibles</li>
              </ul>
              <p style={s.redText}>
                Toute action est enregistrée.
              </p>
            </div>

            <button
              style={s.confirmBtn}
              onClick={() => setConfirmed(true)}
            >
              CONFIRMER L'ACCÈS AU VAULT
            </button>

            <button
              style={s.exitBtn}
              onClick={() => setView('home')}
            >
              SORTIR IMMÉDIATEMENT
            </button>

            {/* Piège pour bot */}
            {/* <div {...vaultTrap(triggerAlert)} /> */}

          </>
        ) : (
          <>
            <div style={s.successBox}>
              <p style={s.successText}>🔓 Accès au Vault autorisé</p>
            </div>

            <button
              style={s.mainBtn}
              onClick={() => setView('admin_dashboard')}
            >
              ALLER AU DASHBOARD ADMIN
            </button>

            <button
              style={s.exitBtn}
              onClick={() => setView('home')}
            >
              FERMER LE VAULT
            </button>
          </>
        )}

        <p style={s.footer}>Vault sécurisé • Niveau MAX</p>

      </div>
    </div>
  );
}

const s = {
  bg: {
    minHeight: '100vh',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },

  box: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #6b0000',
    borderRadius: '18px',
    padding: '30px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 0 40px rgba(255,0,0,0.35)',
    textAlign: 'center',
  },

  title: {
    color: '#ff0000',
    letterSpacing: '3px',
    marginBottom: '5px',
  },

  brand: {
    fontSize: '11px',
    color: '#555',
    marginBottom: '25px',
  },

  alertBox: {
    border: '1px dashed #7a0000',
    padding: '15px',
    borderRadius: '10px',
    backgroundColor: '#050505',
    marginBottom: '25px',
  },

  alertText: {
    fontSize: '12px',
    color: '#ccc',
    marginBottom: '8px',
  },

  redText: {
    fontSize: '12px',
    color: '#ff3b3b',
    marginTop: '10px',
  },

  list: {
    fontSize: '11px',
    color: '#aaa',
    textAlign: 'left',
    paddingLeft: '15px',
    marginBottom: '10px',
  },

  confirmBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#8b0000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '10px',
  },

  mainBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '10px',
  },

  exitBtn: {
    width: '100%',
    padding: '12px',
    background: 'none',
    border: '1px solid #333',
    color: '#777',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  successBox: {
    padding: '15px',
    backgroundColor: '#060606',
    border: '1px solid #ff0000',
    borderRadius: '10px',
    marginBottom: '20px',
  },

  successText: {
    color: '#00ff9c',
    fontSize: '13px',
    fontWeight: 'bold',
  },

  footer: {
    fontSize: '10px',
    color: '#333',
    marginTop: '20px',
  },
};