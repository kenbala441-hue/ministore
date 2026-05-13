import React, { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  BadgeCheck,
  ChevronLeft,
  FileText,
  LockKeyhole,
  Scale,
  Sparkles,
  Eye,
  CheckCircle2,
  ScrollText,
  Fingerprint,
} from "lucide-react";

export default function AuthorContractScreen({ setView }) {
  const [accepted, setAccepted] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [warning, setWarning] = useState("");
  const [securityCheck, setSecurityCheck] = useState(false);
  const [humanConfirmed, setHumanConfirmed] = useState(false);

  const scrollRef = useRef(null);

  // 🔒 HONEYPOT BOT
  const [botTriggered, setBotTriggered] = useState(false);

  // 🔒 ANALYSE LECTURE
  useEffect(() => {
    const container = scrollRef.current;

    const handleScroll = () => {
      if (!container) return;

      const progress =
        (container.scrollTop /
          (container.scrollHeight - container.clientHeight)) *
        100;

      setReadProgress(progress);

      if (progress > 92) {
        setSecurityCheck(true);
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleContinue = () => {
    if (botTriggered) {
      setWarning(
        "Activité automatisée détectée. Vérification de sécurité échouée."
      );
      return;
    }

    if (!securityCheck) {
      setWarning(
        "Veuillez lire attentivement le contrat avant de continuer."
      );
      return;
    }

    if (!humanConfirmed) {
      setWarning(
        "Veuillez confirmer que vous avez lu les engagements."
      );
      return;
    }

    if (!accepted) {
      setWarning(
        "Vous devez accepter les conditions officielles."
      );
      return;
    }

    setView("author_submission");
  };

  return (
    <div style={s.wrapper}>
      {/* BG */}
      <div style={s.glowOne} />
      <div style={s.glowTwo} />
      <div style={s.glowThree} />

      {/* GRID */}
      <div style={s.grid} />

      {/* CARD */}
      <div style={s.card}>
        
        {/* TOP */}
        <div style={s.header}>
          <button
            onClick={() => setView("author_identity")}
            style={s.backBtn}
          >
            <ChevronLeft size={17} />
          </button>

          <div style={s.topIcon}>
            <Scale size={30} />
          </div>

          <div style={s.badge}>
            <Sparkles size={12} />
            <span>Contrat légal officiel ComicCrafte</span>
          </div>

          <h1 style={s.title}>
            Contrat <span style={s.accent}>Auteur Studio</span>
          </h1>

          <p style={s.subtitle}>
            Veuillez lire attentivement chaque article avant
            de poursuivre votre intégration au programme auteur.
          </p>
        </div>

        {/* SECURITY BOX */}
        <div style={s.securityBox}>
          <Fingerprint size={16} color="#00e0ff" />

          <span>
            Toutes les activités liées à cette interface peuvent
            être analysées automatiquement pour protéger la plateforme.
          </span>
        </div>

        {/* PROGRESS */}
        <div style={s.progressWrapper}>
          <div style={s.progressBar}>
            <div
              style={{
                ...s.progressFill,
                width: `${Math.min(readProgress, 100)}%`,
              }}
            />
          </div>

          <span style={s.progressText}>
            Lecture du contrat : {Math.floor(readProgress)}%
          </span>
        </div>

        {/* CONTRACT */}
        <div ref={scrollRef} style={s.contractBox}>
          
          <div style={s.section}>
            <div style={s.sectionTitle}>
              <FileText size={16} />
              <span>Préambule officiel</span>
            </div>

            <p style={s.paragraph}>
              En rejoignant le programme auteur ComicCrafte,
              vous reconnaissez avoir lu, compris et accepté
              l’intégralité des conditions légales, obligations,
              limitations de responsabilité et engagements liés
              à l’utilisation de la plateforme.
            </p>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>
              <ShieldCheck size={16} />
              <span>Articles et engagements</span>
            </div>

            <div style={s.rules}>
              {[
                "L’auteur garantit être propriétaire légal de toutes les œuvres publiées.",
                "L’auteur est seul responsable du contenu qu’il diffuse.",
                "ComicCrafte ne garantit aucun revenu minimum.",
                "La visibilité dépend des systèmes algorithmiques internes.",
                "Le studio peut limiter la portée d’un contenu selon l’intérêt du public.",
                "Tout contenu illégal peut être supprimé sans préavis.",
                "Les œuvres peuvent être modérées automatiquement ou manuellement.",
                "L’auteur accepte les politiques internationales liées au numérique.",
                "ComicCrafte ne peut être tenu responsable des réactions du public.",
                "Toute fraude ou tentative de manipulation entraînera des sanctions.",
                "Les faux comptes ou systèmes automatisés sont interdits.",
                "L’auteur accepte les politiques anti-harcèlement et anti-haine.",
                "Les contenus extrêmes ou dangereux sont interdits.",
                "ComicCrafte peut suspendre un compte pour activité suspecte.",
                "L’auteur accepte les mises à jour futures des conditions.",
                "Le studio peut utiliser des données analytiques afin d’améliorer les services.",
                "Les données peuvent être utilisées pour personnaliser les recommandations.",
                "L’auteur accepte les règles liées à la propriété intellectuelle.",
                "Toute tentative de piratage entraînera un bannissement définitif.",
                "ComicCrafte peut coopérer avec les autorités compétentes.",
                "L’auteur s’engage à respecter les lois de son pays.",
                "Le studio ne garantit pas une disponibilité permanente des services.",
                "Les contenus peuvent être supprimés après signalement légal.",
                "L’auteur accepte les systèmes de sécurité automatisés.",
                "Les revenus peuvent varier selon les performances du contenu.",
                "ComicCrafte peut limiter certaines fonctionnalités selon les régions.",
                "L’auteur accepte les systèmes anti-bot et anti-fraude.",
                "Tout litige reste sous la responsabilité de l’auteur.",
                "ComicCrafte peut refuser une candidature sans justification.",
                "L’auteur confirme que les informations fournies sont exactes.",
                "Les publications peuvent être analysées par IA de modération.",
                "Le studio peut suspendre un contenu en attente de vérification.",
                "Toute violation grave peut entraîner des poursuites légales.",
                "Les contenus sexuels illégaux ou violents sont interdits.",
                "Les systèmes automatisés peuvent détecter les comportements suspects.",
                "ComicCrafte ne peut être tenu responsable d’un manque de visibilité.",
                "Le studio peut modifier les algorithmes à tout moment.",
                "L’auteur accepte les règles de confidentialité internationales.",
                "Toute tentative de contournement sécurité est interdite.",
                "Le studio conserve des journaux de sécurité pour protection juridique.",
              ].map((rule, index) => (
                <div key={index} style={s.rule}>
                  <CheckCircle2 size={14} color="#00e0ff" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>
              <LockKeyhole size={16} />
              <span>Clause de responsabilité</span>
            </div>

            <p style={s.paragraph}>
              L’auteur reconnaît être l’unique responsable des
              œuvres, publications, commentaires, médias et activités
              associés à son compte. ComicCrafte agit uniquement
              comme plateforme de diffusion numérique.
            </p>

            <p style={s.paragraph}>
              En cas de poursuite juridique, réclamation de droits,
              violation de copyright, plainte ou litige, l’auteur
              accepte d’assumer seul les responsabilités légales,
              civiles et financières associées à son contenu.
            </p>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>
              <Eye size={16} />
              <span>Analyse et sécurité</span>
            </div>

            <p style={s.paragraph}>
              Afin de protéger les accès auteurs et l’intégrité
              du studio, ComicCrafte utilise différents systèmes
              de sécurité incluant l’analyse comportementale,
              les limitations de requêtes, les journaux d’activité,
              les systèmes anti-bot et les mécanismes de détection
              automatisée.
            </p>
          </div>

          {/* HONEYPOT */}
          <button
            onClick={() => {
              setBotTriggered(true);
              setWarning(
                "Violation sécurité détectée."
              );
            }}
            style={{
              position: "absolute",
              opacity: 0,
              width: "2px",
              height: "2px",
              pointerEvents: "auto",
              top: "12%",
              left: "8%",
            }}
          />
        </div>

        {/* CHECKS */}
        <div style={s.checks}>
          <label style={s.check}>
            <input
              type="checkbox"
              checked={humanConfirmed}
              onChange={() =>
                setHumanConfirmed(!humanConfirmed)
              }
            />

            <span>
              Je confirme avoir lu attentivement les articles.
            </span>
          </label>

          <label style={s.check}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            />

            <span>
              J’accepte les engagements légaux et les conditions.
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

        {/* FOOTER */}
        <div style={s.footer}>
          <button
            onClick={handleContinue}
            style={{
              ...s.continueBtn,
              opacity:
                accepted &&
                humanConfirmed &&
                securityCheck
                  ? 1
                  : 0.7,
            }}
          >
            Continuer
          </button>

          <p style={s.footerText}>
            En poursuivant, vous confirmez avoir pris
            connaissance des engagements légaux du studio.
          </p>
        </div>
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
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Inter', sans-serif",
  },

  glowOne: {
    position: "absolute",
    width: "340px",
    height: "340px",
    background: "#00e0ff",
    filter: "blur(160px)",
    opacity: 0.12,
    top: "-100px",
    left: "-120px",
  },

  glowTwo: {
    position: "absolute",
    width: "340px",
    height: "340px",
    background: "#7a5cff",
    filter: "blur(160px)",
    opacity: 0.12,
    bottom: "-120px",
    right: "-120px",
  },

  glowThree: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "#ff0080",
    filter: "blur(160px)",
    opacity: 0.08,
    top: "35%",
    left: "50%",
    transform: "translateX(-50%)",
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
    maxWidth: "850px",
    background: "rgba(10,12,18,0.9)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "32px",
    padding: "28px",
    backdropFilter: "blur(24px)",
    position: "relative",
    zIndex: 2,
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
  },

  header: {
    textAlign: "center",
    position: "relative",
    marginBottom: "22px",
  },

  backBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  topIcon: {
    width: "82px",
    height: "82px",
    borderRadius: "24px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(0,224,255,0.14), rgba(122,92,255,0.14))",
    color: "#00e0ff",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 50px rgba(0,224,255,0.15)",
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
    marginBottom: "18px",
  },

  title: {
    color: "#fff",
    fontSize: "34px",
    fontWeight: "900",
    margin: "0 0 10px",
  },

  accent: {
    background: "linear-gradient(90deg,#00e0ff,#7a5cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "13px",
    lineHeight: 1.7,
    maxWidth: "560px",
    margin: "0 auto",
  },

  securityBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px",
    borderRadius: "16px",
    background: "rgba(0,224,255,0.05)",
    border: "1px solid rgba(0,224,255,0.12)",
    color: "#d9e2f2",
    fontSize: "12px",
    lineHeight: 1.6,
    marginBottom: "18px",
  },

  progressWrapper: {
    marginBottom: "18px",
  },

  progressBar: {
    width: "100%",
    height: "6px",
    borderRadius: "999px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.06)",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg,#00e0ff,#7a5cff,#ff0080)",
    borderRadius: "999px",
    transition: "0.3s",
  },

  progressText: {
    display: "block",
    marginTop: "8px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.45)",
    textAlign: "right",
  },

  contractBox: {
    height: "420px",
    overflowY: "auto",
    padding: "22px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "22px",
    position: "relative",
  },

  section: {
    marginBottom: "26px",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "800",
    marginBottom: "14px",
  },

  paragraph: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    lineHeight: 1.9,
  },

  rules: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  rule: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    color: "#dbe4f5",
    fontSize: "12px",
    lineHeight: 1.7,
    background: "rgba(255,255,255,0.025)",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.04)",
  },

  checks: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  check: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#dbe4f5",
    fontSize: "13px",
  },

  warning: {
    marginTop: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,80,80,0.08)",
    border: "1px solid rgba(255,80,80,0.18)",
    color: "#ff8080",
    padding: "14px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: "700",
  },

  footer: {
    marginTop: "24px",
  },

  continueBtn: {
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

  footerText: {
    marginTop: "14px",
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    fontSize: "11px",
    lineHeight: 1.7,
  },
};