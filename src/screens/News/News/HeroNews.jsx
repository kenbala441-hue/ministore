import React, { useState, useEffect } from 'react';

const HeroNews = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const ads = [
    { url: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772150811/1762552814369_tdmwse.png", title: "Nouveau : Les Héritiers de l'Oubli" },
    { url: "https://picsum.photos/800/400?sig=2", title: "Concours de Dessin : Inscris-toi !" },
    { url: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1774630505/1774630494659_gzve7l.png", title: "Blackline : Chapitre 15 disponible" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % ads.length);
    }, 10000); // Change toutes les 10 secondes
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={s.wrapper}>
      <div style={s.container}>
        <img src={ads[currentImg].url} style={s.img} alt="Ad" />
        <div style={s.overlay}>
          <div style={s.adTitle}>{ads[currentImg].title}</div>
        </div>
      </div>
    </div>
  );
};

const s = {
  wrapper: { padding: '20px 20px 10px 20px' }, // Cadrage parfait
  container: { height: '160px', borderRadius: '15px', overflow: 'hidden', position: 'relative', border: '1px solid #222' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s ease-in-out' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' },
  adTitle: { fontSize: '14px', fontWeight: 'bold', color: '#fff' }
};

export default HeroNews;
