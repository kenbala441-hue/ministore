import React from "react";
import ChangePassword from "./ChangePassword";
import DevicesList from "./DevicesList";
import AddPhoneNumber from "./AddPhoneNumber";
import Security2FA from "./Security2FA";
import "./securityCenter.css";

export default function SecurityCenter({ user }) {
  if (!user)
    return <p className="sc-message">Vous devez être connecté pour accéder au centre de sécurité.</p>;

  return (
    <div className="sc-container">
      <h2>Centre de Sécurité</h2>
      <p>Gérez votre mot de passe, vos appareils et vos informations de sécurité.</p>

      {/* Sections */}
      <div className="sc-section">
        <ChangePassword user={user} />
      </div>

      <div className="sc-section">
        <DevicesList user={user} />
      </div>

      <div className="sc-section">
        <AddPhoneNumber user={user} />
      </div>

      <div className="sc-section">
        <Security2FA setView={(view) => console.log("Redirection vers :", view)} />
      </div>
    </div>
  );
}