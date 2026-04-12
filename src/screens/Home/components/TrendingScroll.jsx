import React from 'react';
import { COMICCRAFTE_STORIES } from '../../../data/Action'; 

const TrendingScroll = ({ setView, setSelectedStory }) => {
  
  const handleOpen = (story) => {
    setSelectedStory(story);
    setView("story");
  };

  return (
    <div style={s.scrollContainer}>
      {COMICCRAFTE_STORIES.slice(0, 5).map((story) => (
        <div 
          key={story.id} 
          style={s.card} 
          onClick={() => handleOpen(story)}
        >
          <img 
            src={story.coverImage} 
            style={s.image} 
            alt={story.title}
          />
          <div style={s.info}>
            <div style={s.rank}>{COMICCRAFTE_STORIES.indexOf(story) + 1}</div>
            <div style={s.title}>{story.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const s = {
  scrollContainer: {
    display: 'flex',
    overflowX: 'auto',
    gap: '15px',
    padding: '10px 5px',
    scrollbarWidth: 'none'
  },
  card: {
    minWidth: '140px',
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#111'
  },
  image: {
    width: '140px',
    height: '200px',
    objectFit: 'cover',
    display: 'block'
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '10px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  rank: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#00f7ff',
    fontStyle: 'italic',
    lineHeight: '1'
  },
  title: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

export default TrendingScroll;
