// AuthorApplyScreen.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AuthorApplyScreen() {
  const [formData, setFormData] = useState({
    penName: "",
    bio: "",
    experience: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.penName || !formData.bio) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }
    console.log("Candidature envoyée :", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden p-6">
        {/* Néon animé */}
        <motion.div
          className="absolute w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] top-[-200px] left-1/2 -translate-x-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold text-purple-400 mb-4 drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">
            🎉 Candidature envoyée !
          </h2>
          <p className="text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            Notre équipe examinera votre demande.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden p-6">
      {/* Fond néon dynamique */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[140px] top-[-200px] left-1/2 -translate-x-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-6 drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]">
          Devenir Auteur
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="penName"
            placeholder="Nom d'artiste *"
            value={formData.penName}
            onChange={handleChange}
            className="p-4 rounded-xl bg-gray-900 text-white border border-purple-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            name="bio"
            placeholder="Biographie *"
            value={formData.bio}
            onChange={handleChange}
            className="p-4 rounded-xl bg-gray-900 text-white border border-purple-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
          <textarea
            name="experience"
            placeholder="Expérience"
            value={formData.experience}
            onChange={handleChange}
            className="p-4 rounded-xl bg-gray-900 text-white border border-purple-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-3 rounded-2xl font-bold text-black bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-lg transition-all duration-300"
          >
            Envoyer la candidature
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}