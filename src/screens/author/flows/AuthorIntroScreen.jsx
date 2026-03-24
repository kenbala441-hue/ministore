import { motion } from "framer-motion";
import "./AuthorIntroScreen.css";
import { useUserContext } from "../../users/userContext";

export default function AuthorIntroScreen({ setView }) {
  const { user } = useUserContext();

  const handleAccessClick = () => {
    // Si l'utilisateur est membre studio et activé
    if (user?.role === "studio_member" && user?.studioActivated) {
      setView("studio_activated");
    } else {
      setView("author_access"); // flow normal pour les auteurs indépendants
    }
  };

  return (
    <div className="intro-container">
      <motion.div
        className="neon-orb"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="intro-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="intro-title">Vous avez du talent ?</h1>

        <p className="intro-text">
          Vous êtes passionné d'histoire, vous voulez créer votre propre univers
          ou avoir un public fidèle et gagner de l'argent en monétisant votre
          histoire, vous êtes au bon endroit.
        </p>

        <div className="intro-buttons">
          <motion.button
            onClick={handleAccessClick}
            className="btn-primary"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Entrer une carte d'accès
          </motion.button>

          <motion.button
            onClick={() => setView("author_apply")}
            className="btn-secondary"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Envoyer une demande auteur
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}