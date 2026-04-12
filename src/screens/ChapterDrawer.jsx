import React from 'react';
import { motion } from 'framer-motion';
import { X, Lock, CheckCircle2, Play } from 'lucide-react';

const ChapterDrawer = ({ chapters, currentIndex, setIndex, onClose, theme }) => {
  return (
    <motion.div 
      initial={{ x: "100%" }} 
      animate={{ x: 0 }} 
      exit={{ x: "100%" }}
      style={{ ...ds.drawer, background: theme.paper, borderColor: theme.border }}
    >
      <div style={ds.header}>
        <h3 style={{ color: theme.text }}>Liste des Chapitres</h3>
        <X onClick={onClose} size={24} style={{ cursor: "pointer", color: theme.text }} />
      </div>

      <div style={ds.list}>
        {chapters.map((ch, i) => {
          const isCurrent = i === currentIndex;
          const isLocked = ch.isPremium && !ch.isUnlocked; // Simulation logique Ink

          return (
            <div 
              key={i} 
              onClick={() => !isLocked && (setIndex(i), onClose())}
              style={{ 
                ...ds.item, 
                backgroundColor: isCurrent ? `${theme.accent}22` : "transparent",
                borderBottom: `1px solid ${theme.border}`
              }}
            >
              <div style={ds.itemLeft}>
                <span style={{ ...ds.index, color: isCurrent ? theme.accent : "#555" }}>
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </span>
                <div style={ds.itemInfo}>
                  <div style={{ ...ds.itemTitle, color: isLocked ? "#555" : theme.text }}>
                    {ch.title || `Chapitre ${i + 1}`}
                  </div>
                  <div style={ds.itemSub}>Gratuit • 12 Pages</div>
                </div>
              </div>

              <div style={ds.itemRight}>
                {isLocked ? (
                  <div style={{ color: "#facc15" }}><Lock size={16} /></div>
                ) : isCurrent ? (
                  <div style={{ color: theme.accent }}><Play size={16} fill={theme.accent} /></div>
                ) : (
                  <div style={{ color: "#33bb33" }}><CheckCircle2 size={16} /></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const ds = {
  drawer: { position: "fixed", top: 0, right: 0, width: "85%", maxWidth: "350px", height: "100%", zIndex: 1000, borderLeft: "1px solid", display: "flex", flexDirection: "column", boxShadow: "-10px 0 30px rgba(0,0,0,0.5)" },
  header: { padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  list: { flex: 1, overflowY: "auto", padding: "10px" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 10px", cursor: "pointer", transition: "0.2s" },
  itemLeft: { display: "flex", alignItems: "center", gap: "15px" },
  index: { fontSize: "14px", fontWeight: "900" },
  itemInfo: { display: "flex", flexDirection: "column", gap: "2px" },
  itemTitle: { fontSize: "14px", fontWeight: "bold" },
  itemSub: { fontSize: "10px", opacity: 0.4 },
  itemRight: { paddingLeft: "10px" }
};
