import React, { useState, useMemo, useRef } from "react";
import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  Camera,
  LogOut,
  Award,
  PenTool,
  Shield,
  Wallet,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Flame,
  Trophy,
  Clock3,
  Settings,
  Star,
  Cloud,
} from "lucide-react";

import { db, storage } from "../../firebase/index.js";
import { useUserContext } from "./userContext";

import {
  payForProfileUpdate,
} from "../../services/bankService";

const DEFAULT_PROFILE =
  "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";

const PROFILE_UPDATE_COST = 50;

const NEON_COLORS = [
  "#00f7ff",
  "#ff00ff",
  "#39ff14",
  "#ffd300",
  "#8f00ff",
  "#ff4d6d",
];

export default function UserProfile({ setView }) {
  const { user, userData, logout } =
    useUserContext();

  const [editing, setEditing] = useState(false);
  const [pseudo, setPseudo] = useState("");

  const [uploadProgress, setUploadProgress] =
    useState(null);

  const [avatarPreview, setAvatarPreview] =
    useState(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [bankMessage, setBankMessage] =
    useState("");

  const neonColor = useMemo(
    () =>
      NEON_COLORS[
        Math.floor(
          Math.random() * NEON_COLORS.length
        )
      ],
    []
  );

  const roleConfig = {
    admin: {
      color: "#ff4dff",
      label: "ADMIN",
    },
    vip: {
      color: "#ffd700",
      label: "VIP",
    },
    author: {
      color: "#ff8800",
      label: "AUTHOR",
    },
    standard: {
      color: "#00f7ff",
      label: "MEMBRE",
    },
  };

  const currentRole =
    roleConfig[userData?.role] ||
    roleConfig.standard;

  /* =========================================================
     IMAGE COMPRESS
  ========================================================= */

  const compressImage = (
    file,
    size = 500,
    quality = 0.82
  ) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas =
          document.createElement("canvas");

        canvas.width = size;
        canvas.height = size;

        const ctx =
          canvas.getContext("2d");

        const minSide = Math.min(
          img.width,
          img.height
        );

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
            resolve(
              new File(
                [blob],
                "avatar.jpg",
                {
                  type: "image/jpeg",
                }
              )
            );

            URL.revokeObjectURL(url);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = reject;
      img.src = url;
    });

  /* =========================================================
     AVATAR UPDATE
  ========================================================= */

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !user?.uid) return;

    const confirmPay =
      window.confirm(
        `💎 MODIFICATION PROFIL\n\nChanger votre photo coûte ${PROFILE_UPDATE_COST} INKS.\n\nContinuer ?`
      );

    if (!confirmPay) return;

    setIsProcessing(true);

    try {
      /* ============================================
         ÉTAPE 1 : VALIDATION BANQUE
      ============================================ */

      const payment =
        await payForProfileUpdate(
          user.uid,
          "VALIDATE_ONLY"
        );

      if (!payment.success) {
        setBankMessage(
          payment.message ||
            "Solde insuffisant"
        );

        alert(
          "❌ SOLDE INSUFFISANT\n\nVous n'avez pas assez d'INKS."
        );

        setView?.("store");

        setIsProcessing(false);

        return;
      }

      /* ============================================
         ÉTAPE 2 : PREVIEW
      ============================================ */

      setAvatarPreview(
        URL.createObjectURL(file)
      );

      /* ============================================
         ÉTAPE 3 : COMPRESSION
      ============================================ */

      const compressed =
        await compressImage(file);

      /* ============================================
         ÉTAPE 4 : UPLOAD STORAGE
      ============================================ */

      const path = `avatars/${
        user.uid
      }/${Date.now()}.jpg`;

      const sRef = storageRef(
        storage,
        path
      );

      const uploadTask =
        uploadBytesResumable(
          sRef,
          compressed
        );

      uploadTask.on(
        "state_changed",

        (snap) => {
          const progress = Math.round(
            (snap.bytesTransferred /
              snap.totalBytes) *
              100
          );

          setUploadProgress(progress);
        },

        async (error) => {
          console.error(error);

          alert(
            "❌ Upload impossible."
          );

          setIsProcessing(false);
          setUploadProgress(null);
          setAvatarPreview(null);
        },

        async () => {
          try {
            const downloadURL =
              await getDownloadURL(
                uploadTask.snapshot.ref
              );

            /* ============================================
               ÉTAPE 5 : DÉBIT FINAL
            ============================================ */

            const finalize =
              await payForProfileUpdate(
                user.uid,
                downloadURL
              );

            if (!finalize.success) {
              alert(
                "❌ Banque refusée."
              );

              setIsProcessing(false);

              return;
            }

            /* ============================================
               ÉTAPE 6 : UPDATE FIRESTORE
            ============================================ */

            await updateDoc(
              doc(db, "users", user.uid),
              {
                photoURL: downloadURL,
                updatedAt:
                  serverTimestamp(),
              }
            );

            alert(
              "✅ Profil mis à jour."
            );

            setUploadProgress(null);
            setAvatarPreview(null);
            setIsProcessing(false);
          } catch (err) {
            console.error(err);

            alert(
              "❌ Erreur système."
            );

            setIsProcessing(false);
          }
        }
      );
    } catch (err) {
      console.error(err);

      alert(
        "❌ Transaction impossible."
      );

      setIsProcessing(false);
    }
  };

  /* =========================================================
     USERNAME UPDATE
  ========================================================= */

  const savePseudo = async () => {
    if (
      !pseudo ||
      pseudo === userData?.username
    ) {
      setEditing(false);
      return;
    }

    const confirmPay =
      window.confirm(
        "Modifier votre pseudo coûte 20 INKS.\n\nContinuer ?"
      );

    if (!confirmPay) return;

    setIsProcessing(true);

    try {
      const payment =
        await payForProfileUpdate(
          user.uid,
          "USERNAME_CHANGE"
        );

      if (!payment.success) {
        alert(
          "❌ Solde insuffisant."
        );

        setView?.("store");

        setIsProcessing(false);

        return;
      }

      await updateDoc(
        doc(db, "users", user.uid),
        {
          username: pseudo,
          updatedAt:
            serverTimestamp(),
        }
      );

      alert(
        "✅ Pseudo mis à jour."
      );

      setEditing(false);
    } catch (err) {
      console.error(err);

      alert(
        "❌ Impossible de modifier le pseudo."
      );
    }

    setIsProcessing(false);
  };

  if (!userData) {
    return (
      <div style={styles.loader}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* COVER */}

      <div
        style={{
          ...styles.cover,
          background: `linear-gradient(to bottom, ${neonColor}55, #050505)`,
        }}
      >
        <button
          style={styles.backBtn}
          onClick={() => setView("home")}
        >
          ← Retour
        </button>
      </div>

      {/* PROFILE */}

      <div style={styles.profileSection}>
        <div style={styles.avatarWrapper}>
          <img
            src={
              avatarPreview ||
              userData.photoURL ||
              DEFAULT_PROFILE
            }
            alt="profil"
            style={{
              ...styles.avatar,
              borderColor:
                currentRole.color,
            }}
          />

          <label
            style={{
              ...styles.uploadBtn,
              background:
                currentRole.color,
            }}
          >
            <Camera
              size={18}
              color="#000"
            />

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={
                handleAvatarChange
              }
            />
          </label>

          {uploadProgress !==
            null && (
            <div
              style={
                styles.progressOverlay
              }
            >
              {uploadProgress}%
            </div>
          )}
        </div>

        {/* USER */}

        <div style={styles.infoBlock}>
          {editing ? (
            <input
              autoFocus
              value={pseudo}
              onChange={(e) =>
                setPseudo(
                  e.target.value
                )
              }
              onBlur={savePseudo}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                savePseudo()
              }
              style={
                styles.pseudoInput
              }
            />
          ) : (
            <h2
              style={styles.username}
              onClick={() => {
                setPseudo(
                  userData.username
                );

                setEditing(true);
              }}
            >
              {userData.username}
            </h2>
          )}

          <div
            style={{
              ...styles.roleBadge,
              color:
                currentRole.color,
            }}
          >
            {currentRole.label}
          </div>

          <div style={styles.inkDisplay}>
            <Wallet
              size={15}
              color="#ffd700"
            />

            <span
              style={styles.inkAmount}
            >
              {userData.inks || 0} INKS
            </span>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div style={styles.statsContainer}>
        <Stat
          icon={<BookOpen size={16} />}
          value={
            userData.booksRead || 0
          }
          label="Lectures"
        />

        <Stat
          icon={<Flame size={16} />}
          value={
            userData.streak || 0
          }
          label="Streak"
        />

        <Stat
          icon={<Trophy size={16} />}
          value={
            userData.level || 1
          }
          label="Niveau"
        />

        <Stat
          icon={<Clock3 size={16} />}
          value={
            userData.hoursRead || 0
          }
          label="Heures"
        />
      </div>

      {/* MENUS */}

      <div style={styles.menuList}>
        <MenuRow
          icon={
            <Wallet
              size={18}
              color="#ffd700"
            />
          }
          label="Banque & Boutique"
          onClick={() =>
            setView("wallet")
          }
        />

        <MenuRow
          icon={
            <Cloud
              size={18}
              color="#00f7ff"
            />}
          label="Sauvegarde Cloud"
         onClick={() => setView("cloud")}
        />

       <MenuRow
          icon={<Star size={18} color="#ff00ff" />}
          label="Récompenses"
          onClick={() => setView("rewards")}
        />  

        <MenuRow
          icon={<Settings size={18} color="#39ff14" />}
          label="Paramètres"
          onClick={() => setView("settings")}
        />

        <button
          style={styles.logoutBtn}
          onClick={logout}
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>

      {isProcessing && (
        <div style={styles.processingToast}>
          <AlertCircle size={15} />
          Transaction bancaire...
        </div>
      )}
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}) {
  return (
    <div style={styles.statItem}>
      <div style={styles.statIcon}>
        {icon}
      </div>

      <div style={styles.statNum}>
        {value}
      </div>

      <div style={styles.statLabel}>
        {label}
      </div>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  onClick,
}) {
  return (
    <div
      style={styles.menuRow}
      onClick={onClick}
    >
      <div style={styles.menuRowLeft}>
        {icon}
        <span>{label}</span>
      </div>

      <ChevronRight
        size={16}
        color="#555"
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#fff",
    paddingBottom: "120px",
    fontFamily: "Inter",
  },

  loader: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cover: {
    height: 170,
  },

  backBtn: {
    margin: 20,
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    background:
      "rgba(0,0,0,0.45)",
    color: "#fff",
  },

  profileSection: {
    marginTop: -60,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    border: "4px solid",
    objectFit: "cover",
  },

  uploadBtn: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 42,
    height: 42,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  progressOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "rgba(0,0,0,0.7)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  infoBlock: {
    textAlign: "center",
    marginTop: 15,
  },

  username: {
    fontSize: 26,
    fontWeight: 900,
  },

  pseudoInput: {
    background: "#111",
    border:
      "2px solid #00f7ff",
    color: "#fff",
    padding: 12,
    borderRadius: 14,
    textAlign: "center",
  },

  roleBadge: {
    marginTop: 10,
    fontWeight: 800,
  },

  inkDisplay: {
    marginTop: 14,
  },

  inkAmount: {
    color: "#ffd700",
    fontWeight: 900,
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,1fr)",
    gap: 12,
    padding: 20,
  },

  statItem: {
    background: "#0d0d0d",
    borderRadius: 18,
    padding: 15,
    textAlign: "center",
  },

  statIcon: {
    marginBottom: 8,
  },

  statNum: {
    fontWeight: 900,
  },

  statLabel: {
    fontSize: 11,
    color: "#666",
  },

  menuList: {
    padding: 20,
  },

  menuRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    background: "#0f0f0f",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  menuRowLeft: {
    display: "flex",
    gap: 14,
    alignItems: "center",
  },

  logoutBtn: {
    width: "100%",
    padding: 18,
    borderRadius: 18,
    border: "none",
    background: "#1a0505",
    color: "#ff5555",
    fontWeight: 900,
  },

  processingToast: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform:
      "translateX(-50%)",
    background: "#ffd700",
    color: "#000",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
};