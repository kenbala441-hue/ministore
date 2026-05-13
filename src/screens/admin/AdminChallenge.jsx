import React, { useState, useEffect, useMemo } from "react";

const QUESTION_POOL = [
  {
    q: "Quel est le rôle principal de l'Admin Vault ?",
    choices: [
      "Stocker les séries",
      "Protéger les clés et rôles sensibles",
      "Afficher les statistiques",
      "Gérer le thème",
    ],
    answer: 1,
  },
  {
    q: "Que se passe-t-il en cas d'accès non autorisé au Vault ?",
    choices: [
      "Rien",
      "Suppression du compte",
      "Journalisation et alerte",
      "Redémarrage de l'app",
    ],
    answer: 2,
  },
  {
    q: "Pourquoi utiliser des traps anti-bot ?",
    choices: [
      "Pour ralentir l'app",
      "Pour piéger les scripts automatisés",
      "Pour améliorer le design",
      "Pour stocker les logs",
    ],
    answer: 1,
  },
  {
    q: "Un accès admin doit toujours être :",
    choices: ["Rapide", "Public", "Traçable et vérifiable", "Invisible"],
    answer: 2,
  },
  {
    q: "Quelle est la meilleure pratique pour un accès critique ?",
    choices: [
      "Un simple mot de passe",
      "Aucune sécurité",
      "Plusieurs couches de validation",
      "Un bouton caché",
    ],
    answer: 2,
  },
  {
    q: "Qui peut autoriser un accès admin ?",
    choices: [
      "N'importe quel utilisateur",
      "Le système seul",
      "Un membre du conseil",
      "Un bot",
    ],
    answer: 2,
  },
  {
    q: "Pourquoi les challenges doivent-ils changer ?",
    choices: [
      "Pour le style",
      "Pour éviter les attaques répétées",
      "Pour ralentir l'admin",
      "Pour faire joli",
    ],
    answer: 1,
  },
  {
    q: "Que signifie une action irréversible ?",
    choices: [
      "Action annulable",
      "Action temporaire",
      "Action définitive",
      "Action visuelle",
    ],
    answer: 2,
  },
  {
    q: "Que doit faire un admin s'il ne connaît pas une réponse ?",
    choices: [
      "Deviner",
      "Forcer l'accès",
      "Contacter un membre du conseil",
      "Quitter l'app",
    ],
    answer: 2,
  },
  {
    q: "Pourquoi Comiccrafte utilise un système multi-écrans ?",
    choices: [
      "Pour compliquer",
      "Pour le design",
      "Pour compartimenter la sécurité",
      "Pour le marketing",
    ],
    answer: 2,
  },

  // PIÈGE
  {
    q: "En JavaScript, lequel est STRICTEMENT égal ?",
    choices: ["=", "==", "===", "!="],
    answer: 2,
  },

  {
    q: "Quel port est utilisé par HTTPS ?",
    choices: ["80", "21", "443", "22"],
    answer: 2,
  },
  {
    q: "Une clé API doit être :",
    choices: [
      "Publique",
      "Partagée sur GitHub",
      "Stockée côté serveur",
      "Envoyée en clair",
    ],
    answer: 2,
  },
  {
    q: "Un token expiré doit être :",
    choices: ["Réutilisé", "Ignoré", "Renouvelé", "Supprimé visuellement"],
    answer: 2,
  },
  {
    q: "Une authentification forte inclut :",
    choices: [
      "Mot de passe simple",
      "2FA / MFA",
      "Nom d'utilisateur",
      "Captcha seulement",
    ],
    answer: 1,
  },
];

const MAX_ERRORS = 3;
const LOCK_TIME = 24 * 60 * 60 * 1000;

export default function AdminChallenge({ setView }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [errors, setErrors] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);

  useEffect(() => {
    const savedLock = parseInt(localStorage.getItem("challenge_lock"));
    if (savedLock && Date.now() < savedLock) {
      setLockUntil(savedLock);
    }
  }, []);

  const questions = useMemo(() => {
    return [...QUESTION_POOL]
      .sort(() => 0.5 - Math.random())
      .slice(0, 15);
  }, []);

  if (lockUntil && Date.now() < lockUntil) {
    const remaining = Math.ceil((lockUntil - Date.now()) / 1000);

    return (
      <div style={s.bg}>
        <div style={s.box}>
          <h1 style={s.fail}>ACCÈS SUSPENDU</h1>
          <p style={s.text}>
            Tentatives suspectes détectées. Accès verrouillé.
          </p>
          <p style={s.text}>Temps restant : {remaining}s</p>

          <button onClick={() => setView("home")} style={s.exitBtn}>
            QUITTER
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (choiceIndex) => {
    const isCorrect = choiceIndex === questions[index].answer;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);

      if (newErrors >= MAX_ERRORS) {
        const lock = Date.now() + LOCK_TIME;
        localStorage.setItem("challenge_lock", lock);
        setLockUntil(lock);
        return;
      }
    }

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      setFinalScore(newScore);
      setFinished(true);
    }
  };

  // PIÈGE BOUTON INVISIBLE
  const invisibleTrap = () => {
    const lock = Date.now() + LOCK_TIME;
    localStorage.setItem("challenge_lock", lock);
    setLockUntil(lock);
  };

  if (finished) {
    const success = finalScore >= 10;

    return (
      <div style={s.bg}>
        <div style={s.box}>
          {success ? (
            <>
              <h1 style={s.title}>ACCÈS AUTORISÉ</h1>
              <button
                style={s.mainBtn}
                onClick={() => setView("admin_vault")}
              >
                ACCÉDER AU VAULT
              </button>
            </>
          ) : (
            <>
              <h1 style={s.fail}>ACCÈS REFUSÉ</h1>
              <button style={s.exitBtn} onClick={() => setView("home")}>
                QUITTER
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div style={s.bg}>
      <div style={s.box}>
        <h1 style={s.title}>ADMIN CHALLENGE</h1>

        <p style={s.counter}>
          Question {index + 1} / {questions.length}
        </p>

        <h3 style={s.question}>{q.q}</h3>

        {q.choices.map((c, i) => (
          <button key={i} style={s.choiceBtn} onClick={() => handleAnswer(i)}>
            {c}
          </button>
        ))}

        {/* PIÈGE VISUEL ERREUR */}
        <p style={{ color: "#ff4444", fontSize: 11 }}>
          Erreurs: {errors === 0 ? "0" : errors === 1 ? "0" : errors}/{MAX_ERRORS}
        </p>

        {/* BOUTON INVISIBLE */}
        <div
          onClick={invisibleTrap}
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            bottom: 10,
            right: 10,
            opacity: 0,
          }}
        />

        <p style={s.footer}>merci @comiccrafte</p>
      </div>
    </div>
  );
}

const s = {
  bg: {
    minHeight: "100vh",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "#0a0a0a",
    borderRadius: 18,
    padding: 30,
    maxWidth: 480,
    width: "100%",
    border: "1px solid #550000",
    textAlign: "center",
    position: "relative",
  },
  title: {
    color: "#ff0000",
    letterSpacing: 2,
  },
  fail: {
    color: "#ff3b3b",
  },
  text: {
    fontSize: 13,
    color: "#ccc",
    marginBottom: 15,
  },
  counter: {
    fontSize: 11,
    color: "#666",
  },
  question: {
    color: "#fff",
    margin: "20px 0",
  },
  choiceBtn: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#111",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 8,
    cursor: "pointer",
  },
  mainBtn: {
    width: "100%",
    padding: 14,
    backgroundColor: "#ff0000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
  },
  exitBtn: {
    width: "100%",
    padding: 12,
    background: "none",
    border: "1px solid #333",
    color: "#777",
    borderRadius: 8,
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    color: "#444",
  },
};