import React from "react";
import { useUserContext } from "../firebase/userContext";

export default function AuthorValidationMessage({ setView }) {
  const { user, setUser } = useUserContext();

  const handleValidation = () => {
    // Si l'utilisateur a un rôle d'auteur, on met à jour l'état
    if (user && user.role === "author") {
      alert("Votre compte a été validé et reconnu par Comiccrafte !");
      setUser({ ...user, role: "author" }); // Mettez à jour le rôle si nécessaire
      setView("author_dashboard"); // Rediriger vers le tableau de bord
    } else {
      alert("Erreur de validation. Veuillez essayer de nouveau.");
    }
  };

  return (
    <div className="validation-message-container">
      <h2>Votre compte a été validé et reconnu par Comiccrafte !</h2>
      <p>Appuyez sur le bouton ci-dessous pour continuer.</p>
      <button onClick={handleValidation}>Continuer</button>
    </div>
  );
}