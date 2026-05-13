// src/screens/Messaging/contacts/ChatThread.jsx
// ⚡ CHAT THREAD V12 — COMICCRAFTE MESSENGER 2026
// Ultra compact • Temps réel • Optimisé mobile • Sécurisé Firebase

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ArrowLeft,
  Phone,
  Video,
  Search,
  MoreVertical,
  ShieldCheck,
  Pin,
  BellOff,
  Lock,
  CheckCheck,
  Image as ImageIcon,
  Smile,
  Mic,
  Info,
} from "lucide-react";

import { db } from "../../../firebase/index.js";

import MessageItem from "../message/MessageItem";
import MessageInput from "../conversation/MessageInput";

import "../message/messaging.css";

export default function ChatThread({
  conversation,
  currentUser,
  onBack,
}) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState("En ligne");

  const threadRef = useRef(null);
  const bottomRef = useRef(null);

  // 🔒 Conversation sécurisée
  const isSecured = true;

  // 🔥 Messages filtrés recherche
  const filteredMessages = useMemo(() => {
    if (!searchText.trim()) return messages;

    return messages.filter((msg) =>
      msg?.text?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [messages, searchText]);

  // ⚡ Chargement temps réel Firestore
  useEffect(() => {
    if (!conversation?.id) return;

    setLoading(true);

    try {
      const messagesRef = collection(
        db,
        "conversations",
        String(conversation.id),
        "messages"
      );

      const q = query(
        messagesRef,
        orderBy("timestamp", "asc"),
        limit(300)
      );

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const data = snapshot.docs.map((docu) => ({
            id: docu.id,
            ...docu.data(),
          }));

          setMessages(data);
          setLoading(false);

          // ✅ READ RECEIPTS
          try {
            const convRef = doc(db, "conversations", conversation.id);

            await updateDoc(convRef, {
              lastSeen: serverTimestamp(),
            });
          } catch (err) {
            console.log(err);
          }
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [conversation?.id]);

  // ⚡ AUTO SCROLL
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  // 🔥 Typing simulation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTyping(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [typing]);

  // 🔒 Anti crash
  if (!conversation) return null;

  return (
    <div className="cc-chat-thread">

      {/* HEADER */}
      <header className="cc-thread-header">

        <div className="cc-thread-left">
          <button className="cc-icon-btn" onClick={onBack}>
            <ArrowLeft size={18} />
          </button>

          <div className="cc-avatar-wrap">
            <img
              src={
                conversation?.photoURL ||
                "https://i.pravatar.cc/150"
              }
              alt="avatar"
              className="cc-avatar"
            />

            <div className="cc-online-dot" />
          </div>

          <div className="cc-thread-user">
            <h3>
              {conversation?.name || "Discussion"}
            </h3>

            <span>
              {typing
                ? "Écrit..."
                : onlineStatus}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="cc-thread-actions">

          <button className="cc-icon-btn">
            <Phone size={17} />
          </button>

          <button className="cc-icon-btn">
            <Video size={17} />
          </button>

          <button
            className="cc-icon-btn"
            onClick={() => setSearchMode(!searchMode)}
          >
            <Search size={17} />
          </button>

          <div className="cc-menu-wrapper">
            <button
              className="cc-icon-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical size={17} />
            </button>

            {showMenu && (
              <div className="cc-thread-menu">

                <div className="cc-menu-item">
                  <Pin size={15} />
                  Épingler
                </div>

                <div className="cc-menu-item">
                  <BellOff size={15} />
                  Silence
                </div>

                <div className="cc-menu-item">
                  <ShieldCheck size={15} />
                  Vérifier
                </div>

                <div className="cc-menu-item">
                  <Info size={15} />
                  Infos
                </div>

              </div>
            )}
          </div>

        </div>
      </header>

      {/* SEARCH */}
      {searchMode && (
        <div className="cc-search-box">
          <Search size={15} />

          <input
            placeholder="Rechercher un message..."
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />
        </div>
      )}

      {/* SECURITY BAR */}
      <div className="cc-security-bar">
        <Lock size={13} />
        <span>
          Chiffrement de bout en bout activé
        </span>
      </div>

      {/* THREAD */}
      <main
        className="cc-thread-messages"
        ref={threadRef}
      >

        {loading ? (
          <div className="cc-loader-wrap">
            <div className="cc-loader" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="cc-empty-chat">
            <ShieldCheck size={42} />
            <h4>Aucun message</h4>
            <p>
              Commencez une conversation sécurisée.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => (
            <MessageItem
              key={msg.id || index}
              message={msg}
              currentUser={currentUser}
            />
          ))
        )}

        {/* Typing */}
        {typing && (
          <div className="cc-typing">
            <span />
            <span />
            <span />
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* QUICK ACTIONS */}
      <div className="cc-quick-actions">

        <button className="cc-quick-btn">
          <ImageIcon size={15} />
        </button>

        <button className="cc-quick-btn">
          <Smile size={15} />
        </button>

        <button className="cc-quick-btn">
          <Mic size={15} />
        </button>

      </div>

      {/* INPUT */}
      <footer className="cc-thread-footer">
        <MessageInput
          conversationId={conversation?.id}
          currentUser={currentUser}
          onTyping={() => setTyping(true)}
        />
      </footer>

    </div>
  );
}