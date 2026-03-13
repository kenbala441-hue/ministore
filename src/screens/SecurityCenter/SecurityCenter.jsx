import React from "react";

import ChangePassword from "./ChangePassword";
import DevicesList from "./DevicesList";
import AddPhoneNumber from "./AddPhoneNumber";
import "./securityCenter.css";
export default function SecurityCenter({ user }) {
  if (!user)
    return (
      <p className="sc-message">
        Vous devez être connecté pour accéder au centre de sécurité.
      </p>
    );

  return (
    <div className="sc-container">
      <h2>Centre de Sécurité</h2>
      <p>Gérez votre mot de passe, vos appareils et vos informations de sécurité.</p>

      <div className="sc-section">
        <ChangePassword user={user} />
      </div>

      <div className="sc-section">
        <DevicesList user={user} />
      </div>

      <div className="sc-section">
        <AddPhoneNumber user={user} />
      </div>
    </div>
  );
}