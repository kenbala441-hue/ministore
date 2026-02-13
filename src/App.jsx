import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Screens utilisateur
import Login from './screens/Login';
import Terms from './screens/Terms';
import Home from './screens/Home';
import News from './screens/News';
import MySeries from './screens/MySeries';
import Reader from './screens/Reader';
import Store from './screens/Store';
import InkMarket from './screens/InkMarket';
import Messaging from './screens/Messaging';
import ThemeSettings from './screens/ThemeSettings';
import Security2FA from './screens/Security2FA';
import Search from './screens/Search';
import Notifications from './screens/Notifications';
import LegalDetails from './screens/LegalDetails';
import Profile from './screens/Profile';

// Screens admin
import AdminLogin from './screens/admin/AdminLogin';
import AdminGate from './screens/admin/AdminGate';
import AdminVault from './screens/admin/AdminVault';
import AdminChallenge from './screens/admin/AdminChallenge';
import AdminDashboard from './screens/admin/AdminDashboard';
import AdminLayout from "./screens/admin/layout/AdminLayout.jsx";
import Overview from "./screens/admin/dashboard/Overview.jsx";
import AdminGuard from "./screens/admin/layout/AdminGuard.jsx";

// Components
import Navbar from './components/Navbar';
import BurgerMenu from './components/BurgerMenu';

function App() {
  const [user, setUser] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [view, setView] = useState('home');
  const [selectedStory, setSelectedStory] = useState(null);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [adminOk, setAdminOk] = useState(false);

  const userStatus = 'vip';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.acceptedTerms) setAccepted(true);
    });
    return () => unsub();
  }, []);

  if (!user) return <Login />;
  if (user && !accepted) {
    return <Terms setView={setView} onAccept={() => setAccepted(true)} />;
  }

  return (
    <div
      style={{
        backgroundColor: '#050505',
        color: 'white',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
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
        {view === 'profile' && <Profile setView={setView} />}
        {view === 'reader' && <Reader story={selectedStory} setView={setView} />}
        {view === 'store' && <Store />}
        {view === 'search' && <Search setView={setView} />}
        {view === 'notifications' && <Notifications setView={setView} />}
        {view === 'legal_details' && <LegalDetails setView={setView} />}
        {view === 'ink_market' && <InkMarket setView={setView} userStatus={userStatus} />}
        {view === 'messaging' && <Messaging setView={setView} userStatus={userStatus} />}
        {view === 'themes' && <ThemeSettings setView={setView} userStatus={userStatus} />}
        {view === 'security_2fa' && <Security2FA setView={setView} />}

        {view === 'admin_login' && <AdminLogin setView={setView} />}
        {view === 'admin_gate' && <AdminGate setView={setView} />}
        {view === 'admin_vault' && <AdminVault setView={setView} />}
        {view === 'admin_challenge' && <AdminChallenge setView={setView} />}

        {view === 'admin_dashboard' && (
          <>
            {!adminOk && <AdminGuard onSuccess={() => setAdminOk(true)} />}
            {adminOk && (
              <AdminLayout setView={setView}>
                <Overview />
              </AdminLayout>
            )}
          </>
        )}
      </main>

      <Navbar view={view} setView={setView} />
    </div>
  );
}

export default App;