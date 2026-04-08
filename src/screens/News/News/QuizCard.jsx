import React from 'react';

const QuizCard = ({ data, onAnswer }) => {
  return (
    <div style={s.card}>
      <h3 style={s.question}>{data.question}</h3>
      <div style={s.optionsGrid}>
        {data.options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => onAnswer(index === data.correct)}
            style={s.optionBtn}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

const s = {
  card: { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' },
  question: { fontSize: '16px', marginBottom: '20px', textAlign: 'center' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  optionBtn: { padding: '15px', backgroundColor: '#222', color: 'white', border: '1px solid #444', borderRadius: '10px', textAlign: 'left' }
};

export default QuizCard;
