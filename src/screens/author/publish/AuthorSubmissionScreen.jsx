import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  ImagePlus,
  Eye,
  Lock,
  Globe,
  Tag,
  Layers3,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

import { db } from "../../../firebase/index.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUserContext } from "../../users/userContext";

export default function AuthorSubmissionScreen({ setView }) {
  const { user } = useUserContext();

  const isAuthor = user?.role === "author";

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [chapter, setChapter] = useState("");

  const [genre, setGenre] = useState("Fantasy");
  const [visibility, setVisibility] = useState("Public");
  const [language, setLanguage] = useState("Français");

  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  const [agreement, setAgreement] = useState(false);

  const wordCount = useMemo(() => {
    return chapter.trim()
      ? chapter.trim().split(/\s+/).length
      : 0;
  }, [chapter]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthor) {
      setWarning(
        "Votre compte ne possède pas les autorisations auteur."
      );
      return;
    }

    if (!title || !synopsis || !chapter) {
      setWarning(
        "Veuillez remplir tous les champs obligatoires."
      );
      return;
    }

    if (!agreement) {
      setWarning(
        "Veuillez accepter les règles de publication."
      );
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "stories"), {
        title,
        synopsis,
        content: chapter,

        genre,
        visibility,
        language,

        author: user.username,
        authorId: user.uid,
        role: user.role,

        likes: 0,
        views: 0,
        comments: 0,

        verified: false,
        featured: false,
        moderationStatus: "pending_review",

        chaptersCount: 1,

        status: "published",

        createdAt: serverTimestamp(),
      });

      setTitle("");
      setSynopsis("");
      setChapter("");

      setWarning("");

      alert("Publication envoyée avec succès.");

      setView("author_dashboard");

    } catch (error) {
      console.error(error);

      setWarning(
        "Une erreur est survenue pendant la publication."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrapper}>
      
      {/* BG */}
      <div style={s.glowOne} />
      <div style={s.glowTwo} />
      <div style={s.grid} />

      {/* CARD */}
      <div style={s.card}>
        
        {/* HEADER */}
        <div style={s.header}>
          
          <button
            style={s.backBtn}
            onClick={() => setView("author_dashboard")}
          >
            <ArrowLeft size={16} />
          </button>

          <div style={s.logo}>
            <BookOpen size={32} />
          </div>

          <div style={s.badge}>
            <Sparkles size={12} />
            <span>ComicCrafte Studio</span>
          </div>

          <h1 style={s.title}>
            Publication <span style={s.accent}>Auteur</span>
          </h1>

          <p style={s.subtitle}>
            Publiez votre histoire dans l’univers ComicCrafte
            et soumettez votre contenu à l’analyse du studio.
          </p>
        </div>

        {/* SECURITY */}
        <div style={s.securityBox}>
          <ShieldCheck size={16} color="#00e0ff" />

          <span>
            Toutes les publications peuvent être analysées,
            modérées ou limitées selon les politiques du studio.
          </span>
        </div>

        {/* STATUS */}
        <div style={s.statusRow}>
          
          <div style={s.statusCard}>
            <Eye size={16} color="#00e0ff" />
            <div>
              <h4 style={s.statusTitle}>Visibilité</h4>
              <p style={s.statusText}>
                Contrôle de diffusion intelligent
              </p>
            </div>
          </div>

          <div style={s.statusCard}>
            <Lock size={16} color="#8b5cf6" />
            <div>
              <h4 style={s.statusTitle}>Protection</h4>
              <p style={s.statusText}>
                Sécurité et modération active
              </p>
            </div>
          </div>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          
          {/* TITLE */}
          <div style={s.inputBox}>
            <div style={s.label}>
              <FileText size={15} />
              <span>Titre de l’histoire</span>
            </div>

            <motion.input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Les Héritiers de l’Oubli"
              style={s.input}
              whileFocus={{ scale: 1.01 }}
              maxLength={120}
            />

            <div style={s.bottomInfo}>
              <span>Titre principal</span>
              <span>{title.length}/120</span>
            </div>
          </div>

          {/* SYNOPSIS */}
          <div style={s.inputBox}>
            <div style={s.label}>
              <BookOpen size={15} />
              <span>Synopsis</span>
            </div>

            <motion.textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Décrivez brièvement votre univers..."
              style={s.textarea}
              rows={5}
              whileFocus={{ scale: 1.01 }}
            />

            <div style={s.bottomInfo}>
              <span>Présentation publique</span>
              <span>{synopsis.length} caractères</span>
            </div>
          </div>

          {/* OPTIONS */}
          <div style={s.optionsGrid}>
            
            <div style={s.optionBox}>
              <div style={s.label}>
                <Tag size={14} />
                <span>Genre</span>
              </div>

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                style={s.select}
              >
                <option>Fantasy</option>
                <option>Action</option>
                <option>Mystère</option>
                <option>Horreur</option>
                <option>Romance</option>
                <option>Science-fiction</option>
              </select>
            </div>

            <div style={s.optionBox}>
              <div style={s.label}>
                <Globe size={14} />
                <span>Visibilité</span>
              </div>

              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                style={s.select}
              >
                <option>Public</option>
                <option>Privé</option>
                <option>Brouillon</option>
              </select>
            </div>

            <div style={s.optionBox}>
              <div style={s.label}>
                <Layers3 size={14} />
                <span>Langue</span>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={s.select}
              >
                <option>Français</option>
                <option>English</option>
                <option>日本語</option>
              </select>
            </div>

          </div>

          {/* CHAPTER */}
          <div style={s.inputBox}>
            <div style={s.label}>
              <UploadCloud size={15} />
              <span>Chapitre 1</span>
            </div>

            <motion.textarea
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Commencez votre histoire..."
              style={s.chapterArea}
              rows={14}
              whileFocus={{ scale: 1.005 }}
            />

            <div style={s.bottomInfo}>
              <span>{wordCount} mots</span>
              <span>Analyse automatique active</span>
            </div>
          </div>

          {/* COVER */}
          <div style={s.coverBox}>
            <div style={s.coverIcon}>
              <ImagePlus size={18} />
            </div>

            <div>
              <h4 style={s.coverTitle}>
                Ajouter une couverture
              </h4>

              <p style={s.coverText}>
                Les couvertures améliorent la visibilité
                de votre histoire sur ComicCrafte.
              </p>
            </div>

            <button
              type="button"
              style={s.coverBtn}
            >
              Importer
            </button>
          </div>

          {/* RULES */}
          <div style={s.rulesBox}>
            <div style={s.rule}>
              <CheckCircle2 size={14} color="#00e0ff" />
              <span>
                Vous confirmez être propriétaire du contenu publié.
              </span>
            </div>

            <div style={s.rule}>
              <CheckCircle2 size={14} color="#00e0ff" />
              <span>
                Le studio peut limiter la visibilité du contenu.
              </span>
            </div>

            <div style={s.rule}>
              <CheckCircle2 size={14} color="#00e0ff" />
              <span>
                Les contenus peuvent être analysés automatiquement.
              </span>
            </div>

            <label style={s.checkbox}>
              <input
                type="checkbox"
                checked={agreement}
                onChange={() => setAgreement(!agreement)}
              />

              <span>
                J’accepte les politiques de publication ComicCrafte.
              </span>
            </label>
          </div>

          {/* WARNING */}
          {warning && (
            <div style={s.warning}>
              <AlertTriangle size={15} />
              <span>{warning}</span>
            </div>
          )}

          {/* ACTIONS */}
          <div style={s.actions}>
            
            <motion.button
              type="submit"
              disabled={loading}
              style={{
                ...s.publishBtn,
                opacity: loading ? 0.7 : 1,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading
                ? "Publication..."
                : "Publier maintenant"}
            </motion.button>

            <button
              type="button"
              style={s.secondaryBtn}
              onClick={() =>
                setView("publish_chapter")
              }
            >
              <span>Publier un chapitre</span>

              <ChevronRight size={15} />
            </button>

            <button
              type="button"
              style={s.secondaryBtn}
              onClick={() =>
                setView("author_dashboard")
              }
            >
              Retour Dashboard
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: "100vh",
    background: "#05070d",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },

  glowOne: {
    position: "absolute",
    width: "340px",
    height: "340px",
    background: "#00e0ff",
    filter: "blur(180px)",
    opacity: 0.12,
    top: "-120px",
    left: "-120px",
  },

  glowTwo: {
    position: "absolute",
    width: "340px",
    height: "340px",
    background: "#7a5cff",
    filter: "blur(180px)",
    opacity: 0.12,
    bottom: "-120px",
    right: "-120px",
  },

  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "45px 45px",
  },

  card: {
    width: "100%",
    maxWidth: "860px",
    background: "rgba(10,12,18,0.92)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "34px",
    padding: "30px",
    position: "relative",
    zIndex: 2,
    backdropFilter: "blur(24px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
  },

  header: {
    textAlign: "center",
    marginBottom: "24px",
    position: "relative",
  },

  backBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  logo: {
    width: "86px",
    height: "86px",
    borderRadius: "24px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00e0ff",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.14), rgba(122,92,255,0.14))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 50px rgba(0,224,255,0.16)",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#cfd6e4",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "16px",
  },

  title: {
    color: "#fff",
    fontSize: "34px",
    fontWeight: "900",
    margin: "0 0 12px",
  },

  accent: {
    background:
      "linear-gradient(90deg,#00e0ff,#7a5cff,#ff0080)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "rgba(255,255,255,0.68)",
    fontSize: "13px",
    lineHeight: 1.7,
    maxWidth: "580px",
    margin: "0 auto",
  },

  securityBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(0,224,255,0.05)",
    border: "1px solid rgba(0,224,255,0.12)",
    padding: "14px",
    borderRadius: "16px",
    marginBottom: "18px",
    color: "#d9e2f2",
    fontSize: "12px",
    lineHeight: 1.6,
  },

  statusRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "22px",
  },

  statusCard: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "14px",
    borderRadius: "18px",
  },

  statusTitle: {
    color: "#fff",
    fontSize: "13px",
    margin: 0,
  },

  statusText: {
    margin: "4px 0 0",
    color: "rgba(255,255,255,0.5)",
    fontSize: "11px",
  },

  inputBox: {
    marginBottom: "20px",
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    color: "#d9e2f2",
    fontSize: "12px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    height: "58px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    padding: "0 18px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    padding: "16px",
    outline: "none",
    resize: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  chapterArea: {
    width: "100%",
    borderRadius: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    padding: "18px",
    outline: "none",
    resize: "vertical",
    minHeight: "320px",
    fontSize: "14px",
    lineHeight: 1.8,
    boxSizing: "border-box",
  },

  bottomInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    color: "rgba(255,255,255,0.35)",
    fontSize: "10px",
    fontWeight: "600",
  },

  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: "14px",
    marginBottom: "22px",
  },

  optionBox: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "14px",
    borderRadius: "18px",
  },

  select: {
    width: "100%",
    height: "48px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#111827",
    color: "#fff",
    padding: "0 12px",
    outline: "none",
    marginTop: "10px",
  },

  coverBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "20px",
  },

  coverIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.14), rgba(122,92,255,0.14))",
    color: "#00e0ff",
  },

  coverTitle: {
    color: "#fff",
    margin: 0,
    fontSize: "13px",
  },

  coverText: {
    margin: "4px 0 0",
    color: "rgba(255,255,255,0.45)",
    fontSize: "11px",
  },

  coverBtn: {
    marginLeft: "auto",
    height: "42px",
    padding: "0 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  rulesBox: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "18px",
    borderRadius: "20px",
    marginBottom: "20px",
  },

  rule: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    color: "#d9e2f2",
    fontSize: "12px",
    marginBottom: "12px",
    lineHeight: 1.6,
  },

  checkbox: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "16px",
    color: "#fff",
    fontSize: "12px",
  },

  warning: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,80,80,0.08)",
    border: "1px solid rgba(255,80,80,0.18)",
    padding: "14px",
    borderRadius: "16px",
    color: "#ff8080",
    fontSize: "12px",
    marginBottom: "18px",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  publishBtn: {
    width: "100%",
    height: "58px",
    border: "none",
    borderRadius: "18px",
    background:
      "linear-gradient(90deg,#00e0ff,#7a5cff,#ff0080)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 40px rgba(0,224,255,0.18)",
  },

  secondaryBtn: {
    width: "100%",
    height: "54px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
  },
};