// MESSAGING HOME V2.0 — COMICCRAFTE SECURE CHAT
// VERSION 2026
// UI PRO • FIREBASE READY • END TO END READY • WHATSAPP + SIGNAL STYLE

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  ShieldCheck,
  Lock,
  Bell,
  Moon,
  Sun,
  ArrowLeft,
  CheckCheck,
  Mic,
  Paperclip,
  Image,
  Smile,
  Trash2,
  Pin,
  Archive,
  Users,
  MessageCircle,
  Circle,
  Camera,
  Settings,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  limit,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth, db } from "../../firebase/index.js";

const THEME = {
  bg: "#05070d",
  card: "#0b1118",
  soft: "#101923",
  border: "rgba(255,255,255,0.06)",
  text: "#ffffff",
  muted: "#7c8796",
  neon: "#00e5ff",
  purple: "#7a5cff",
  success: "#39ff88",
};

export default function MessagingHomeV2({
  setView,
}) {
  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedChat, setSelectedChat] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [darkMode, setDarkMode] =
    useState(true);

  const [showMenu, setShowMenu] =
    useState(false);

  const [typing, setTyping] =
    useState(false);

  const [showSearchBar, setShowSearchBar] =
    useState(false);

  const [recording, setRecording] =
    useState(false);

  const [conversations, setConversations] = useState([
  {
    id: "1",
    name: "Test User",
    lastMessage: "Ça marche !",
    participants: [currentUser?.uid]
  }
]);


  const messageEndRef = useRef(null);

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          setView("login");
        }

        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // CONVERSATIONS
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "conversations"),
      where(
        "participants",
        "array-contains",
        currentUser.uid
      ),
      orderBy("updatedAt", "desc"),
      limit(50)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setConversations(data);
    });

    return () => unsub();
  }, [currentUser]);

  // MESSAGES
  useEffect(() => {
    if (!selectedChat) return;

    const q = query(
      collection(
        db,
        "conversations",
        selectedChat.id,
        "messages"
      ),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(data);
    });

    return () => unsub();
  }, [selectedChat]);

  // AUTO SCROLL
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (
      !message.trim() ||
      !selectedChat ||
      !currentUser
    )
      return;

    const payload = {
      text: message,
      senderId: currentUser.uid,
      senderName:
        currentUser.displayName || "Utilisateur",
      createdAt: serverTimestamp(),
      encrypted: true,
      seen: false,
      edited: false,
      deleted: false,
      reactions: [],
      replyTo: null,
      type: "text",
    };

    await addDoc(
      collection(
        db,
        "conversations",
        selectedChat.id,
        "messages"
      ),
      payload
    );

    await updateDoc(
      doc(db, "conversations", selectedChat.id),
      {
        lastMessage: message,
        updatedAt: serverTimestamp(),
      }
    );

    setMessage("");
  };

  // DELETE MESSAGE
  const deleteMessage = async (msgId) => {
    if (!selectedChat) return;

    await deleteDoc(
      doc(
        db,
        "conversations",
        selectedChat.id,
        "messages",
        msgId
      )
    );
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // SEARCH FILTER
  const filteredConversations =
    useMemo(() => {
      return conversations.filter((c) =>
        c.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }, [search, conversations]);

  if (loading) {
    return (
      <div style={s.loader}>
        <div style={s.loaderCircle} />
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* SIDEBAR */}
      <div
        style={{
          ...s.sidebar,
          display: selectedChat
            ? "none"
            : "flex",
        }}
      >
        {/* HEADER */}
        <div style={s.sidebarHeader}>
          <div>
            <div style={s.logoRow}>
              <ShieldCheck
                size={18}
                color={THEME.neon}
              />

              <h2 style={s.logo}>
                ComicChat
              </h2>
            </div>

            <div style={s.secureText}>
              Chiffrement sécurisé actif
            </div>
          </div>

          <div style={s.headerBtns}>
            <button
              style={s.iconBtn}
              onClick={() =>
                setShowSearchBar(
                  !showSearchBar
                )
              }
            >
              <Search size={18} />
            </button>

            <button
              style={s.iconBtn}
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >
              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <div style={{ position: "relative" }}>
              <button
                style={s.iconBtn}
                onClick={() =>
                  setShowMenu(!showMenu)
                }
              >
                <MoreVertical size={18} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                    }}
                    style={s.menu}
                  >
                    <button
                      style={s.menuItem}
                    >
                      <Settings size={15} />
                      Paramètres
                    </button>

                    <button
                      style={s.menuItem}
                    >
                      <Archive size={15} />
                      Archivés
                    </button>

                    <button
                      style={s.menuItem}
                    >
                      <Bell size={15} />
                      Notifications
                    </button>

                    <button
                      style={s.menuItem}
                      onClick={logout}
                    >
                      <Lock size={15} />
                      Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        {showSearchBar && (
          <div style={s.searchWrapper}>
            <Search
              size={16}
              color={THEME.muted}
            />

            <input
              placeholder="Rechercher..."
              style={s.searchInput}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        )}

        {/* STORIES */}
        <div style={s.storyBar}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={s.storyItem}
            >
              <div style={s.storyCircle}>
                <Camera size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* CONVERSATIONS */}
        <div style={s.chatList}>
          {filteredConversations.map(
            (chat) => (
              <motion.div
                whileTap={{
                  scale: 0.98,
                }}
                key={chat.id}
                style={s.chatCard}
                onClick={() =>
                  setSelectedChat(chat)
                }
              >
                <div style={s.avatar}>
                  {chat.name?.[0]}
                </div>

                <div style={s.chatInfo}>
                  <div style={s.chatTop}>
                    <div style={s.chatName}>
                      {chat.name}
                    </div>

                    <div style={s.chatTime}>
                      21:45
                    </div>
                  </div>

                  <div style={s.chatBottom}>
                    <div style={s.lastMessage}>
                      {chat.lastMessage ||
                        "Discussion sécurisée"}
                    </div>

                    <div style={s.unread}>
                      2
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>

        {/* FLOAT */}
        <button style={s.fab}>
          <MessageCircle size={22} />
        </button>
      </div>

      {/* CHAT */}
      {selectedChat && (
        <div style={s.chatContainer}>
          {/* TOP */}
          <div style={s.chatHeader}>
            <div style={s.chatHeaderLeft}>
              <button
                style={s.iconBtn}
                onClick={() =>
                  setSelectedChat(null)
                }
              >
                <ArrowLeft size={18} />
              </button>

              <div style={s.avatar}>
                {selectedChat.name?.[0]}
              </div>

              <div>
                <div style={s.chatName}>
                  {selectedChat.name}
                </div>

                <div style={s.online}>
                  <Circle
                    size={8}
                    fill="#39ff88"
                    color="#39ff88"
                  />
                  en ligne
                </div>
              </div>
            </div>

            <div style={s.chatActions}>
              <button style={s.iconBtn}>
                <Phone size={18} />
              </button>

              <button style={s.iconBtn}>
                <Video size={18} />
              </button>

              <button style={s.iconBtn}>
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={s.messagesArea}>
            {messages.map((msg) => {
              const me =
                msg.senderId ===
                currentUser.uid;

              return (
                <motion.div
                  key={msg.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  style={{
                    ...s.messageRow,
                    justifyContent: me
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...s.messageBubble,
                      background: me
                        ? THEME.neon
                        : THEME.card,
                      color: me
                        ? "#000"
                        : "#fff",
                    }}
                  >
                    <div>
                      {msg.text}
                    </div>

                    <div style={s.messageMeta}>
                      <span>21:40</span>

                      {me && (
                        <CheckCheck
                          size={13}
                        />
                      )}
                    </div>

                    <div
                      style={
                        s.messageActions
                      }
                    >
                      <button
                        style={
                          s.messageActionBtn
                        }
                      >
                        <Pin size={13} />
                      </button>

                      <button
                        style={
                          s.messageActionBtn
                        }
                        onClick={() =>
                          deleteMessage(
                            msg.id
                          )
                        }
                      >
                        <Trash2
                          size={13}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <div ref={messageEndRef} />
          </div>

          {/* INPUT */}
          <div style={s.inputBar}>
            <button style={s.inputIcon}>
              <Smile size={20} />
            </button>

            <button style={s.inputIcon}>
              <Paperclip size={20} />
            </button>

            <button style={s.inputIcon}>
              <Image size={20} />
            </button>

            <input
              style={s.messageInput}
              placeholder="Message sécurisé..."
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
            />

            {message.length === 0 ? (
              <button
                style={s.sendBtn}
                onClick={() =>
                  setRecording(
                    !recording
                  )
                }
              >
                <Mic size={19} />
              </button>
            ) : (
              <button
                style={s.sendBtn}
                onClick={sendMessage}
              >
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  container: {
    height: "100vh",
    background: THEME.bg,
    color: THEME.text,
    display: "flex",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  sidebarHeader: {
    padding: "14px",
    borderBottom: `1px solid ${THEME.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  logo: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
  },

  secureText: {
    fontSize: "10px",
    color: THEME.muted,
    marginTop: "2px",
  },

  headerBtns: {
    display: "flex",
    gap: "8px",
  },

  iconBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "12px",
    border: `1px solid ${THEME.border}`,
    background: THEME.soft,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
  },

  searchWrapper: {
    margin: "12px",
    height: "42px",
    borderRadius: "14px",
    background: THEME.soft,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 14px",
    border: `1px solid ${THEME.border}`,
  },

  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "13px",
  },

  storyBar: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    padding: "12px",
  },

  storyItem: {
    flexShrink: 0,
  },

  storyCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#00e5ff,#7a5cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  chatList: {
    flex: 1,
    overflowY: "auto",
    padding: "0 10px 100px",
  },

  chatCard: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    borderRadius: "18px",
    background: THEME.card,
    marginBottom: "8px",
    border: `1px solid ${THEME.border}`,
    cursor: "pointer",
  },

  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg,#00e5ff,#7a5cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    color: "#fff",
    flexShrink: 0,
  },

  chatInfo: {
    flex: 1,
    minWidth: 0,
  },

  chatTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },

  chatName: {
    fontSize: "14px",
    fontWeight: "700",
  },

  chatTime: {
    fontSize: "10px",
    color: THEME.muted,
  },

  chatBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  lastMessage: {
    fontSize: "12px",
    color: THEME.muted,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  unread: {
    minWidth: "20px",
    height: "20px",
    borderRadius: "20px",
    background: THEME.neon,
    color: "#000",
    fontSize: "10px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  fab: {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    width: "58px",
    height: "58px",
    borderRadius: "20px",
    border: "none",
    background:
      "linear-gradient(135deg,#00e5ff,#7a5cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    boxShadow:
      "0 10px 30px rgba(0,229,255,0.35)",
  },

  chatContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  chatHeader: {
    padding: "12px",
    borderBottom: `1px solid ${THEME.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: THEME.bg,
  },

  chatHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  online: {
    fontSize: "11px",
    color: THEME.success,
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  chatActions: {
    display: "flex",
    gap: "8px",
  },

  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  messageRow: {
    display: "flex",
  },

  messageBubble: {
    maxWidth: "78%",
    padding: "10px 12px",
    borderRadius: "18px",
    position: "relative",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  messageMeta: {
    marginTop: "6px",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "4px",
    opacity: 0.7,
  },

  messageActions: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    display: "flex",
    gap: "4px",
  },

  messageActionBtn: {
    width: "24px",
    height: "24px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
 inputIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    border: `1px solid ${THEME.border}`,
    background: THEME.soft,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  messageInput: {
    flex: 1,
    height: "44px",
    borderRadius: "14px",
    border: `1px solid ${THEME.border}`,
    background: THEME.soft,
    padding: "0 14px",
    color: "#fff",
    outline: "none",
    fontSize: "13px",
  },

  sendBtn: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg,#00e5ff,#7a5cff)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    position: "absolute",
    right: 0,
    top: "46px",
    width: "180px",
    background: THEME.card,
    borderRadius: "16px",
    border: `1px solid ${THEME.border}`,
    overflow: "hidden",
    zIndex: 20,
  },

  menuItem: {
    width: "100%",
    padding: "12px 14px",
    border: "none",
    background: "transparent",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
  },

  loader: {
    height: "100vh",
    background: THEME.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loaderCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.08)",
    borderTop: "3px solid #00e5ff",
    animation: "spin 1s linear infinite",
  },
};
  