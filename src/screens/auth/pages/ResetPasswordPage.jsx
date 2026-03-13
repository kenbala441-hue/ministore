import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    await sendPasswordResetEmail(auth, email);
    setMessage("Email de réinitialisation envoyé !");
  };

  return (
    <PageWrapper>
      <div style={{ padding: 40 }}>
        <h1>Réinitialiser le mot de passe</h1>

        {message && <p style={{ color: "lightgreen" }}>{message}</p>}

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Envoyer</button>
        </form>

        <p
          style={{ cursor: "pointer", marginTop: 20 }}
          onClick={() => navigate("/login")}
        >
          Retour à la connexion
        </p>
      </div>
    </PageWrapper>
  );
}