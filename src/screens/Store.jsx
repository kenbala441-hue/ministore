import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/index.js";
import { useUserContext } from "./users/userContext";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Download,
  Star,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  UploadCloud,
  Gamepad2,
  LayoutGrid,
  Smartphone,
  Monitor,
  RefreshCcw,
} from "lucide-react";

/* =========================
   REVOLUTION STORE 2026
   Neo Store • PlayStore + AppStore + Microsoft Store
   Compact • Android Ready • Offline Safe
========================= */

/* -------------------------
   DATABASE
------------------------- */

const STORE_APPS = [
  {
    id: 1,
    name: "ComicCraft Reader",
    developer: "CraftComic",
    version: "3.5.2",
    size: "42 MB",
    icon: "⚡",
    category: "Lecture",
    rating: 4.9,
    downloads: "12M+",
    featured: true,
    isInstalled: true,
    description: "Lecture immersive ultra fluide.",
    banner:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Shadow Hunter",
    developer: "Neo Games",
    version: "2.4.0",
    size: "850 MB",
    icon: "⚔️",
    category: "Action",
    rating: 4.8,
    downloads: "48M+",
    isInstalled: false,
    description: "Cyber action nouvelle génération.",
    banner:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Z-Art Community",
    developer: "CraftSocial",
    version: "1.8.0",
    size: "120 MB",
    icon: "🎨",
    category: "Social",
    rating: 4.6,
    downloads: "3M+",
    isInstalled: false,
    description: "Communauté créative mondiale.",
    banner:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Neo Music",
    developer: "Neo Studio",
    version: "5.0.1",
    size: "90 MB",
    icon: "🎵",
    category: "Musique",
    rating: 4.7,
    downloads: "20M+",
    isInstalled: false,
    description: "Streaming audio intelligent.",
    banner:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
  },
];

/* -------------------------
   CATEGORIES
------------------------- */

const CATEGORIES = [
  { name: "Tous", icon: <LayoutGrid size={14} /> },
  { name: "Action", icon: <Gamepad2 size={14} /> },
  { name: "Social", icon: <Smartphone size={14} /> },
  { name: "Lecture", icon: <Monitor size={14} /> },
  { name: "Musique", icon: <Sparkles size={14} /> },
];
const INK_PACKS = [
  { id: "starter", amount: 40, price: "0.50", label: "Starter", bonus: null, color: "#00d9ff" },
  { id: "basic", amount: 100, price: "1.20", label: "Basic", bonus: null, color: "#00f7ff" },
  { id: "popular", amount: 200, price: "2.00", label: "Populaire", bonus: "100₵/$", color: "#8b5cf6" },
  { id: "premium", amount: 1100, price: "10.00", label: "Premium", bonus: "+10%", color: "#FFD700" },
  { id: "elite", amount: 2400, price: "20.00", label: "Elite", bonus: "+20%", color: "#ff6a00" },
  { id: "legend", amount: 6500, price: "50.00", label: "Légende", bonus: "Best", color: "#ff003c" },
];

export default function Store() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const { user } = useUserContext();
  const [updates, setUpdates] = useState([]);
  const [installingId, setInstallingId] = useState(null);

  /* -------------------------
     LOAD LOCAL STORAGE
  ------------------------- */

  useEffect(() => {
    const localApps =
      JSON.parse(localStorage.getItem("neo_store_apps")) || [];

    if (localApps.length > 0) {
      setApps(localApps);
    } else {
      localStorage.setItem(
        "neo_store_apps",
        JSON.stringify(STORE_APPS)
      );
      setApps(STORE_APPS);
    }
  }, []);

  /* -------------------------
     SAVE AUTO
  ------------------------- */

  useEffect(() => {
    if (!apps.length) return;

    localStorage.setItem(
      "neo_store_apps",
      JSON.stringify(apps)
    );
  }, [apps]);

  /* -------------------------
     FILTER
  ------------------------- */

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchCategory =
        activeCategory === "Tous" ||
        app.category === activeCategory;

      const matchSearch =
        app.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        app.developer
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [apps, search, activeCategory]);

  /* -------------------------
     INSTALL SYSTEM
  ------------------------- */

  const handleInstall = (app) => {
    setInstallingId(app.id);

    setTimeout(() => {
      const updated = apps.map((a) =>
        a.id === app.id
          ? {
              ...a,
              isInstalled: true,
            }
          : a
      );

      setApps(updated);
      setInstallingId(null);
    }, 2400);
  };

  const handlePurchase = async (pack) => {
    if (!user) return alert("Veuillez vous connecter pour acheter des Inks.");

    const confirmBuy = window.confirm(`💎 BANQUE :\nConfirmer l'achat du pack ${pack.label} pour ${pack.price} $US ?`);
    
    if (confirmBuy) {
      try {
        const userRef = doc(db, "users", user.uid);
        // Utilise increment() pour ajouter les Inks au solde existant dans Firebase
        await updateDoc(userRef, {
          inks: increment(pack.amount)
        });
        alert(`✅ SUCCÈS\n+${pack.amount} CRAFT-INK ajoutés à votre compte !`);
      } catch (err) {
        console.error("Erreur Banque:", err);
        alert("❌ ERREUR\nTransaction impossible. Vérifiez votre connexion.");
      }
    }
  };

  /* -------------------------
     UPDATE SYSTEM
  ------------------------- */

  const handleUpdate = (app) => {
    setInstallingId(app.id);

    setTimeout(() => {
      const updated = apps.map((a) =>
        a.id === app.id
          ? {
              ...a,
              version:
                Number(
                  a.version.split(".")[0]
                ) +
                1 +
                ".0.0",
            }
          : a
      );

      setApps(updated);
      setInstallingId(null);
    }, 2200);
  };

  /* -------------------------
     FEATURED APP
  ------------------------- */

  const featured =
    apps.find((a) => a.featured) || apps[0];

  return (
    <div style={s.container}>
      {/* BG */}
      <div style={s.glow1} />
      <div style={s.glow2} />

      {/* HEADER */}
      <div style={s.header}>
        <div>
          <div style={s.logoRow}>
            <div style={s.logoBox}>N</div>

            <div>
              <div style={s.storeName}>
                Comicrate Store
              </div>

              <div style={s.storeSub}>
                Comicrate Cloud
              </div>
            </div>
          </div>
        </div>

        <div style={s.headerIcons}>
          <button style={s.iconBtn}>
            <Bell size={18} />
          </button>

          <button style={s.profileBtn}>
            K
          </button>
        </div>
      </div>

      {/* FEEDBACK PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={s.feedbackCard}
      >
        <div style={{ flex: 1 }}>
          <div style={s.feedbackTitle}>
            Votre avis améliore l'app 🚀
          </div>

          <div style={s.feedbackText}>
            Envoyez des idées pour rendre
            l'expérience encore plus
            révolutionnaire.
          </div>
        </div>

        <button style={s.feedbackBtn}>
          <UploadCloud size={14} />
          Envoyer
        </button>
      </motion.div>

      {/* SEARCH */}
      <div style={s.searchBar}>
        <Search
          size={17}
          color="rgba(255,255,255,0.55)"
        />

        <input
          placeholder="Rechercher une application..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={s.input}
        />
      </div>

      {/* TABS */}
      <div style={s.tabs}>
        {CATEGORIES.map((cat) => {
          const active =
            activeCategory === cat.name;

          return (
            <button
              key={cat.name}
              onClick={() =>
                setActiveCategory(cat.name)
              }
              style={{
                ...s.tab,
                ...(active
                  ? s.activeTab
                  : {}),
              }}
            >
              {cat.icon}
              {cat.name}
            </button>
          );
        })}
      </div>

{/* FEATURED */}
{featured ? (
  <motion.div
    whileTap={{ scale: 0.99 }}
    style={s.hero}
  >
    <img
      src={featured?.banner || "https://via.placeholder.com/1200x600"}
      alt={featured?.name || "Featured App"}
      style={s.heroImage}
      loading="lazy"
      draggable={false}
      onError={(e) => {
        e.currentTarget.src =
          "https://via.placeholder.com/1200x600";
      }}
    />

    <div style={s.heroOverlay} />

    <div style={s.heroContent}>
      <div style={s.heroBadge}>
        TOP APP
      </div>

      <div style={s.heroTitle}>
        {featured?.name || "Application"}
      </div>

      <div style={s.heroDesc}>
        {featured?.description ||
          "Découvrez une nouvelle expérience révolutionnaire."}
      </div>

      <button style={s.heroBtn}>
        Explorer
        <ChevronRight size={15} />
      </button>
    </div>
  </motion.div>
) : (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      ...s.hero,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(135deg,#0f172a,#111827)",
      color: "#888",
      fontSize: "13px",
      fontWeight: "700",
    }}
  >
    Chargement des applications...
  </motion.div>
)}

      {/* QUICK STATUS */}
      <div style={s.quickRow}>
        <div style={s.quickCard}>
          <ShieldCheck size={16} />
          <span>100% sécurisé</span>
        </div>

        <div style={s.quickCard}>
          <RefreshCcw size={16} />
          <span>Mises à jour live</span>
        </div>

        <div style={s.quickCard}>
          <Download size={16} />
          <span>Offline Ready</span>
        </div>
      </div>

      {/* SECTION TITLE */}
      <div style={s.sectionHeader}>
        <div>
          <div style={s.sectionTitle}>
            Recommandations
          </div>

          <div style={s.sectionSub}>
            Applications optimisées Android
          </div>
        </div>
      </div>
      
      {/* SECTION BOUTIQUE INKS (BAS DE PAGE) */}
      <div style={{ marginTop: '30px' }}>
        <div style={s.sectionHeader}>
          <div style={s.sectionTitle}>Boutique CRAFT-INK</div>
          <div style={s.sectionSub}>Rechargez votre solde ₵</div>
        </div>

        <div style={s.inkStoreRow}>
          {INK_PACKS.map((pack) => (
            <motion.div
              key={pack.id}
              whileTap={{ scale: 0.95 }}
              style={{ ...s.inkCard, borderLeft: `4px solid ${pack.color}` }}
              onClick={() => handlePurchase(pack)}
            >
              <div style={s.inkAmount}>₵{pack.amount}</div>
              <div style={s.inkPrice}>{pack.price} $</div>
              {pack.bonus && <div style={{...s.inkBadge, color: pack.color}}>{pack.bonus}</div>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* APPS */}
      <div style={s.appsList}>
        {filteredApps.map((app) => (
          <motion.div
            key={app.id}
            whileTap={{ scale: 0.985 }}
            style={s.appCard}
          >
            <div style={s.appIcon}>
              {app.icon}
            </div>

            <div style={s.appInfo}>
              <div style={s.appTop}>
                <div style={s.appName}>
                  {app.name}
                </div>

                <div style={s.rating}>
                  <Star
                    size={11}
                    fill="#FFD700"
                  />
                  {app.rating}
                </div>
              </div>

              <div style={s.meta}>
                {app.developer}
              </div>

              <div style={s.bottomMeta}>
                <span>{app.size}</span>
                <span>•</span>
                <span>{app.downloads}</span>
                <span>•</span>
                <span>v{app.version}</span>
              </div>
            </div>

            <button
              onClick={() =>
                app.isInstalled
                  ? handleUpdate(app)
                  : handleInstall(app)
              }
              disabled={
                installingId === app.id
              }
              style={
                app.isInstalled
                  ? s.updateBtn
                  : s.installBtn
              }
            >
              {installingId === app.id
                ? "..."
                : app.isInstalled
                ? "Update"
                : "Installer"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const s = {
  container: {
    minHeight: "100vh",
    background: "#050816",
    color: "#fff",
    padding: "14px",
    paddingBottom: "110px",
    position: "relative",
    overflowX: "hidden",
    fontFamily: "'Inter', sans-serif",
  },

  glow1: {
    position: "fixed",
    top: "-120px",
    left: "-120px",
    width: "240px",
    height: "240px",
    borderRadius: "999px",
    background: "#00d9ff",
    filter: "blur(140px)",
    opacity: 0.16,
    pointerEvents: "none",
  },

  glow2: {
    position: "fixed",
    bottom: "-120px",
    right: "-120px",
    width: "240px",
    height: "240px",
    borderRadius: "999px",
    background: "#8b5cf6",
    filter: "blur(140px)",
    opacity: 0.16,
    pointerEvents: "none",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
    position: "sticky",
    top: 0,
    zIndex: 50,
    paddingTop: "4px",
    backdropFilter: "blur(16px)",
  },

  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoBox: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg,#00d9ff,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "18px",
    boxShadow:
      "0 10px 30px rgba(0,217,255,0.35)",
  },

  storeName: {
    fontSize: "15px",
    fontWeight: "800",
  },

  storeSub: {
    fontSize: "11px",
    color: "#8b95a7",
    marginTop: "2px",
  },

  headerIcons: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  iconBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profileBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background:
      "linear-gradient(135deg,#00d9ff,#8b5cf6)",
    color: "#fff",
    fontWeight: "900",
    fontSize: "15px",
  },

  feedbackCard: {
    background:
      "linear-gradient(135deg,rgba(0,217,255,0.12),rgba(139,92,246,0.12))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "16px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backdropFilter: "blur(18px)",
  },

  feedbackTitle: {
    fontWeight: "800",
    fontSize: "14px",
    marginBottom: "4px",
  },

  feedbackText: {
    fontSize: "11px",
    color: "#9ca3af",
    lineHeight: 1.5,
  },

  feedbackBtn: {
    height: "42px",
    padding: "0 16px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg,#00d9ff,#8b5cf6)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "700",
    fontSize: "12px",
    flexShrink: 0,
  },

  searchBar: {
    height: "54px",
    borderRadius: "18px",
    padding: "0 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    backdropFilter: "blur(18px)",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "13px",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "8px",
    marginBottom: "16px",
    scrollbarWidth: "none",
  },

  tab: {
    height: "40px",
    padding: "0 14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)",
    color: "#888",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
    fontSize: "12px",
    fontWeight: "700",
  },

  activeTab: {
    background:
      "linear-gradient(135deg,rgba(0,217,255,0.15),rgba(139,92,246,0.15))",
    color: "#fff",
    border: "1px solid rgba(0,217,255,0.18)",
    boxShadow:
      "0 0 30px rgba(0,217,255,0.12)",
  },

  hero: {
    height: "220px",
    borderRadius: "28px",
    overflow: "hidden",
    position: "relative",
    marginBottom: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.15))",
  },

  heroContent: {
    position: "absolute",
    left: "18px",
    right: "18px",
    bottom: "18px",
  },

  heroBadge: {
    display: "inline-flex",
    padding: "5px 10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    fontSize: "10px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  heroTitle: {
    fontSize: "22px",
    fontWeight: "900",
    marginBottom: "6px",
  },

  heroDesc: {
    fontSize: "12px",
    color: "#d1d5db",
    lineHeight: 1.5,
    marginBottom: "14px",
    maxWidth: "280px",
  },

  heroBtn: {
    height: "42px",
    padding: "0 16px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg,#00d9ff,#8b5cf6)",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "800",
    fontSize: "12px",
  },

  quickRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginBottom: "22px",
  },

  quickCard: {
    height: "72px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "10px",
    color: "#d1d5db",
    textAlign: "center",
    backdropFilter: "blur(18px)",
  },

  sectionHeader: {
    marginBottom: "14px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "900",
  },

  sectionSub: {
    marginTop: "4px",
    fontSize: "11px",
    color: "#8b95a7",
  },

  appsList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  appCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "rgba(12,16,28,0.92)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "24px",
    padding: "14px",
    backdropFilter: "blur(18px)",
  },

  appIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#101826,#1c2438)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    flexShrink: 0,
  },

  appInfo: {
    flex: 1,
    minWidth: 0,
  },

  appTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "5px",
  },

  appName: {
    fontSize: "14px",
    fontWeight: "800",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  rating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    color: "#FFD700",
    flexShrink: 0,
  },

  meta: {
    fontSize: "11px",
    color: "#9ca3af",
    marginBottom: "6px",
  },

  bottomMeta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    color: "#6b7280",
    flexWrap: "wrap",
  },
  inkStoreRow: { 
    display: "flex", 
    gap: "12px", 
    overflowX: "auto", 
    padding: "10px 5px 20px 5px", 
    scrollbarWidth: "none" 
  },
  inkCard: { 
    minWidth: "125px", 
    background: "rgba(255,255,255,0.03)", 
    borderRadius: "20px", 
    padding: "15px", 
    display: "flex", 
    flexDirection: "column", 
    gap: "4px", 
    backdropFilter: "blur(10px)", 
    border: "1px solid rgba(255,255,255,0.05)" 
  },
  inkAmount: { fontSize: "18px", fontWeight: "900", color: "#fff" },
  inkPrice: { fontSize: "12px", color: "#8b95a7", fontWeight: "700" },
  inkBadge: { fontSize: "9px", fontWeight: "800", marginTop: "5px", textTransform: "uppercase" },

  installBtn: {
    minWidth: "92px",
    height: "40px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg,#00d9ff,#8b5cf6)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "11px",
    padding: "0 14px",
  },

  updateBtn: {
    minWidth: "92px",
    height: "40px",
    borderRadius: "14px",
    border: "1px solid rgba(0,217,255,0.22)",
    background: "rgba(255,255,255,0.04)",
    color: "#00d9ff",
    fontWeight: "800",
    fontSize: "11px",
    padding: "0 14px",
  },
};