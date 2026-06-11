import React, { useState, useEffect, useRef } from "react";

export default function AssistantGemini({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(""); // 🟢 État pour le texte saisi
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const alreadyLoaded = useRef(false);

  // Fonction d'analyse d'erreur conservée
  const analyzeError = (err, status = null) => {
    const msg = err?.message?.toLowerCase?.() || "";
    if (msg.includes("failed to fetch") || msg.includes("networkerror")) {
      return { title: "🔌 Serveur Gemini inaccessible (Node.js éteint)", color: "#ff4444", solution: ["Lancer le serveur Node.js", "Vérifier le port 3000"] };
    }
    if (status === 500) {
      return { title: "💥 Crash ou Clé API manquante côté Node.js", color: "#ff0033", solution: ["Vérifier la clé GEMINI_API_KEY dans le .env du serveur"] };
    }
    return { title: "❓ Erreur de communication", color: "#999", solution: [err?.message || "Erreur inconnue"] };
  };

  // 1. Message de bienvenue automatique au chargement
  const fetchWelcome = async () => {
    if (alreadyLoaded.current) return;
    alreadyLoaded.current = true;
    setLoading(true);
    setDebugInfo(null);

    try {
      const userDisplayName = user?.name || user?.username || "Lecteur ComicCraft";
      const res = await fetch("http://localhost:3000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Tu es l'assistant IA officiel de ComicCraft Studio. Fais un accueil court et chaleureux pour l'utilisateur "${userDisplayName}". Donne 3 exemples rapides de ce qu'il peut te demander.`
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages([{ sender: "gemini", text: data?.reply || "Bonjour ! Comment puis-je t'aider sur ComicCraft aujourd'hui ? 🤖" }]);
    } catch (err) {
      setDebugInfo(analyzeError(err));
      setMessages([{ sender: "gemini", text: "⚠️ Assistant temporairement hors ligne. Lance ton serveur Node.js." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWelcome(); }, [user]);

  // Auto-scroll vers le bas lors d'un nouveau message
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // 2. Envoi d'une question par l'utilisateur
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput(""); // Vide l'input
    setMessages((prev) => [...prev, { sender: "user", text: userText }]); // Ajoute le message de l'utilisateur à l'écran
    setLoading(true);
    setDebugInfo(null);

    try {
      const res = await fetch("http://localhost:3000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }), // Envoi du prompt de l'utilisateur au backend
      });

      if (!res.ok) {
        const status = res.status;
        throw new Error(`HTTP ${status}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "gemini", text: data?.reply || "Je n'ai pas compris." }]);
    } catch (err) {
      setDebugInfo(analyzeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: 15, border: "1px solid #222", borderRadius: 14, margin: "15px 0",
      background: "linear-gradient(180deg, #0f0f12, #050505)", display: "flex", flexDirection: "column", height: "400px"
    }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222", paddingBottom: 8 }}>
        <h4 style={{ color: "#00ffcc", margin: 0, fontSize: "13px" }}>🤖 Assistant IA ComicCraft</h4>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: debugInfo ? "#ff4444" : "#00ffbb" }} />
      </div>

      {/* ZONE DES MESSAGES DÉROULANTE */}
      <div style={{ flex: 1, overflowY: "auto", margin: "10px 0", paddingRight: 5, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
            background: m.sender === "user" ? "#00ffcc" : "#18181c",
            color: m.sender === "user" ? "#000" : "#fff",
            padding: "10px 14px", borderRadius: 12, maxWidth: "80%", fontSize: "12px",
            border: m.sender === "user" ? "none" : "1px solid #252528", wordBreak: "break-word"
          }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ color: "#777", fontSize: "11px", fontStyle: "italic" }}>⚡ Réflexion en cours...</div>}
        {debugInfo && (
          <div style={{ background: "#200b0b", border: `1px solid ${debugInfo.color}`, padding: 10, borderRadius: 8, color: "#ff8888", fontSize: "11px" }}>
            <strong>{debugInfo.title}</strong>
            {debugInfo.solution.map((s, i) => <div key={i}>• {s}</div>)}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* BARRE DE SAISIE INTERACTIVE */}
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8, borderTop: "1px solid #222", paddingTop: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question à l'IA..."
          disabled={loading}
          style={{
            flex: 1, background: "#111", border: "1px solid #333", borderRadius: 8,
            padding: "8px 12px", color: "#fff", fontSize: "12px", outline: "none"
          }}
        />
        <button type="submit" disabled={loading} style={{
          background: "#00ffcc", color: "#000", border: "none", borderRadius: 8,
          padding: "0 16px", fontWeight: "bold", fontSize: "12px", cursor: "pointer"
        }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}
