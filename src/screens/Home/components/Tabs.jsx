import React, { useState } from 'react';

const NEON_COLOR = '#00fff2';
const INACTIVE_COLOR = '#888';

export default function Tabs({ setView }) {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'ACCUEIL' },
    { id: 'news', label: 'NOUVEAUTÉS' },
    { id: 'myseries', label: 'MES SÉRIES' },
  ];

  const handleClick = (id) => {
    setActiveTab(id);
    setView(id);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '25px',
        marginBottom: '25px',
        borderBottom: '1px solid #1a1a1a',
        paddingBottom: '5px',
      }}
    >
      {tabs.map((tab) => (
        <span
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          style={{
            color: activeTab === tab.id ? NEON_COLOR : INACTIVE_COLOR,
            borderBottom: activeTab === tab.id ? `2px solid ${NEON_COLOR}` : '2px solid transparent',
            paddingBottom: '8px',
            fontSize: activeTab === tab.id ? '14px' : '12px',
            fontWeight: activeTab === tab.id ? 'bold' : 'normal',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            textShadow: activeTab === tab.id ? `0 0 5px ${NEON_COLOR}, 0 0 10px ${NEON_COLOR}` : 'none',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) e.currentTarget.style.color = NEON_COLOR;
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) e.currentTarget.style.color = INACTIVE_COLOR;
          }}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
}