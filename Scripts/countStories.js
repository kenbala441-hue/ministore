import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
const db = getFirestore(app);

async function countStories() {
  try {
    const storiesCol = collection(db, "stories");
    const snapshot = await getDocs(storiesCol);
    console.log("Nombre de stories :", snapshot.size);
  } catch (err) {
    console.error("Erreur lors du comptage des stories :", err);
  }
}

countStories();