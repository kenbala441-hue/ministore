import React, { useState } from 'react';
import { auth, loginWithGoogle } from '../firebase'; // Assure-toi que loginWithGoogle fonctionne toujours
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import AuthForm from './AuthForm'; // On importe ton composant design et sécurisé !

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // ==========================================
  // LOGIQUE CONNEXION / INSCRIPTION
  // ==========================================
  const handleLoginOrRegister = async (email, password) => {
    setLoading(true);
    setAuthError('');

    try {
      if (isSignup) {
        // 1. Création du compte dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // [IMPORTANT] C'est ici ou dans ton userContext qu'il faut appeler la finalisation.
        // Exemple si tu as une fonction globale ou locale pour Firestore :
        // await handleFinalizeProfile(user.uid, email); 

      } else {
        // Connexion classique
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Auth Error:", error);
      
      // Traduction des erreurs Firebase pour ton AuthForm
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError('identifiants incorrects.');
      } else if (error.code === 'auth/email-already-in-use') {
        setAuthError('cette adresse email est déjà utilisée.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('le mot de passe doit contenir au moins 6 caractères.');
      } else {
        setAuthError('une erreur est survenue, veuillez réessayer.');
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ACTION GOOGLE
  // ==========================================
  const handleGoogleClick = async () => {
    setLoading(true);
    setAuthError('');
    try {
      await loginWithGoogle();
    } catch (error) {
      setAuthError('connexion google échouée.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      // Mode actuel (si isSignup est vrai, le bouton principal servira à s'inscrire)
      loading={loading}
      error={authError}
      
      // Callbacks vers Firebase
      onLogin={handleLoginOrRegister}
      onGoogle={handleGoogleClick}
      
      // Switch entre Connexion et Inscription
      onRegister={() => setIsSignup(!isSignup)} 
      
      // Placeholders pour tes futures méthodes si tu les actives
      onApple={() => console.log('apple auth')}
      onPhone={() => console.log('phone auth')}
      onSmsOtp={() => console.log('sms otp')}
      onEmailLink={() => console.log('email link')}
      onBiometric={() => console.log('biometric')}
      onAnonymous={() => console.log('anonymous')}
    />
  );
}