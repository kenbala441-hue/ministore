import React, { useState, useMemo } from 'react';

const QUESTION_POOL = [
  {
    q: "Quel est le rôle principal de l'Admin Vault ?",
    choices: [
      "Stocker les séries",
      "Protéger les clés et rôles sensibles",
      "Afficher les statistiques",
      "Gérer le thème"
    ],
    answer: 1,
  },
  {
    q: "Que se passe-t-il en cas d'accès non autorisé au Vault ?",
    choices: [
      "Rien",
      "Suppression du compte",
      "Journalisation et alerte",
      "Redémarrage de l'app"
    ],
    answer: 2,
  },
  {
    q: "Pourquoi utiliser des traps anti-bot ?",
    choices: [
      "Pour ralentir l'app",
      "Pour piéger les scripts automatisés",
      "Pour améliorer le design",
      "Pour stocker les logs"
    ],
    answer: 1,
  },
  {
    q: "Un accès admin doit toujours être :",
    choices: [
      "Rapide",
      "Public",
      "Traçable et vérifiable",
      "Invisible"
    ],
    answer: 2,
  },
  {
    q: "Quelle est la meilleure pratique pour un accès critique ?",
    choices: [
      "Un simple mot de passe",
      "Aucune sécurité",
      "Plusieurs couches de validation",
      "Un bouton caché"
    ],
    answer: 2,
  },
  {
    q: "Qui peut autoriser un accès admin ?",
    choices: [
      "N'importe quel utilisateur",
      "Le système seul",
      "Un membre du conseil",
      "Un bot"
    ],
    answer: 2,
  },
  {
    q: "Pourquoi les challenges doivent-ils changer ?",
    choices: [
      "Pour le style",
      "Pour éviter les attaques répétées",
      "Pour ralentir l'admin",
      "Pour faire joli"
    ],
    answer: 1,
  },
  {
    q: "Que signifie une action irréversible ?",
    choices: [
      "Action annulable",
      "Action temporaire",
      "Action définitive",
      "Action visuelle"
    ],
    answer: 2,
  },
  {
    q: "Que doit faire un admin s'il ne connaît pas une réponse ?",
    choices: [
      "Deviner",
      "Forcer l'accès",
      "Contacter un membre du conseil",
      "Quitter l'app"
    ],
    answer: 2,
  },
  {
    q: "Pourquoi Comiccrafte utilise un système multi-écrans ?",
    choices: [
      "Pour compliquer",
      "Pour le design",
      "Pour compartimenter la sécurité",
      "Pour le marketing"
    ],
    answer: 2,
  },
];

export default function AdminChallenge({ setView }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Questions randomisées à chaque chargement
  const questions = useMemo(() => {
    return [...QUESTION_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
  }, []);

  const handleAnswer = (choiceIndex) => {
    if (choiceIndex === questions[index].answer) {
      setScore((s) => s + 1);
    }

    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const success = score >= 7;

    return (
      <div style={s.bg}>
        <div style={s.box}>
          {success ? (
            <>
              <h1 style={s.title}>FÉLICITATIONS</h1>
              <p style={s.text}>
                Vous avez fourni les codes requis et passé les écrans de validation.
              </p>
              <p style={s.text}>
                Comiccrafte peut désormais valider votre demande.
              </p>
              <p style={s.text}>
                L'accès au Vault est autorisé.
              </p>

              <button style={s.mainBtn} onClick={() => setView('admin_vault')}>
                ACCÉDER AU VAULT
              </button>
            </>
          ) : (
            <>
              <h1 style={s.fail}>ACCÈS REFUSÉ</h1>
              <p style={s.text}>
                Vous n'avez pas atteint le niveau requis.
              </p>
              <p style={s.text}>
                Veuillez contacter un membre du conseil qui vous a donné
                l'autorisation pour continuer.
              </p>
              <p style={s.footer}>merci @comiccrafte</p>

              <button style={s.exitBtn} onClick={() => setView('home')}>
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

        <p style={s.text}>
          Vous devez répondre à cette série de questions pour accéder à l'écran suivant.
          <br />
          Si vous n'en connaissez aucune, veuillez contacter un membre du conseil.
        </p>

        <p style={s.counter}>
          Question {index + 1} / {questions.length}
        </p>

        <h3 style={s.question}>{q.q}</h3>

        {q.choices.map((c, i) => (
          <button
            key={i}
            style={s.choiceBtn}
            onClick={() => handleAnswer(i)}
          >
            {c}
          </button>
        ))}

        <p style={s.footer}>merci @comiccrafte</p>
      </div>
    </div>
  );
}

const s = {
  bg: {
    minHeight: '100vh',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#0a0a0a',
    borderRadius: 18,
    padding: 30,
    maxWidth: 480,
    width: '100%',
    border: '1px solid #550000',
    textAlign: 'center',
  },
  title: {
    color: '#ff0000',
    letterSpacing: 2,
  },
  fail: {
    color: '#ff3b3b',
  },
  text: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 15,
  },
  counter: {
    fontSize: 11,
    color: '#666',
  },
  question: {
    color: '#fff',
    margin: '20px 0',
  },
  choiceBtn: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#111',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: 8,
    cursor: 'pointer',
  },
  mainBtn: {
    width: '100%',
    padding: 14,
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
  },
  exitBtn: {
    width: '100%',
    padding: 12,
    background: 'none',
    border: '1px solid #333',
    color: '#777',
    borderRadius: 8,
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    color: '#444',
  },
};