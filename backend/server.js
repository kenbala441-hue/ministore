import express from "express";
import cors from "cors";
import { db } from "../src/firebase/index.js"; // lien vers ton firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

app.post("/story", async (req, res) => {
  try {
    const { title, description, genre, authorId, coverImage, pages } = req.body;

    const docRef = await addDoc(collection(db, "stories"), {
      title,
      description,
      genre,
      authorId,
      coverImage,
      chaptersCount: 1,
      likes: [],
      comments: [],
      shares: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "stories", docRef.id, "chapters"), {
      title: "CHAPITRE 1",
      order: 1,
      pages,
      createdAt: serverTimestamp(),
    });

    res.json({ success: true, storyId: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));