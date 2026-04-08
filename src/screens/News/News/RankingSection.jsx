import React from 'react';

const RankingSection = ({ onSelectStory }) => {
  // On simule ici la récupération de tes vraies histoires (Blackline, etc.)
  const stories = [
    { id: 1, title: "Les Héritiers de l'Oubli", author: "ComicCrafte", stats: "98% Top", img: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772150811/1762552814369_tdmwse.png" },
    { id: 2, title: "Blackline", author: "ComicCrafte", stats: "92% Top", img: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1774630505/1774630494659_gzve7l.png" }
  ];

  return (
    <div style={s.container}>
      <h3 style={s.title}>TENDANCES <span style={s.neonText}>CLASSEMENT</span></h3>
      
      {stories.map((story, i) => (
        <div key={story.id} style={s.card} onClick={() => onSelectStory(story)}>
          <div style={s.rankNum}>0{i + 1}</div>
          <img src={story.img} style={s.cover} alt="Cover" />
          <div style={s.info}>
            <div style={s.storyName}>{story.title}</div>
            <div style={s.author}>{story.author}</div>
          </div>
          <div style={s.stats}>{story.stats}</div>
        </div>
      ))}
    </div>
  );
};

const s = {
  container: { padding: '20px' },
  title: { fontSize: '13px', letterSpacing: '2px', color: '#444', marginBottom: '20px' },
  neonText: { color: '#fff', textShadow: '0 0 5px #fff' }, // Néon blanc
  card: { display: 'flex', alignItems: 'center', backgroundColor: '#0a0a0a', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #1a1a1a' },
  rankNum: { fontSize: '16px', fontWeight: 'bold', color: '#333', marginRight: '15px', fontStyle: 'italic' },
  cover: { width: '40px', height: '55px', borderRadius: '4px', objectFit: 'cover' },
  info: { flex: 1, marginLeft: '15px' },
  storyName: { fontSize: '13px', fontWeight: '600', color: '#eee' },
  author: { fontSize: '10px', color: '#555', marginTop: '3px' },
  stats: { fontSize: '10px', color: '#fff', fontWeight: 'bold' }
};

export default RankingSection;
