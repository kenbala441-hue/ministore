import React, { useState, useMemo, useRef } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase/index.js";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Camera, LogOut, Award, PenTool, Shield, Wallet, ChevronRight, AlertCircle } from "lucide-react";
import { useUserContext } from "./userContext";
import { payForProfileUpdate } from "../../services/bankService"; // Import du service banque

const DEFAULT_PROFILE = "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";
const NEON_COLORS = ["#ff003c", "#00f7ff", "#ff00ff", "#39ff14", "#ffd300", "#8f00ff"];

export default function UserProfile({ setView }) {
  const { user, userData, logout } = useUserContext();

  // --- ÉTATS ---
  const [editing, setEditing] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef(null);
  const neonColor = useMemo(() => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)], []);

  // --- CONFIG RÔLES ---
  const roleConfig = {
    admin: { color: "#ff4dff", label: "ADMIN", icon: <Shield size={14} /> },
    vip: { color: "#ffd700", label: "VIP", icon: <Award size={14} /> },
    author: { color: "#ff6a00", label: "AUTEUR", icon: <PenTool size={14} /> },
    standard: { color: "#00f7ff", label: "MEMBRE", icon: <Award size={14} /> },
  };
  const currentRole = roleConfig[userData?.role] || roleConfig.standard;

  // --- COMPRESSION V8 ---
  const compressImage = (file, size = 400, quality = 0.8) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");
        const minSide = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - minSide) / 2, (img.height - minSide) / 2, minSide, minSide, 0, 0, size, size);
        canvas.toBlob((blob) => {
          resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
          URL.revokeObjectURL(url);
        }, "image/jpeg", quality);
      };
      img.onerror = reject;
      img.src = url;
    });

  // --- LOGIQUE DE PAIEMENT & UPLOAD (FUSIONNÉE) ---
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    // 1. Message de confirmation
    const confirmPay = window.confirm(
      `💎 SYSTEM BANQUE :\n\nModifier votre photo coûte 50 Inks.\nVoulez-vous dépenser 50 Inks pour cette action ?`
    );
    if (!confirmPay) return;

    // 2. Vérification rapide côté client (avant upload pour gagner du temps)
    if (userData.inks < 50) {
      alert("❌ SOLDE INSUFFISANT\n\nIl vous manque des Inks. Gagnez-en via vos tâches quotidiennes ou passez à la boutique !");
      return;
    }

    setIsProcessing(true);
    setAvatarPreview(URL.createObjectURL(file)); // Prévisualisation immédiate

    try {
      // 3. Compression
      const compressed = await compressImage(file);
      
      // 4. Upload vers Firebase Storage avec Progression
      const path = `avatars/${user.uid}/${Date.now()}.jpg`;
      const sRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(sRef, compressed);

      uploadTask.on("state_changed", 
        (snap) => {
          const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (err) => { throw err; },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // 5. Transaction Finale (Paiement + Update DB)
          const result = await payForProfileUpdate(user.uid, downloadURL);

          if (result.success) {
            alert("✅ SUCCÈS\n\nVotre profil a été mis à jour. 50 Inks ont été prélevés par la Banque.");
          } else {
            alert(`⚠️ BANQUE :\n\n${result.message}`);
          }
          
          setUploadProgress(null);
          setAvatarPreview(null);
          setIsProcessing(false);
        }
      );
    } catch (err) {
      console.error(err);
      alert("❌ ERREUR\n\nUne erreur est survenue lors de la transaction. Contactez le support si vos Inks ont été débités.");
      setAvatarPreview(null);
      setIsProcessing(false);
      setUploadProgress(null);
    }
  };

  const savePseudo = async () => {
    if (!pseudo || pseudo === userData.username) return setEditing(false);
    try {
      await updateDoc(doc(db, "users", user.uid), { username: pseudo });
      setEditing(false);
    } catch (err) { alert("Erreur lors du changement de pseudo"); }
  };

  if (!userData) return <div style={styles.loader}>Initialisation du Studio...</div>;

  return (
    <div style={styles.page}>
      {/* SECTION HEADER / BANNIÈRE */}
      <div style={{...styles.cover, background: `linear-gradient(to bottom, ${neonColor}55, #050505)`}}>
        <button onClick={() => setView("home")} style={styles.backBtn}>← Retour</button>
      </div>

      {/* CARTE PROFIL */}
      <div style={styles.profileSection}>
        <div style={styles.avatarWrapper}>
          <img 
            src={avatarPreview || userData.photoURL || DEFAULT_PROFILE} 
            style={{...styles.avatar, borderColor: isProcessing ? '#555' : currentRole.color}} 
            alt="Profil" 
          />
          <label style={{...styles.uploadBtn, backgroundColor: isProcessing ? '#333' : currentRole.color}}>
            <Camera size={18} color="#000" />
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleAvatarChange} 
              disabled={isProcessing}
            />
          </label>
          
          {uploadProgress !== null && (
            <div style={styles.progressOverlay}>
              <div style={styles.progressText}>{uploadProgress}%</div>
            </div>
          )}
        </div>

        <div style={styles.infoBlock}>
          {editing ? (
            <input 
              autoFocus 
              onBlur={savePseudo}
              onKeyDown={(e) => e.key === 'Enter' && savePseudo()}
              value={pseudo} 
              onChange={(e) => setPseudo(e.target.value)}
              style={styles.pseudoInput}
              placeholder={userData.username}
            />
          ) : (
            <h2 style={styles.username} onClick={() => {setPseudo(userData.username); setEditing(true);}}>
              {userData.username} <PenTool size={14} style={{opacity: 0.5}} />
            </h2>
          )}
          
          <div style={{...styles.roleBadge, color: currentRole.color, border: `1px solid ${currentRole.color}44`}}>
            {currentRole.icon} {currentRole.label}
          </div>

          <div style={styles.inkDisplay}>
            <Wallet size={16} color="#ffd700" />
            <span style={styles.inkAmount}>{userData.inks || 0} INKS</span>
          </div>
        </div>
      </div>

      {/* GRILLE DE STATS */}
      <div style={styles.statsContainer}>
        <div style={styles.statItem}>
          <span style={styles.statNum}>{userData.followers?.length || 0}</span>
          <span style={styles.statLabel}>Abonnés</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>{userData.following?.length || 0}</span>
          <span style={styles.statLabel}>Suivis</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>{userData.storiesCount || 0}</span>
          <span style={styles.statLabel}>Histoires</span>
        </div>
      </div>

      {/* NAVIGATION / MENU */}
      <div style={styles.menuList}>
        <h3 style={styles.menuTitle}>COMPTE & ÉCONOMIE</h3>
        <MenuRow icon={<Wallet size={20} color="#ffd700"/>} label="Banque & Boutique" onClick={() => setView("wallet")} />
        <MenuRow icon={<PenTool size={20} color="#ff6a00"/>} label="Espace Créateur" onClick={() => setView("author_dashboard")} />
        
        <h3 style={styles.menuTitle}>PARAMÈTRES</h3>
        <MenuRow icon={<Shield size={20} color="#00f7ff"/>} label="Sécurité" onClick={() => setView("profile_security")} />
        
        <button style={styles.logoutBtn} onClick={logout}>
          <LogOut size={18} /> Déconnexion
        </button>
      </div>

      {isProcessing && (
        <div style={styles.processingToast}>
          <AlertCircle size={16} /> Transaction Bancaire en cours...
        </div>
      )}
    </div>
  );
}

// Composant Ligne de Menu
const MenuRow = ({ icon, label, onClick }) => (
  <div style={styles.menuRow} onClick={onClick}>
    <div style={styles.menuRowLeft}>{icon} <span>{label}</span></div>
    <ChevronRight size={18} color="#333" />
  </div>
);

// --- STYLES ---
const styles = {
  page: { minHeight: "100vh", backgroundColor: "#050505", color: "#fff", fontFamily: "'Inter', sans-serif", paddingBottom: "30px" },
  loader: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#00f7ff", fontWeight: "bold" },
  cover: { height: "160px", position: "relative", borderBottom: "1px solid #111" },
  backBtn: { position: "absolute", top: 25, left: 20, backgroundColor: "rgba(0,0,0,0.6)", border: "none", color: "#fff", padding: "10px 18px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", backdropFilter: "blur(5px)" },
  profileSection: { marginTop: "-60px", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 20px" },
  avatarWrapper: { position: "relative", width: "120px", height: "120px", marginBottom: "15px" },
  avatar: { width: "100%", height: "100%", borderRadius: "50%", border: "4px solid #050505", objectFit: "cover", backgroundColor: "#111", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" },
  uploadBtn: { position: "absolute", bottom: "5px", right: "5px", padding: "10px", borderRadius: "50%", cursor: "pointer", display: "flex", boxShadow: "0 4px 15px rgba(0,0,0,0.4)", transition: "0.2s" },
  progressOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.75)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" },
  progressText: { color: "#00f7ff", fontWeight: "900", fontSize: "16px" },
  infoBlock: { textAlign: "center", width: "100%" },
  username: { fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
  pseudoInput: { backgroundColor: "#111", border: "2px solid #00f7ff", color: "#fff", padding: "8px 15px", borderRadius: "12px", textAlign: "center", fontSize: "20px", fontWeight: "bold", width: "80%" },
  roleBadge: { display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "900", padding: "5px 15px", borderRadius: "30px", backgroundColor: "rgba(255,255,255,0.03)", textTransform: "uppercase", letterSpacing: "1px" },
  inkDisplay: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px", padding: "8px 20px", backgroundColor: "#111", borderRadius: "15px", width: "fit-content", margin: "12px auto" },
  inkAmount: { color: "#ffd700", fontWeight: "bold", fontSize: "15px" },
  statsContainer: { display: "flex", margin: "25px 20px", padding: "20px", backgroundColor: "#0a0a0a", borderRadius: "20px", border: "1px solid #151515" },
  statItem: { flex: 1, textAlign: "center" },
  statNum: { display: "block", fontSize: "20px", fontWeight: "900", color: "#fff" },
  statLabel: { fontSize: "10px", color: "#444", textTransform: "uppercase", marginTop: "4px", fontWeight: "700" },
  statDivider: { width: "1px", height: "35px", backgroundColor: "#222" },
  menuList: { padding: "0 20px" },
  menuTitle: { fontSize: "11px", color: "#333", fontWeight: "800", marginBottom: "12px", marginLeft: "10px", textTransform: "uppercase", letterSpacing: "1.5px" },
  menuRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px", backgroundColor: "#0e0e0e", borderRadius: "16px", marginBottom: "12px", cursor: "pointer", transition: "0.2s" },
  menuRowLeft: { display: "flex", alignItems: "center", gap: "15px", fontSize: "15px", fontWeight: "600" },
  logoutBtn: { width: "100%", marginTop: "20px", padding: "18px", backgroundColor: "rgba(255,68,68,0.05)", border: "1px solid rgba(255,68,68,0.1)", borderRadius: "16px", color: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontWeight: "bold", cursor: "pointer" },
  processingToast: { position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#ffd700", color: "#000", padding: "10px 20px", borderRadius: "30px", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", zIndex: 100 }
};
