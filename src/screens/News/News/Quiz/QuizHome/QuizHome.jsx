import React, { useState, useEffect } from 'react';
import { QUIZ_CATEGORIES } from './quizData';

const QuizHome = ({ onExit }) => {
  // ÉTAT : null = Menu principal, sinon = Objet du Quiz sélectionné
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  // ÉTATS DU JEU (Moteur interne)
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);

  // --- LOGIQUE DU TIMER ---
  useEffect(() => {
    let timer;
    if (selectedQuiz && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (selectedQuiz && timeLeft === 0) {
      handleNext(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, selectedQuiz]);

  // --- LOGIQUE DU JEU ---
  const handleNext = (isCorrect) => {
    const points = selectedQuiz.pointsPerQ || 50;
    const newScore = isCorrect ? score + points : score;

    if (currentStep + 1 < selectedQuiz.questions.length) {
      setScore(newScore);
      setCurrentStep(currentStep + 1);
      setTimeLeft(15);
    } else {
      alert(`Terminé ! Score : ${newScore} Ink`);
      resetGame();
    }
  };

  const resetGame = () => {
    setSelectedQuiz(null);
    setCurrentStep(0);
    setTimeLeft(15);
    setScore(0);
  };

  // --- RENDU 1 : ÉCRAN DE JEU (Si un quiz est choisi) ---
  if (selectedQuiz) {
    const question = selectedQuiz.questions[currentStep];
    return (
      <div style={s.container}>
        <div style={s.header}>
          <button onClick={resetGame} style={s.closeBtn}>✕</button>
          <div style={s.timerCircle}>{timeLeft}s</div>
          <div style={s.inkBadge}>{score} Ink</div>
        </div>
        <div style={s.cardGame}>
          <div style={s.step}>QUESTION {currentStep + 1}/{selectedQuiz.questions.length}</div>
          <h2 style={s.questionText}>{question.q}</h2>
          <div style={s.optionsGrid}>
            {question.options.map((opt, i) => (
              <button key={i} style={s.optionBtn} onClick={() => handleNext(i === question.correct)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDU 2 : MENU PRINCIPAL (HUB) ---
  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={onExit} style={s.closeBtn}>✕</button>
        <h1 style={s.mainTitle}>QUIZ <span style={s.neon}>HUB</span></h1>
        <div style={s.userInk}>Mon Ink: <span style={s.neon}>500</span></div>
      </div>

      <p style={s.sectionLabel}>CHOISIS TON MODE DE JEU</p>
      
      <div style={s.grid}>
        {QUIZ_CATEGORIES.map((quiz) => (
          <div key={quiz.id} style={s.cardMenu} onClick={() => setSelectedQuiz(quiz)}>
            <div style={s.cardImageContainer}>
               <img src={quiz.image} style={s.cardImg} alt={quiz.title} />
               <div style={s.difficultyTag}>{quiz.difficulty}</div>
            </div>
            <div style={s.cardContent}>
              <h3 style={s.cardTitle}>{quiz.title}</h3>
              <p style={s.cardSub}>{quiz.questions.length} Q • {quiz.pointsPerQ} Ink/rép</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const s = {
  container: { position: 'fixed', inset: 0, backgroundColor: '#000', zIndex: 2000, padding: '20px', overflowY: 'auto', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' },
  mainTitle: { color: '#fff', fontSize: '22px', fontWeight: 'bold' },
  neon: { color: '#a855f7', textShadow: '0 0 10px #a855f7' },
  userInk: { fontSize: '12px', color: '#666' },
  sectionLabel: { color: '#444', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  cardMenu: { backgroundColor: '#111', borderRadius: '15px', overflow: 'hidden', border: '1px solid #222', cursor: 'pointer' },
  cardImageContainer: { position: 'relative', height: '100px' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 },
  difficultyTag: { position: 'absolute', top: '8px', left: '8px', backgroundColor: '#a855f7', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', color: '#fff', fontWeight: 'bold' },
  cardContent: { padding: '12px' },
  cardTitle: { color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' },
  cardSub: { color: '#555', fontSize: '10px' },
  // Styles Jeu
  timerCircle: { width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' },
  inkBadge: { backgroundColor: '#a855f7', padding: '6px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', color: '#fff' },
  cardGame: { marginTop: '20px' },
  step: { color: '#444', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' },
  questionText: { fontSize: '22px', fontWeight: 'bold', color: '#fff', marginBottom: '40px', lineHeight: '1.4' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionBtn: { padding: '18px', backgroundColor: '#111', color: '#fff', border: '1px solid #222', borderRadius: '15px', textAlign: 'left', fontSize: '14px' }
};

export default QuizHome;
