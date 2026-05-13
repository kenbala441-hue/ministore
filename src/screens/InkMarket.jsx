import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
  collection,
  query,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

import { motion, AnimatePresence } from "framer-motion";
import {
  Gem,
  Crown,
  ShieldCheck,
  Sparkles,
  Wallet,
  Gift,
  BadgeCheck,
  Loader2,
  Ticket,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* =========================================================
   CONFIG PACKS STYLE WEBTOON / MODERNE
========================================================= */

const DEFAULT_PACKS = [
  {
    id: "starter",
    amount: 40,
    bonus: 0,
    price: 0.5,
    label: "STARTER",
    color: "#00f5d4",
    popular: false,
  },
  {
    id: "basic",
    amount: 100,
    bonus: 5,
    price: 1.2,
    label: "BASIC",
    color: "#8b5cf6",
    popular: false,
  },
  {
    id: "popular",
    amount: 200,
    bonus: 25,
    price: 2,
    label: "POPULAIRE",
    color: "#ff00aa",
    popular: true,
  },
  {
    id: "premium",
    amount: 1100,
    bonus: 100,
    price: 10,
    label: "PREMIUM",
    color: "#ffd700",
    popular: false,
  },
  {
    id: "elite",
    amount: 2400,
    bonus: 400,
    price: 20,
    label: "ELITE",
    color: "#39ff14",
    popular: false,
  },
  {
    id: "legend",
    amount: 6500,
    bonus: 1500,
    price: 50,
    label: "LEGEND",
    color: "#ff3c3c",
    popular: false,
  },
];

export default function InkMarket({ setView }) {
  const [balance, setBalance] = useState(0);
  const [packs, setPacks] = useState(DEFAULT_PACKS);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState(null);

  /* =========================================================
     USER LISTENER
  ========================================================= */

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        setBalance(snap.data().ink || 0);
      }
    });

    return () => unsub();
  }, []);

  /* =========================================================
     LOAD PACKS FIREBASE
  ========================================================= */

  useEffect(() => {
    const q = query(collection(db, "ink_packs"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          setPacks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      },
      () => {
        setPacks(DEFAULT_PACKS);
      }
    );

    return () => unsub();
  }, []);

  /* =========================================================
     LOAD SUBSCRIPTIONS
  ========================================================= */

  useEffect(() => {
    const q = query(collection(db, "subscriptions"));

    const unsub = onSnapshot(q, (snap) => {
      setSubscriptions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* =========================================================
     ACHAT PACK
  ========================================================= */

  const buyInkPack = async (pack) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Connectez-vous pour continuer.");
      return;
    }

    const total = pack.amount + (pack.bonus || 0);

    const confirmBuy = window.confirm(
      `💎 BANQUE CRAFTCOMIC\n\nAcheter ${total} ₵ pour ${pack.price}$ ?`
    );

    if (!confirmBuy) return;

    try {
      setProcessing(true);

      /* 
        PLUS TARD :
        Ici tu connectes Stripe / PayPal / Mobile Money.
        Pour l’instant simulation paiement OK.
      */

      await updateDoc(doc(db, "users", user.uid), {
        ink: increment(total),
      });

      // historique transaction
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "ink_purchase",
        packId: pack.id,
        amount: pack.amount,
        bonus: pack.bonus || 0,
        total,
        price: pack.price,
        createdAt: serverTimestamp(),
      });

      alert(`✅ Achat validé\n\n+${total} ₵ ajoutés.`);
    } catch (err) {
      console.error(err);
      alert("❌ Transaction échouée.");
    } finally {
      setProcessing(false);
    }
  };

  /* =========================================================
     OFFRES GRATUITES
  ========================================================= */

  const claimFreeInk = async (amount, source) => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ink: increment(amount),
      });

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "free_reward",
        source,
        amount,
        createdAt: serverTimestamp(),
      });

      alert(`🎉 +${amount} ₵ reçus`);
    } catch (err) {
      alert("Erreur récompense");
    }
  };

  /* =========================================================
     PROMO CODE
  ========================================================= */

  const redeemPromoCode = async () => {
    const user = auth.currentUser;

    if (!user || !promoCode.trim()) return;

    try {
      setProcessing(true);

      const code = promoCode.trim().toUpperCase();

      const promoSnap = await getDocs(query(collection(db, "promo_codes")));

      const promos = promoSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const found = promos.find((p) => p.code === code);

      if (!found) {
        setPromoMessage({
          type: "error",
          text: "Code promo invalide",
        });
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        ink: increment(found.reward || 0),
      });

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "promo_code",
        code,
        amount: found.reward,
        createdAt: serverTimestamp(),
      });

      setPromoMessage({
        type: "success",
        text: `+${found.reward} ₵ ajoutés`,
      });

      setPromoCode("");
    } catch (err) {
      console.error(err);

      setPromoMessage({
        type: "error",
        text: "Erreur système",
      });
    } finally {
      setProcessing(false);
    }
  };

  /* =========================================================
     ABONNEMENTS
  ========================================================= */

  const subscribe = async (plan) => {
    const user = auth.currentUser;

    if (!user) return;

    const confirmSub = window.confirm(
      `👑 Activer le plan ${plan.name} ?`
    );

    if (!confirmSub) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        plan: plan.id,
        verified: true,
      });

      alert(`👑 Bienvenue dans ${plan.name}`);
    } catch (err) {
      alert("Erreur abonnement");
    }
  };

  const totalBonus = useMemo(() => {
    return packs.reduce((acc, p) => acc + (p.bonus || 0), 0);
  }, [packs]);

  if (loading) {
    return (
      <div style={s.loader}>
        <Loader2 size={40} className="spin" />
        <div>Chargement de la Banque...</div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* HEADER */}

      <div style={s.topBar}>
        <button style={s.backBtn} onClick={() => setView?.("home")}>
          ← Retour
        </button>

        <div style={s.secureBadge}>
          <ShieldCheck size={14} />
          Banque Sécurisée
        </div>
      </div>

      {/* WALLET */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={s.walletCard}
      >
        <div style={s.walletTop}>
          <div>
            <div style={s.walletLabel}>Votre Solde</div>
            <div style={s.balance}>₵ {balance.toLocaleString()}</div>
          </div>

          <div style={s.walletIcon}>
            <Wallet size={28} />
          </div>
        </div>

        <div style={s.walletStats}>
          <span>💎 Packs premium</span>
          <span>🎁 Bonus total +{totalBonus} ₵</span>
        </div>
      </motion.div>

      {/* GRATUIT */}

      <div style={s.section}>
        <div style={s.sectionTitle}>
          <Gift size={18} />
          Gagner gratuitement
        </div>

        <div style={s.freeRow}>
          <motion.div
            whileTap={{ scale: 0.95 }}
            style={s.rewardCard}
            onClick={() => claimFreeInk(2, "ads")}
          >
            <div style={s.rewardEmoji}>📺</div>
            <div style={s.rewardTitle}>Regarder une pub</div>
            <div style={s.rewardValue}>+2 ₵</div>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.95 }}
            style={s.rewardCard}
            onClick={() => claimFreeInk(10, "survey")}
          >
            <div style={s.rewardEmoji}>📝</div>
            <div style={s.rewardTitle}>Mini sondage</div>
            <div style={s.rewardValue}>+10 ₵</div>
          </motion.div>
        </div>
      </div>

      {/* PROMO */}

      <div style={s.section}>
        <div style={s.sectionTitle}>
          <Ticket size={18} />
          Code Promo
        </div>

        <div style={s.promoBox}>
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Entrer un code promo"
            style={s.promoInput}
          />

          <button
            style={s.promoBtn}
            onClick={redeemPromoCode}
            disabled={processing}
          >
            Activer
          </button>
        </div>

        <AnimatePresence>
          {promoMessage && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                ...s.promoMessage,
                borderColor:
                  promoMessage.type === "success"
                    ? "#00ff88"
                    : "#ff4444",
              }}
            >
              {promoMessage.type === "success" ? (
                <CheckCircle2 size={14} color="#00ff88" />
              ) : (
                <XCircle size={14} color="#ff4444" />
              )}

              {promoMessage.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PACKS */}

      <div style={s.section}>
        <div style={s.sectionTitle}>
          <Gem size={18} />
          Boutique Craft-Ink
        </div>

        <div style={s.packGrid}>
          {packs.map((pack) => {
            const total = pack.amount + (pack.bonus || 0);

            return (
              <motion.div
                key={pack.id}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -4 }}
                style={{
                  ...s.packCard,
                  border: `1px solid ${pack.color}55`,
                }}
                onClick={() => buyInkPack(pack)}
              >
                {pack.popular && (
                  <div
                    style={{
                      ...s.popularBadge,
                      background: pack.color,
                    }}
                  >
                    POPULAIRE
                  </div>
                )}

                <div
                  style={{
                    ...s.packGlow,
                    background: `${pack.color}22`,
                  }}
                />

                <div style={s.packLabel}>{pack.label}</div>

                <div style={s.packAmount}>
                  ₵{total.toLocaleString()}
                </div>

                {pack.bonus > 0 && (
                  <div style={s.bonus}>
                    BONUS +{pack.bonus} ₵
                  </div>
                )}

                <div style={s.packPrice}>
                  ${pack.price}
                </div>

                <button
                  style={{
                    ...s.buyButton,
                    background: pack.color,
                  }}
                >
                  Acheter
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SUBSCRIPTIONS */}

      <div style={s.section}>
        <div style={s.sectionTitle}>
          <Crown size={18} />
          Grades & Certifications
        </div>

        <div style={s.subList}>
          {subscriptions.map((sub) => (
            <div key={sub.id} style={s.subCard}>
              <div>
                <div style={s.subName}>
                  <BadgeCheck size={15} />
                  {sub.name}
                </div>

                <div style={s.subPrice}>
                  {sub.price}$ / mois
                </div>
              </div>

              <button
                style={s.subBtn}
                onClick={() => subscribe(sub)}
              >
                Activer
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECURITY */}

      <div style={s.securityBox}>
        <Sparkles size={16} color="#00f5d4" />

        <div>
          <div style={s.securityTitle}>
            Protection bancaire active
          </div>

          <div style={s.securitySub}>
            Chiffrement • Historique • Vérification Cloud
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const s = {
  container: {
    minHeight: "100vh",
    background: "#050505",
    color: "#fff",
    padding: "20px",
    paddingBottom: "120px",
    fontFamily: "Inter, sans-serif",
  },

  loader: {
    height: "100vh",
    background: "#000",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  backBtn: {
    background: "#111",
    border: "1px solid #222",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "12px",
    cursor: "pointer",
  },

  secureBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#0f1f17",
    color: "#00ff88",
    padding: "10px 14px",
    borderRadius: "30px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  walletCard: {
    background:
      "linear-gradient(135deg,#111,#0b0b0b,#161616)",
    borderRadius: "26px",
    padding: "25px",
    border: "1px solid #222",
    marginBottom: "30px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  },

  walletTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  walletLabel: {
    fontSize: "12px",
    color: "#777",
    marginBottom: "5px",
  },

  balance: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#00f5d4",
  },

  walletIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00f5d4",
  },

  walletStats: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#777",
  },

  section: {
    marginBottom: "35px",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "17px",
    fontWeight: "800",
    marginBottom: "16px",
  },

  freeRow: {
    display: "flex",
    gap: "12px",
  },

  rewardCard: {
    flex: 1,
    background: "#111",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid #222",
    textAlign: "center",
    cursor: "pointer",
  },

  rewardEmoji: {
    fontSize: "28px",
    marginBottom: "8px",
  },

  rewardTitle: {
    fontSize: "12px",
    marginBottom: "8px",
  },

  rewardValue: {
    color: "#00f5d4",
    fontWeight: "bold",
  },

  promoBox: {
    display: "flex",
    gap: "10px",
  },

  promoInput: {
    flex: 1,
    background: "#111",
    border: "1px solid #222",
    borderRadius: "14px",
    padding: "14px",
    color: "#fff",
    outline: "none",
  },

  promoBtn: {
    background: "#8b5cf6",
    border: "none",
    color: "#fff",
    borderRadius: "14px",
    padding: "0 20px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  promoMessage: {
    marginTop: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "#111",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "12px",
  },

  packGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  packCard: {
    position: "relative",
    overflow: "hidden",
    background: "#101010",
    borderRadius: "24px",
    padding: "18px",
    cursor: "pointer",
  },

  packGlow: {
    position: "absolute",
    inset: 0,
    filter: "blur(30px)",
  },

  popularBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "9px",
    fontWeight: "900",
    padding: "5px 8px",
    borderRadius: "20px",
    color: "#000",
  },

  packLabel: {
    fontSize: "11px",
    color: "#999",
    fontWeight: "700",
    marginBottom: "10px",
  },

  packAmount: {
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "10px",
  },

  bonus: {
    color: "#39ff14",
    fontSize: "11px",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  packPrice: {
    color: "#00f5d4",
    fontWeight: "800",
    marginBottom: "14px",
  },

  buyButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "12px",
    fontWeight: "900",
    cursor: "pointer",
    color: "#000",
  },

  subList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  subCard: {
    background: "#111",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid #222",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subName: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "800",
  },

  subPrice: {
    marginTop: "5px",
    fontSize: "11px",
    color: "#777",
  },

  subBtn: {
    background: "#8b5cf6",
    border: "none",
    color: "#fff",
    borderRadius: "12px",
    padding: "10px 16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  securityBox: {
    marginTop: "40px",
    background: "#0c0c0c",
    border: "1px solid #1d1d1d",
    borderRadius: "20px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  securityTitle: {
    fontWeight: "800",
    marginBottom: "4px",
  },

  securitySub: {
    fontSize: "11px",
    color: "#666",
  },
};