import React, { useState } from 'react';
import { auth, loginWithGoogle } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>{isSignup ? 'Créer un compte ComicCraft' : 'Connexion'}</h2>
      <form onSubmit={handleAuth} style={s.form}>
        <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} style={s.input} />
        <input type="password" placeholder="Mot de passe" onChange={(e)=>setPassword(e.target.value)} style={s.input} />
        <button type="submit" style={s.btnMain}>{isSignup ? 'S\'inscrire' : 'Se connecter'}</button>
      </form>
      
      <button onClick={loginWithGoogle} style={s.btnGoogle}>Continuer avec Google</button>
      
      <p onClick={() => setIsSignup(!isSignup)} style={s.toggle}>
        {isSignup ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Créez-en un"}
      </p>
    </div>
  );
}

const s = {
  container: { padding: '20px', textAlign: 'center', backgroundColor: '#0f0f15', height: '100vh', color: 'white' },
  title: { color: '#a855f7', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#1a1a2e', color: 'white' },
  btnMain: { padding: '12px', backgroundColor: '#a855f7', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' },
  btnGoogle: { marginTop: '10px', padding: '12px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '5px', width: '100%' },
  toggle: { marginTop: '20px', color: '#bbb', cursor: 'pointer', fontSize: '14px' }
};
