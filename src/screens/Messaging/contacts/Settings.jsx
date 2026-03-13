import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div style={st.page}>
      <SettingsIcon size={50} color="#00f5d4" />
      <h2 style={{color: '#fff'}}>Paramètres Messaging</h2>
      <p style={{color: '#888'}}>Gérez vos notifications et votre profil pro.</p>
    </div>
  );
}

const st = {
  page: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }
};
