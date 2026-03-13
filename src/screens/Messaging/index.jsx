import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/index.js"; // ⚠️ Vérifie le chemin
import ConversationList from "./ConversationList";
import ChatThread from "./contacts/ChatThread";
import MessagingSplash from "./MessagingSplash";
import MessagingHome from "./MessagingHome";
import { mockConversations } from "./mockData";

import "./message/messaging.css";

export default function Messaging({ setView, userStatus }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setMessagingView] = useState("messaging_splash"); // splash → home
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  /* 🔐 Authentification utilisateur */
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  /* 💬 Chargement conversations Firestore + fallback mock */
  useEffect(() => {
    // 🚨 Aucun utilisateur → mock direct
    if (!currentUser?.uid) {
      setConversations(mockConversations || []);
      setSelectedConversation(mockConversations?.[0] || null);
      return;
    }

    try {
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", currentUser.uid),
        orderBy("lastMessage.timestamp", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          if (!snapshot || snapshot.empty) {
            setConversations(mockConversations || []);
            setSelectedConversation(mockConversations?.[0] || null);
          } else {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setConversations(data);
            if (!selectedConversation && data.length > 0) setSelectedConversation(data[0]);
          }
        },
        error => {
          console.error("Erreur Firestore:", error);
          setConversations(mockConversations || []);
          setSelectedConversation(mockConversations?.[0] || null);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Erreur globale:", error);
      setConversations(mockConversations || []);
      setSelectedConversation(mockConversations?.[0] || null);
    }
  }, [currentUser?.uid]);

  /* 🔹 Rendu splash ou home */
  return (
    <div className="messaging-app-wrapper">

{/* Change setView par onComplete ici */}
{view === "messaging_splash" && (
  <MessagingSplash onComplete={() => setMessagingView("messaging_home")} />
)}


      {/* ⚡ Messaging Home */}
      {view === "messaging_home" && (
        <MessagingHome
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          currentUser={currentUser}
        />
      )}

      {/* ⚡ Fallback complet (si MessagingHome veut afficher chat direct) */}
      {view === "messaging_home" && !selectedConversation && (
        <div className="messaging-container">
          <div className="sidebar-section">
            <ConversationList
              conversations={conversations || []}
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              currentUser={currentUser}
            />
          </div>

          <div className="main-chat-section">
            <div className="messaging-placeholder">
              <div className="neon-circle-bg"></div>
              <div className="placeholder-content">
                <p className="placeholder-text">INIT_CONNEXION_NEURALE...</p>
                <span className="placeholder-subtext">
                  Sélectionnez un canal de communication
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}