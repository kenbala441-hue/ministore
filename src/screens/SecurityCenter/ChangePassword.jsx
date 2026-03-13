import React, { useState } from "react";
import { auth } from "../../firebase";

export default function ChangePassword({ user }) {
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      await auth.currentUser.updatePassword(newPassword);
      alert("Mot de passe changé avec succès !");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors du changement de mot de passe.");
    }
  };

  return (
    <div>
      <h3>Changer mot de passe</h3>
      <input
        type="password"
        value={newPassword}
        placeholder="Nouveau mot de passe"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Valider</button>
    </div>
  );
}