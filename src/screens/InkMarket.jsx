import React, { useState } from 'react';

export default function Store({ setView }) {
  const [balance, setBalance] = useState(150); // Solde de Craft-Ink

  const packs = [
    { qty: "50 ₵", price: "0.99$", bonus: "Standard" },
    { qty: "500 ₵", price: "8.99$", bonus: "+50 Bonus" },
    { qty: "1200 ₵", price: "19.99$", bonus: "Pack VIP" },
  ];

  const subscriptions = [
    { name: "Standard", price: "Gratuit", perks: "Pubs incluses, accès basique" },
    { name: "Premium", price: "4.99$/mois", perks: "Zéro Pub, Badge Argent, +25% Revenus", color: "#a855f7" },
    { name: "VIP Elite", price: "14.99$/mois", perks: "Badge Or, Cloud 50GB, +45% Revenus, Couleurs custom", color: "#00f5d4" },
  ];

  return (
    <div style={s.container}>
      {/* HEADER SOLDE */}
      <div style={s.walletCard}>
        <p style={{margin:0, fontSize:'12px', opacity:0.8}}>Votre Solde Craft-Ink</p>
        <h1 style={{margin:0, color:'#00f5d4'}}>₵ {balance}</h1>
      </div>

      {/* SECTION GAIN GRATUIT */}
      <h3 style={s.sectionTitle}>Gagner des Ink gratuitement</h3>
      <div style={s.freeRow}>
        <div style={s.adBox} onClick={() => alert("Chargement Pub...")}>📺 Regarder une Pub<br/><span style={{color:'#00f5d4'}}>+2 ₵</span></div>
        <div style={s.adBox}>📋 Sondage rapide<br/><span style={{color:'#00f5d4'}}>+10 ₵</span></div>
      </div>

      {/* PACKS D'ACHAT */}
      <h3 style={s.sectionTitle}>Acheter des Craft-Ink</h3>
      <div style={s.grid}>
        {packs.map(p => (
          <div key={p.qty} style={s.packCard}>
            <div style={s.inkQty}>{p.qty}</div>
            <div style={s.inkBonus}>{p.bonus}</div>
            <button style={s.buyBtn}>{p.price}</button>
          </div>
        ))}
      </div>

      {/* ABONNEMENTS & CERTIFICATIONS */}
      <h3 style={s.sectionTitle}>Certifications & Grades</h3>
      <div style={s.subList}>
        {subscriptions.map(sub => (
          <div key={sub.name} style={{...s.subCard, borderColor: sub.color || '#222'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <h4 style={{margin:0, color: sub.color}}>{sub.name}</h4>
              <span style={s.priceTag}>{sub.price}</span>
            </div>
            <p style={s.perksText}>{sub.perks}</p>
            <button style={{...s.subBtn, backgroundColor: sub.color || '#333'}}>S'abonner</button>
          </div>
        ))}
      </div>

      {/* PROTECTION & SÉCURITÉ */}
      <div style={s.securityBox}>
        <p>🔒 Sécurité activée : 2FA (Auth à deux facteurs)</p>
        <p style={{fontSize:'10px', opacity:0.5}}>Protection contre l'usurpation et Cloud inclus dans Premium/VIP</p>
      </div>
    </div>
  );
}

const s = {
  container: { backgroundColor: '#000', color: '#fff', padding: '20px', paddingBottom: '100px' },
  walletCard: { background: 'linear-gradient(45deg, #1a1a1a, #0a0a0a)', padding: '20px', borderRadius: '15px', border: '1px solid #a855f7', textAlign: 'center', marginBottom: '25px' },
  sectionTitle: { fontSize: '15px', color: '#a855f7', marginBottom: '15px', marginTop: '20px' },
  freeRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  adBox: { flex: 1, backgroundColor: '#111', padding: '15px', borderRadius: '10px', textAlign: 'center', fontSize: '11px', border: '1px solid #222' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  packCard: { backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1a1a1a' },
  inkQty: { fontSize: '16px', fontWeight: 'bold' },
  inkBonus: { fontSize: '8px', color: '#555', margin: '5px 0' },
  buyBtn: { backgroundColor: '#fff', color: '#000', border: 'none', padding: '5px', borderRadius: '5px', width: '100%', fontWeight: 'bold', fontSize: '10px' },
  subList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  subCard: { backgroundColor: '#0a0a0a', padding: '20px', borderRadius: '15px', borderLeft: '5px solid' },
  priceTag: { fontSize: '12px', fontWeight: 'bold' },
  perksText: { fontSize: '11px', color: '#888', margin: '10px 0' },
  subBtn: { width: '100%', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold' },
  securityBox: { marginTop: '40px', padding: '15px', border: '1px dashed #333', borderRadius: '10px', textAlign: 'center', fontSize: '11px' }
};
