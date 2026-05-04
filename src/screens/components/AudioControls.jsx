// src/screens/components/AudioControls.jsx
import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  User, UserCircle, Gauge, Volume2, Mic2 
} from 'lucide-react';

export const AudioControls = ({ audioState, actions }) => {
  const { 
    isPlaying, volume, speed, voiceType, isArticulating 
  } = audioState;

  return (
    <div className="audio-engine-v3">
      {/* --- SÉLECTEUR DE VOIX --- */}
      <div className="audio-row-pro">
        <label><User size={14}/> TYPE DE VOIX</label>
        <div className="voice-selector">
          <button 
            className={voiceType === 'male' ? 'active' : ''} 
            onClick={() => actions.setVoiceType('male')}
          >
            <User size={14}/> HOMME
          </button>
          <button 
            className={voiceType === 'female' ? 'active' : ''} 
            onClick={() => actions.setVoiceType('female')}
          >
            <UserCircle size={14}/> FEMME
          </button>
        </div>
      </div>

      {/* --- CONTRÔLES DE NAVIGATION --- */}
      <div className="audio-playback-main">
        <button className="nav-btn" onClick={actions.skipBackward}>
          <SkipBack size={20} />
        </button>
        
        <button className="play-pulse-btn" onClick={actions.togglePlay}>
          {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}
        </button>

        <button className="nav-btn" onClick={actions.skipForward}>
          <SkipForward size={20} />
        </button>
      </div>

      {/* --- RÉGLAGES (Volume & Vitesse) --- */}
      <div className="audio-sliders-grid">
        <div className="slider-item">
          <div className="slider-label"><Volume2 size={12}/> Volume</div>
          <input 
            type="range" min="0" max="100" 
            value={volume} 
            onChange={(e) => actions.setVolume(e.target.value)} 
          />
        </div>
        
        <div className="slider-item">
          <div className="slider-label"><Gauge size={12}/> Vitesse ({speed}x)</div>
          <input 
            type="range" min="0.5" max="2" step="0.1" 
            value={speed} 
            onChange={(e) => actions.setSpeed(e.target.value)} 
          />
        </div>
      </div>

      {/* --- OPTION D'ARTICULATION --- */}
      <button 
        className={`articulation-toggle ${isArticulating ? 'enabled' : ''}`}
        onClick={() => actions.setArticulating(!isArticulating)}
      >
        <Mic2 size={14} />
        <span>MODE ARTICULATION PRÉCISE</span>
      </button>
    </div>
  );
};
