// src/screens/author/AuthorTermsScreen.jsx

import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Globe,
  FileText,
  Eye,
  Database,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function AuthorTermsScreen({ setView }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (!accepted) return;
    // On dirige vers le contrat, pas directement vers le dashboard
    setView("author_contract"); 
  };

  const rules = [
    "ComicCrafte peut modérer, restreindre ou supprimer une publication jugée contraire aux règles du studio.",
    "Le studio peut limiter la visibilité d’un contenu selon l’intérêt du public, les performances ou les signalements.",
    "L’auteur confirme que son œuvre est originale et ne viole aucun droit d’auteur international.",
    "Toute tentative de plagiat peut entraîner un bannissement définitif.",
    "ComicCrafte n’est pas responsable des interprétations faites par les lecteurs concernant une œuvre publiée.",
    "Les contenus haineux, extrémistes ou discriminatoires sont interdits.",
    "Les contenus violents ou sensibles peuvent être restreints selon l’âge du public.",
    "ComicCrafte peut suspendre un compte en cas d’activité suspecte ou frauduleuse.",
    "Les œuvres publiées peuvent être utilisées pour promouvoir la plateforme.",
    "Le studio peut modifier l’affichage d’un contenu pour des raisons techniques ou marketing.",
    "Les statistiques affichées peuvent être ajustées ou recalculées automatiquement.",
    "L’auteur accepte que les données de navigation soient utilisées pour personnaliser les recommandations.",
    "ComicCrafte collecte certaines données afin d’améliorer l’expérience utilisateur.",
    "Les contenus trompeurs ou générés pour manipuler l’algorithme sont interdits.",
    "Le studio peut modifier ses règles à tout moment sans notification obligatoire.",
    "L’auteur reste responsable légalement du contenu publié sous son compte.",
    "Les comptes inactifs peuvent être archivés ou limités.",
    "Les signalements de la communauté peuvent entraîner une vérification du contenu.",
    "ComicCrafte peut retirer une œuvre en cas de conflit juridique.",
    "Les publications peuvent être analysées automatiquement par des systèmes de sécurité.",
    "Les faux comptes ou identités fictives destinées à frauder sont interdits.",
    "Le studio peut recommander ou non une œuvre selon les tendances et la qualité perçue.",
    "Les contenus sexuels explicites ou illégaux sont interdits.",
    "Les auteurs doivent respecter les lois locales et internationales concernant les droits numériques.",
    "ComicCrafte peut désactiver certaines fonctionnalités selon la région ou le pays.",
    "Les contenus liés à la désinformation peuvent être restreints.",
    "Le studio peut limiter la monétisation selon les performances et le respect des règles.",
    "Les contenus publiés peuvent apparaître dans les recommandations automatiques.",
    "L’auteur accepte que certaines données soient utilisées pour améliorer les services IA et les suggestions.",
    "Toute violation grave peut entraîner la suppression définitive du compte sans remboursement.",
  ];

  return (
    <div style={s.wrapper}>
      {/* BACKGROUND */}
      <div style={s.bgGlowOne} />
      <div style={s.bgGlowTwo} />

      {/* HEADER */}
      <div style={s.hero}>
        <div style={s.heroIcon}>
          <ShieldCheck size={34} />
        </div>

        <h1 style={s.title}>
          Conditions & Règles <span style={s.accent}>ComicCrafte</span>
        </h1>

        <p style={s.subtitle}>
          Prenez le temps de lire attentivement les règles du studio avant
          d’accéder au programme auteur.
        </p>

        <div style={s.notice}>
          <AlertTriangle size={16} />
          <span>
            En continuant, vous confirmez comprendre et accepter les politiques
            de publication, de visibilité et de sécurité du studio.
          </span>
        </div>
      </div>

      {/* TERMS BOX */}
      <div style={s.card}>
        {/* TOP INFO */}
        <div style={s.topInfos}>
          <div style={s.infoBox}>
            <Globe size={18} />
            <span>Règles internationales</span>
          </div>

          <div style={s.infoBox}>
            <Lock size={18} />
            <span>Protection & sécurité</span>
          </div>

          <div style={s.infoBox}>
            <Database size={18} />
            <span>Données & recommandations</span>
          </div>
        </div>

        {/* INTRO */}
        <div style={s.intro}>
          <FileText size={18} color="#00e0ff" />
          <p>
            ComicCrafte applique des standards de sécurité et de modération
            similaires aux grandes plateformes internationales afin de protéger
            les auteurs, les lecteurs et le studio.
          </p>
        </div>

        {/* RULES */}
        <div style={s.rulesContainer}>
          {rules.map((rule, index) => (
            <div key={index} style={s.ruleItem}>
              <div style={s.ruleIndex}>
                {String(index + 1).padStart(2, "0")}
              </div>

              <div style={s.ruleText}>
                <ChevronRight size={14} color="#00e0ff" />
                <span>{rule}</span>
              </div>
            </div>
          ))}
        </div>

        {/* DATA SECTION */}
        <div style={s.dataBox}>
          <Eye size={18} color="#00e0ff" />

          <div>
            <h3 style={s.dataTitle}>Utilisation des données</h3>

            <p style={s.dataText}>
              ComicCrafte peut récupérer certaines données d’activité afin de
              proposer du contenu adapté, améliorer les recommandations,
              renforcer la sécurité et personnaliser l’expérience utilisateur.
            </p>
          </div>
        </div>

        {/* ACCEPT */}
        <div style={s.acceptBox}>
          <label style={s.checkboxLabel}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              style={s.checkbox}
            />

            <div style={s.customCheck}>
              {accepted && <CheckCircle2 size={18} />}
            </div>

            <span style={s.acceptText}>
              J’ai lu et accepté les règles du studio ComicCrafte.
            </span>
          </label>

          <button
            disabled={!accepted}
            onClick={handleAccept}
            style={{
              ...s.button,
              opacity: accepted ? 1 : 0.5,
              cursor: accepted ? "pointer" : "not-allowed",
            }}
          >
            Continuer vers l’espace auteur
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: "100vh",
    background: "#05070d",
    position: "relative",
    overflow: "hidden",
    padding: "25px 16px 60px",
    fontFamily: "'Inter', sans-serif",
    color: "#fff",
  },

  bgGlowOne: {
    position: "absolute",
    top: "-120px",
    left: "-100px",
    width: "300px",
    height: "300px",
    background: "#00e0ff",
    filter: "blur(140px)",
    opacity: 0.15,
  },

  bgGlowTwo: {
    position: "absolute",
    bottom: "-120px",
    right: "-100px",
    width: "300px",
    height: "300px",
    background: "#7a5cff",
    filter: "blur(140px)",
    opacity: 0.16,
  },

  hero: {
    position: "relative",
    zIndex: 2,
    maxWidth: "760px",
    margin: "0 auto 20px",
    textAlign: "center",
  },

  heroIcon: {
    width: "72px",
    height: "72px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.18), rgba(122,92,255,0.18))",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    color: "#00e0ff",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 40px rgba(0,224,255,0.15)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "10px",
    lineHeight: 1.2,
  },

  accent: {
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.7)",
    maxWidth: "520px",
    margin: "0 auto",
    lineHeight: 1.6,
  },

  notice: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#d6d6d6",
    fontSize: "13px",
    lineHeight: 1.5,
    backdropFilter: "blur(20px)",
  },

  card: {
    position: "relative",
    zIndex: 2,
    maxWidth: "760px",
    margin: "0 auto",
    borderRadius: "30px",
    padding: "22px",
    background: "rgba(12,14,22,0.88)",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(24px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
  },

  topInfos: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "10px",
    marginBottom: "22px",
  },

  infoBox: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#d6d6d6",
    fontSize: "12px",
    fontWeight: "600",
  },

  intro: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    background: "rgba(0,224,255,0.05)",
    border: "1px solid rgba(0,224,255,0.1)",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "22px",
    color: "#cfd6e4",
    lineHeight: 1.7,
    fontSize: "13px",
  },

  rulesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  ruleItem: {
    display: "flex",
    gap: "14px",
    padding: "14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  ruleIndex: {
    minWidth: "38px",
    height: "38px",
    borderRadius: "12px",
    background: "rgba(0,224,255,0.08)",
    border: "1px solid rgba(0,224,255,0.2)",
    color: "#00e0ff",
    fontWeight: "800",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  ruleText: {
    display: "flex",
    gap: "10px",
    fontSize: "13px",
    lineHeight: 1.6,
    color: "#d5d9e5",
  },

  dataBox: {
    marginTop: "24px",
    padding: "18px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.07), rgba(122,92,255,0.07))",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },

  dataTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "800",
    marginBottom: "6px",
  },

  dataText: {
    margin: 0,
    color: "#c6cedf",
    fontSize: "13px",
    lineHeight: 1.7,
  },

  acceptBox: {
    marginTop: "28px",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    marginBottom: "20px",
  },

  checkbox: {
    display: "none",
  },

  customCheck: {
    minWidth: "24px",
    height: "24px",
    borderRadius: "8px",
    border: "1px solid rgba(0,224,255,0.4)",
    background: "rgba(0,224,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00e0ff",
  },

  acceptText: {
    fontSize: "13px",
    lineHeight: 1.5,
    color: "#d5d9e5",
  },

  button: {
    width: "100%",
    height: "54px",
    borderRadius: "18px",
    border: "none",
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "800",
    letterSpacing: "0.4px",
    boxShadow: "0 10px 30px rgba(0,224,255,0.18)",
    transition: "0.3s",
  },
};