import React, { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Camera, Send, X } from "lucide-react";

export default function AddStory({ user, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    synopsis: "",
    genre: "Action",
    coverUrl: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.synopsis) return alert("Le titre et le synopsis sont requis !");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "stories"), {
        ...form,
        authorId: user.uid,
        authorName: user.displayName || user.username || "Auteur",
        views: 0,
        likes: 0,
        status: "published",
        createdAt: serverTimestamp(),
      });
      alert("🚀 Histoire publiée avec succès !");
      onComplete(); // Retour au dashboard
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la publication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.modal}>
      <div style={s.card}>
        <h2 style={s.title}>Nouvelle Œuvre</h2>
        
        <div style={s.inputGroup}>
          <label>Titre de l'histoire</label>
          <input 
            style={s.input} 
            placeholder="Ex: Les Chroniques de Kinshasa" 
            onChange={e => setForm({...form, title: e.target.value})}
          />
        </div>

        <div style={s.inputGroup}>
          <label>Synopsis / Prologue</label>
          <textarea 
            style={s.textarea} 
            placeholder="Racontez le début de l'aventure..." 
            onChange={e => setForm({...form, synopsis: e.target.value})}
          />
        </div>

        <div style={s.uploadZone}>
          <Camera size={24} />
          <span>Ajouter une couverture (URL)</span>
          <input 
            style={s.input} 
            placeholder="Lien de l'image" 
            onChange={e => setForm({...form, coverUrl: e.target.value})}
          />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          style={s.btn}
        >
          {loading ? "Chargement..." : "PUBLIER MAINTENANT"} <Send size={18} />
        </button>
      </div>
    </div>
  );
}

const s = {
  modal: { padding: '20px', background: '#000', minHeight: '100vh' },
  card: { background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: '1px solid #222' },
  title: { color: '#00f5d4', marginBottom: '20px' },
  inputGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', background: '#111', border: '1px solid #333', color: '#fff', marginTop: '5px' },
  textarea: { width: '100%', height: '120px', padding: '12px', borderRadius: '8px', background: '#111', border: '1px solid #333', color: '#fff', marginTop: '5px' },
  uploadZone: { padding: '20px', border: '2px dashed #333', borderRadius: '10px', textAlign: 'center', color: '#888', marginBottom: '20px' },
  btn: { width: '100%', padding: '15px', background: '#00f5d4', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }
};
