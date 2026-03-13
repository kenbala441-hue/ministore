import React, { useState, useEffect, Suspense, lazy } from "react";
import { auth, db, googleProvider } from "./firebase/index.js"; 
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import { UserProvider, useUserContext } from "./screens/users/userContext";
import NeonLayout from "./components/NeonLayout";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import BurgerMenu from "./components/BurgerMenu";
import AssistantGemini from "./components/AssistantGemini"; // adapte le chemin si besoin
import { useUser } from "./screens/users/userContext";
// 🔹 Lazy loading screens utilisateur
const Login = lazy(() => import("./screens/Login"));
const Terms = lazy(() => import("./screens/Terms"));
const Home = lazy(() => import("./screens/Home"));
const MySeries = lazy(() => import("./screens/MySeries"));
const Reader = lazy(() => import("./screens/Reader"));
const Store = lazy(() => import("./screens/Store"));
const InkMarket = lazy(() => import("./screens/InkMarket"));
const Messaging = lazy(() => import("./screens/Messaging"));
const SecurityCenter = lazy(() => import("./screens/SecurityCenter"));
const ThemeSettings = lazy(() => import("./screens/ThemeSettings"));
const Security2FA = lazy(() => import("./screens/Security2FA"));
const Search = lazy(() => import("./screens/Search"));
const Notifications = lazy(() => import("./screens/Notifications"));
const LegalDetails = lazy(() => import("./screens/LegalDetails"));
const RegisterProfile = lazy(() => import("./screens/RegisterProfile/RegisterProfile"));
const News = lazy(() => import("./screens/News"));
const WalletHistory = lazy(() => import("./screens/WalletHistory"));
// 🔹 Lazy loading screens auteur
const AuthorIntroScreen = lazy(() => import("./screens/author/AuthorIntroScreen"));
const AuthorAccessScreen = lazy(() => import("./screens/author/AuthorAccessScreen"));
const AuthorApplyScreen = lazy(() => import("./screens/author/AuthorApplyScreen"));
const AuthorTermsScreen = lazy(() => import("./screens/author/AuthorTermsScreen"));
const AuthorSubmissionScreen = lazy(() => import("./screens/author/AuthorSubmissionScreen"));
const AuthorContractScreen = lazy(() => import("./screens/author/AuthorContractScreen"));
const AuthorDashboardScreen = lazy(() => import("./screens/author/AuthorDashboardScreen"));
const AuthorIdentityScreen = lazy(() => import("./screens/author/AuthorIdentityScreen"));

// 🔹 Lazy loading admin
const AdminLogin = lazy(() => import("./screens/admin/AdminLogin"));
const AdminGuard = lazy(() => import("./screens/admin/layout/AdminGuard.jsx"));
const AdminLayout = lazy(() => import("./screens/admin/layout/AdminLayout.jsx"));
const Overview = lazy(() => import("./screens/admin/dashboard/Overview.jsx"));
const Profile = lazy(() => import("./screens/users/UserProfile"));


// 🔹 Home composants
import TrendingGrid from "./screens/Home/components/TrendingGrid";
import NewStory from "./screens/Home/components/NewStory";
import StoryCard from "./screens/Home/components/StoryCard";
import Tabs from "./screens/Home/components/Tabs";

function AppContent() {
  const { user, setUser } = useUserContext();
  const [authReady, setAuthReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [view, setView] = useState("login");
  const [selectedStory, setSelectedStory] = useState(null);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [adminOk, setAdminOk] = useState(false);
  const [authorData, setAuthorData] = useState(null);
const [currentStory, setCurrentStory] = useState(null);
  const userStatus = "vip";

  // 🔹 Auth Listener principal
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setAuthReady(true);

      if (!u) {
        setView("login");
        return;
      }

      try {
        const userRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          setView("register");
          return;
        }

        const data = docSnap.data();
        if (!data?.acceptedTerms) setView("terms");
        else if (!data?.completedProfile) setView("register");
        else setView("home");
      } catch (err) {
        console.error(err);
        setView("home");
      }
    });

    return () => unsub();
  }, []);

  // 🔹 Splash control
  useEffect(() => {
    if (!authReady) return;
    const minTimer = setTimeout(() => setSplashVisible(false), 1500);
    const maxTimer = setTimeout(() => setSplashVisible(false), 6000);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [authReady]);

  // 🔹 Email login
  const handleLogin = async (email, password) => {
    try {
      const { user: u } = await signInWithEmailAndPassword(auth, email, password);
      setUser(u);

      const userRef = doc(db, "users", u.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        setView("register");
        return;
      }

      const data = docSnap.data();
      if (!data?.acceptedTerms) setView("terms");
      else if (!data?.completedProfile) setView("register");
      else setView("home");
    } catch (err) {
      console.error(err);
      alert("Erreur connexion");
    }
  };

  // 🔹 Google login
  const handleGoogleLogin = async () => {
    try {
      const { user: u } = await signInWithPopup(auth, googleProvider);
      setUser(u);

      const userRef = doc(db, "users", u.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || "",
          photoURL: u.photoURL || "",
          createdAt: serverTimestamp(),
          acceptedTerms: false,
          completedProfile: false,
        });
        setView("register");
        return;
      }

      const data = docSnap.data();
      if (!data?.acceptedTerms) setView("terms");
      else if (!data?.completedProfile) setView("register");
      else setView("home");
    } catch (err) {
      console.error(err);
      alert("Erreur Google");
    }
  };

  const pageTransition = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25 },
  };

  if (splashVisible) return <SplashScreen finishLoading={() => setSplashVisible(false)} />;

  return (
    <div style={{ backgroundColor: "#050505", color: "white", minHeight: "100vh", position: "relative" }}>
      <BurgerMenu
        isOpen={isBurgerOpen}
        close={() => setIsBurgerOpen(false)}
        user={user}
        setView={setView}
      />

      <main style={{ paddingBottom: "90px" }}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<SplashScreen finishLoading={() => setSplashVisible(false)} />}>
            <motion.div key={view} {...pageTransition}>
              {view === "login" && (
                <Login onEmailLogin={handleLogin} onGoogleLogin={handleGoogleLogin} setView={setView} />
              )}

              {view === "terms" && (
                <Terms setView={setView} onAccept={() => setView("home")} />
              )}

              {view === "register" && (
                <RegisterProfile setView={setView} user={user} />
              )}
             
              {view === "home" && (
                <Home
                  setView={setView}
                  setSelectedStory={setSelectedStory}
                  toggleBurger={() => setIsBurgerOpen(true)}
                  TrendingGrid={TrendingGrid}
                  NewStory={NewStory}
                  StoryCard={StoryCard}
                  Tabs={Tabs}
                />
              )}

              {view === "profile" && <Profile setView={setView} />}
              {view === "reader" && <Reader story={selectedStory} setView={setView} />}
              {view === "news" && <News setView={setView} setSelectedStory={setSelectedStory} />}
              {view === "myseries" && <MySeries setView={setView} setSelectedStory={setSelectedStory} />}
              {view === "store" && <Store />}
              {view === "search" && <Search setView={setView} />}
              {view === "notifications" && <Notifications setView={setView} />}
              {view === "legal_details" && <LegalDetails setView={setView} />}
              {view === "ink_market" && <InkMarket setView={setView} userStatus={userStatus} />}
              {view === "wallet_history" && <WalletHistory user={user} />}
              {view === "messaging" && <Messaging setView={setView} userStatus={userStatus} />}
              {view === "themes" && <ThemeSettings setView={setView} userStatus={userStatus} />}
              {view === "security_2fa" && <Security2FA setView={setView} />}
              {view === "security_center" && <SecurityCenter user={user} />}

              {view === "admin_login" && <AdminLogin setView={setView} />}
              {view === "admin_dashboard" && (
                <>
                  {!adminOk && <AdminGuard onSuccess={() => setAdminOk(true)} />}
                  {adminOk && (
                    <AdminLayout setView={setView}>
                      <Overview />
                    </AdminLayout>
                  )}
                </>
              )}

              {view === "author_intro" && <AuthorIntroScreen setView={setView} />}
              {view === "author_terms" && <AuthorTermsScreen setView={setView} />}
              {view === "author_submission" && <AuthorSubmissionScreen setView={setView} />}
              {view === "author_contract" && <AuthorContractScreen setView={setView} />}
              {view === "author_dashboard" && <AuthorDashboardScreen setView={setView} />}
              {view === "author_access" && (
                <AuthorAccessScreen setView={setView} setAuthorData={setAuthorData} />
              )}
              {view === "author_identity" && (
                  <AuthorIdentityScreen setView={setView} />
)}
              {view === "author_apply" && <AuthorApplyScreen setView={setView} />}
            </motion.div>
          </Suspense>
        </AnimatePresence>
      </main>

      {["home","profile","reader","news","myseries","store","search","notifications"].includes(view) && (
        <Navbar view={view} setView={setView} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ErrorBoundary>
        <NeonLayout>
          <AppContent />
        </NeonLayout>
      </ErrorBoundary>
    </UserProvider>
  );
}