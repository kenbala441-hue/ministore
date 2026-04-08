import React, { useState, useEffect } from 'react';

const QuizGame = ({ selectedQuiz, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);

  // On utilise les questions du quiz sélectionné ou tes questions par défaut
  const questions = selectedQuiz?.questions || [
    { q: "Quel studio produit 'Blackline' ?", options: ["ComicCrafte", "Mappa", "Ufotable"], correct: 0 },
    { q: "Combien d'Ink gagne-t-on par jour ?", options: ["10", "50", "100"], correct: 1 },
  ];

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      handleAnswer(false); // Temps écoulé = mauvaise réponse
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (isCorrect) => {
    const points = selectedQuiz?.pointsPerQ || 50;
    const newScore = isCorrect ? score + points : score;
    
    if (currentStep + 1 < questions.length) {
      setScore(newScore);
      setCurrentStep(currentStep + 1);
      setTimeLeft(15); // Reset du chrono pour la suivante
    } else {
      // Fin du quiz
      alert(`Terminé ! Score final : ${newScore} Ink`);
      onExit(); 
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button onClick={onExit} style={s.closeBtn}>✕</button>
        <div style={s.timerContainer}>
           <div style={s.timerCircle}>{timeLeft}s</div>
        </div>
        <div style={s.inkBadge}>{score} Ink</div>
      </div>

      <div style={s.card}>
        <div style={s.step}>QUESTION {currentStep + 1}/{questions.length}</div>
        <h2 style={s.questionText}>{questions[currentStep].q}</h2>

        <div style={s.optionsGrid}>
          {questions[currentStep].options.map((opt, i) => (
            <button 
              key={i} 
              style={s.optionBtn} 
              onClick={() => handleAnswer(i === questions[currentStep].correct)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const s = {
  container: { position: 'fixed', inset: 0, backgroundColor: '#000', zIndex: 2000, padding: '20px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', marginTop: '10px' },
  closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' },
  timerContainer: { flex: 1, display: 'flex', justifyContent: 'center' },
  timerCircle: { width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', boxShadow: '0 0 10px #a855f7' },
  inkBadge: { backgroundColor: '#a855f7', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: '#fff' },
  card: { marginTop: '30px' },
  step: { color: '#666', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '15px', textTransform: 'uppercase' },
  questionText: { fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '50px', lineHeight: '1.4' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  optionBtn: { padding: '20px', backgroundColor: '#1A1A1A', color: '#fff', border: '1px solid #333', borderRadius: '16px', textAlign: 'left', fontSize: '15px', fontWeight: '500', transition: 'all 0.2s' }
};

export default QuizGame;
