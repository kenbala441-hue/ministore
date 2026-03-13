// scripts/addChapter.js
import { db } from "@/firebase";  // ton alias @ doit être reconnu
import { doc, collection, setDoc, serverTimestamp } from "firebase/firestore";

async function addStoryWithChapter() {
  const storyId = "storyId123";

  // Mettre le cover de la story
  await setDoc(doc(db, "stories", storyId), {
    title: "Black line",
    authorId: "uid_user",
    description: "Résumé de l’histoire",
    genre: "Action",
    coverImage: "https://firebasestorage.googleapis.com/v0/b/ton-projet.appspot.com/o/images%2Fcover.png?alt=media",
    chaptersCount: 1,
    likesCount: 0,
    sharesCount: 0,
    viewsCount: 0,
    status: "ongoing",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Ajouter le chapitre
  await setDoc(doc(collection(db, "stories", storyId, "chapters"), "chapter1"), {
    title: "CHAPITRE 1",
    order: 1,
    pages: [
      { type: "text", text: "Avez-vous déjà ressenti ce vide ?" },
      { type: "image", src: "https://firebasestorage.googleapis.com/v0/b/ton-projet.appspot.com/o/images%2Fchapter1_image1.png?alt=media" },
      { type: "text", text: "Pas la tristesse. Pas la solitude. Non." }
    ],
    createdAt: serverTimestamp()
  });

  console.log("Story + chapitre ajoutés !");
}

addStoryWithChapter();