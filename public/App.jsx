import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Importation de tes nouveaux composants
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Store from './components/Store';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');

  // Surveillance de la connexion Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Si l'utilisateur n'est pas connecté, on affiche l'écran Login
  if (!user) return <Login />;

  // Si l'utilisateur est connecté, on affiche l'interface principale
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', position: 'relative' }}>
      
      {/* ZONE DE CONTENU : Elle change selon la vue sélectionnée */}
      <div style={{ paddingBottom: '110px' }}> 
        {view === 'home' && <Home />}
        {view === 'store' && <Store />}
        
        {/* Tu pourras ajouter les vues 'news' ou 'profile' ici plus tard */}
        {view === 'news' && <div style={{padding: '20px'}}><h2>Nouveautés bientôt...</h2></div>}
      </div>

      {/* TA NAVBAR CYBERPUNK (Fixée en bas) */}
      <Navbar setView={setView} />
    </div>
  );
}

export default App;
