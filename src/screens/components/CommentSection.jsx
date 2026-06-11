import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useUserContext } from "../profile/userContext";
import { Send, Loader2 } from "lucide-react";

export const CommentSection = ({ storyId }) => {
  const { user, userData } = useUserContext();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger les commentaires en temps réel
  useEffect(() => {
    if (!storyId) return;
    const q = query(collection(db, "stories_meta", storyId, "comments"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [storyId]);

  const postComment = async () => {
    if (!user || !comment.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "stories_meta", storyId, "comments"), {
        userId: user.uid,
        username: userData?.username || "Lecteur",
        text: comment.trim(),
        createdAt: serverTimestamp()
      });
      setComment("");
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Commentaires ({comments.length})</h3>
      
      {/* Input toujours visible (Webtoon style) */}
      <div style={styles.inputArea}>
        <input 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          placeholder={user ? "Laisser un commentaire..." : "Connectez-vous pour commenter"}
          disabled={!user}
          style={styles.input}
        />
        <button onClick={postComment} disabled={!user || loading} style={styles.sendBtn}>
          {loading ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>}
        </button>
      </div>

      {/* Liste des commentaires */}
      <div style={styles.list}>
        {comments.map(c => (
          <div key={c.id} style={styles.comment}>
            <div style={styles.user}>{c.username}</div>
            <div style={styles.text}>{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { marginTop: 40, padding: "20px", background: "#0a0a0a", borderRadius: 20 },
  title: { fontSize: 16, marginBottom: 15 },
  inputArea: { display: "flex", gap: 10, marginBottom: 20 },
  input: { flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#1a1a1a", color: "#fff" },
  sendBtn: { background: "#00f7ff", border: "none", borderRadius: 12, padding: "0 15px", cursor: "pointer" },
  comment: { marginBottom: 15 },
  user: { fontSize: 12, color: "#00f7ff", fontWeight: 700 },
  text: { fontSize: 14, color: "#ccc", marginTop: 4 }
};
