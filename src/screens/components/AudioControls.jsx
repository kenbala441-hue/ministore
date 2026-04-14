// src/screens/components/AudioControls.jsx
export const AudioControls = ({ volumeMale, setVolumeMale, volumeFemale, setVolumeFemale }) => {
  return (
    <div className="audio-section">
      <h4>Système Audio</h4>
      <div className="volume-row">
        <span>Voix Masculine</span>
        <input 
          type="range" 
          value={volumeMale} 
          onChange={(e) => setVolumeMale(e.target.value)} 
        />
      </div>
      <div className="volume-row">
        <span>Voix Féminine</span>
        <input 
          type="range" 
          value={volumeFemale} 
          onChange={(e) => setVolumeFemale(e.target.value)} 
        />
      </div>
    </div>
  );
};
