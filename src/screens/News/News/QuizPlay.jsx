import QuizHome from './Quiz/index'; // On remonte pour chercher le dossier Quiz

const QuizPlay = ({ onExit }) => {
  return <QuizHome onExit={onExit} />;
};

export default QuizPlay;
