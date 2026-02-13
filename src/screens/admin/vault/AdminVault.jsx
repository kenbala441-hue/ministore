import React, { useState } from 'react';
import { vaultTrap } from './vault.trap';
import { logVaultEvent } from './vault.logs';
import { vaultGuard } from './vault.guard';

export default function AdminVault({ setView, session }) {
  const [confirmed, setConfirmed] = useState(false);

  // Sécurité : guard
  if (!vaultGuard(session)) {
    logVaultEvent({ type: 'ACCESS_DENIED', time: Date.now() });
    return <p style={{color:'#ff0000', textAlign:'center', marginTop:'50px'}}>⚠️ Accès non autorisé</p>;
  }

  const triggerAlert = (event) => {
    logVaultEvent(event);
    alert("⚠️ Piège détecté ! Action enregistrée.");
  };

  return (
    <div style={s.bg}>
      <div style={s.box}>

        {/* Honeypot invisible */}
        <div {...vaultTrap(triggerAlert)} />

        <h1 style={s.title}>ADMIN VAULT</h1>
        <p style={s.brand}>Comiccrafte • Coffre Sécurisé</p>

        {!confirmed ? (
          <>
            <div style={s.alertBox}>
              <p style={s.alertText}>
                Vous êtes sur le point d’entrer dans le <strong>coffre interne</strong>.
              </p>
              <p style={s.alertText}>Cette zone contient :</p>
              <ul style={s.list}>
                <li>• Clés système</li>
                <li>• Rôles administrateurs</li>
                <li>• Paramètres irréversibles</li>
              </ul>
              <p style={s.redText}>Toute action est enregistrée.</p>
            </div>

            <button style={s.confirmBtn} onClick={() => setConfirmed(true)}>
              CONFIRMER L’ACCÈS AU VAULT
            </button>
            <button style={s.exitBtn} onClick={() => setView('home')}>
              SORTIR IMMÉDIATEMENT
            </button>
          </>
        ) : (
          <>
            <div style={s.successBox}>
              <p style={s.successText}>🔓 Accès au Vault autorisé</p>
            </div>

            <button style={s.mainBtn} onClick={() => setView('admin_dashboard')}>
              ALLER AU DASHBOARD ADMIN
            </button>
            <button style={s.exitBtn} onClick={() => setView('home')}>
              FERMER LE VAULT
            </button>
          </>
        )}

        <p style={s.footer}>Vault sécurisé • Niveau MAX</p>
      </div>
    </div>
  );
}

const s = { ... /* Styles identiques à ton code précédent */ };