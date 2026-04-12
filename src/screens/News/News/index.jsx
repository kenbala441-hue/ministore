
import React, { useState } from 'react';
import HeroNews from './HeroNews';
import RankingSection from './RankingSection';
import StoryDetails from './StoryDetails';
import QuizPlay from './QuizPlay';
import TrendingNews from './TrendingNews'; 
import TrendingScroll from './TrendingScroll';

const News = ({ setView }) => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [isPlayingQuiz, setIsPlayingQuiz] = useState(false);

  // 1. GESTION DU QUIZ
  if (isPlayingQuiz) {
    return <QuizPlay onExit={() => setIsPlayingQuiz(false)} />;
  }

  // 2. GESTION DE LA FICHE DÉTAILS
  if (selectedStory) {
    return (
      <StoryDetails 
        story={selectedStory} 
        onBack={() => setSelectedStory(null)} 
        setView={setView} 
      />
    );
  }

  // 3. AFFICHAGE PRINCIPAL (NEWS FEED)
  return (
    <div style={s.mainContainer}>
      
      {/* SECTION HAUT : Hero et Promotion */}
      <HeroNews />

      {/* BANNIÈRE QUIZ INTERACTIVE */}
      <div style={s.quizContainer} onClick={() => setIsPlayingQuiz(true)}>
        <div style={s.quizContent}>
          <span style={s.quizIcon}>🎯</span>
          <div>
            <div style={s.quizTitle}>QUIZ DU MATIN</div>
            <div style={s.quizSub}>Teste tes connaissances et gagne 50 Ink</div>
          </div>
        </div>
        <div style={s.playTag}>JOUER</div>
      </div>

      {/* SECTION MILIEU : Trending Horizontal (Séparateur visuel) */}
      <TrendingScroll 
        setSelectedStory={setSelectedStory} 
        setView={setView} 
        neonColor="#a855f7" 
      />

      {/* SECTION CLASSEMENT : Top Ranking Vertical */}
      <RankingSection onSelectStory={(story) => setSelectedStory(story)} />

      {/* SECTION NEW COMING : Sorties prochaines & Retards */}
      <TrendingNews onSelectStory={(story) => setSelectedStory(story)} />

      {/* FOOTER : Bouton d'exploration finale */}
      <div style={s.footer}>
         <button style={s.fullBtn} onClick={() => setView('multiverse')}>
           VOIR TOUTES LES NOUVEAUTÉS
         </button>
      </div>
      
    </div>
  );
};

/* --- DESIGN SYSTEM COMICCRAFTE --- */
const s = {
  mainContainer: { 
    backgroundColor: '#000', 
    minHeight: '100vh', 
    color: '#fff', 
    paddingBottom: '100px' // Espace pour la navigation basse
  },

  quizContainer: { 
    margin: '15px 20px', 
    padding: '15px', 
    backgroundColor: '#111', 
    borderRadius: '12px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderLeft: '4px solid #fff', 
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
  },

  quizContent: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px' 
  },

  quizIcon: { fontSize: '22px' },

  quizTitle: { 
    fontSize: '13px', 
    fontWeight: 'bold', 
    color: '#fff',
    letterSpacing: '0.5px'
  },

  quizSub: { fontSize: '10px', color: '#777' },

  playTag: { 
    backgroundColor: '#fff', 
    color: '#000', 
    padding: '6px 14px', 
    borderRadius: '20px', 
    fontSize: '10px', 
    fontWeight: '900' 
  },

  footer: { 
    textAlign: 'center', 
    padding: '30px 20px' 
  },

  fullBtn: { 
    backgroundColor: 'transparent', 
    color: '#fff', 
    border: '1px solid #333', 
    padding: '12px 24px', 
    borderRadius: '12px', 
    fontSize: '11px', 
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: '0.3s'
  }
};

export default News;

