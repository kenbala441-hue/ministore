import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Imports des Screens
import Login from './screens/Login';
import Home from './screens/Home';
import News from './screens/News';
import MySeries from './screens/MySeries';
import Reader from './screens/Reader';
import Store from './screens/Store';
import InkMarket from './screens/InkMarket';
import Messaging from './screens/Messaging';
import ThemeSettings from './screens/ThemeSettings';
import Security2FA from './screens/Security2FA'; // ✅ AJOUTÉ
import AdminLogin from './screens/admin/AdminLogin';
import AdminDashboard from './screens/admin/AdminDashboard';

// Imports des Composants
import Navbar from './components/Navbar';
import BurgerMenu from './components/BurgerMenu';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [selectedStory, setSelectedStory] = useState(null);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  // Simulation du statut pour le test (à lier à Firebase plus tard)
  const userStatus = 'vip';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <Login />;

  return (
    <div style={{ backgroundColor: '#050505', color: 'white', minHeight: '100vh', position: 'relative' }}>
      
      <BurgerMenu 
        isOpen={isBurgerOpen} 
        close={() => setIsBurgerOpen(false)} 
        user={user} 
        setView={setView} 
      />
      
      <main style={{ paddingBottom: '90px' }}>
        {view === 'home' && (
          <Home
            setView={setView}
            setSelectedStory={setSelectedStory}
            toggleBurger={() => setIsBurgerOpen(true)}
          />
        )}

        {view === 'news' && <News setView={setView} setSelectedStory={setSelectedStory} />}
        {view === 'myseries' && <MySeries setView={setView} setSelectedStory={setSelectedStory} />}
        {view === 'reader' && <Reader story={selectedStory} setView={setView} />}
        {view === 'store' && <Store />}

        {/* NOUVELLES ROUTES */}
        {view === 'ink_market' && <InkMarket setView={setView} userStatus={userStatus} />}
        {view === 'messaging' && <Messaging setView={setView} userStatus={userStatus} />}
        {view === 'themes' && <ThemeSettings setView={setView} userStatus={userStatus} />}
        {view === 'security_2fa' && <Security2FA setView={setView} />}

        {/* ADMIN */}
        {view === 'admin_login' && <AdminLogin setView={setView} />}
        {view === 'admin_dashboard' && <AdminDashboard setView={setView} />}
      </main>

      <Navbar view={view} setView={setView} />
    </div>
  );
}

export default App;