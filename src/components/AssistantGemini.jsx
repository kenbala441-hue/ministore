import React, { useState, useEffect } from "react";

export default function AssistantGemini({ user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchWelcome = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Bienvenue ${user.pseudo}! Explique comment utiliser l'app, changer thème et acheter Ink.`
          }),
        });
        const data = await res.json();
        setMessages([data.reply]);
      } catch (err) {
        setMessages(["Bienvenue! Impossible de récupérer le message Gemini."]);
      }
    };

    fetchWelcome();
  }, [user]);

  return (
    <div style={{ padding: 15, border: "1px solid #ccc", borderRadius: 10, marginTop: 20 }}>
      {messages.map((m, i) => (
        <p key={i} style={{ margin: 5 }}>{m}</p>
      ))}
    </div>
  );
}