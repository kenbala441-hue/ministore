import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import mangaRoutes from "./routes/manga.js";
import inkRoutes from "./routes/ink.js";
import marketplaceRoutes from "./routes/marketplace.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

let users = {}; 
let transactions = [];

// ===== AUTH REGISTER =====

app.post("/auth/register", (req, res) => {

  const { email, password, displayName } = req.body;

  const uid = "u" + Date.now();

  users[uid] = {
    uid,
    email,
    displayName,
    inkBalance: 0,
    createdAt: new Date(),
    acceptedTerms: true,
    completedProfile: false
  };

  const token = jwt.sign({ uid }, "COMICRAFTE_SECRET");

  res.json({
    user: users[uid],
    token
  });

});


// ===== LOGIN =====

app.post("/auth/login", (req, res) => {

  const { email } = req.body;

  const user = Object.values(users).find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  const token = jwt.sign({ uid: user.uid }, "COMICRAFTE_SECRET");

  res.json({
    user,
    token
  });

});


// ===== AJOUTER OU RETIRER INK =====

app.post("/users/:id/balance", (req, res) => {

  const { id } = req.params;
  const { amount, reason } = req.body;

  const user = users[id];

  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  // Vérification solde
  if (amount < 0 && user.inkBalance < Math.abs(amount)) {
    return res.status(400).json({
      error: "Solde insuffisant"
    });
  }

  user.inkBalance += amount;

  const transaction = {
    id: "t" + Date.now(),
    uid: id,
    amount,
    reason,
    date: new Date()
  };

  transactions.push(transaction);

  res.json({
    balance: user.inkBalance,
    transaction
  });

});


// ===== LISTE TRANSACTIONS ADMIN =====

app.get("/transactions", (req, res) => {

  res.json(transactions);

});


// ===== ROUTES MODULES =====

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/manga", mangaRoutes);
app.use("/ink", inkRoutes);
app.use("/marketplace", marketplaceRoutes);

const PORT = 4000;

app.listen(PORT, () => {

  console.log("Comicrafte API running on port 4000");

});