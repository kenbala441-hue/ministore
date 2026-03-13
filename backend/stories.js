import { db } from "./index.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

// =============================
// 🔹 COLLECTION STORIES
// =============================
const storiesCollection = collection(db, "stories");

// =============================
// ➕ AJOUTER UNE STORY
// =============================
export const addStory = async (storyData) => {
  try {
    const docRef = await addDoc(storiesCollection, { 
      ...storyData, 
      createdAt: serverTimestamp(),
      likes: storyData.likes || [],
      comments: storyData.comments || [],
      shares: storyData.shares || []
    });
    return docRef;
  } catch (error) {
    console.error("Erreur ajout story :", error);
    throw error;
  }
};

// =============================
// 🔹 AJOUT AUTOMATIQUE D’UNE STORY (exemple)
// =============================
export const addDefaultStory = async () => {
  try {
    const docRef = await addStory({
      storyId: "s003",
      title: "Le Retour de l’Élu",
      status: "published",
      genre: "Action",
      coverImage: "url_image.jpg",
      synopsis: "L’Élu revient après 100 ans...",
      chapters: [],
      createdBy: "Studio Craftcomic",
      featured: false
    });
    console.log("Story ajoutée :", docRef.id);
  } catch (error) {
    console.error("Erreur ajout default story :", error);
  }
};

// =============================
// 📖 RÉCUPÉRER TOUTES LES STORIES
// =============================
export const getStories = async () => {
  try {
    const q = query(storiesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur récupération stories :", error);
    return [];
  }
};

// =============================
// 🔄 ÉCOUTE EN TEMPS RÉEL
// =============================
export const subscribeToStories = (callback) => {
  try {
    const q = query(storiesCollection, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(stories);
    }, (error) => {
      console.error("Erreur snapshot stories :", error);
    });
  } catch (error) {
    console.error("Erreur subscribe stories :", error);
  }
};

// =============================
// ❌ SUPPRIMER UNE STORY
// =============================
export const deleteStory = async (id) => {
  try {
    await deleteDoc(doc(db, "stories", id));
  } catch (error) {
    console.error("Erreur suppression story :", error);
    throw error;
  }
};