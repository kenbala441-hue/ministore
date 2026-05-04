import React, { useState } from "react";
import { useUserContext } from "./userContext";
import { 
  Wallet, ShoppingBag, Award, 
  TrendingUp, AlertTriangle, RefreshCcw 
} from "lucide-react";

export default function UserWallet({ setView }) {
  // On utilise uniquement les données locales pour l'instant
  const { userData } = useUserContext();
  const [loading, setLoading] = useState(false);
  
  // Simulation des valeurs (en attendant le backend final)
  const [localInks, setLocalInks] = useState(userData?.inks || 0);
  const [localDebt, setLocalDebt] = useState(userData?.debt || 0);

  const transactions = userData?.transactions ? [...userData.transactions].reverse() : [];

  /* ============================================================
     ✅ LOGIQUE SIMPLIFIÉE (SANS CONFLIT DE RÈGLES)
  ============================================================ */
  const handleBorrowSimulation = () => {
    if (localDebt > 0) {
      alert("Vous avez déjà une dette en cours.");
      return;
    }

    if (window.confirm("Demander 500 Inks ? (Simulation d'interface)")) {
      setLoading(true);
      // Ici, on simule visuellement le succès au lieu d'appeler Firebase
      setTimeout(() => {
        setLocalInks(prev => prev + 500);
        setLocalDebt(550); // 500 + 10% intérêt
        setLoading(false);
        alert("✅ Succès ! Votre interface est prête pour le futur backend.");
      }, 800);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => setView("profile")} style={styles.backBtn}>←</button>
        <h2 style={styles.title}>Banque ComicCrafte</h2>
      </div>

      <div style={styles.balanceCard}>
        <div style={styles.balanceInfo}>
          <span style={styles.balanceLabel}>Total Inks</span>
          <h1 style={styles.balanceValue}>
            {localInks} <span style={styles.unit}>Inks</span>
          </h1>
          <div style={styles.convertibleBadge}>
            <TrendingUp size={12} color="#39ff14" />
            <span style={{color: "#39ff14"}}>0 convertibles en $</span>
          </div>
        </div>
        <Wallet size={42} color="#ffd700" opacity={0.8} />
      </div>

      {localDebt > 0 && (
        <div style={styles.debtAlert}>
          <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <AlertTriangle size={18} color="#ff4444" />
            <div>
              <div style={styles.debtTitle}>Dette : {localDebt} Inks</div>
              <div style={styles.debtSub}>+10% d'intérêts inclus</div>
            </div>
          </div>
          <button style={styles.repayBtn} onClick={() => setLocalDebt(0)}>
             <RefreshCcw size={14} /> Rembourser
          </button>
        </div>
      )}

      <div style={styles.quickActions}>
        <button style={styles.actionBtn} onClick={() => alert("Boutique en développement")}>
          Acheter
        </button>
        {localDebt === 0 && (
          <button style={styles.actionBtnSecondary} onClick={handleBorrowSimulation} disabled={loading}>
            {loading ? "Chargement..." : "Emprunter 500"}
          </button>
        )}
      </div>

      <div style={styles.historySection}>
        <h3 style={styles.historyTitle}>Mouvements récents</h3>
        <div style={styles.list}>
          {transactions.map((t, index) => (
            <div key={index} style={styles.transactionRow}>
              <div style={styles.iconBox}>
                <Award size={16} color="#00f7ff"/>
              </div>
              <div style={styles.txInfo}>
                <span style={styles.txReason}>{t.reason}</span>
                <span style={styles.txDate}>---</span>
              </div>
              <div style={styles.txAmount}>+{t.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Les styles restent identiques à ta version précédente
const styles = {
  container: { minHeight: "100vh", backgroundColor: "#050505", color: "#fff", padding: "20px", fontFamily: "Inter, sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" },
  backBtn: { background: "none", border: "none", color: "#fff", fontSize: "28px", cursor: "pointer" },
  title: { fontSize: "20px", fontWeight: "900", letterSpacing: "-0.5px" },
  balanceCard: { background: "linear-gradient(145deg, #0f0f0f 0%, #000 100%)", padding: "25px", borderRadius: "28px", border: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" },
  balanceLabel: { color: "#444", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" },
  balanceValue: { fontSize: "36px", fontWeight: "900", margin: "5px 0" },
  unit: { fontSize: "16px", color: "#ffd700" },
  convertibleBadge: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", marginTop: "10px" },
  debtAlert: { marginTop: "20px", padding: "15px", backgroundColor: "rgba(255, 68, 68, 0.08)", borderRadius: "18px", border: "1px solid rgba(255, 68, 68, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  debtTitle: { fontSize: "14px", fontWeight: "800", color: "#ff4444" },
  debtSub: { fontSize: "11px", color: "#888" },
  repayBtn: { backgroundColor: "#ff4444", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" },
  quickActions: { display: "flex", gap: "12px", margin: "25px 0" },
  actionBtn: { flex: 1, padding: "16px", borderRadius: "16px", border: "none", backgroundColor: "#00f7ff", color: "#000", fontWeight: "900", fontSize: "14px" },
  actionBtnSecondary: { flex: 1, padding: "16px", borderRadius: "16px", border: "1px solid #222", backgroundColor: "transparent", color: "#fff", fontWeight: "700" },
  historySection: { marginTop: "10px" },
  historyTitle: { fontSize: "13px", color: "#444", fontWeight: "800", marginBottom: "15px" },
  transactionRow: { display: "flex", alignItems: "center", padding: "16px", backgroundColor: "#0c0c0c", borderRadius: "20px", marginBottom: "12px" },
  iconBox: { padding: "10px", borderRadius: "14px", marginRight: "15px", backgroundColor: "#39ff1411" },
  txInfo: { flex: 1, display: "flex", flexDirection: "column" },
  txReason: { fontSize: "14px", fontWeight: "700" },
  txDate: { fontSize: "11px", color: "#444" },
  txAmount: { fontWeight: "900", color: "#39ff14" }
};