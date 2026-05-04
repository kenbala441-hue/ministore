// src/screens/components/SettingsMenu.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, Play, Palette, Layout, Check, X, 
  ChevronRight, Zap, ArrowLeft, Volume2, 
  Mic2, SkipBack, SkipForward, Pause, User, Headphones 
} from 'lucide-react';

// --- COMPOSANT AUDIO ---
const AudioPane = ({ local, up }) => (
  <div className="audio-engine-v3">
    <div className="voice-selector">
      <button className={local.voice === 'male' ? 'active' : ''} onClick={() => up('voice', 'male')}>
        <User size={14}/> MASCULIN
      </button>
      <button className={local.voice === 'female' ? 'active' : ''} onClick={() => up('voice', 'female')}>
        <User size={14}/> FÉMININ
      </button>
    </div>
    
    <div className="audio-playback-main">
      <button className="nav-btn"><SkipBack size={20} /></button>
      <button className="play-pulse-btn"><Pause size={24} fill="currentColor"/></button>
      <button className="nav-btn"><SkipForward size={20} /></button>
    </div>
    
    <div className="audio-sliders-grid">
      <div className="slider-item">
        <div className="slider-label"><Volume2 size={12}/> Volume</div>
        <input 
          type="range" 
          value={local.audioVolume || 50} 
          onChange={(e) => up('audioVolume', parseInt(e.target.value))} 
        />
      </div>
      <div className="slider-item">
        <div className="slider-label"><Zap size={12}/> Vitesse ({local.audioSpeed || 1}x)</div>
        <input 
          type="range" min="0.5" max="2" step="0.1" 
          value={local.audioSpeed || 1} 
          onChange={(e) => up('audioSpeed', parseFloat(e.target.value))} 
        />
      </div>
    </div>
    
    <button 
      className={`articulation-toggle ${local.isArticulating ? 'enabled' : ''}`} 
      onClick={() => up('isArticulating', !local.isArticulating)}
    >
      <Mic2 size={14} /> <span>ARTICULATION PRÉCISE</span>
    </button>
  </div>
);

export const SettingsMenu = ({ isOpen, onClose, settings, actions }) => {
  // Initialisation complète pour éviter les bugs d'undefined
  const [local, setLocal] = useState({ 
    theme: 'dark', 
    fontSize: 18, 
    readerMode: 'Webtoon', 
    autoScroll: false, 
    scrollSpeed: 1, 
    voice: 'male', 
    audioVolume: 50, 
    audioSpeed: 1,
    isArticulating: false,
    ...settings 
  });
  
  const [view, setView] = useState('main');

  if (!isOpen) return null;

  const up = (k, v) => setLocal(prev => ({ ...prev, [k]: v }));

  const save = () => {
    // Synchronisation avec les actions du Reader
    if (actions.setTheme) actions.setTheme(local.theme);
    if (actions.setFontSize) actions.setFontSize(local.fontSize);
    if (actions.setReaderMode) actions.setReaderMode(local.readerMode);
    if (actions.setIsWebtoonMode) actions.setIsWebtoonMode(local.readerMode === 'Webtoon');
    if (actions.setAutoScroll) actions.setAutoScroll(local.autoScroll);
    if (actions.setScrollSpeed) actions.setScrollSpeed(local.scrollSpeed);
    
    // Sauvegarde de la config Audio
    if (actions.setAudioConfig) {
      actions.setAudioConfig({
        volume: local.audioVolume,
        speed: local.audioSpeed,
        voice: local.voice,
        articulation: local.isArticulating
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="cc-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        
        <style>{`
          .cc-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
          .cc-kernel { width: 320px; background: #080808; border: 1px solid #1a1a1a; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,1); }
          .cc-head { padding: 18px; background: #111; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1a1a1a; }
          .cc-title { font-size: 10px; letter-spacing: 2px; color: #00f7ff; font-weight: 800; text-transform: uppercase; }
          .cc-body { padding: 15px; min-height: 260px; }
          
          .cc-list { display: flex; flex-direction: column; gap: 8px; }
          .cc-item { background: #121212; padding: 14px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
          .cc-item:active { background: #1a1a1a; transform: scale(0.98); }
          .cc-label { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #fff; font-weight: 500; }
          
          .cc-pane { display: flex; flex-direction: column; gap: 15px; animation: slideIn 0.2s ease-out; }
          .cc-back { background: none; border: none; color: #555; display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: bold; cursor: pointer; margin-bottom: 5px; }
          
          .cc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .cc-btn { background: #151515; border: 1px solid #222; color: white; padding: 12px; border-radius: 12px; font-size: 12px; cursor: pointer; }
          .cc-btn.active { background: #ff00ff; border-color: #ff00ff; box-shadow: 0 0 15px rgba(255,0,255,0.3); }
          
          /* AUDIO STYLE */
          .audio-engine-v3 { display: flex; flex-direction: column; gap: 15px; }
          .voice-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .voice-selector button { background: #121212; border: 1px solid #222; color: #666; padding: 10px; border-radius: 12px; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px; }
          .voice-selector button.active { border-color: #00f7ff; color: #00f7ff; background: #00f7ff0d; }
          .audio-playback-main { display: flex; align-items: center; justify-content: center; gap: 20px; background: #111; padding: 15px; border-radius: 20px; }
          .play-pulse-btn { width: 50px; height: 50px; border-radius: 50%; background: #00f7ff; border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(0, 247, 255, 0.4); }
          .nav-btn { background: transparent; border: none; color: #555; }
          .slider-item { background: #121212; padding: 10px; border-radius: 12px; }
          .slider-label { font-size: 10px; color: #555; margin-bottom: 5px; text-transform: uppercase; }
          .slider-item input { width: 100%; accent-color: #ff00ff; }
          .articulation-toggle { background: #121212; border: 1px solid #222; color: #555; padding: 12px; border-radius: 12px; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; }
          .articulation-toggle.enabled { color: #ff00ff; border-color: #ff00ff; background: #ff00ff0d; }

          .cc-save { width: calc(100% - 30px); margin: 0 15px 15px 15px; background: #00f7ff; color: black; border: none; padding: 15px; border-radius: 18px; font-weight: 900; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
          
          @keyframes slideIn { from { opacity: 0; transform: translateX(15px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>

        <motion.div className="cc-kernel" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}>
          <div className="cc-head">
            <span className="cc-title">ComicCrafte Engine</span>
            <X size={18} onClick={onClose} style={{color: '#444', cursor: 'pointer'}} />
          </div>

          <div className="cc-body">
            {view === 'main' ? (
              <div className="cc-list">
                <div className="cc-item" onClick={() => setView('mode')}>
                  <div className="cc-label"><Layout size={18} color="#ff00ff"/> Mode Lecture</div>
                  <ChevronRight size={14} color="#333"/>
                </div>
                <div className="cc-item" onClick={() => setView('audio')}>
                  <div className="cc-label"><Headphones size={18} color="#ccff00"/> Système Audio</div>
                  <ChevronRight size={14} color="#333"/>
                </div>
                <div className="cc-item" onClick={() => setView('scroll')}>
                  <div className="cc-label"><Play size={18} color="#00ff88"/> Auto-Scroll</div>
                  <ChevronRight size={14} color="#333"/>
                </div>
                <div className="cc-item" onClick={() => setView('text')}>
                  <div className="cc-label"><Type size={18} color="#00f7ff"/> Taille Texte</div>
                  <ChevronRight size={14} color="#333"/>
                </div>
                <div className="cc-item" onClick={() => setView('theme')}>
                  <div className="cc-label"><Palette size={18} color="#ff8800"/> Ambiance</div>
                  <ChevronRight size={14} color="#333"/>
                </div>
              </div>
            ) : (
              <div className="cc-pane">
                <button className="cc-back" onClick={() => setView('main')}><ArrowLeft size={14}/> RETOUR</button>
                
                {view === 'mode' && (
                  <div className="cc-grid">
                    {['Livre', 'Webtoon', 'Manga', 'Novel'].map(m => (
                      <button 
                        key={m} 
                        className={`cc-btn ${local.readerMode === m ? 'active' : ''}`}
                        onClick={() => up('readerMode', m)}
                      >{m}</button>
                    ))}
                  </div>
                )}

                {view === 'audio' && <AudioPane local={local} up={up} />}

                {view === 'scroll' && (
                  <div className="cc-grid">
                    {[1, 2, 3, 5].map(s => (
                      <button 
                        key={s} 
                        className={`cc-btn ${local.scrollSpeed === s && local.autoScroll ? 'active' : ''}`} 
                        onClick={() => {up('scrollSpeed', s); up('autoScroll', true)}}
                      >Vitesse x{s}</button>
                    ))}
                    <button className="cc-btn" style={{gridColumn: 'span 2'}} onClick={() => up('autoScroll', false)}>DÉSACTIVER SCROLL</button>
                  </div>
                )}

                {view === 'text' && (
                  <div className="cc-grid">
                    <button className="cc-btn" onClick={() => up('fontSize', local.fontSize - 1)}>A -</button>
                    <button className="cc-btn" style={{background: '#000', borderColor: '#333'}}>{local.fontSize}px</button>
                    <button className="cc-btn" onClick={() => up('fontSize', local.fontSize + 1)}>A +</button>
                  </div>
                )}

                {view === 'theme' && (
                  <div className="cc-grid">
                    {['dark', 'sepia', 'neon', 'amoled'].map(t => (
                      <button key={t} className={`cc-btn ${local.theme === t ? 'active' : ''}`} onClick={() => up('theme', t)}>{t}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {view === 'main' && (
            <button className="cc-save" onClick={save}>
              <Check size={16}/> VALIDER LES RÉGLAGES
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
