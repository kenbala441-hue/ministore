import React from 'react';
import RankingSection from './RankingSection';
import TrendingNews from './TrendingNews'; // Importation du nouveau composant

const NewsFeed = ({ onSelectStory }) => {
  return (
    <div style={{ paddingBottom: '100px' }}> {/* Espace pour le menu bas */}
      
      {/* 1. BANNIÈRE ÉVÉNEMENT */}
      <div style={styles.banner}>
        <h4 style={{margin: 0}}>Concours ComicCrafte 🏆</h4>
        <p style={{fontSize: '11px', opacity: 0.7}}>Participez et gagnez des récompenses !</p>
      </div>

      {/* 2. CLASSEMENT (Horizontal style card list) */}
      <RankingSection onSelectStory={onSelectStory} />

      {/* 3. TRENDING VERTICAL (Actualités / Dernières sorties) */}
      <TrendingNews onSelectStory={onSelectStory} />

    </div>
  );
};

const styles = {
  banner: { 
    margin: '15px', 
    padding: '20px', 
    borderRadius: '15px', 
    background: 'linear-gradient(135deg, #1e1b4b, #581c87)', 
    color: '#fff' 
  }
};

export default NewsFeed;
