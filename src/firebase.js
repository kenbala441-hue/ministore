// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

// 🔥 CONFIG OFFICIELLE COMICCRAFTE STUDIO
const firebaseConfig = {
  apiKey: "AIzaSyAalUx5YEWq1Bs9HW_VFiqqqZpWenW69CA",
  authDomain: "comiccrafte-studio.firebaseapp.com",
  projectId: "comiccrafte-studio",
  storageBucket: "comiccrafte-studio.firebasestorage.app",
  messagingSenderId: "322099627324",
  appId: "1:322099627324:web:f3298dac6afcd3e0faca39"
};

// INITIALISATION
const app = initializeApp(firebaseConfig);

// AUTH
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// GOOGLE LOGIN
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// FIRESTORE
export const db = getFirestore(app);

// COLLECTION STORIES
export const storiesCollection = collection(db, "stories");

// AJOUTER UNE HISTOIRE
export const addStory = async (storyData) => {
  try {
    const docRef = await addDoc(storiesCollection, storyData);
    return docRef.id;
  } catch (error) {
    console.error("Erreur ajout story:", error);
    throw error;
  }
};

// RÉCUPÉRER UNE HISTOIRE PAR ID
export const getStory = async (id) => {
  const docRef = doc(db, "stories", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
};

// RÉCUPÉRER TOUTES LES HISTOIRES (avec options)
export const getStories = async (genre = null) => {
  let q = query(storiesCollection, orderBy("createdAt", "desc"));
  if (genre && genre !== "Tous") q = query(storiesCollection, where("genres", "array-contains", genre), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// OBSERVER LES HISTOIRES EN TEMPS RÉEL
export const onStoriesUpdate = (callback, genre = null) => {
  let q = query(storiesCollection, orderBy("createdAt", "desc"));
  if (genre && genre !== "Tous") q = query(storiesCollection, where("genres", "array-contains", genre), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

// METTRE À JOUR UNE HISTOIRE
export const updateStory = async (id, updatedData) => {
  const docRef = doc(db, "stories", id);
  await updateDoc(docRef, updatedData);
};

// SUPPRIMER UNE HISTOIRE
export const deleteStory = async (id) => {
  const docRef = doc(db, "stories", id);
  await deleteDoc(docRef);
};

// OBSERVER USER
export const onUserStateChange = (callback) =>
  onAuthStateChanged(auth, callback);