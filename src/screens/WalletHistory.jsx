import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/index";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Wallet,
  Search,
  Filter,
} from "lucide-react";

export default function WalletHistory({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTRES
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortMode, setSortMode] = useState("newest");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Date inconnue";

    return new Date(date.toDate()).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // LABELS TYPES
  const getTypeLabel = (type) => {
    switch (type) {
      case "ad_reward":
        return "Récompense Publicité";

      case "ink_purchase":
        return "Achat de Craft-Ink";

      case "subscription":
        return "Abonnement";

      case "gift":
        return "Bonus Cadeau";

      default:
        return "Transaction";
    }
  };

  // FILTRAGE + TRI
  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    // Recherche
    if (search.trim()) {
      data = data.filter((t) =>
        getTypeLabel(t.type)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Type
    if (filterType !== "all") {
      data = data.filter((t) => t.type === filterType);
    }

    // Tri
    switch (sortMode) {
      case "oldest":
        data.sort(
          (a, b) =>
            a.createdAt?.seconds - b.createdAt?.seconds
        );
        break;

      case "highest":
        data.sort(
          (a, b) =>
            (b.amountInk || b.amount || 0) -
            (a.amountInk || a.amount || 0)
        );
        break;

      case "lowest":
        data.sort(
          (a, b) =>
            (a.amountInk || a.amount || 0) -
            (b.amountInk || b.amount || 0)
        );
        break;

      default:
        data.sort(
          (a, b) =>
            b.createdAt?.seconds - a.createdAt?.seconds
        );
    }

    return data;
  }, [transactions, search, filterType, sortMode]);

  // TOTAL
  const totalInk = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, item) => acc + (item.amountInk || item.amount || 0),
      0
    );
  }, [filteredTransactions]);

  return (
    <div style={s.container}>
      {/* HEADER */}
      <div style={s.topCard}>
        <div style={s.walletRow}>
          <div style={s.walletIcon}>
            <Wallet size={22} />
          </div>

          <div>
            <div style={s.smallText}>Historique du portefeuille</div>
            <div style={s.totalAmount}>
              {totalInk.toLocaleString()} ₵
            </div>
          </div>
        </div>

        <div style={s.statsRow}>
          <div style={s.statBox}>
            <div style={s.statValue}>
              {filteredTransactions.length}
            </div>
            <div style={s.statLabel}>Transactions</div>
          </div>

          <div style={s.statBox}>
            <div style={s.statValue}>
              {
                filteredTransactions.filter(
                  (t) => t.type === "ad_reward"
                ).length
              }
            </div>
            <div style={s.statLabel}>Publicités</div>
          </div>
        </div>
      </div>

      {/* TITRE */}
      <div style={s.header}>
        <h2 style={s.title}>
          <History size={18} />
          Historique
        </h2>
      </div>

      {/* FILTRES */}
      <div style={s.filterBox}>
        {/* RECHERCHE */}
        <div style={s.searchContainer}>
          <Search size={15} color="#888" />

          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>

        {/* SELECT TYPE */}
        <div style={s.selectRow}>
          <div style={s.selectWrap}>
            <Filter size={14} color="#aaa" />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={s.select}
            >
              <option value="all">Tous</option>
              <option value="ad_reward">Publicités</option>
              <option value="ink_purchase">Achats</option>
              <option value="subscription">Abonnements</option>
              <option value="gift">Bonus</option>
            </select>
          </div>

          {/* TRI */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            style={s.select}
          >
            <option value="newest">Plus récent</option>
            <option value="oldest">Plus ancien</option>
            <option value="highest">Plus élevé</option>
            <option value="lowest">Plus faible</option>
          </select>
        </div>
      </div>

      {/* LISTE */}
      {loading ? (
        <div style={s.loadingBox}>
          Chargement des transactions...
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div style={s.emptyState}>
          Aucune transaction trouvée.
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredTransactions.map((t, index) => {
              const positive =
                t.type === "ad_reward" ||
                t.type === "gift";

              const amount =
                t.amountInk || t.amount || 0;

              return (
                <motion.div
                  key={t.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.03,
                  }}
                  style={s.card}
                >
                  <div style={s.cardLeft}>
                    <div
                      style={{
                        ...s.iconBox,
                        background: positive
                          ? "rgba(0,245,212,0.12)"
                          : "rgba(168,85,247,0.12)",
                      }}
                    >
                      {positive ? (
                        <ArrowDownLeft
                          color="#00f5d4"
                          size={18}
                        />
                      ) : (
                        <ArrowUpRight
                          color="#a855f7"
                          size={18}
                        />
                      )}
                    </div>

                    <div>
                      <div style={s.type}>
                        {getTypeLabel(t.type)}
                      </div>

                      <div style={s.date}>
                        {formatDate(t.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      ...s.amount,
                      color: positive
                        ? "#00f5d4"
                        : "#ff8a8a",
                    }}
                  >
                    {positive ? "+" : "-"}
                    {amount.toLocaleString()} ₵
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

const s = {
  container: {
    padding: "18px",
    color: "#fff",
    minHeight: "100vh",
    background: "#050505",
  },

  topCard: {
    background:
      "linear-gradient(135deg,#111827,#0f172a)",
    border: "1px solid #1f2937",
    borderRadius: "20px",
    padding: "18px",
    marginBottom: "22px",
  },

  walletRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  walletIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg,#a855f7,#00f5d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  smallText: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  totalAmount: {
    fontSize: "28px",
    fontWeight: "900",
    marginTop: "3px",
  },

  statsRow: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
  },

  statBox: {
    flex: 1,
    background: "#0b1220",
    border: "1px solid #1f2937",
    borderRadius: "14px",
    padding: "12px",
    textAlign: "center",
  },

  statValue: {
    fontSize: "18px",
    fontWeight: "800",
  },

  statLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "4px",
  },

  header: {
    marginBottom: "14px",
  },

  title: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: "800",
  },

  filterBox: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "14px",
    padding: "12px",
  },

  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "13px",
  },

  selectRow: {
    display: "flex",
    gap: "10px",
  },

  selectWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "12px",
    padding: "0 10px",
  },

  select: {
    flex: 1,
    background: "#111827",
    border: "none",
    outline: "none",
    color: "#fff",
    padding: "12px 6px",
    fontSize: "12px",
    borderRadius: "12px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f172a",
    padding: "15px",
    borderRadius: "16px",
    marginBottom: "12px",
    border: "1px solid #1e293b",
    backdropFilter: "blur(12px)",
  },

  cardLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  iconBox: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  type: {
    fontWeight: "700",
    fontSize: "14px",
  },

  date: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "3px",
  },

  amount: {
    fontWeight: "900",
    fontSize: "15px",
  },

  emptyState: {
    textAlign: "center",
    marginTop: "80px",
    color: "#6b7280",
    fontSize: "13px",
  },

  loadingBox: {
    textAlign: "center",
    marginTop: "80px",
    color: "#9ca3af",
  },
};