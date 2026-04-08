import React, { useState } from 'react';
import HeroNews from './HeroNews';
import RankingSection from './RankingSection';
import StoryDetails from './StoryDetails';
import QuizPlay from './QuizPlay';

const News = ({ setView }) => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [isPlayingQuiz, setIsPlayingQuiz] = useState(false);

  // 1. Écran Quiz
  if (isPlayingQuiz) {
    return <QuizPlay onExit={() => setIsPlayingQuiz(false)} />;
  }

  // 2. Écran Détails
  if (selectedStory) {
    return (
      <StoryDetails 
        story={selectedStory} 
        onBack={() => setSelectedStory(null)} 
        setView={setView} 
      />
    );
  }

  // 3. Écran principal
  return (
    <div style={s.mainContainer}>
      
      {/* Hero */}
      <HeroNews />

      {/* Bannière Quiz améliorée */}
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

      {/* Ranking */}
      <RankingSection onSelectStory={(story) => setSelectedStory(story)} />
      
    </div>
  );
};

// --- STYLES COMBINÉS PRO ---
const s = {
  mainContainer: { 
    backgroundColor: '#000', 
    minHeight: '100vh', 
    color: '#fff', 
    paddingBottom: '30px' 
  },

  quizContainer: { 
    margin: '15px 20px', 
    padding: '15px', 
    backgroundColor: '#111', 
    borderRadius: '12px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderLeft: '4px solid #fff', // effet néon
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
  },

  quizContent: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px' 
  },

  quizIcon: { 
    fontSize: '22px' 
  },

  quizTitle: { 
    fontSize: '13px', 
    fontWeight: 'bold', 
    color: '#fff' 
  },

  quizSub: { 
    fontSize: '10px', 
    color: '#aaa' 
  },

  playTag: { 
    backgroundColor: '#fff', 
    color: '#000', 
    padding: '6px 14px', 
    borderRadius: '20px', 
    fontSize: '10px', 
    fontWeight: 'bold' 
  }
};

export default News;