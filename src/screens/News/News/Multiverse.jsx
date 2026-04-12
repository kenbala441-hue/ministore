import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Multiverse = ({ setView }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('planning'); // 'planning' ou 'archives'
  const [showExplanation, setShowExplanation] = useState(false);

  // DONNÉES DU HERO (PROMOS)
  const monthlyPromos = [
    { 
      id: 1, 
      title: "Les Héritiers de l'Oubli", 
      image: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772150811/1762552814369_tdmwse.png", 
      tag: "NOUVEAUTÉ DU MOIS",
      desc: "Le destin du royaume repose sur leurs épaules."
    },
    { 
      id: 2, 
      title: "Blackline", 
      image: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1774630505/1774630494659_gzve7l.png", 
      tag: "CHAPITRE SPÉCIAL",
      desc: "Une immersion brutale dans l'underground."
    },
    { 
      id: 3, 
      title: "The Silent King", 
      image: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1775763148/Screenshot_20260409_202552_wfuhxe.jpg",
      tag: "PREMIUM EXCLUSIF",
      desc: "Le silence est sa seule couronne."
    },
  ];

  // DONNÉES DES SORTIES (PLANNING & ARCHIVES)
  const storiesData = {
    planning: [
      { rank: "01", title: "Peter Pan", author: "Studio C", date: "15 Avril", type: "Manga", chap: "S2 - Ep 04", price: "Gratuit" },
      { rank: "02", title: "Dracula", author: "ComicCrafte", date: "22 Avril", type: "Action", chap: "Chapitre 1", price: "Premium" },
      { rank: "03", title: "Shadow Hunter", author: "Auteur Inconnu", date: "RETARDÉ", type: "Horreur", chap: "Spécial", price: "Premium", status: "delayed" },
      { rank: "04", title: "Solo Leveling: Arise", author: "Chugong", date: "30 Avril", type: "Webtoon", chap: "Side Story", price: "Premium" },
    ],
    archives: [
      { rank: "✔", title: "L'Architecte des Chimères", author: "ComicCrafte", date: "Mars", type: "Fantasy", chap: "Complet", price: "Gratuit" },
      { rank: "✔", title: "Naruto: Blue Moon", author: "Fan-Project", date: "Février", type: "Ninja", chap: "Tome 1", price: "Gratuit" },
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % monthlyPromos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [monthlyPromos.length]);

  return (
    <div style={s.container}>
      {/* EFFETS NÉON DE FOND */}
      <div style={s.neonGlowLeft}></div>
      <div style={s.neonGlowRight}></div>

      {/* HEADER : HERO SLIDER */}
      <div style={s.heroWrapper}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            style={{ ...s.heroCard, backgroundImage: `url(${monthlyPromos[activeIndex].image})` }}
            onClick={() => setShowExplanation(true)}
          >
            <div style={s.heroOverlay}>
              <div style={s.tagRow}>
                <span style={s.promoTag}>{monthlyPromos[activeIndex].tag}</span>
                <span style={s.infoIcon}>ⓘ</span>
              </div>
              <h1 style={s.heroTitle}>{monthlyPromos[activeIndex].title}</h1>
              <p style={s.heroDesc}>{monthlyPromos[activeIndex].desc}</p>
              <div style={s.inkBadge}>ACCÈS ANTICIPÉ : 50 INK</div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div style={s.dotsContainer}>
          {monthlyPromos.map((_, i) => (
            <div key={i} style={{ ...s.dot, backgroundColor: i === activeIndex ? '#a855f7' : '#222' }} />
          ))}
        </div>
      </div>

      {/* MODAL D'EXPLICATION (POURQUOI MULTIVERSE ?) */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={s.modalOverlay} onClick={() => setShowExplanation(false)}>
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={s.modalContent} onClick={e => e.stopPropagation()}>
              <h3 style={s.modalTitle}>Pourquoi le Multiverse ?</h3>
              <p style={s.modalText}>
                Le Multiverse est la zone **Premium** de ComicCrafte. Les histoires affichées ici sont en 
                avant-première mondiale. En utilisant vos **Inks**, vous soutenez directement les auteurs 
                pour qu'ils terminent leurs chapitres plus vite.
              </p>
              <button style={s.closeModal} onClick={() => setShowExplanation(false)}>COMPRIS</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SYSTÈME D'ONGLETS (TABS) */}
      <div style={s.tabWrapper}>
        <div 
          style={{ ...s.tab, color: activeTab === 'planning' ? '#fff' : '#555', borderBottom: activeTab === 'planning' ? '2px solid #a855f7' : 'none' }}
          onClick={() => setActiveTab('planning')}
        >
          PROGRAMME
        </div>
        <div 
          style={{ ...s.tab, color: activeTab === 'archives' ? '#fff' : '#555', borderBottom: activeTab === 'archives' ? '2px solid #a855f7' : 'none' }}
          onClick={() => setActiveTab('archives')}
        >
          DÉJÀ SORTIS
        </div>
      </div>

      {/* LISTE DES SORTIES ÉTALÉES */}
      <div style={s.listSection}>
        <div style={s.listHeader}>
            <span>{activeTab === 'planning' ? "SORTIES D'AVRIL" : "HISTOIRES DISPONIBLES"}</span>
            <div style={s.line}></div>
        </div>
        
        <div style={s.listContainer}>
          {storiesData[activeTab].map((story, index) => (
            <ReleaseCard key={index} {...story} />
          ))}
        </div>
      </div>

      <button style={s.backBtn} onClick={() => setView('news')}>← RETOUR AU FLUX</button>
    </div>
  );
};

const ReleaseCard = ({ rank, title, author, date, type, chap, price, status }) => (
  <motion.div whileTap={{ scale: 0.98 }} style={s.listCard}>
    <div style={{ ...s.rankCol, color: status === 'delayed' ? '#ff4444' : '#222' }}>{rank}</div>
    <div style={s.mainInfoCol}>
      <div style={s.typeChapRow}>
        <span style={s.cardType}>{type}</span>
        <span style={s.cardChap}>{chap}</span>
      </div>
      <div style={s.cardTitle}>{title}</div>
      <div style={s.cardAuthor}>par {author}</div>
    </div>
    <div style={s.datePriceCol}>
      <div style={{ ...s.cardDate, color: status === 'delayed' ? '#ff4444' : '#fff' }}>{date}</div>
      <div style={{ ...s.cardPrice, color: price === 'Gratuit' ? '#00ff88' : '#a855f7' }}>
        {price === 'Gratuit' ? 'OFFERT' : '🔒 PREMIUM'}
      </div>
    </div>
  </motion.div>
);

const s = {
  container: { backgroundColor: '#000', minHeight: '100vh', position: 'relative', overflowX: 'hidden', paddingBottom: '120px', color: '#fff', fontFamily: 'sans-serif' },
  neonGlowLeft: { position: 'absolute', top: '20%', left: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' },
  neonGlowRight: { position: 'absolute', bottom: '10%', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' },
  
  heroWrapper: { padding: '20px', height: '480px', position: 'relative', zIndex: 2 },
  heroCard: { width: '100%', height: '100%', borderRadius: '28px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px', background: 'linear-gradient(transparent, rgba(0,0,0,0.95) 80%)', display: 'flex', flexDirection: 'column', gap: '8px' },
  tagRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  promoTag: { color: '#a855f7', fontSize: '11px', fontWeight: '900', letterSpacing: '2px' },
  infoIcon: { width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #555', textAlign: 'center', fontSize: '12px', color: '#555' },
  heroTitle: { fontSize: '32px', fontWeight: '900', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
  heroDesc: { fontSize: '13px', color: '#aaa', margin: '0 0 10px 0', lineHeight: '1.4' },
  inkBadge: { backgroundColor: '#fff', color: '#000', padding: '6px 14px', borderRadius: '30px', fontSize: '11px', fontWeight: 'bold', width: 'fit-content' },
  dotsContainer: { display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' },
  dot: { width: '5px', height: '5px', borderRadius: '50%', transition: '0.4s' },

  tabWrapper: { display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '10px', marginBottom: '20px' },
  tab: { fontSize: '12px', fontWeight: '900', padding: '10px 5px', cursor: 'pointer', letterSpacing: '1px', transition: '0.3s' },

  listSection: { padding: '0 20px', zIndex: 2, position: 'relative' },
  listHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#444', fontSize: '11px', fontWeight: 'bold' },
  line: { flex: 1, height: '1px', backgroundColor: '#1a1a1a' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },

  listCard: { display: 'flex', alignItems: 'center', gap: '18px', padding: '16px', backgroundColor: '#080808', borderRadius: '18px', border: '1px solid #111' },
  rankCol: { fontSize: '28px', fontWeight: '900', width: '35px', textAlign: 'center' },
  mainInfoCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' },
  typeChapRow: { display: 'flex', gap: '12px', alignItems: 'center' },
  cardType: { fontSize: '10px', color: '#444', textTransform: 'uppercase', fontWeight: 'bold' },
  cardChap: { fontSize: '10px', color: '#a855f7', fontWeight: 'bold' },
  cardTitle: { fontSize: '16px', fontWeight: 'bold', letterSpacing: '-0.2px' },
  cardAuthor: { fontSize: '11px', color: '#555' },
  datePriceCol: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' },
  cardDate: { fontSize: '12px', fontWeight: 'bold' },
  cardPrice: { fontSize: '9px', fontWeight: '900', letterSpacing: '0.5px' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  modalContent: { backgroundColor: '#111', padding: '30px', borderRadius: '24px', border: '1px solid #222', textAlign: 'center' },
  modalTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#a855f7' },
  modalText: { fontSize: '14px', color: '#888', lineHeight: '1.6', marginBottom: '25px' },
  closeModal: { backgroundColor: '#fff', color: '#000', border: 'none', padding: '12px 30px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },

  backBtn: { display: 'block', margin: '40px auto', background: 'none', border: 'none', color: '#333', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }
};

export default Multiverse;
