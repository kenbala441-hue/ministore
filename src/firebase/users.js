// src/firebase/users.js
import { db } from "./index.js";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// ➕ Créer un utilisateur (lors du premier login)
export const createUser = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || "Auteur inconnu",
      email: user.email || "",
      photoURL: user.photoURL || "",
      createdAt: new Date(),
      favorites: [],
      likedStories: [],
      comments: [],
    }, { merge: true }); // merge = ne pas écraser si existant
    return userRef;
  } catch (err) {
    console.error("Erreur création utilisateur :", err);
  }
};

// 🔍 Récupérer un utilisateur par uid
export const getUser = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) return snap.data();
    return null;
  } catch (err) {
    console.error("Erreur récupération utilisateur :", err);
  }
};

// 💖 Ajouter une story aux favoris
export const addFavorite = async (uid, storyId) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      favorites: arrayUnion(storyId)
    });
  } catch (err) {
    console.error("Erreur ajout aux favoris :", err);
  }
};

// 👍 Ajouter une story likée
export const addLikedStory = async (uid, storyId) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      likedStories: arrayUnion(storyId)
    });
  } catch (err) {
    console.error("Erreur ajout story likée :", err);
  }
};

// 💬 Ajouter un commentaire de l'utilisateur
export const addComment = async (uid, comment) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      comments: arrayUnion(comment)
    });
  } catch (err) {
    console.error("Erreur ajout commentaire :", err);
  }
};