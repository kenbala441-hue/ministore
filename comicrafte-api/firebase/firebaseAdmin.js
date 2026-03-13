// src/firebase/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Chemin vers le fichier serviceAccountKey.json
const serviceAccountPath = path.join(
  process.cwd(),
  "src/firebase/serviceAccountKey.json"
);

// Vérifie que le fichier existe
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    "❌ Le fichier serviceAccountKey.json est introuvable dans src/firebase !"
  );
}

// Charge le fichier JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialisation Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Optionnel : définir l'URL de la base Firestore si tu utilises un projet spécifique
  // databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com"
});

const db = admin.firestore();

// Export pour l'utiliser dans toute l'API
export { admin, db };