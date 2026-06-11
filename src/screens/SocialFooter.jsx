import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { doc, getDoc, updateDoc, increment, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from "../firebase"; 

export const SocialFooter = ({ storyId, user }) => {
  const [meta, setMeta] = useState({ likes: 0, rating: 0 });
  const [comment, setComment] = useState("");

  // Écouter les likes/notes en temps réel
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "stories_meta", storyId), (doc) => {
      if (doc.exists()) setMeta(doc.data());
    });
    return unsub;
  }, [storyId]);

  const handleLike = async () => {
    const ref = doc(db, "stories_meta", storyId);
    await updateDoc(ref, { likes: increment(1) });
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    await addDoc(collection(db, "stories_meta", storyId, "comments"), {
      userId: user.uid,
      userName: user.displayName,
      text: comment,
      createdAt: new Date()
    });
    setComment("");
  };

  return (
    <div className="social-footer">
      <div className="actions">
        <button onClick={handleLike}><Heart /> {meta.likes}</button>
        <button><Star /> Note</button>
      </div>
      <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ajouter un commentaire..." />
      <button onClick={postComment}>Publier</button>
    </div>
  );
};
