// src/screens/components/SettingsMenu.jsx
import { AudioControls } from './AudioControls';

export const SettingsMenu = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  // Fonction helper pour mettre à jour une seule valeur proprement
  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div className="settings-overlay">
      <div className="settings-mini-card">
        <div className="header-mini">
          <span className="title">PARAMÈTRES</span>
          <button onClick={onClose} className="close-btn">fermer</button>
        </div>

        {/* --- MODE DE LECTURE --- */}
        <section className="mini-section">
          <small>lecture</small>
          <div className="grid-2">
            <button className={settings.mode === 'classique' ? 'active' : ''} 
                    onClick={() => update('mode', 'classique')}>Classique</button>
            <button className={settings.mode === 'webtoon' ? 'active' : ''} 
                    onClick={() => update('mode', 'webtoon')}>Webtoon</button>
          </div>
        </section>

        {/* --- THÈMES (Cercles de tes screenshots) --- */}
        <section className="mini-section">
          <small>thèmes d'affichage</small>
          <div className="theme-selector">
            {['#000', '#fff', '#f4ecd8', '#1a1a1a'].map(color => (
              <div 
                key={color}
                className={`theme-circle ${settings.theme === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => update('theme', color)}
              />
            ))}
          </div>
        </section>

        {/* --- TAILLE DU TEXTE (Mini & Précis) --- */}
        <section className="mini-section">
          <small>taille du texte</small>
          <div className="font-control">
            <button onClick={() => update('fontSize', settings.fontSize - 1)}>A-</button>
            <span className="size-display">{settings.fontSize}px</span>
            <button onClick={() => update('fontSize', settings.fontSize + 1)}>A+</button>
          </div>
        </section>

        {/* --- SYSTÈME AUDIO (Divisé) --- */}
        <AudioControls 
          settings={settings}
          update={update}
        />

        {/* --- 10 FONCTIONS "ULTRA" POUR COMICCRAFTE --- */}
        <section className="ultra-functions">
          <small>options avancées</small>
          <div className="ultra-grid">
            <button onClick={() => update('autoScroll', !settings.autoScroll)}>
              {settings.autoScroll ? '🛑 Stop Scroll' : '📜 Auto-Scroll'}
            </button>
            <button onClick={() => update('fontFamily', 'Bangers')}>🎨 Police Manga</button>
            <button onClick={() => update('brightness', 0.5)}>🌙 Mode Nuit Max</button>
            <button onClick={() => update('immersion', !settings.immersion)}>📺 Full Screen</button>
            <button onClick={() => update('speedRead', !settings.speedRead)}>⚡ Speed Reader</button>
            <button onClick={() => update('highRes', !settings.highRes)}>🖼️ HD Images</button>
            <button onClick={() => update('sepia', !settings.sepia)}>📜 Mode Vieux Papier</button>
            <button onClick={() => update('lineHeight', 1.8)}>↔️ Espacement</button>
            <button onClick={() => update('blueLight', !settings.blueLight)}>🛡️ Filtre Bleu</button>
            <button onClick={() => update('preRender', !settings.preRender)}>🚀 Turbo Load</button>
          </div>
        </section>
      </div>
    </div>
  );
};
