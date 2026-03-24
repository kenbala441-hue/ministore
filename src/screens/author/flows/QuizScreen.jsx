import React from "react";
import { db, auth } from "../../../firebase"; 
import { doc, updateDoc } from "firebase/firestore";
import { useUserContext } from "../../users/userContext";

export default function QuizScreen({ setView }) {
  const { user } = useUserContext();

  const handleFinishQuiz = async () => {
    // 1. Vérifier si l'utilisateur est connecté
    if (!auth.currentUser) {
      alert("Erreur: Utilisateur non détecté.");
      return;
    }

    try {
      // 2. Référence du document utilisateur dans Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      // 3. Mise à jour du rôle
      await updateDoc(userRef, {
        role: "author"
      });

      alert("Bravo ! Vous avez réussi le quiz. Vous êtes maintenant Auteur.");
      
      // 4. Redirection vers le Dashboard Auteur tout neuf
      setView("author_dashboard"); 

    } catch (error) {
      console.error("Erreur role update:", error);
      alert("Impossible de mettre à jour votre profil.");
    }
  };

  return (
    <div className="container quiz-container">
      <h2 className="neon-text">Quiz de Certification</h2>
      <p>Répondez correctement pour débloquer les outils de publication.</p>
      
      {/* Ton contenu de quiz ici */}
      
      <button className="button-purple" onClick={handleFinishQuiz}>
        Terminer et Devenir Auteur
      </button>
    </div>
  );
}
