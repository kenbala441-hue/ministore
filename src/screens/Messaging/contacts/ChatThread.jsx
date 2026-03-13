import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/index.js";
import MessageItem from "../message/MessageItem";
import MessageInput from "../conversation/MessageInput";

/**
 * 🔥 CHAT THREAD V7 — Version Pro Ultime
 * - Messages temps réel Firestore
 * - Scroll auto smooth
 * - Header conversation dynamique
 * - Style néon vert/noir immersive
 * - Protection complète currentUser
 */
export default function ChatThread({ conversation, currentUser }) {
  const [messages, setMessages] = useState([]);
  const threadRef = useRef(null);

  // 🔹 Chargement messages Firebase temps réel
  useEffect(() => {
    if (!conversation?.id) {
      setMessages([]);
      return;
    }

    try {
      const messagesRef = collection(db, "conversations", String(conversation.id), "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          if (!snapshot || snapshot.empty) {
            setMessages([]);
          } else {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(data);
          }
        },
        error => {
          console.error("🔥 Erreur snapshot:", error);
          setMessages([]);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("🔥 Erreur ChatThread:", error);
      setMessages([]);
    }
  }, [conversation?.id]);

  // 🔹 Scroll automatique vers le dernier message
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (!conversation?.id) return null;

  return (
    <div
      className="chat-thread"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        className="chat-thread-header"
        style={{
          padding: "12px 15px",
          borderBottom: "1px solid rgba(0,255,128,0.3)",
          backgroundColor: "#050505",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#00ff7f" }}>
          {conversation?.name || "Discussion"}
        </h3>
        <small style={{ opacity: 0.6, fontSize: "0.8rem" }}>
          {conversation?.status || "En ligne"}
        </small>
      </div>

      {/* ZONE MESSAGES */}
      <div
        className="messages-container"
        ref={threadRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "linear-gradient(to top, #000000 0%, #0a0a0a 100%)",
        }}
      >
        {messages.length > 0 ? (
          messages.map(msg => (
            <MessageItem key={msg.id} message={msg} currentUser={currentUser} />
          ))
        ) : (
          <div style={{ textAlign: "center", opacity: 0.3, marginTop: "30px" }}>
            Aucun message pour le moment...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div
        className="chat-input-area"
        style={{
          padding: "10px 15px",
          borderTop: "1px solid rgba(0,255,128,0.3)",
          backgroundColor: "#050505",
        }}
      >
        <MessageInput conversationId={conversation?.id} currentUser={currentUser} />
      </div>
    </div>
  );
}