import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = result.user;

        await setDoc(
          doc(db, 'users', user.uid),
          {
            username: user.displayName || 'Utilisateur',
            role: 'user',
            plan: 'standard',
            ink: 0,
            followers: 0,
            following: 0,
            seriesCount: 0,
            createdAt: serverTimestamp(),
            acceptedTerms: true,
          },
          { merge: true }
        );
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          username: user.displayName || 'Utilisateur',
          role: 'user',
          plan: 'standard',
          ink: 0,
          followers: 0,
          following: 0,
          seriesCount: 0,
          createdAt: serverTimestamp(),
          acceptedTerms: true,
        },
        { merge: true }
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={s.container}>
      <h1 style={s.title}>Bienvenue dans l'univers Comiccrafte</h1>
      <p style={s.subtitle}>
        Pour participer à cette grande aventure, veuillez{' '}
        {isSignup ? 'créer un compte' : 'vous connecter'}.
      </p>

      {error && <p style={s.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={s.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={s.input}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={s.input}
          required
        />
        <button type="submit" style={s.btn} disabled={loading}>
          {loading
            ? 'Chargement...'
            : isSignup
            ? 'Créer un compte'
            : 'Se connecter'}
        </button>
      </form>

      <p style={s.toggleText}>
        {isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
        <span
          style={s.toggleLink}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Connectez-vous' : 'Créez-en un'}
        </span>
      </p>

      <hr style={s.hr} />

      <button style={s.googleBtn} onClick={handleGoogleLogin}>
        Se connecter avec Google
      </button>
    </div>
  );
}

const s = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 20,
    color: 'white',
    background: `
      radial-gradient(circle at top, #7c3aed33, transparent 40%),
      radial-gradient(circle at bottom, #2563eb33, transparent 40%),
      linear-gradient(135deg, #020617, #050505)
    `,
    animation: 'fadeIn 1.2s ease-in-out',
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #a855f7, #38bdf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5f5',
    marginBottom: 25,
    textAlign: 'center',
    maxWidth: 360,
  },
  error: {
    color: '#f87171',
    marginBottom: 12,
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 320,
    background: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(12px)',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 0 40px rgba(168,85,247,0.15)',
  },
  input: {
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #334155',
    background: '#020617',
    color: 'white',
    outline: 'none',
  },
  btn: {
    padding: 12,
    background: 'linear-gradient(90deg, #a855f7, #6366f1)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: 10,
    boxShadow: '0 0 20px rgba(168,85,247,0.4)',
  },
  toggleText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 15,
    textAlign: 'center',
  },
  toggleLink: {
    color: '#a855f7',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  hr: {
    width: '100%',
    border: '0.5px solid #1e293b',
    margin: '25px 0',
  },
  googleBtn: {
    padding: 12,
    width: 320,
    background: 'linear-gradient(90deg, #4285F4, #2563eb)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 0 20px rgba(37,99,235,0.4)',
  },
};