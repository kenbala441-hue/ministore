import React from 'react';

export default function Header({ toggleBurger, setView, notifCount }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', position: 'sticky', top: 0, backgroundColor: '#050505', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} onClick={toggleBurger}>
        <div style={{ fontSize: '24px', color: '#00fff2', cursor: 'pointer' }}>☰</div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#00fff2', margin: 0 }}>Comic<span style={{color:'#00fff2'}}>Craft</span></h1>
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', fontSize: '20px', cursor: 'pointer' }} onClick={() => setView('notifications')}>
          🔔
          {notifCount > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ff0000', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '50%', fontWeight: 'bold' }}>{notifCount}</span>}
        </div>
        <div style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => setView('search')}>🔍</div>
      </div>
    </header>
  );
}