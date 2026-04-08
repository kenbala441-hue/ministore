import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';

// Exemple de base de données locale
const LOCAL_QUESTIONS = [
  { id: 1, question: "Qui est le créateur de Lord of the Mysteries ?", options: ["Cuttlefish", "TurtleMe", "Mad Snail"], correct: 0 },
  { id: 2, question: "Quel est le grade de Jinwoo au début de Solo Leveling ?", options: ["Rang C", "Rang E", "Rang S"], correct: 1 }
];

const QuizContainer = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 100); // On actualise le score
    
    if (currentIdx + 1 < LOCAL_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
      // Ici tu pourras ajouter la logique pour sauvegarder le score final dans Firebase
    }
  };

  if (quizFinished) return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>Terminé ! 🏆</h2>
      <p style={{ color: '#a855f7', fontSize: '24px' }}>Score : {score} Ink</p>
      <button onClick={() => window.location.reload()} style={s.btn}>Rejouer</button>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={s.scoreHeader}>Score Actuel : {score}</div>
      <QuizCard 
        data={LOCAL_QUESTIONS[currentIdx]} 
        onAnswer={handleAnswer} 
      />
    </div>
  );
};

const s = {
  scoreHeader: { textAlign: 'right', color: '#22c55e', fontWeight: 'bold', marginBottom: '20px' },
  btn: { backgroundColor: '#a855f7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', marginTop: '20px' }
};

export default QuizContainer;
