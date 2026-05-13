import React from 'react';
import { motion } from 'framer-motion';

export default function AdminGate({ setView }) {
  return (
    <div style={s.bg}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={s.box}
      >
        {/* INDICATEUR DE SÉCURITÉ */}
        <div style={s.topBadge}>RESTRICTED AREA • LEVEL 4</div>
        
        {/* HEADER */}
        <h1 style={s.title}>PROTOCOLE D'ACCÈS</h1>
        <p style={s.brand}>COMICCRAFTE SYSTEM ADMINISTRATION</p>

        {/* WARNING PANEL */}
        <div style={s.warningBox}>
          <div style={s.scanLine} />
          <h2 style={s.alertTitle}>⚠️ AVERTISSEMENT DE SÉCURITÉ</h2>
          
          <p style={s.text}>
            Vous tentez d'initialiser une connexion avec le <strong>Noyau Central</strong>. 
            Ce terminal est sous surveillance continue.
          </p>

          <div style={s.infoList}>
            <div style={s.listItem}>
              <span style={s.bullet}>[!]</span>
              <span>Intégrité des données : Toute modification est irréversible.</span>
            </div>
            <div style={s.listItem}>
              <span style={s.bullet}>[!]</span>
              <span>Traçabilité : Votre identifiant et IP sont enregistrés.</span>
            </div>
            <div style={s.listItem}>
              <span style={s.bullet}>[!]</span>
              <span>Responsabilité : L'usage non autorisé est passible de bannissement définitif.</span>
            </div>
          </div>

          <p style={s.criticalText}>
            L'accès sans accréditation "CONSEIL" est une violation directe des termes du Studio.
          </p>
        </div>

        {/* ACTIONS */}
        <div style={s.actionArea}>
          <button
            style={s.acceptBtn}
            onClick={() => setView('admin_login')}
          >
            INITIALISER L'AUTHENTIFICATION
          </button>

          <button
            style={s.exitBtn}
            onClick={() => setView('home')}
          >
            AVORTER LA CONNEXION
          </button>
        </div>

        {/* FOOTER */}
        <div style={s.footer}>
          <div style={s.pulse} />
          <span>CRYPTAGE AES-256 ACTIF</span>
        </div>

      </motion.div>
    </div>
  );
}

const s = {
  bg: {
    minHeight: '100vh',
    backgroundColor: '#050505',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'monospace'
  },
  box: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #ff0000',
    borderRadius: '4px', // Plus carré pour un look "terminal"
    padding: '40px 30px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 0 50px rgba(255,0,0,0.15)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  topBadge: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ff0000',
    color: '#000',
    fontSize: '10px',
    padding: '2px 15px',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },
  title: {
    color: '#fff',
    letterSpacing: '4px',
    fontSize: '22px',
    margin: '10px 0 5px 0'
  },
  brand: {
    fontSize: '10px',
    color: '#666',
    letterSpacing: '1px',
    marginBottom: '30px'
  },
  warningBox: {
    border: '1px solid #333',
    padding: '20px',
    backgroundColor: '#000',
    marginBottom: '30px',
    position: 'relative',
    textAlign: 'left'
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: 'rgba(255,0,0,0.5)',
    boxShadow: '0 0 10px #ff0000',
    animation: 'scan 3s infinite linear'
  },
  alertTitle: {
    color: '#ff0000',
    fontSize: '14px',
    marginBottom: '15px',
    textAlign: 'center'
  },
  text: {
    fontSize: '12px',
    color: '#aaa',
    lineHeight: '1.6',
    marginBottom: '15px'
  },
  infoList: {
    marginBottom: '15px'
  },
  listItem: {
    display: 'flex',
    gap: '10px',
    fontSize: '11px',
    color: '#888',
    marginBottom: '8px'
  },
  bullet: { color: '#ff0000', fontWeight: 'bold' },
  criticalText: {
    fontSize: '11px',
    color: '#ff4444',
    borderTop: '1px solid #222',
    paddingTop: '10px',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  actionArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  acceptBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
    letterSpacing: '1px',
    transition: '0.3s'
  },
  exitBtn: {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: '1px solid #333',
    color: '#666',
    cursor: 'pointer',
    fontSize: '11px'
  },
  footer: {
    marginTop: '30px',
    fontSize: '9px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  pulse: {
    width: '6px',
    height: '6px',
    backgroundColor: '#ff0000',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite'
  }
};
