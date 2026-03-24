import React, { useState } from "react";
import "./AuthorContractScreen.css";

export default function AuthorContractScreen({ setView }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="contract-container">
      <div className="contract-card">
        <h2 className="contract-title">⚖ Contrat officiel d'engagement Auteur</h2>

        <p>
          En acceptant ce contrat, vous reconnaissez avoir lu, compris et accepté
          l’ensemble des règles suivantes :
        </p>

        <ul className="contract-list">
          <li>Vous confirmez que votre œuvre est 100% originale et vous détenez tous les droits.</li>
          <li>Vous garantissez ne violer aucun droit d’auteur, marque ou propriété intellectuelle.</li>
          <li>Tout plagiat ou tentative de fraude entraînera un bannissement immédiat et définitif.</li>
          <li>Vous êtes seul responsable du contenu que vous publiez sur la plateforme.</li>
          <li>Comicrafte n’est nullement responsable des décisions éditoriales ou créatives que vous prenez.</li>
          <li>Comicrafte ne peut être tenu responsable des réactions du public face à votre contenu.</li>
          <li>Vous vous engagez à ne pas publier de contenu illégal, haineux, diffamatoire ou violent.</li>
          <li>Tout contenu à caractère extrême, illégal ou sensible pourra être supprimé sans préavis.</li>
          <li>Vous acceptez le système de modération et de validation interne de Comicrafte.</li>
          <li>Comicrafte se réserve le droit de suspendre ou supprimer un contenu non conforme.</li>
          <li>Vous êtes responsable des informations que vous fournissez lors de la vérification d’identité.</li>
          <li>En cas de litige légal lié à votre œuvre, vous assumez l’entière responsabilité juridique.</li>
          <li>Vous autorisez Comicrafte à afficher et promouvoir votre contenu sur la plateforme.</li>
          <li>Vous comprenez que la visibilité dépend des algorithmes et de l’engagement des lecteurs.</li>
          <li>Les revenus générés sont soumis aux conditions financières de la plateforme.</li>
          <li>Tout comportement frauduleux (bots, faux comptes, manipulation de vues) entraînera des sanctions.</li>
          <li>Vous acceptez que Comicrafte puisse modifier ses conditions générales à tout moment.</li>
          <li>La plateforme ne garantit aucun revenu minimum ni succès commercial.</li>
          <li>Vous vous engagez à respecter les lois en vigueur dans votre pays de résidence.</li>
          <li>La violation répétée des règles peut entraîner la suppression définitive de votre compte.</li>
        </ul>

        <button
          className={`accept-btn ${accepted ? "active" : ""}`}
          onClick={() => setAccepted(!accepted)}
        >
          {accepted ? "✔ Conditions acceptées" : "Accepter les conditions"}
        </button>

        <button
          disabled={!accepted}
          className={`continue-btn ${!accepted ? "disabled" : ""}`}
          onClick={() => setView("author_submission")}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}