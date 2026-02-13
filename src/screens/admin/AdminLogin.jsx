import React, { useState } from 'react';

export default function AdminLogin({ setView }) {
  const [inputCode, setInputCode] = useState('');

  const MASTER_KEY = "COMIC-CRAFT-SECRET-KEY-2024-ADMIN-ACCESS-30-CHARS";

  const handleVerify = () => {
    if (inputCode.trim() === MASTER_KEY) {
      setView('admin_gate');
    } else {
      alert("⚠️ CODE INCORRECT - ACCÈS REFUSÉ");
    }
  };

  return (
    <div style={s.bg}>
      <div style={s.box}>
        <h1 style={s.title}>ADMIN AUTH</h1>

        <p style={s.sub}>
          Clé administrateur requise<br/>
          <span style={{ color: '#ff4444', fontSize: '10px' }}>
            Accès non autorisé strictement interdit
          </span>
        </p>

        <input 
          type="password"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          style={s.input}
          placeholder="ENTRER LA CLÉ ADMINISTRATEUR"
        />

        <button onClick={handleVerify} style={s.btn}>
          DÉVERROUILLER LE SYSTÈME
        </button>

        <button onClick={() => setView('home')} style={s.btnBack}>
          RETOUR
        </button>
      </div>
    </div>
  );
}

const s = {
  bg: {
    height: '100vh',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  box: {
    backgroundColor: '#0a0a0a',
    padding: '30px',
    borderRadius: '15px',
    border: '1px solid #8b0000',
    textAlign: 'center',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 0 25px rgba(139,0,0,0.4)'
  },
  title: {
    color: '#b00000',
    letterSpacing: '4px',
    fontSize: '24px'
  },
  sub: {
    color: '#666',
    fontSize: '12px',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#111',
    border: '1px solid #333',
    color: '#ff0000',
    borderRadius: '6px',
    textAlign: 'center',
    marginBottom: '20px',
    fontFamily: 'monospace'
  },
  btn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnBack: {
    marginTop: '10px',
    background: 'none',
    border: 'none',
    color: '#555',
    cursor: 'pointer'
  }
};