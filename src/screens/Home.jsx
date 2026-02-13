import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

const GENRES = [
  "Tous", "Action", "Horreur", "Romance", "Aventure", "Sci-Fi", "Drame", "Comédie", "Dark Romance", 
  "Reincarnation", "Level Up", "Amateurs", "Humour", "Mystère", "Fantastique", "Épique", "Slice of Life",
  "Sport", "Musique", "Histoire", "Psychologique", "Thriller", "Magie", "Monde Virtuel", "Enquête",
  "Super Pouvoir", "Romance Scolaire", "Romance Fantastique", "Romance Drame", "Romance Comédie",
  "Action Aventure", "Survie", "Zombie", "Cyberpunk", "Dystopie", "Voyage dans le Temps",
  "Science", "Mecha", "Harem", "Shojo", "Shonen", "Seinen", "Josei", "Mystic", "Paranormal", "Espionnage",
  "Detective", "Martial Arts", "Space Opera", "Post-Apocalyptic", "Slice of Fantasy", "Romance Amour"
];

export default function Home({ setView, setSelectedStory, toggleBurger }) {
  const [stories, setStories] = useState([]);
  const [activeGenre, setActiveGenre] = useState("Tous");
  const [notifCount, setNotifCount] = useState(3);

  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStories(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredStories = stories.filter(st => activeGenre === "Tous" || st.genres.includes(activeGenre));

  return (
    <div style={s.container}>
      <header style={s.header}>
        <div style={s.headerLeft} onClick={toggleBurger}>
          <div style={s.burgerIcon}>☰</div>
          <h1 style={s.logoText}>Comic<span style={{color:'#00fff2'}}>Craft</span></h1>
        </div>
        <div style={s.headerRight}>
          <div style={s.notifWrapper} onClick={() => setView('notifications')}>
            <span style={s.icon}>🔔</span>
            {notifCount > 0 && <span style={s.badge}>{notifCount}</span>}
          </div>
          <div style={s.searchIcon} onClick={() => setView('search')}>🔍</div>
        </div>
      </header>

      <div style={s.tabs}>
        <span style={s.tabActive} onClick={() => setView('home')}>ACCUEIL</span>
        <span style={s.tab} onClick={() => setView('news')}>NOUVEAUTÉS</span>
        <span style={s.tab} onClick={() => setView('myseries')}>MES SÉRIES</span>
      </div>

      <div style={s.genreScroll}>
        {GENRES.map(g => (
          <button 
            key={g} 
            onClick={() => setActiveGenre(g)}
            style={activeGenre === g ? s.genreBtnActive : s.genreBtn}
          >
            {g}
          </button>
        ))}
      </div>

      <section style={s.heroSection} onClick={() => {setSelectedStory(filteredStories[0]); setView('reader')}}>
        {filteredStories[0] && (
          <>
            <img src={filteredStories[0].cover} style={s.heroImg} alt="banner" />
            <div style={s.heroOverlay}>
              <div style={s.tag}>⭐ RECOMMANDÉ POUR VOUS</div>
              <h2 style={s.heroTitle}>{filteredStories[0].title}</h2>
              <p style={s.heroSub}>{filteredStories[0].genres.join(", ")} • 🔥 Popularité Élevée</p>
            </div>
          </>
        )}
      </section>

      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>Tendances Actuelles</h3>
        <span style={s.seeMore} onClick={() => setView('news')}>Voir tout {'>'} </span>
      </div>

      <div style={s.grid}>
        {filteredStories.map(story => (
          <div key={story.id} style={s.card} onClick={() => {setSelectedStory(story); setView('reader')}}>
            <div style={{...s.cardThumb, border: `1px solid #00fff244`}}>
              <img src={story.cover} style={s.thumbImg} alt="cover" />
              <div style={s.viewCount}>👁️ {story.views || 0}</div>
            </div>
            <div style={s.cardInfo}>
              <div style={s.cardTitle}>{story.title}</div>
              <div style={s.cardMeta}>{story.genres.join(", ")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: { backgroundColor: '#050505', minHeight: '100vh', padding: '0 15px 100px 15px', color: 'white', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', position: 'sticky', top: 0, backgroundColor: '#050505', zIndex: 10 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  burgerIcon: { fontSize: '24px', color: '#00fff2', cursor: 'pointer' },
  logoText: { fontSize: '22px', fontWeight: 'bold', color: '#00fff2', margin: 0 },
  headerRight: { display: 'flex', gap: '20px', alignItems: 'center' },
  notifWrapper: { position: 'relative', fontSize: '20px', cursor: 'pointer' },
  badge: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ff0000', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '50%', fontWeight: 'bold' },
  searchIcon: { fontSize: '18px', cursor: 'pointer' },

  tabs: { display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #1a1a1a' },
  tabActive: { color: '#00fff2', borderBottom: '2px solid #00fff2', paddingBottom: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' },
  tab: { color: '#888', paddingBottom: '10px', fontSize: '12px', cursor: 'pointer' },

  genreScroll: { display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '20px', scrollbarWidth: 'none' },
  genreBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #222', backgroundColor: '#111', color: '#888', whiteSpace: 'nowrap', fontSize: '11px', cursor: 'pointer' },
  genreBtnActive: { padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#00fff2', color: 'black', whiteSpace: 'nowrap', fontSize: '11px', boxShadow: '0 0 15px rgba(0,255,242,0.4)' },

  heroSection: { position: 'relative', height: '220px', borderRadius: '20px', overflow: 'hidden', marginBottom: '30px', cursor: 'pointer' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.95))' },
  tag: { fontSize: '10px', color: '#00fff2', fontWeight: 'bold', marginBottom: '5px' },
  heroTitle: { fontSize: '22px', margin: '0 0 5px 0' },
  heroSub: { fontSize: '12px', color: '#aaa' },

  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  sectionTitle: { fontSize: '16px', color: '#fff', margin: 0 },
  seeMore: { fontSize: '11px', color: '#00fff2', cursor: 'pointer' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
  card: { cursor: 'pointer' },
  cardThumb: { height: '180px', borderRadius: '12px', overflow: 'hidden', position: 'relative', backgroundColor: '#111' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  viewCount: { position: 'absolute', bottom: '5px', left: '5px', fontSize: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '10px' },
  cardInfo: { marginTop: '8px' },
  cardTitle: { fontSize: '12px', fontWeight: 'bold', color: '#fff', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardMeta: { fontSize: '10px', color: '#888', marginTop: '3px' }
};