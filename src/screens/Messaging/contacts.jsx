import React from 'react';
import { Users } from 'lucide-react';

export default function Contacts() {
  return (
    <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
      <Users size={48} style={{ color: '#00f5d4', marginBottom: '10px' }} />
      <h2>Mes Contacts ComicCrafte</h2>
      <p style={{ opacity: 0.6 }}>Ta liste de contacts s'affichera ici.</p>
    </div>
  );
}
