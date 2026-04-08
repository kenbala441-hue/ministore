import React, { useState } from 'react';
import QuizHome from './QuizHome'; // L'affichage de la liste des thèmes
import QuizGame from './QuizGame'; // Le moteur de jeu

const QuizIndex = ({ onExit }) => {
  // On gère l'état global ici : quel quiz est sélectionné ?
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // 1. SI UN QUIZ EST SÉLECTIONNÉ : On affiche le moteur de jeu
  if (selectedQuiz) {
    return (
      <QuizGame 
        selectedQuiz={selectedQuiz} 
        onExit={() => setSelectedQuiz(null)} 
      />
    );
  }

  // 2. SINON : On affiche l'écran d'accueil (la liste des thèmes)
  // On lui passe setSelectedQuiz pour qu'il puisse dire à l'index quel quiz charger
  return (
    <QuizHome 
      onExit={onExit} 
      onSelectQuiz={(quiz) => setSelectedQuiz(quiz)} 
    />
  );
};

export default QuizIndex;
