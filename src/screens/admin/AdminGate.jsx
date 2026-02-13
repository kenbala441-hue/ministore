import React from 'react';

export default function AdminGate({ setView }) {
  return (
    <div style={s.bg}>
      <div style={s.box}>
        
        {/* HEADER */}
        <h1 style={s.title}>⚠️ ZONE ADMINISTRATEUR</h1>
        <p style={s.brand}>Comiccrafte • Système Interne</p>

        {/* MESSAGE */}
        <div style={s.warningBox}>
          <p style={s.text}>
            Vous accédez à une <strong>zone restreinte</strong> du système Comiccrafte.
          </p>

          <p style={s.text}>
            Cette interface est destinée <strong>uniquement</strong> aux administrateurs
            autorisés. Toute action effectuée ici peut :
          </p>

          <ul style={s.list}>
            <li>• Modifier ou supprimer des données critiques</li>
            <li>• Affecter des comptes utilisateurs</li>
            <li>• Engager votre responsabilité légale</li>
          </ul>

          <p style={s.redText}>
            Si vous n’avez pas d’autorisation officielle, vous ne devriez pas être ici.
          </p>
        </div>

        {/* ACTIONS */}
        <button
          style={s.acceptBtn}
          onClick={() => setView('admin_vault')}
        >
          J’ACCEPTE LES RISQUES
        </button>

        <button
          style={s.exitBtn}
          onClick={() => setView('home')}
        >
          QUITTER CETTE ZONE
        </button>

        {/* FOOTER */}
        <p style={s.footer}>
          Toute activité est susceptible d’être auditée.
        </p>

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
    padding: '20px'
  },

  box: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #8b0000',
    borderRadius: '18px',
    padding: '30px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 0 30px rgba(139,0,0,0.4)',
    textAlign: 'center'
  },

  title: {
    color: '#b00000',
    letterSpacing: '2px',
    marginBottom: '5px'
  },

  brand: {
    fontSize: '11px',
    color: '#444',
    marginBottom: '25px'
  },

  warningBox: {
    border: '1px dashed #550000',
    padding: '15px',
    borderRadius: '10px',
    backgroundColor: '#050505',
    marginBottom: '25px'
  },

  text: {
    fontSize: '12px',
    color: '#ccc',
    marginBottom: '10px'
  },

  redText: {
    fontSize: '12px',
    color: '#ff4444',
    marginTop: '10px'
  },

  list: {
    fontSize: '11px',
    color: '#999',
    textAlign: 'left',
    paddingLeft: '15px',
    marginBottom: '10px'
  },

  acceptBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#8b0000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '10px'
  },

  exitBtn: {
    width: '100%',
    padding: '12px',
    background: 'none',
    border: '1px solid #333',
    color: '#777',
    borderRadius: '8px',
    cursor: 'pointer'
  },

  footer: {
    fontSize: '10px',
    color: '#333',
    marginTop: '20px'
  }
};