import React, { useState } from 'react';

export default function AdminLogin({ setView }) {
  const [inputCode, setInputCode] = useState('');
  
  // Voici ton verrou (tu pourras changer ce code plus tard)
  const MASTER_KEY = "COMIC-CRAFT-SECRET-KEY-2024-ADMIN-ACCESS-30-CHARS";

  const handleVerify = () => {
    if (inputCode === MASTER_KEY) {
      setView('admin_dashboard'); // Si c'est bon, on va au tableau de bord
    } else {
      alert("⚠️ CODE INCORRECT - ACCÈS REFUSÉ");
    }
  };

  return (
    <div style={s.bg}>
      <div style={s.box}>
        <h1 style={s.title}>ADMIN AUTH</h1>
        <p style={s.sub}>Entrez la clé de sécurité (30 caractères)</p>
        <input 
          type="password" 
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          style={s.input}
          placeholder="••••••••••••••••••••••••••••••"
        />
        <button onClick={handleVerify} style={s.btn}>DÉVERROUILLER LE SYSTÈME</button>
        <button onClick={() => setView('home')} style={s.btnBack}>RETOUR</button>
      </div>
    </div>
  );
}

const s = {
  bg: { height: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  box: { backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '15px', border: '1px solid #ff0000', textAlign: 'center', width: '100%' },
  title: { color: '#ff0000', letterSpacing: '5px', fontSize: '24px' },
  sub: { color: '#444', fontSize: '12px', marginBottom: '20px' },
  input: { width: '100%', padding: '15px', backgroundColor: '#111', border: '1px solid #333', color: '#ff0000', borderRadius: '5px', textAlign: 'center', marginBottom: '20px', fontFamily: 'monospace' },
  btn: { width: '100%', padding: '15px', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  btnBack: { marginTop: '10px', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }
};

