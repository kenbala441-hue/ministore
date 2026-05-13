import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Target, Zap } from "lucide-react";
import "./AuthorIntroScreen.css";
import { useUserContext } from "../../users/userContext";

export default function AuthorIntroScreen({ setView }) {
  const { user } = useUserContext();

  const handleAccessClick = () => {
    if (user?.role === "studio_member" && user?.studioActivated) {
      setView("studio_activated");
    } else {
      setView("author_access");
    }
  };

  /* 🎬 Animation parent (stagger) */
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  /* 🎬 Animation enfant */
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="intro-container">

      {/* 🔙 BACK */}
      <motion.button 
        className="back-arrow"
        onClick={() => setView("home")}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={22} />
      </motion.button>

      {/* 🔥 BACKGROUND FX */}
      <div className="neon-bg">
        <motion.div 
          className="orb orb-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="orb orb-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 💎 CONTENT */}
      <motion.div
        className="intro-content"
        variants={container}
        initial="hidden"
        animate="show"
      >

        {/* BADGE */}
        <motion.div className="badge" variants={item}>
          <Sparkles size={14} />
          <span>RECRUTEMENT OUVERT</span>
        </motion.div>

        {/* 🔥 TITRE */}
        <motion.h1 className="intro-title" variants={item}>
          Transforme ton <span>imagination</span><br />
          en pouvoir réel.
        </motion.h1>

        {/* 💬 TEXTE */}
        <motion.p className="intro-text" variants={item}>
          Crée ton univers. Construis ta communauté.  
          Génère des revenus avec tes histoires.  
          <strong>ComicCrafte</strong> te donne les outils…  
          à toi de créer la légende.
        </motion.p>

        {/* 🚀 FEATURES */}
        <motion.div className="features" variants={item}>
          <motion.div 
            className="feature"
            whileHover={{ scale: 1.08 }}
          >
            <Target size={18} />
            <span>Audience ciblée</span>
          </motion.div>

          <motion.div 
            className="feature"
            whileHover={{ scale: 1.08 }}
          >
            <Zap size={18} />
            <span>Monétisation directe</span>
          </motion.div>
        </motion.div>

        {/* 🎯 BUTTONS */}
        <motion.div className="intro-buttons" variants={item}>
          <motion.button
            onClick={handleAccessClick}
            className="btn-primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            🔑 Carte d'accès
          </motion.button>

          <motion.button
            onClick={() => setView("author_apply")}
            className="btn-secondary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Devenir Auteur
          </motion.button>
        </motion.div>

        {/* FOOTER */}
        <motion.p 
          className="footer"
          variants={item}
          whileHover={{ opacity: 1 }}
          onClick={() => setView("home")}
        >
          Peut-être plus tard...
        </motion.p>

      </motion.div>
    </div>
  );
}