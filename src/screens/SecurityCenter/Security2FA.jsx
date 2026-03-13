import React, { useState } from "react";
import QRCode from "qrcode.react";
import "./security2fa.css";

export default function Security2FA({ user, setView }) {

  const [enabled, setEnabled] = useState(false);
  const [code, setCode] = useState("");

  // secret exemple (normalement généré par serveur)
  const secret = "MINISTORESECUREKEY123";

  const otpauth = `otpauth://totp/MiniStore:${user?.email}?secret=${secret}&issuer=MiniStore`;

  const handleEnable = () => {

    if (code.length !== 6) {
      alert("Code invalide");
      return;
    }

    // normalement vérifié côté serveur
    setEnabled(true);
    alert("2FA activé !");
  };

  const handleDisable = () => {
    setEnabled(false);
    setCode("");
  };

  return (
    <div className="twofa-container">

      <h2>Authentification à deux facteurs</h2>
      <p>Ajoutez une sécurité supplémentaire à votre compte.</p>

      {!enabled && (
        <div className="twofa-setup">

          <h3>Scanner le QR Code</h3>

          <div className="qr-box">
            <QRCode value={otpauth} size={180} />
          </div>

          <p>
            Ouvrez Google Authenticator ou Microsoft Authenticator et scannez ce code.
          </p>

          <input
            type="text"
            placeholder="Code à 6 chiffres"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button onClick={handleEnable}>
            Activer 2FA
          </button>

        </div>
      )}

      {enabled && (
        <div className="twofa-enabled">

          <p className="success">
            ✅ 2FA activé sur votre compte
          </p>

          <button className="disable-btn" onClick={handleDisable}>
            Désactiver
          </button>

        </div>
      )}

      <button className="back-btn" onClick={() => setView("security_center")}>
        Retour
      </button>

    </div>
  );
}