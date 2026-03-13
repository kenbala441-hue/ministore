import { addStory } from "../src/firebase/stories.js";
import { db } from "../src/firebase/index.js";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";

async function publierStory() {
  // 🔹 Story principale
  const nouvelleStory = {
    title: "Black line",
    content: "Voici l’histoire...",
    authorId: "uid_user",
    likesCount: 5,
    commentsCount: 0,
    sharesCount: 0,
    viewsCount: 0,
    coverImage: "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png",
    description: "Résumé de l’histoire",
    genre: "Action",
    status: "ongoing",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    chaptersCount: 1
  };

  // Ajouter la story
  const docRef = await addStory(nouvelleStory);
  console.log("Story publiée avec ID :", docRef.id);

  const storyId = docRef.id;

  // 🔹 Ajouter le chapitre 1
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

  console.log("Chapitre 1 ajouté à la story !");
}

publierStory();