import express from "express";
import { users } from "../database/db.js";

const router = express.Router();

// profil
router.get("/:id", (req, res) => {

  const user = users[req.params.id];

  if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

  res.json(user);
});

// devenir auteur
router.post("/:id/become-author", (req, res) => {

  const user = users[req.params.id];

  if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

  user.role = "author";

  res.json(user);
});

export default router;