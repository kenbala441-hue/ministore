import express from "express";
import { users } from "../database/db.js";

const router = express.Router();

router.post("/register", (req, res) => {

  const { email, displayName } = req.body;

  const uid = "u" + Date.now();

  users[uid] = {
    uid,
    email,
    displayName,
    inkBalance: 0,
    role: "reader"
  };

  res.json(users[uid]);
});

router.post("/login", (req, res) => {

  const { email } = req.body;

  const user = Object.values(users).find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  res.json(user);
});

export default router;