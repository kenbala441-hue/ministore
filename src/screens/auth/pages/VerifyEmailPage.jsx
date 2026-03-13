import React, { useState } from "react";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleResend = async () => {
    if (user) {
      await sendEmailVerification(user);
      setMessage("Email de vérification envoyé !");
    }
  };

  const handleRefresh = async () => {
    await user.reload();
    if (user.emailVerified) {
      navigate("/home");
    } else {
      setMessage("Email non encore vérifié.");
    }
  };

  return (
    <div style={s.container}>
      <h1>Vérifiez votre email</h1>
      <p>
        Un email de vérification a été envoyé à {user?.email}
      </p>

      {message && <p style={s.message}>{message}</p>}

      <button onClick={handleResend} style={s.btn}>
        Renvoyer l'email
      </button>

      <button onClick={handleRefresh} style={s.btnSecondary}>
        J'ai vérifié
      </button>
    </div>
  );
}

const s = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#050505",
    color: "white",
  },
  message: {
    color: "#4ade80",
    marginTop: 10,
  },
  btn: {
    marginTop: 20,
    padding: 10,
    background: "#6366f1",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
  },
  btnSecondary: {
    marginTop: 10,
    padding: 10,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
  },
};