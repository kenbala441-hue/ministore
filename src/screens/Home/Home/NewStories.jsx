// 🔹 Exemple d'utilisation dans Home/components/TrendingGrid.jsx ou NewStory.jsx

import React from 'react';
import { likeStory, commentStory, shareStory } from '../../utils/firebaseActions';

export default function StoryCard({ story, setSelectedStory, setView, user }) {
  const handleLike = () => likeStory(user.uid, story.id);
  const handleComment = () => commentStory(user.uid, story.id, prompt("Ton commentaire :"));
  const handleShare = () => shareStory(user.uid, story.id);

  return (
    <div style={{ cursor: 'pointer', marginBottom: '15px', border: '1px solid #00fff2', borderRadius: '12px', padding: '10px', background: '#111' }}>
      <div onClick={() => { setSelectedStory(story); setView('reader'); }}>
        <img src={story.cover} alt={story.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px' }} />
        <h4 style={{ color: '#00fff2', margin: '5px 0 0 0' }}>{story.title}</h4>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
        <span onClick={handleLike} style={{ cursor: 'pointer' }}>❤️ {story.likes?.length || 0}</span>
        <span onClick={handleComment} style={{ cursor: 'pointer' }}>💬 {story.comments?.length || 0}</span>
        <span onClick={handleShare} style={{ cursor: 'pointer' }}>🔗 {story.shares?.length || 0}</span>
      </div>
    </div>
  );
}