import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";

export default function AddPhoneNumber({ user }) {
  const [phone, setPhone] = useState("");

  const handleAddPhone = async () => {
    if (!phone) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        phoneNumbers: arrayUnion(phone),
      });
      alert("Numéro ajouté !");
      setPhone("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du numéro.");
    }
  };

  return (
    <div>
      <h3>Ajouter un numéro</h3>
      <input
        type="text"
        placeholder="Ex: +243 123 456 789"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleAddPhone}>Ajouter</button>
    </div>
  );
}