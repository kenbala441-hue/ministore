// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Fonction pour appeler Gemini
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) return `Gemini non configuré: ${prompt}`;
  try {
    const res = await fetch("https://api.gemini.com/v1/responses", { // à adapter si endpoint change
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.reply || "Gemini n'a pas pu répondre.";
  } catch (err) {
    console.error("Erreur Gemini:", err);
    return "Erreur serveur Gemini, réessayez plus tard.";
  }
}

// Endpoint général
app.post("/api/gemini", async (req, res) => {
  const { prompt, user, type } = req.body;

  let fullPrompt = prompt;

  // Si tu veux des messages avancés selon rôle / type
  if (type === "role_validation") {
    fullPrompt = `Utilisateur ${user.pseudo}, ton rôle ${user.role} a été ${user.validated ? "activé" : "refusé"}.`;
  } else if (type === "story_status") {
    fullPrompt = `Utilisateur ${user.pseudo}, ton histoire '${req.body.storyTitle}' est ${req.body.status}.`;
  } else if (type === "welcome") {
    fullPrompt = `Bienvenue ${user.pseudo}! Explique comment utiliser l'app, changer thème et acheter Ink.`;
  }

  const reply = await callGemini(fullPrompt);
  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini backend running on port ${PORT}`));