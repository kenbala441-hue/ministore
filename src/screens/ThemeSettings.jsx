import React, { useState } from 'react';

export default function ThemeSettings({ setView, userStatus }) {
  // Simuler le statut : 'standard', 'premium', ou 'vip'
  const isEligible = userStatus === 'premium' || userStatus === 'vip';

  const themes = [
    { id: 'classic', name: 'Classic Dark', color: '#a855f7', preview: '#000' },
    { id: 'matrix', name: 'Matrix Green', color: '#00f5d4', preview: '#051a05' },
    { id: 'gold', name: 'Gold VIP', color: '#fbbf24', preview: '#1a1405' },
    { id: 'cyber', name: 'Cyber Pink', color: '#ff0055', preview: '#0a000a' },
  ];

  return (
    <div style={{...s.container, backgroundColor: !isEligible ? '#111' : '#000'}}>
      <div style={s.header}>
        <button onClick={() => setView('home')} style={s.back}>←</button>
        <h3>Personnalisation</h3>
      </div>

      {!isEligible && (
        <div style={s.lockBanner}>
          <p>🔒 Cette foctionalité est réservée aux membres <b>Premium</b> et <b>VIP</b>.</p>
          <button onClick={() => setView('ink_market')} style={s.upgradeBtn}>Devenir Premium</button>
        </div>
      )}

      <div style={{...s.content, opacity: isEligible ? 1 : 0.3, pointerEvents: isEligible ? 'auto' : 'none'}}>
        <p style={s.label}>Choisissez votre ambiance :</p>
        <div style={s.grid}>
          {themes.map(t => (
            <div key={t.id} style={{...s.themeCard, borderColor: t.color, backgroundColor: t.preview}}>
              <div style={{color: t.color, fontWeight: 'bold'}}>{t.name}</div>
              <div style={s.dot}></div>
              <button style={{...s.selectBtn, backgroundColor: t.color}}>Appliquer</button>
            </div>
          ))}
        </div>
      </div>

      <div style={s.footer}>
        Protection contre l'usurpation active pour les membres certifiés 🛡️
      </div>
    </div>
  );
}

const s = {
  container: { minHeight: '100vh', color: '#fff', padding: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  back: { background: 'none', border: 'none', color: '#a855f7', fontSize: '24px' },
  lockBanner: { backgroundColor: '#ff005522', border: '1px solid #ff0055', padding: '20px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px' },
  upgradeBtn: { marginTop: '10px', padding: '8px 15px', backgroundColor: '#ff0055', border: 'none', color: '#fff', borderRadius: '5px', fontWeight: 'bold' },
  content: { display: 'flex', flexDirection: 'column', gap: '20px' },
  label: { fontSize: '14px', color: '#888' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  themeCard: { padding: '20px', borderRadius: '15px', border: '2px solid', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' },
  selectBtn: { border: 'none', color: '#000', padding: '5px', borderRadius: '5px', fontWeight: 'bold', fontSize: '10px' },
  footer: { marginTop: '50px', textAlign: 'center', fontSize: '10px', color: '#444' }
};
