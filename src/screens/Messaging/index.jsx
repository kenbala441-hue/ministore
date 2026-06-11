// MESSAGING V3 — COMICCRAFTE SECURE MESSENGER 2026
// VERSION NETTOYÉE & OPTIMISÉE POUR MOBILE

import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";

import {
  Search,
  ShieldCheck,
  Lock,
  Bell,
  Phone,
  Video,
  Plus,
  Archive,
  Moon,
  Pin,
  CheckCheck,
  Settings,
  Users,
  Wifi,
  WifiOff,
  Star,
  Clock3,
  X,
} from "lucide-react";

import { db, auth } from "../../firebase/index.js";

import MessagingSplash from "./MessagingSplash";
import ChatThread from "./contacts/ChatThread";
import { mockConversations } from "./mockData";

import "./message/messaging.css";

const TABS = [
  { id: "all", label: "Discussions" },
  { id: "groups", label: "Groupes" },
  { id: "favorites", label: "Favoris" },
  { id: "archived", label: "Archivés" },
];

export default function Messaging({ setView }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [screen, setScreen] = useState("splash");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [online, setOnline] = useState(navigator.onLine);
  const [showMenu, setShowMenu] = useState(false);

  // =========================
  // HELPER : FORMAT AGE / TIME
  // =========================
  const formatTime = (timestamp, defaultTime) => {
    if (!timestamp) return defaultTime || "12:45";
    // Si c'est un Timestamp Firebase
    if (timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return timestamp;
  };

  // =========================
  // AUTH LISTENER
  // =========================
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // =========================
  // INTERNET STATUS
  // =========================
  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  // =========================
  // FIREBASE CONVERSATIONS
  // =========================
  useEffect(() => {
    if (!currentUser) {
      setConversations(mockConversations);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("lastTimestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConversations(data.length ? data : mockConversations);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase error, using mockData:", error);
        setConversations(mockConversations);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // =========================
  // FILTERS
  // =========================
  const filteredConversations = useMemo(() => {
    let list = [...conversations];

    if (activeTab === "favorites") list = list.filter((c) => c.favorite);
    if (activeTab === "groups") list = list.filter((c) => c.isGroup);
    if (activeTab === "archived") list = list.filter((c) => c.archived);

    if (search.trim()) {
      list = list.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  }, [conversations, search, activeTab]);

  // =========================
  // THEME CONFIG
  // =========================
  const theme = darkMode
    ? {
        bg: "#050505",
        card: "#0d0d0d",
        card2: "#101114",
        border: "rgba(255,255,255,0.06)",
        text: "#fff",
        sub: "#8b8b95",
        neon: "#00ffd5",
      }
    : {
        bg: "#f4f5f8",
        card: "#fff",
        card2: "#fff",
        border: "rgba(0,0,0,0.06)",
        text: "#111",
        sub: "#667085",
        neon: "#00a884",
      };

  if (screen === "splash") {
    return <MessagingSplash onComplete={() => setScreen("home")} />;
  }

  if (selectedConversation) {
    return (
      <ChatThread
        conversation={selectedConversation}
        currentUser={currentUser}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <div style={{ ...s.container, background: theme.bg, color: theme.text }}>
      
      {/* HEADER */}
      <div style={{ ...s.header, background: theme.card, borderBottom: `1px solid ${theme.border}` }}>
        <div style={s.headerTop}>
          <div>
            <div style={s.logoRow}>
              <ShieldCheck size={16} color={theme.neon} />
              <span style={{ ...s.logoText, color: theme.neon }}>ComicCrafte Secure</span>
            </div>
            <div style={{ ...s.subText, color: theme.sub }}>Chiffrement de bout en bout</div>
          </div>

          <div style={s.actions}>
            <button style={s.iconBtn} aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button style={s.iconBtn} onClick={() => setDarkMode(!darkMode)} aria-label="Changer Theme">
              <Moon size={18} />
            </button>
            <button style={s.iconBtn} onClick={() => setShowMenu(!showMenu)} aria-label="Menu">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* SECURE STATUS BAR */}
        <div style={s.statusRow}>
          <div style={{ ...s.onlineBadge, background: online ? "rgba(0,255,120,0.12)" : "rgba(255,70,70,0.12)" }}>
            {online ? <Wifi size={12} color="#00ff84" /> : <WifiOff size={12} color="#ff4646" />}
            <span>{online ? "Connexion sécurisée" : "Mode hors ligne"}</span>
          </div>
          <div style={s.securityBadge}>
            <Lock size={11} /> AES-256
          </div>
        </div>

        {/* INPUT DE RECHERCHE */}
        <div style={{ ...s.searchBox, background: theme.card2, border: `1px solid ${theme.border}` }}>
          <Search size={15} color={theme.sub} />
          <input
            placeholder="Rechercher une discussion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...s.searchInput, color: theme.text }}
          />
          {search && <X size={15} color={theme.sub} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
        </div>

        {/* ONGLETS NAV */}
        <div style={s.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...s.tabBtn,
                color: activeTab === tab.id ? theme.neon : theme.sub,
                borderBottom: activeTab === tab.id ? `2px solid ${theme.neon}` : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTE DES DISCUSSIONS */}
      <div style={s.list}>
        {loading ? (
          <div style={s.loadingBox}>Chargement des messages sécurisés...</div>
        ) : filteredConversations.length === 0 ? (
          <div style={s.emptyBox}>Aucune conversation dans cette section</div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              style={{ ...s.chatCard, background: theme.card, border: `1px solid ${theme.border}` }}
              onClick={() => setSelectedConversation(conv)}
            >
              {/* AVATAR */}
              <div style={s.avatarWrap}>
                <img src={conv.avatar || "https://i.pravatar.cc/150"} alt="" style={s.avatar} />
                {conv.online && <div style={s.onlineDot} />}
              </div>

              {/* DETAILS MESSAGE */}
              <div style={s.chatInfo}>
                <div style={s.chatTop}>
                  <div style={s.chatName}>
                    {conv.name}
                    {conv.verified && <ShieldCheck size={13} color="#00ffd5" />}
                  </div>
                  <div style={{ ...s.time, color: theme.sub }}>
                    {formatTime(conv.lastTimestamp || conv.time)}
                  </div>
                </div>

                <div style={s.chatBottom}>
                  <div style={{ ...s.lastMessage, color: theme.sub }}>
                    {conv.read && <CheckCheck size={13} color="#00ffd5" style={{ marginRight: 2 }} />}
                    {conv.lastMessage || "Aucun message partagé"}
                  </div>

                  <div style={s.rightBadges}>
                    {conv.favorite && <Star size={13} color="#FFD700" />}
                    {conv.pinned && <Pin size={12} color="#00ffd5" />}
                    {conv.unread > 0 && <div style={s.unread}>{conv.unread}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOUTON FLOTTANT NOUVEAU MESSAGE */}
      <button style={{ ...s.fab, background: theme.neon }} aria-label="Nouvelle discussion">
        <Plus size={22} color="#000" />
      </button>

      {/* QUICK MENU DROPDOWN */}
      {showMenu && (
        <>
          {/* Overlay transparent pour fermer le menu si on clique à côté */}
          <div style={s.overlay} onClick={() => setShowMenu(false)} />
          <div style={{ ...s.quickMenu, background: theme.card, border: `1px solid ${theme.border}` }}>
            <div style={s.quickItem}><Users size={15} /> Nouveau groupe</div>
            <div style={s.quickItem}><Archive size={15} /> Archivés</div>
            <div style={s.quickItem}><Phone size={15} /> Appels</div>
            <div style={s.quickItem}><Video size={15} /> Salons vidéo</div>
            <div style={s.quickItem}><Clock3 size={15} /> Programmés</div>
          </div>
        </>
      )}
    </div>
  );
}

// =========================
// STYLES OBJECTS
// =========================
const s = {
  container: { height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", fontFamily: "Inter, sans-serif" },
  header: { padding: "10px 12px 8px", position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(20px)" },
  headerTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logoRow: { display: "flex", alignItems: "center", gap: "6px" },
  logoText: { fontSize: "14px", fontWeight: "800" },
  subText: { fontSize: "10px", marginTop: "2px" },
  actions: { display: "flex", gap: "6px" },
  iconBtn: { width: "34px", height: "34px", borderRadius: "10px", border: "none", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" },
  statusRow: { marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" },
  onlineBadge: { display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: "700" },
  securityBadge: { display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#00ffd5", fontWeight: "700" },
  searchBox: { marginTop: "12px", height: "42px", borderRadius: "14px", padding: "0 12px", display: "flex", alignItems: "center", gap: "8px" },
  searchInput: { flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "13px" },
  tabs: { display: "flex", gap: "12px", marginTop: "12px", overflowX: "auto" },
  tabBtn: { border: "none", background: "transparent", padding: "8px 0", fontSize: "11px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" },
  list: { flex: 1, overflowY: "auto", padding: "10px 12px 100px" },
  chatCard: { display: "flex", gap: "10px", padding: "10px", borderRadius: "18px", marginBottom: "10px", cursor: "pointer" },
  avatarWrap: { position: "relative" },
  avatar: { width: "54px", height: "54px", borderRadius: "16px", objectFit: "cover" },
  onlineDot: { position: "absolute", right: 2, bottom: 2, width: "11px", height: "11px", borderRadius: "50%", background: "#00ff84", border: "2px solid #050505" },
  chatInfo: { flex: 1, minWidth: 0 },
  chatTop: { display: "flex", justifyContent: "space-between", gap: "10px" },
  chatName: { display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: "700" },
  time: { fontSize: "10px" },
  chatBottom: { marginTop: "6px", display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" },
  lastMessage: { display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },
  rightBadges: { display: "flex", alignItems: "center", gap: "6px" },
  unread: { minWidth: "18px", height: "18px", borderRadius: "999px", background: "#00ffd5", color: "#000", fontSize: "10px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" },
  fab: { position: "fixed", right: "18px", bottom: "88px", width: "58px", height: "58px", borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", zIndex: 10 },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, background: "transparent" },
  quickMenu: { position: "fixed", top: "55px", right: "14px", width: "190px", borderRadius: "18px", overflow: "hidden", zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" },
  quickItem: { padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  loadingBox: { padding: "40px", textAlign: "center", opacity: 0.6, fontSize: "13px" },
  emptyBox: { padding: "40px", textAlign: "center", opacity: 0.5, fontSize: "13px" },
};
