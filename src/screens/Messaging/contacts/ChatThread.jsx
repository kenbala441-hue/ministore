// src/screens/Messaging/contacts/ChatThread.jsx
// ⚡ CHAT THREAD V13 — COMICCRAFTE MESSENGER 2026
// Réponses • Réactions • Scroll intelligent • Groupes de dates • Optimisé mobile

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
  ChevronDown,
  Info,
  X,
  Reply,
  SmilePlus,
} from "lucide-react";

import { db } from "../../../firebase/index.js";
import MessageItem from "../message/MessageItem";
import MessageInput from "../conversation/MessageInput";
import "../message/messaging.css";

// ─── Helpers ────────────────────────────────────────────────────────────────

const QUICK_REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

function formatDateLabel(timestamp) {
  if (!timestamp) return "";
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / 86400000);

  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return date.toLocaleDateString("fr-FR", { weekday: "long" });
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: days > 365 ? "numeric" : undefined,
  });
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  const da = a?.toDate ? a.toDate() : new Date(a);
  const db2 = b?.toDate ? b.toDate() : new Date(b);
  return (
    da.getFullYear() === db2.getFullYear() &&
    da.getMonth() === db2.getMonth() &&
    da.getDate() === db2.getDate()
  );
}

// ─── DateDivider ─────────────────────────────────────────────────────────────

function DateDivider({ label }) {
  return (
    <div className="cc-date-divider">
      <span>{label}</span>
    </div>
  );
}

// ─── ReactionPicker ──────────────────────────────────────────────────────────

function ReactionPicker({ onPick, onClose }) {
  return (
    <div className="cc-reaction-picker" role="menu">
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          className="cc-reaction-btn"
          onClick={() => { onPick(emoji); onClose(); }}
          aria-label={emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

// ─── ReplyPreview ────────────────────────────────────────────────────────────

function ReplyPreview({ message, onCancel }) {
  if (!message) return null;
  return (
    <div className="cc-reply-preview">
      <Reply size={13} />
      <div className="cc-reply-preview-content">
        <span className="cc-reply-preview-author">
          {message.senderName || "Utilisateur"}
        </span>
        <span className="cc-reply-preview-text">
          {message.text?.slice(0, 80) || "Message"}
        </span>
      </div>
      <button className="cc-icon-btn cc-reply-cancel" onClick={onCancel}>
        <X size={14} />
      </button>
    </div>
  );
}

// ─── MessageWithContext ───────────────────────────────────────────────────────

function MessageWithContext({ msg, currentUser, onReply, onReact }) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const isMine = msg.senderId === currentUser?.uid;
  const actionsRef = useRef(null);

  // Ferme le menu si clic hors
  useEffect(() => {
    if (!showActions && !showReactions) return;
    const handler = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setShowActions(false);
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showActions, showReactions]);

  return (
    <div
      className={`cc-msg-row ${isMine ? "cc-msg-mine" : "cc-msg-theirs"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        if (!showReactions) setShowActions(false);
      }}
      ref={actionsRef}
    >
      {/* Actions contextuelles */}
      {showActions && (
        <div className={`cc-msg-actions ${isMine ? "cc-msg-actions-left" : "cc-msg-actions-right"}`}>
          <button
            className="cc-msg-action-btn"
            title="Réagir"
            onClick={() => setShowReactions((v) => !v)}
          >
            <SmilePlus size={14} />
          </button>
          <button
            className="cc-msg-action-btn"
            title="Répondre"
            onClick={() => { onReply(msg); setShowActions(false); }}
          >
            <Reply size={14} />
          </button>
          {showReactions && (
            <ReactionPicker
              onPick={(emoji) => onReact(msg.id, emoji)}
              onClose={() => { setShowReactions(false); setShowActions(false); }}
            />
          )}
        </div>
      )}

      <MessageItem message={msg} currentUser={currentUser} />
    </div>
  );
}

// ─── ScrollToBottomButton ────────────────────────────────────────────────────

function ScrollToBottomButton({ show, onClick, unread }) {
  if (!show) return null;
  return (
    <button className="cc-scroll-bottom" onClick={onClick} aria-label="Aller en bas">
      <ChevronDown size={16} />
      {unread > 0 && <span className="cc-scroll-badge">{unread}</span>}
    </button>
  );
}

// ─── ChatThread ───────────────────────────────────────────────────────────────

export default function ChatThread({ conversation, currentUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyTarget, setReplyTarget] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const threadRef = useRef(null);
  const bottomRef = useRef(null);
  const prevLenRef = useRef(0);

  // ── Recherche ──────────────────────────────────────────────────────────────
  const filteredMessages = useMemo(() => {
    if (!searchText.trim()) return messages;
    return messages.filter((msg) =>
      msg?.text?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [messages, searchText]);

  // ── Messages avec séparateurs de date ─────────────────────────────────────
  const messagesWithDividers = useMemo(() => {
    const items = [];
    filteredMessages.forEach((msg, i) => {
      const prev = filteredMessages[i - 1];
      if (!prev || !isSameDay(prev.timestamp, msg.timestamp)) {
        items.push({
          type: "divider",
          id: `divider-${i}`,
          label: formatDateLabel(msg.timestamp),
        });
      }
      items.push({ type: "message", ...msg });
    });
    return items;
  }, [filteredMessages]);

  // ── Firestore temps réel ───────────────────────────────────────────────────
  useEffect(() => {
    if (!conversation?.id) return;
    setLoading(true);

    const messagesRef = collection(
      db,
      "conversations",
      String(conversation.id),
      "messages"
    );

    const q = query(messagesRef, orderBy("timestamp", "asc"), limit(300));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMessages(data);
        setLoading(false);

        // Compteur de non-lus si l'utilisateur n'est pas en bas
        if (!isAtBottom) {
          const newCount = data.length - prevLenRef.current;
          if (newCount > 0) setUnreadCount((c) => c + newCount);
        }
        prevLenRef.current = data.length;

        try {
          await updateDoc(doc(db, "conversations", conversation.id), {
            lastSeen: serverTimestamp(),
          });
        } catch (e) {
          console.log(e);
        }
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  // ── Auto scroll conditionnel ───────────────────────────────────────────────
  useEffect(() => {
    if (isAtBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [messages, isAtBottom]);

  // ── Détection scroll ───────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = threadRef.current;
    if (!el) return;
    const threshold = 80;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsAtBottom(atBottom);
    if (atBottom) setUnreadCount(0);
  }, []);

  // ── Typing timeout ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), 2500);
    return () => clearTimeout(t);
  }, [typing]);

  // ── Réaction ──────────────────────────────────────────────────────────────
  const handleReact = useCallback(async (msgId, emoji) => {
    if (!msgId || !conversation?.id) return;
    try {
      const ref = doc(db, "conversations", conversation.id, "messages", msgId);
      // Optimiste : stocker la réaction dans un champ reactions (map uid → emoji)
      await updateDoc(ref, {
        [`reactions.${currentUser?.uid}`]: emoji,
      });
    } catch (e) {
      console.error(e);
    }
  }, [conversation?.id, currentUser?.uid]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
    setUnreadCount(0);
  }, []);

  const handleCancelReply = useCallback(() => setReplyTarget(null), []);

  if (!conversation) return null;

  return (
    <div className="cc-chat-thread">

      {/* ── HEADER ── */}
      <header className="cc-thread-header">
        <div className="cc-thread-left">
          <button className="cc-icon-btn" onClick={onBack} aria-label="Retour">
            <ArrowLeft size={18} />
          </button>

          <div className="cc-avatar-wrap">
            <img
              src={conversation?.photoURL || "https://i.pravatar.cc/150"}
              alt={conversation?.name || "avatar"}
              className="cc-avatar"
            />
            <div className="cc-online-dot" aria-label="En ligne" />
          </div>

          <div className="cc-thread-user">
            <h3>{conversation?.name || "Discussion"}</h3>
            <span className={typing ? "cc-typing-label" : ""}>
              {typing ? "En train d'écrire…" : "En ligne"}
            </span>
          </div>
        </div>

        <div className="cc-thread-actions">
          <button className="cc-icon-btn" aria-label="Appel audio"><Phone size={17} /></button>
          <button className="cc-icon-btn" aria-label="Appel vidéo"><Video size={17} /></button>
          <button
            className={`cc-icon-btn ${searchMode ? "cc-icon-btn--active" : ""}`}
            onClick={() => setSearchMode((v) => !v)}
            aria-label="Rechercher"
          >
            <Search size={17} />
          </button>

          <div className="cc-menu-wrapper">
            <button
              className="cc-icon-btn"
              onClick={() => setShowMenu((v) => !v)}
              aria-label="Plus d'options"
            >
              <MoreVertical size={17} />
            </button>

            {showMenu && (
              <div className="cc-thread-menu" role="menu">
                {[
                  { icon: <Pin size={15} />, label: "Épingler" },
                  { icon: <BellOff size={15} />, label: "Silence" },
                  { icon: <ShieldCheck size={15} />, label: "Vérifier" },
                  { icon: <Info size={15} />, label: "Infos" },
                ].map(({ icon, label }) => (
                  <div key={label} className="cc-menu-item" role="menuitem">
                    {icon}{label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── SEARCH ── */}
      {searchMode && (
        <div className="cc-search-box">
          <Search size={15} />
          <input
            autoFocus
            placeholder="Rechercher dans la conversation…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              className="cc-icon-btn"
              onClick={() => setSearchText("")}
              aria-label="Effacer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* ── SECURITY BAR ── */}
      <div className="cc-security-bar">
        <Lock size={12} />
        <span>Chiffrement de bout en bout</span>
      </div>

      {/* ── MESSAGES ── */}
      <main
        className="cc-thread-messages"
        ref={threadRef}
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="cc-loader-wrap">
            <div className="cc-loader" />
          </div>
        ) : messagesWithDividers.length === 0 ? (
          <div className="cc-empty-chat">
            <ShieldCheck size={42} />
            <h4>Aucun message</h4>
            <p>Commencez une conversation sécurisée.</p>
          </div>
        ) : (
          messagesWithDividers.map((item) =>
            item.type === "divider" ? (
              <DateDivider key={item.id} label={item.label} />
            ) : (
              <MessageWithContext
                key={item.id}
                msg={item}
                currentUser={currentUser}
                onReply={setReplyTarget}
                onReact={handleReact}
              />
            )
          )
        )}

        {typing && (
          <div className="cc-typing" aria-live="polite">
            <span /><span /><span />
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* ── SCROLL TO BOTTOM ── */}
      <ScrollToBottomButton
        show={!isAtBottom}
        onClick={scrollToBottom}
        unread={unreadCount}
      />

      {/* ── REPLY PREVIEW ── */}
      <ReplyPreview message={replyTarget} onCancel={handleCancelReply} />

      {/* ── INPUT ── */}
      <footer className="cc-thread-footer">
        <MessageInput
          conversationId={conversation?.id}
          currentUser={currentUser}
          onTyping={() => setTyping(true)}
          replyTo={replyTarget}
          onReplySent={handleCancelReply}
        />
      </footer>

    </div>
  );
}