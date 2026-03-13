import React from 'react';

export default function NewStory({ story, setSelectedStory, setView }) {
  return (
    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', cursor: 'pointer' }} onClick={() => { setSelectedStory(story); setView('reader'); }}>
      <div style={{ width: '100px', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #00fff2' }}>
        <img src={story.cover} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0', color: '#00fff2', fontSize: '14px' }}>{story.title}</h4>
          <p style={{ margin: 0, color: '#aaa', fontSize: '11px' }}>{story.genres?.join(', ')}</p>
        </div>
        <span style={{ fontSize: '10px', color: '#fff' }}>👁️ {story.views || 0}</span>
      </div>
    </div>
  );
}