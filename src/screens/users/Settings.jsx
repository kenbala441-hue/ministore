import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Trash2,
  Globe,
  Eye,
  Moon,
  Download,
  Bell,
  Loader2
} from "lucide-react";

export default function Settings({ setView }) {
  const [langue, setLangue] = useState(
    localStorage.getItem("app_lang") || "fr"
  );

  const [resolution, setResolution] = useState(
    localStorage.getItem("img_res") || "haute"
  );

  const [cacheSize, setCacheSize] = useState("6,81 Mo");

  const [pleinEcran, setPleinEcran] = useState(
    JSON.parse(
      localStorage.getItem("full_screen") ??
        "true"
    )
  );

  const [downloadAuto, setDownloadAuto] =
    useState(
      JSON.parse(
        localStorage.getItem("dl_auto") ??
          "false"
      )
    );

  const [modeSombre, setModeSombre] =
    useState(
      JSON.parse(
        localStorage.getItem("dark_mode") ??
          "true"
      )
    );

  const [notifEpisodes, setNotifEpisodes] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "notif_episodes"
        ) ?? "true"
      )
    );

  const [notifCoins, setNotifCoins] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "notif_coins"
        ) ?? "true"
      )
    );

  const [notifSorties, setNotifSorties] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "notif_sorties"
        ) ?? "true"
      )
    );

  const [isClearingCache, setIsClearingCache] =
    useState(false);

  useEffect(() => {
    localStorage.setItem(
      "app_lang",
      langue
    );

    localStorage.setItem(
      "img_res",
      resolution
    );

    localStorage.setItem(
      "full_screen",
      JSON.stringify(pleinEcran)
    );

    localStorage.setItem(
      "dl_auto",
      JSON.stringify(downloadAuto)
    );

    localStorage.setItem(
      "dark_mode",
      JSON.stringify(modeSombre)
    );

    localStorage.setItem(
      "notif_episodes",
      JSON.stringify(notifEpisodes)
    );

    localStorage.setItem(
      "notif_coins",
      JSON.stringify(notifCoins)
    );

    localStorage.setItem(
      "notif_sorties",
      JSON.stringify(notifSorties)
    );
  }, [
    langue,
    resolution,
    pleinEcran,
    downloadAuto,
    modeSombre,
    notifEpisodes,
    notifCoins,
    notifSorties
  ]);

  const handleClearCache = async () => {
    const confirmClear =
      window.confirm(
        "Voulez-vous vraiment effacer le cache de l'application ?"
      );

    if (!confirmClear) return;

    try {
      setIsClearingCache(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      setCacheSize("0,00 Mo");

      alert(
        "✅ Cache vidé avec succès !"
      );
    } catch (err) {
      console.error(err);

      alert(
        "❌ Impossible de vider le cache."
      );
    } finally {
      setIsClearingCache(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button
          style={styles.backBtn}
          onClick={() =>
            setView("profile")
          }
        >
          <ChevronLeft
            size={24}
            color="#fff"
          />
        </button>

        <h2 style={styles.headerTitle}>
          Paramètres
        </h2>
      </div>

      <div style={styles.scrollContent}>
        <div style={styles.sectionTitle}>
          OPTIONS
        </div>

        <div style={styles.cardSection}>
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <Globe
                size={18}
                color="#666"
              />
              <span>
                Langue de contenu
              </span>
            </div>

            <select
              value={langue}
              onChange={(e) =>
                setLangue(
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option value="fr">
                Français
              </option>

              <option value="en">
                English
              </option>
            </select>
          </div>

          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <Eye
                size={18}
                color="#666"
              />

              <span>
                Résolution de l'image
              </span>
            </div>

            <select
              value={resolution}
              onChange={(e) =>
                setResolution(
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option value="haute">
                Haute résolution
              </option>

              <option value="eco">
                Éco (moins de données)
              </option>
            </select>
          </div>

          <div
            style={{
              ...styles.row,
              opacity:
                isClearingCache
                  ? 0.6
                  : 1,
              cursor: "pointer"
            }}
            onClick={
              handleClearCache
            }
          >
            <div
              style={styles.rowLeft}
            >
              <Trash2
                size={18}
                color="#ff5555"
              />

              <span>
                {isClearingCache
                  ? "Nettoyage..."
                  : "Effacer le cache"}
              </span>
            </div>

            <span
              style={
                styles.valueText
              }
            >
              {isClearingCache ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                cacheSize
              )}
            </span>
          </div>

          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <Moon
                size={18}
                color="#666"
              />

              <span>
                Mode sombre complet
              </span>
            </div>

            <input
              type="checkbox"
              checked={
                modeSombre
              }
              onChange={(e) =>
                setModeSombre(
                  e.target.checked
                )
              }
              style={styles.switch}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <Download
                size={18}
                color="#666"
              />

              <span>
                Téléchargement automatique
              </span>
            </div>

            <input
              type="checkbox"
              checked={
                downloadAuto
              }
              onChange={(e) =>
                setDownloadAuto(
                  e.target.checked
                )
              }
              style={styles.switch}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <span>
                Lire en plein écran
              </span>
            </div>

            <input
              type="checkbox"
              checked={
                pleinEcran
              }
              onChange={(e) =>
                setPleinEcran(
                  e.target.checked
                )
              }
              style={styles.switch}
            />
          </div>
        </div>

        <div style={styles.sectionTitle}>
          NOTIFICATIONS
        </div>

        <div style={styles.cardSection}>
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <Bell
                size={18}
                color="#00f7ff"
              />

              <span>
                Nouveaux épisodes et activités
              </span>
            </div>

            <input
              type="checkbox"
              checked={
                notifEpisodes
              }
              onChange={(e) =>
                setNotifEpisodes(
                  e.target.checked
                )
              }
              style={styles.switch}
            />
          </div>

          <div style={styles.subRow}>
            <span>
              └ Nouveaux épisodes
              d'Original
            </span>

            <input
              type="checkbox"
              checked={
                notifEpisodes
              }
              disabled
              style={styles.switch}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <Bell
                size={18}
                color="#ffd700"
              />

              <span>
                Notifications Coins
                & Offres
              </span>
            </div>

            <input
              type="checkbox"
              checked={notifCoins}
              onChange={(e) =>
                setNotifCoins(
                  e.target.checked
                )
              }
              style={styles.switch}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <Bell
                size={18}
                color="#39ff14"
              />

              <span>
                Nouvelles séries &
                annonces
              </span>
            </div>

            <input
              type="checkbox"
              checked={
                notifSorties
              }
              onChange={(e) =>
                setNotifSorties(
                  e.target.checked
                )
              }
              style={styles.switch}
            />
          </div>
        </div>
        <div style={styles.sectionTitle}>
          À PROPOS
        </div>

        <div style={styles.cardSection}>
          <div style={styles.minimalRow}>
            <span>
              Conditions générales
              d'utilisation
            </span>
          </div>

          <div style={styles.minimalRow}>
            <span>
              Politique de
              confidentialité
            </span>
          </div>

          <div
            style={{
              ...styles.minimalRow,
              border: "none"
            }}
          >
            <span>
              Version de l'App
            </span>

            <span
              style={
                styles.valueText
              }
            >
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#fff",
    fontFamily:
      "Inter, sans-serif"
  },

  header: {
    display: "flex",
    alignItems: "center",
    padding:
      "40px 20px 20px 20px",
    background: "#0d0d0d",
    borderBottom:
      "1px solid #151515"
  },

  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginRight: 15
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0
  },

  scrollContent: {
    padding:
      "10px 20px 120px 20px"
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#555",
    marginTop: 25,
    marginBottom: 10,
    letterSpacing: "1px"
  },

  cardSection: {
    background: "#0a0a0a",
    borderRadius: 18,
    padding: 12,
    marginBottom: 20,
    border: "1px solid #111"
  },

  row: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    background: "#0f0f0f",
    padding: "16px 18px",
    borderRadius: 14,
    marginBottom: 10
  },

  subRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    background: "#0a0a0a",
    padding:
      "12px 18px 12px 36px",
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 13,
    color: "#aaa"
  },

  minimalRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "16px 10px",
    borderBottom:
      "1px solid #111",
    fontSize: 14,
    color: "#ccc"
  },

  rowLeft: {
    display: "flex",
    gap: 12,
    alignItems: "center"
  },

  select: {
    background: "#151515",
    color: "#fff",
    border: "1px solid #222",
    padding: "6px 12px",
    borderRadius: 8,
    outline: "none"
  },

  valueText: {
    color: "#666",
    fontSize: 14
  },

  switch: {
    accentColor: "#39ff14",
    width: 38,
    height: 20,
    cursor: "pointer"
  }
};