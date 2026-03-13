// src/screens/users/UserProfile.jsx
// 🔥 USER PROFILE ULTRA PRO — V7 + V8 FUSION (corrigé, upload résumable + snapshot + persistance)
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../../firebase/index.js";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import NeonButton from "../../components/NeonButton";
import { useUserContext } from "./userContext";

const DEFAULT_PROFILE =
  "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";

const NEON_COLORS = ["#ff003c", "#00f7ff", "#ff00ff", "#39ff14", "#ffd300", "#8f00ff"];
const THEMES = { dark: "#050508", light: "#f4f4f8" };

/**
 * UserProfile component
 * - écoute en temps réel le document user via onSnapshot (persistance)
 * - upload d'avatar via uploadBytesResumable (progress + reprise)
 * - compression + crop centré sur le canvas (carré 300x300)
 * - sauvegarde du photoURL dans Firestore (persistant entre écrans)
 * - interface minimale compatible avec ton style néon
 */
export default function UserProfile({ setView }) {
  const { user, setUser } = useUserContext();

  // UI states
  const [editing, setEditing] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // account states
  const [subscriptionEnd, setSubscriptionEnd] = useState(null);
  const [role, setRole] = useState("standard");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [nbStories, setNbStories] = useState(0);
  const [ink, setInk] = useState(0);

  // avatar
  const [avatarPreview, setAvatarPreview] = useState(null); // object url while selecting
  const [uploadProgress, setUploadProgress] = useState(null); // 0..100 or null

  // meta lists
  const [badges, setBadges] = useState([]);
  const [likedStories, setLikedStories] = useState([]);
  const [sharedStories, setSharedStories] = useState([]);

  const inputRef = useRef(null);
  const neonColor = useMemo(
    () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    []
  );

  const roleConfig = {
    admin: { color: "#ff4dff", label: "ADMIN" },
    vip: { color: "#ffd700", label: "VIP" },
    premium: { color: "#00f5ff", label: "PREMIUM" },
    merchant: { color: "#22c55e", label: "COMMERÇANT" },
    author: { color: "#ff6a00", label: "AUTEUR" },
    standard: { color: "#a855f7", label: "STANDARD" },
  };

  const currentRole = roleConfig[role] || roleConfig.standard;

  // CLEANUP preview objectURL on unmount / change
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // -------------------------
  // Real-time listener for the user's document so photoURL/pseudo stay persisted
  // -------------------------
  useEffect(() => {
    if (!user?.uid) return;
    const userDocRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();

        // merge into context safely (preserve other context fields)
        setUser((prev) => ({ ...(prev || {}), ...data }));

        // local states
        setPseudo(data.pseudo || "");
        setRole(data.role || "standard");
        setFollowers(data.followersCount || 0);
        setFollowing(data.followingCount || 0);
        setNbStories(data.storiesCount || 0);
        setInk(data.ink || 0);
        setBadges(data.badges || []);
        setLikedStories(data.likedStories || []);
        setSharedStories(data.sharedStories || []);
        setSubscriptionEnd(data.subscriptionEnd ? new Date(data.subscriptionEnd) : null);
      },
      (err) => {
        console.error("onSnapshot user error:", err);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, setUser]);

  // -------------------------
  // Subscription expiry verification (in case DB changed)
  // -------------------------
  useEffect(() => {
    if (!subscriptionEnd || !user?.uid) return;
    const now = new Date();
    if (now > subscriptionEnd) {
      setRole("standard");
      setSubscriptionEnd(null);
      updateDoc(doc(db, "users", user.uid), { role: "standard", subscriptionEnd: null }).catch(
        (e) => console.error("Erreur update expiry:", e)
      );
    }
  }, [subscriptionEnd, user?.uid]);

  // -------------------------
  // Pseudo save
  // -------------------------
  const savePseudo = async () => {
    if (!user?.uid) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { pseudo });
      setUser((prev) => ({ ...(prev || {}), pseudo }));
      setEditing(false);
    } catch (err) {
      console.error("Erreur sauvegarde pseudo:", err);
    }
  };

  // -------------------------
  // Activate subscription (1 month)
  // -------------------------
  const activateOffer = async (type) => {
    if (!user?.uid) return;
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      setRole(type);
      setSubscriptionEnd(endDate);
      await updateDoc(doc(db, "users", user.uid), {
        role: type,
        subscriptionEnd: endDate.toISOString(),
      });
    } catch (err) {
      console.error("Erreur activation offre:", err);
    }
  };

  // -------------------------
  // Image compression + crop center -> returns File
  // -------------------------
  const compressImage = (file, size = 300, quality = 0.85) =>
    new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");

          // center-crop square
          const minSide = Math.min(img.width, img.height);
          ctx.drawImage(
            img,
            (img.width - minSide) / 2,
            (img.height - minSide) / 2,
            minSide,
            minSide,
            0,
            0,
            size,
            size
          );

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Compression failed"));
              const f = new File([blob], "avatar.jpg", { type: "image/jpeg" });
              resolve(f);
              URL.revokeObjectURL(url);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e);
        };
        img.src = url;
      } catch (e) {
        reject(e);
      }
    });

  // -------------------------
  // Upload avatar with progress & resumable upload
  // - persists final downloadURL in Firestore
  // - updates user context after success
  // -------------------------
  const handleAvatarChange = async (e) => {
    if (!user?.uid) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // basic client-side validation
    const maxMb = 5;
    if (!file.type.startsWith("image/")) {
      return alert("Veuillez choisir une image valide.");
    }
    if (file.size > maxMb * 1024 * 1024) {
      return alert(`Image trop lourde (max ${maxMb}MB).`);
    }

    // preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    try {
      // compress + crop
      const compressed = await compressImage(file, 400, 0.8);

      // storage path with timestamp to avoid caching collisions
      const path = `avatars/${user.uid}/${Date.now()}.jpg`;
      const sRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(sRef, compressed);

      setUploadProgress(0);

      // handle progress & completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error("upload error:", error);
          setUploadProgress(null);
          // keep preview but don't clear it — user can retry
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // save URL to Firestore (persistant)
            await updateDoc(doc(db, "users", user.uid), {
              photoURL: downloadURL,
              photoUpdatedAt: serverTimestamp(),
            });

            // update local context
            setUser((prev) => ({ ...(prev || {}), photoURL: downloadURL }));

            // cleanup preview & progress
            setAvatarPreview(null);
            setUploadProgress(null);
          } catch (err) {
            console.error("Erreur finalisation upload:", err);
            setUploadProgress(null);
          }
        }
      );
    } catch (err) {
      console.error("Erreur handleAvatarChange:", err);
      setUploadProgress(null);
    }
  };

  // -------------------------
  // Buy theme using local ink (synchronous client-side check + DB update)
  // -------------------------
  const buyTheme = async () => {
    if (!user?.uid) return;
    if (ink < 50) return alert("Pas assez de Ink");
    try {
      const newInk = ink - 50;
      await updateDoc(doc(db, "users", user.uid), { ink: newInk });
      setInk(newInk);
      setDarkMode((d) => !d);
    } catch (err) {
      console.error("Erreur achat thème:", err);
    }
  };

  // -------------------------
  // Navigation helpers
  // -------------------------
  const openAuthorPanel = () => {
    if (role === "author" || role === "admin") {
      setView("author_dashboard");
    } else if (window.confirm("Votre grade ne permet pas cette fonction. Voulez-vous devenir Auteur ?")) {
      setView("author_apply");
    }
  };

  const openAdminPanel = () => {
    if (role === "admin") setView("admin");
    else alert("Votre grade ne correspond pas pour accéder à l'administration.");
  };

  const daysLeft = subscriptionEnd
    ? Math.max(0, Math.ceil((subscriptionEnd - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  // -------------------------
  // Render
  // -------------------------
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "25px",
        fontFamily: "Inter, system-ui, sans-serif",
        background: darkMode
          ? `radial-gradient(circle at 50% 0%, ${neonColor}22, ${THEMES.dark} 80%)`
          : THEMES.light,
        color: darkMode ? "#fff" : "#111",
        transition: "0.3s",
      }}
    >
      {/* Header / Avatar */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <label htmlFor="avatarInput" style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
          <img
            src={avatarPreview || user?.photoURL || DEFAULT_PROFILE}
            alt="avatar"
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              border: `3px solid ${currentRole.color}`,
              boxShadow: `0 0 25px ${currentRole.color}`,
              objectFit: "cover",
              transition: "transform .18s ease, box-shadow .18s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = `0 0 40px ${currentRole.color}`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = `0 0 25px ${currentRole.color}`;
            }}
          />
        </label>

        <input
          ref={inputRef}
          id="avatarInput"
          type="file"
          accept="image/*"
          hidden
          onChange={handleAvatarChange}
        />

        <div style={{ fontSize: 11, marginTop: 8 }}>Modifier la photo</div>

        {uploadProgress !== null && (
          <div style={{ width: 160, margin: "8px auto 0", textAlign: "center" }}>
            <div style={{ height: 8, background: "#222", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ width: `${uploadProgress}%`, height: "100%", background: neonColor }} />
            </div>
            <div style={{ fontSize: 12, marginTop: 6 }}>{uploadProgress}%</div>
          </div>
        )}

        {editing ? (
          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            style={{
              marginTop: 15,
              padding: 8,
              borderRadius: 8,
              border: "none",
              textAlign: "center",
              width: 220,
            }}
            placeholder="Ton pseudo"
          />
        ) : (
          <h2 style={{ marginTop: 12 }}>{user?.displayName || pseudo || "Utilisateur"}</h2>
        )}

        <div style={{ fontWeight: "700", color: currentRole.color }}>{currentRole.label}</div>

        {subscriptionEnd && (
          <div style={{ marginTop: 6, fontSize: 13 }}>
            Offre valide : <strong>{daysLeft} jour{daysLeft > 1 ? "s" : ""}</strong>
          </div>
        )}

        {/* badges */}
        <div style={{ marginTop: 10 }}>
          {badges?.length ? (
            badges.map((b, i) => (
              <span
                key={b.id || `${b.label}-${i}`}
                style={{
                  margin: 4,
                  padding: "6px 8px",
                  background: b.color || "#333",
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 12,
                  display: "inline-block",
                }}
              >
                {b.label}
              </span>
            ))
          ) : (
            <div style={{ fontSize: 12, color: "#9aa" }}>Aucun badge</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18 }}>
        {editing ? (
          <NeonButton color={neonColor} label="💾 Enregistrer" onClick={savePseudo} />
        ) : (
          <NeonButton color={neonColor} label="✏ Modifier" onClick={() => setEditing(true)} />
        )}
        <NeonButton color={neonColor} label="🎨 Thème (50 Ink)" onClick={buyTheme} />
        <NeonButton color={neonColor} label="📤 Exporter profil" onClick={() => alert("Feature non disponible")} />
      </div>

      {/* Subscription / Offers */}
      <section style={{ marginTop: 12, textAlign: "center" }}>
        <h3 style={{ marginBottom: 8 }}>Abonnement</h3>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => activateOffer("premium")} style={smallBtnStyle(neonColor)}>Premium</button>
          <button onClick={() => activateOffer("vip")} style={smallBtnStyle(neonColor)}>VIP</button>
          <button onClick={() => activateOffer("merchant")} style={smallBtnStyle(neonColor)}>Commerçant</button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ display: "flex", justifyContent: "space-around", marginTop: 28 }}>
        <div style={statBoxStyle()}><div style={{ fontSize: 20, fontWeight: 700 }}>{followers}</div><div>Abonnés</div></div>
        <div style={statBoxStyle()}><div style={{ fontSize: 20, fontWeight: 700 }}>{following}</div><div>Abonnements</div></div>
        <div style={statBoxStyle()}><div style={{ fontSize: 20, fontWeight: 700 }}>{nbStories}</div><div>Stories</div></div>
        <div style={statBoxStyle()}><div style={{ fontSize: 20, fontWeight: 700 }}>{likedStories.length}</div><div>Likes</div></div>
        <div style={statBoxStyle()}><div style={{ fontSize: 20, fontWeight: 700 }}>{sharedStories.length}</div><div>Partages</div></div>
      </section>

      {/* Menu */}
      <div style={{ marginTop: 36 }}>
        <div style={menuRowStyle()} onClick={() => setView("profile_theme")}>🎨 Thème & Apparence</div>
        <div style={menuRowStyle()} onClick={() => setView("profile_security")}>🔐 Sécurité</div>
        <div style={menuRowStyle()} onClick={openAuthorPanel}>✍️ Espace Auteur</div>
        <div style={menuRowStyle()} onClick={openAdminPanel}>🛠️ Administration</div>
        <div style={menuRowStyle()} onClick={() => setView("wallet")}>💰 Wallet Ink : {ink}</div>
        <div style={menuRowStyle()} onClick={() => setView("home")}>← Retour accueil</div>
      </div>
    </div>
  );
}

/* ---------- small helpers (styles) ---------- */
function smallBtnStyle(accent) {
  return {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: accent,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  };
}
function statBoxStyle() {
  return {
    textAlign: "center",
    minWidth: 90,
    padding: "6px 8px",
    borderRadius: 8,
    background: "#0b0b0b22",
  };
}
function menuRowStyle() {
  return {
    padding: "12px 10px",
    borderRadius: 8,
    margin: "8px 0",
    background: "#00000018",
    cursor: "pointer",
  };
}