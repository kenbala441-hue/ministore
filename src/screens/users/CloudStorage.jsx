import React, { useState } from "react";
import { ChevronLeft, Cloud, CloudLightning, RefreshCw, CheckCircle, Database } from "lucide-react";

export default function CloudStorage({ setView }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("Il y a 5 minutes");

  const handleSync = () => {
    setIsSyncing(true);
    
    // Simulation d'une synchronisation Firestore
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date().toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
      setLastSync(`Aujourd'hui à ${now}`);
      alert("✅ Données synchronisées avec le Cloud ComicCraft !");
    }, 1500);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => setView("profile")}>
          <ChevronLeft size={24} color="#fff" />
        </button>
        <h2 style={styles.headerTitle}>Sauvegarde Cloud</h2>
      </div>

      <div style={styles.content}>
        <div style={styles.iconContainer}>
          {isSyncing ? (
            <RefreshCw size={64} color="#00f7ff" style={styles.spinning} />
          ) : (
            <Cloud size={64} color="#00f7ff" />
          )}
        </div>

        <div style={styles.statusBox}>
          <h3 style={styles.statusTitle}>Statut de la synchronisation</h3>
          <p style={styles.statusText}>
            Dernière sauvegarde : <strong style={{ color: "#00f7ff" }}>{lastSync}</strong>
          </p>
        </div>

        {/* DETAILS DES DONNEES SAUVEGARDEES */}
        <div style={styles.infoList}>
          <div style={styles.infoRow}>
            <div style={styles.infoLeft}>
              <Database size={16} color="#666" />
              <span>Progression & Lectures</span>
            </div>
            <CheckCircle size={16} color="#39ff14" />
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoLeft}>
              <Database size={16} color="#666" />
              <span>Solde de INKS (Portefeuille)</span>
            </div>
            <CheckCircle size={16} color="#39ff14" />
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoLeft}>
              <Database size={16} color="#666" />
              <span>Préférences de l'application</span>
            </div>
            <CheckCircle size={16} color="#39ff14" />
          </div>
        </div>

        <p style={styles.warningText}>
          💡 Vos données sont liées de manière sécurisée à votre identifiant unique. En cas de changement d'appareil, connectez-vous simplement à votre compte pour tout récupérer.
        </p>

        <button 
          style={{ ...styles.syncBtn, opacity: isSyncing ? 0.6 : 1 }} 
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw size={18} style={isSyncing ? styles.spinning : {}} />
          {isSyncing ? "Synchronisation..." : "Sauvegarder maintenant"}
        </button>
      </div>
    </div>
  );
}const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "40px 20px 20px 20px",
    background: "#0d0d0d",
    borderBottom: "1px solid #151515",
  },
  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
  },
  content: {
    padding: "30px 20px 120px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconContainer: {
    margin: "40px 0",
  },
  statusBox: {
    textAlign: "center",
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 6,
  },
  statusText: {
    color: "#aaa",
    fontSize: 14,
  },
  infoList: {
    width: "100%",
    background: "#0f0f0f",
    borderRadius: 18,
    padding: "10px 18px",
    marginBottom: 25,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #151515",
  },
  infoLeft: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    fontSize: 14,
  },
  warningText: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    lineHeight: "1.6",
    marginBottom: 40,
  },
  syncBtn: {
    width: "100%",
    padding: 18,
    borderRadius: 18,
    border: "none",
    background: "#00f7ff",
    color: "#000",
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    cursor: "pointer",
  },
  rewardCard: {
    width: "100%",
    background: "#0f0f0f",
    borderRadius: 20,
    padding: 20,
    boxSizing: "border-box",
    marginBottom: 30,
    border: "1px solid #222",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTag: {
    fontSize: 11,
    fontWeight: 900,
    color: "#ff00ff",
    letterSpacing: "1px",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 900,
    margin: "0 0 6px 0",
  },
  cardDesc: {
    fontSize: 13,
    color: "#aaa",
    margin: "0 0 20px 0",
    lineHeight: "1.5",
  },
  claimBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  sectionTitle: {
    width: "100%",
    fontSize: 12,
    fontWeight: 700,
    color: "#555",
    marginBottom: 15,
    letterSpacing: "1px",
  },
  missionRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f0f0f",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    boxSizing: "border-box",
  },
  missionLeft: {
    display: "flex",
    gap: 14,
    alignItems: "center",
  },
  missionName: {
    fontSize: 14,
    fontWeight: 700,
  },
  missionProgress: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  rewardBadge: {
    background: "rgba(255, 215, 0, 0.1)",
    color: "#ffd700",
    padding: "6px 12px",
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 800,
  },
  spinning: {
    animation: "spin 2s linear infinite",
  }
};

