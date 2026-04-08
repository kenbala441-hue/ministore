import React from 'react';

const Timer = ({ seconds }) => (
  <div style={t.circle}>
    <span style={{ color: seconds < 5 ? '#ff4444' : '#fff' }}>{seconds}</span>
  </div>
);

const t = {
  circle: {
    width: '45px', height: '45px', 
    borderRadius: '50%', border: '2px solid #fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', fontSize: '16px'
  }
};

export default Timer;
