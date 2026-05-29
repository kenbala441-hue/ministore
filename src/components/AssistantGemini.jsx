import React, {
  useState,
  useEffect,
  useRef,
} from "react";

export default function AssistantGemini({
  user,
}) {

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [errorStatus, setErrorStatus] =
    useState(null);

  const [debugInfo, setDebugInfo] =
    useState(null);

  const [retryCount, setRetryCount] =
    useState(0);

  const alreadyLoaded =
    useRef(false);

  // =========================================================
  // ERROR ANALYZER
  // =========================================================

  const analyzeError = (
    err,
    status = null
  ) => {

    const msg =
      err?.message?.toLowerCase?.() ||
      "";

    // =========================
    // SERVEUR OFFLINE
    // =========================

    if (
      msg.includes("failed to fetch") ||
      msg.includes("networkerror")
    ) {
      return {
        type: "SERVER_OFFLINE",
        title:
          "🔌 Serveur Gemini inaccessible",
        color: "#ff4444",
        solution: [
          "Vérifie si le serveur Node.js est lancé",
          "Vérifie le port localhost:3000",
          "Vérifie si Vite et Node tournent ensemble",
          "Vérifie le firewall Windows",
        ],
      };
    }

    // =========================
    // HTTP 404
    // =========================

    if (status === 404) {
      return {
        type: "API_NOT_FOUND",
        title:
          "📡 Route API introuvable",
        color: "#ff8844",
        solution: [
          "Le endpoint /api/gemini n'existe pas",
          "Vérifie Express routes",
          "Vérifie server.js",
        ],
      };
    }

    // =========================
    // HTTP 500
    // =========================

    if (status === 500) {
      return {
        type: "SERVER_CRASH",
        title:
          "💥 Crash serveur Node.js",
        color: "#ff0033",
        solution: [
          "Erreur dans le backend",
          "Regarde terminal Node.js",
          "Vérifie Gemini API Key",
          "Vérifie process.env",
        ],
      };
    }

    // =========================
    // FIREBASE
    // =========================

    if (
      msg.includes("permission-denied")
    ) {
      return {
        type: "FIREBASE_RULES",
        title:
          "🔒 Firestore Rules bloquent l'accès",
        color: "#ff0033",
        solution: [
          "Vérifie les Firestore Rules",
          "Vérifie request.auth",
          "Vérifie le document users",
        ],
      };
    }

    // =========================
    // ABORT
    // =========================

    if (
      err?.name === "AbortError"
    ) {
      return {
        type: "ABORTED",
        title:
          "⚡ Requête annulée",
        color: "#ffaa00",
        solution: [
          "Composant démonté",
          "React StrictMode",
          "Navigation rapide",
        ],
      };
    }

    // =========================
    // RATE LIMIT
    // =========================

    if (
      status === 429 ||
      msg.includes("quota")
    ) {
      return {
        type: "RATE_LIMIT",
        title:
          "⏳ Limite Gemini atteinte",
        color: "#ffaa00",
        solution: [
          "Trop de requêtes envoyées",
          "Attendre quelques secondes",
          "Limiter les appels API",
        ],
      };
    }

    // =========================
    // UNKNOWN
    // =========================

    return {
      type: "UNKNOWN",
      title:
        "❓ Erreur inconnue",
      color: "#999",
      solution: [
        err?.message ||
          "Erreur inconnue",
      ],
    };
  };

  // =========================================================
  // FETCH ASSISTANT
  // =========================================================

  const fetchWelcome =
    async () => {

      // 🛡️ ANTI-SPAM STRICTMODE
      if (alreadyLoaded.current)
        return;

      alreadyLoaded.current = true;

      setLoading(true);

      setErrorStatus(null);

      setDebugInfo(null);

      const controller =
        new AbortController();

      const { signal } =
        controller;

      try {

        const userDisplayName =
          user?.name ||
          user?.username ||
          "Lecteur ComicCraft";

        const res = await fetch(
          "http://localhost:3000/api/gemini",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              prompt: `
Bienvenue ${userDisplayName}.

Explique :
- comment utiliser ComicCraft
- changer le thème
- acheter Ink
- créer des histoires
- publier un chapitre
              `,
            }),

            signal,
          }
        );

        // =========================
        // HTTP ERROR
        // =========================

        if (!res.ok) {

          const info =
            analyzeError(
              new Error(
                `HTTP ${res.status}`
              ),
              res.status
            );

          setDebugInfo(info);

          throw new Error(
            `Serveur HTTP ${res.status}`
          );
        }

        const data =
          await res.json();

        setMessages([
          data?.reply ||
            "Bonjour 👋",
        ]);

      } catch (err) {

        // =========================
        // IGNORE ABORT
        // =========================

        if (
          err?.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "🎯 GEMINI ERROR:",
          err
        );

        const info =
          analyzeError(err);

        setDebugInfo(info);

        setErrorStatus(
          err?.message
        );

        setMessages([
          "⚠️ Assistant temporairement indisponible.",
        ]);

      } finally {

        if (!signal.aborted) {
          setLoading(false);
        }
      }

      return () => {
        controller.abort();
      };
    };

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {

    fetchWelcome();

  }, [user]);

  // =========================================================
  // RETRY
  // =========================================================

  const retryAssistant =
    () => {

      alreadyLoaded.current =
        false;

      setRetryCount(
        (p) => p + 1
      );

      fetchWelcome();
    };

  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      style={{
        padding: 15,
        border:
          "1px solid #333",
        borderRadius: 14,
        marginTop: 20,
        background:
          "linear-gradient(180deg,#111,#0a0a0a)",
        boxShadow:
          "0 0 25px rgba(0,0,0,0.4)",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          marginBottom: 10,
        }}
      >

        <h4
          style={{
            color: "#00ffcc",
            margin: 0,
          }}
        >
          🤖 Assistant ComicCraft
        </h4>

        <span
          style={{
            fontSize: 11,
            color: "#777",
          }}
        >
          Retry: {retryCount}
        </span>

      </div>

      {/* LOADING */}

      {loading && (

        <div
          style={{
            color: "#aaa",
            fontSize: 13,
            padding: 10,
          }}
        >
          ⚡ Gemini réfléchit...
        </div>
      )}

      {/* ERROR PANEL */}

      {debugInfo && (

        <div
          style={{
            background:
              "#1a0d0d",
            border: `1px solid ${debugInfo.color}`,
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >

          <div
            style={{
              color:
                debugInfo.color,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            {debugInfo.title}
          </div>

          <div
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: "#ddd",
            }}
          >

            {debugInfo.solution.map(
              (s, i) => (
                <div key={i}>
                  • {s}
                </div>
              )
            )}

          </div>

          <button
            onClick={
              retryAssistant
            }
            style={{
              marginTop: 12,
              width: "100%",
              padding: 10,
              border: "none",
              borderRadius: 8,
              background:
                "#222",
              color: "#00ffcc",
              cursor: "pointer",
            }}
          >
            🔄 Réessayer
          </button>

        </div>
      )}

      {/* RAW ERROR */}

      {errorStatus && (

        <div
          style={{
            fontSize: 11,
            color: "#999",
            marginBottom: 10,
            wordBreak:
              "break-word",
          }}
        >
          {errorStatus}
        </div>
      )}

      {/* MESSAGES */}

      <div
        style={{
          display: "flex",
          flexDirection:
            "column",
          gap: 8,
        }}
      >

        {messages.map(
          (m, i) => (

            <div
              key={i}
              style={{
                background:
                  "#181818",
                padding: 12,
                borderRadius: 10,
                lineHeight: 1.5,
                border:
                  "1px solid #222",
              }}
            >
              {m}
            </div>
          )
        )}

      </div>

    </div>
  );
}