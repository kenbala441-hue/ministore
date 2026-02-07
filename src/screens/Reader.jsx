import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Reader({ story, setView }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [fontCase, setFontCase] = useState('normal'); // normal / uppercase
  const [bgColor, setBgColor] = useState('#7c3aed'); // violet néon par défaut
  const [storyContent, setStoryContent] = useState([]);

  // Couleur selon genre
  const genreColors = {
    romance: '#f9a8d4',
    aventure: '#3b82f6',
    darkRomance: '#1f1f1f',
    action: '#ef4444',
    mystere: '#8b5cf6',
    fantaisie: '#ec4899',
    // Ajoute +30 genres ici
  };

  useEffect(() => {
    if (!story) return;
    // Définir couleur selon genre
    setBgColor(genreColors[story.genre] || '#7c3aed');

    // Charger le contenu
    setStoryContent(story.pages || []);

    // Charger position de lecture si existante
    const loadPosition = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid, 'readingPositions', story.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentPage(docSnap.data().page || 0);
      }
    };
    loadPosition();
  }, [story]);

  // Sauvegarde automatique
  useEffect(() => {
    const savePosition = async () => {
      if (!auth.currentUser || !story) return;
      await setDoc(
        doc(db, 'users', auth.currentUser.uid, 'readingPositions', story.id),
        { page: currentPage },
        { merge: true }
      );
    };
    savePosition();
  }, [currentPage, story]);

  if (!story) return <div style={{ color: 'white', padding: 20 }}>Aucune histoire sélectionnée.</div>;

  const nextPage = () => setCurrentPage(Math.min(currentPage + 1, storyContent.length - 1));
  const prevPage = () => setCurrentPage(Math.max(currentPage - 1, 0));

  const reportBug = () => {
    const bug = prompt('Décrivez le problème rencontré :');
    if (!bug) return;
    // Ajouter dans firestore
    setDoc(doc(db, 'bugs', `${story.id}-${Date.now()}`), {
      userId: auth.currentUser?.uid || 'anon',
      storyId: story.id,
      message: bug,
      timestamp: new Date()
    });
    alert('Merci ! Votre signalement a été envoyé.');
  };

  return (
    <div style={{ ...s.container, backgroundColor: bgColor }}>
      {/* Barre de contrôle */}
      <div style={s.controls}>
        <button onClick={() => setView('home')} style={s.btn}>Retour</button>
        <button onClick={() => setFontSize(fontSize + 2)} style={s.btn}>A+</button>
        <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} style={s.btn}>A-</button>
        <button onClick={() => setFontCase(fontCase === 'normal' ? 'uppercase' : 'normal')} style={s.btn}>Maj/Min</button>
        <button onClick={reportBug} style={s.btn}>Signaler un problème</button>
      </div>

      {/* Contenu de l'histoire */}
      <div style={s.content}>
        {storyContent[currentPage]?.type === 'image' && (
          <img src={storyContent[currentPage].src} alt="" style={s.image} />
        )}
        {storyContent[currentPage]?.type === 'text' && (
          <p style={{ ...s.text, fontSize, textTransform: fontCase }}>{storyContent[currentPage].text}</p>
        )}
      </div>

      {/* Navigation */}
      <div style={s.nav}>
        <button onClick={prevPage} disabled={currentPage === 0} style={s.navBtn}>◀ Précédent</button>
        <span style={s.pageIndicator}>{currentPage + 1} / {storyContent.length}</span>
        <button onClick={nextPage} disabled={currentPage === storyContent.length - 1} style={s.navBtn}>Suivant ▶</button>
      </div>
    </div>
  );
}

const s = {
  container: {
    minHeight: '100vh',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
  },
  controls: {
    display: 'flex',
    gap: 10,
    marginBottom: 15,
    flexWrap: 'wrap'
  },
  btn: {
    padding: '6px 12px',
    background: '#222',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer'
  },
  content: {
    flex: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'auto',
    marginBottom: 15
  },
  image: { maxWidth: '100%', maxHeight: '80vh', borderRadius: 10 },
  text: { textAlign: 'center', lineHeight: 1.5, maxWidth: 600 },
  nav: { display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 600 },
  navBtn: { padding: '6px 12px', background: '#333', color: 'white', border: 'none', borderRadius: 5 },
  pageIndicator: { alignSelf: 'center' }
};