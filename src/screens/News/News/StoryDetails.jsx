import React from 'react';

const StoryDetails = ({ story, onBack, setView }) => {
  return (
    <div style={s.fullPage}>
      {/* BOUTON RETOUR EN HAUT À GAUCHE */}
      <button onClick={onBack} style={s.backBtn}>
        ✕ Fermer
      </button>

      <img src={story.img} style={s.cover} alt="Cover" />
      
      <div style={s.contentCard}>
        <h1 style={s.title}>{story.title}</h1>
        <p style={s.author}>Auteur : {story.author || "ComicCrafte"}</p>
        
        <div style={s.divider}></div>

        <h3 style={s.subTitle}>Synopsis</h3>
        <p style={s.description}>
          Découvrez l'incroyable destin des personnages dans cette œuvre 
          exclusive de ComicCrafte Studio.
        </p>

        <button style={s.readBtn} onClick={() => setView('reader')}>
          COMMENCER LA LECTURE
        </button>
      </div>
    </div>
  );
};

const s = {
  fullPage: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000', zIndex: 999, overflowY: 'auto' },
  backBtn: { position: 'absolute', top: '20px', left: '20px', zIndex: 10, padding: '8px 15px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid #333', borderRadius: '20px', fontSize: '12px' },
  cover: { width: '100%', height: '45vh', objectFit: 'cover' },
  contentCard: { padding: '25px', backgroundColor: '#000', marginTop: '-30px', borderRadius: '30px 30px 0 0', borderTop: '1px solid #222' },
  title: { fontSize: '22px', fontWeight: 'bold', color: '#fff' },
  author: { fontSize: '13px', color: '#a855f7', marginTop: '5px' },
  divider: { height: '1px', backgroundColor: '#222', margin: '20px 0' },
  subTitle: { fontSize: '14px', color: '#fff', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
  description: { fontSize: '14px', color: '#888', lineHeight: '1.6' },
  readBtn: { width: '100%', padding: '15px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '30px', fontSize: '14px' }
};

export default StoryDetails;
