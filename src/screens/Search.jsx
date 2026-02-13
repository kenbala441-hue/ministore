import React, { useState } from 'react';

export default function Search({ setView }) {
  const [isTyping, setIsTyping] = useState(false);
  const [query, setQuery] = useState("");

  const trends = ["CYBER-ACTION", "NEO-ROMANCE", "SOLO-GOD", "SYSTEM", "VIRTUAL"];

  // FONCTION POUR LANCER LA RECHERCHE
  const handleSearch = () => {
    if (query.trim() !== "") {
      setIsTyping(true);
      console.log("Scan en cours pour :", query);
      // Ici tu pourras ajouter ta logique de filtrage Firebase
    }
  };

  return (
    <div style={{
      ...s.container, 
      background: isTyping ? '#000' : 'radial-gradient(circle at top right, #1a0b2e, #000, #051a1a)'
    }}>
      {/* BARRE DE RECHERCHE FUTURISTE */}
      <div style={s.searchHeader}>
        <button onClick={() => setView('home')} style={s.back}>←</button>
        
        <div style={{...s.inputWrapper, borderColor: isTyping ? '#00f5d4' : '#a855f7'}}>
          <input 
            type="text" 
            placeholder="Explorer le Multivers..." 
            style={s.input} 
            value={query} // On lie la valeur au state
            onFocus={() => setIsTyping(true)}
            onBlur={() => query === "" && setIsTyping(false)}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // <--- DETECTION TOUCHE ENTREE
            autoFocus 
          />
          
          {/* BOUTON LOUPE AJOUTÉ */}
          <div style={s.searchIcon} onClick={handleSearch}>🔍</div>
          
          <div style={{...s.glow, backgroundColor: isTyping ? '#00f5d4' : '#a855f7'}}></div>
        </div>
      </div>

      <div style={s.content}>
        {!isTyping ? (
          <>
            <h3 style={s.sectionTitle}>⚡ TENDANCES NEURALES</h3>
            <div style={s.chipContainer}>
              {trends.map(t => (
                <div key={t} style={s.chip} onClick={() => {setQuery(t); setIsTyping(true);}}>
                  <span style={s.hash}>#</span>{t}
                </div>
              ))}
            </div>
            
            <div style={s.visualEffect}>
              <div style={s.circle}></div>
              <p style={s.scanText}>SCANNING DATABASE...</p>
            </div>
          </>
        ) : (
          <div style={s.resultsArea}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
               <p style={{color: '#444', fontSize: '12px'}}>RESULTATS POUR : <span style={{color: '#00f5d4'}}>{query.toUpperCase()}</span></p>
               <button onClick={() => {setQuery(""); setIsTyping(false);}} style={s.clearBtn}>ANNULER</button>
            </div>

            <div style={s.emptyResult}>
              <div style={s.loader}></div>
              <p style={s.glitchText}>INITIALISATION DU PROTOCOLE DE RECHERCHE...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  container: { minHeight: '100vh', color: '#fff', padding: '20px', transition: 'all 0.5s ease' },
  searchHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' },
  back: { background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' },
  inputWrapper: { position: 'relative', flex: 1, borderBottom: '2px solid', transition: '0.3s', display: 'flex', alignItems: 'center' },
  input: { width: '100%', backgroundColor: 'transparent', border: 'none', padding: '12px 5px', color: '#fff', fontSize: '16px', outline: 'none', letterSpacing: '1px' },
  searchIcon: { cursor: 'pointer', padding: '0 10px', fontSize: '18px', opacity: 0.8 },
  glow: { position: 'absolute', bottom: '-2px', left: 0, height: '2px', width: '100%', filter: 'blur(8px)', transition: '0.3s', pointerEvents: 'none' },
  content: { marginTop: '40px' },
  sectionTitle: { fontSize: '12px', letterSpacing: '2px', color: '#a855f7', marginBottom: '20px' },
  chipContainer: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  chip: { background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '5px', fontSize: '12px', border: '1px solid rgba(168, 85, 247, 0.3)', cursor: 'pointer', backdropFilter: 'blur(10px)' },
  hash: { color: '#00f5d4', marginRight: '5px', fontWeight: 'bold' },
  visualEffect: { textAlign: 'center', marginTop: '80px', opacity: 0.5 },
  circle: { width: '100px', height: '100px', border: '2px dashed #a855f7', borderRadius: '50%', margin: '0 auto', animation: 'spin 10s linear infinite' },
  scanText: { fontSize: '10px', marginTop: '15px', color: '#a855f7' },
  resultsArea: { animation: 'fadeIn 0.3s ease' },
  clearBtn: { background: 'none', border: '1px solid #333', color: '#666', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' },
  emptyResult: { marginTop: '50px', textAlign: 'center' },
  loader: { width: '20px', height: '20px', border: '2px solid #00f5d4', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 15px', animation: 'spin 1s linear infinite' },
  glitchText: { fontSize: '11px', color: '#555', letterSpacing: '3px' }
};