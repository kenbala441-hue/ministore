import React from 'react';

const QuizCard = ({ data, onSelect }) => {
  return (
    <div>
      <h2 style={s.question}>{data.q}</h2>
      <div style={s.optionsGrid}>
        {data.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => onSelect(i === data.correct)}
            style={s.btn}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const s = {
  question: { color: '#fff', fontSize: '20px', textAlign: 'center', marginBottom: '40px' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  btn: { 
    padding: '18px', 
    backgroundColor: '#0a0a0a', 
    color: '#fff', 
    border: '1px solid #333', 
    borderRadius: '12px',
    textAlign: 'left',
    fontSize: '14px',
    boxShadow: '0 0 5px rgba(255,255,255,0.05)' // Effet léger néon
  }
};

export default QuizCard;
