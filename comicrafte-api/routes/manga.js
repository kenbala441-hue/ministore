import express from "express";
import { mangas } from "../database/db.js";

const router = express.Router();

// publier manga
router.post("/publish", (req, res) => {

  const { title, authorId } = req.body;

  const id = "m" + Date.now();

  mangas[id] = {
    id,
    title,
    authorId,
    chapters: [],
    createdAt: new Date()
  };

  res.json(mangas[id]);
});

// ajouter chapitre
router.post("/:id/chapter", (req, res) => {

  const manga = mangas[req.params.id];

  if (!manga) return res.status(404).json({ error: "Manga introuvable" });

  const { title, content } = req.body;

  manga.chapters.push({
    id: "c" + Date.now(),
    title,
    content
  });

  res.json(manga);
});

export default router;