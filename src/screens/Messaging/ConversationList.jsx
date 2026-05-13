import React, { useMemo, useState } from "react";
import {
  Check,
  CheckCheck,
  Pin,
  BellOff,
  Archive,
  ShieldCheck,
  Search,
  MoreVertical,
  Camera,
  Mic,
} from "lucide-react";

/**
 * 💬 ConversationList V2026
 * - Compact mobile UI
 * - Stable Android/Web
 * - Lazy rendering safe
 * - Firebase friendly
 * - WhatsApp + Discord + Messenger inspiration
 * - Search + unread + online + pinned
 * - Responsive + smooth
 * - Low space usage
 */

export default function ConversationList({
  conversations = [],
  selectedConversation,
  setSelectedConversation,
  currentUser,
}) {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const participantsData = Array.isArray(conv?.participantsData)
        ? conv.participantsData
        : [];

      const otherUser =
        participantsData.find((u) => u?.uid !== currentUser?.uid) ||
        participantsData[0] ||
        {};

      const displayName = otherUser?.displayName || "Utilisateur";

      return displayName
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [conversations, search, currentUser]);

  const getMessageIcon = (type) => {
    switch (type) {
      case "image":
        return <Camera size={12} />;
      case "voice":
        return <Mic size={12} />;
      default:
        return null;
    }
  };

  return (
    <div style={s.wrapper}>
      {/* HEADER */}
      <div style={s.topBar}>
        <div>
          <h2 style={s.title}>Discussions</h2>
          <div style={s.subtitle}>
            Synchronisation sécurisée active
          </div>
        </div>

        <button style={s.headerBtn}>
          <MoreVertical size={18} />
        </button>
      </div>

      {/* SEARCH */}
      <div style={s.searchWrapper}>
        <Search size={16} color="#777" />

        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={s.searchInput}
        />
      </div>

      {/* LIST */}
      <div style={s.list}>
        {filteredConversations.length <= 0 && (
          <div style={s.empty}>
            Aucune conversation disponible
          </div>
        )}

        {filteredConversations.map((conv) => {
          if (!conv?.id) return null;

          const participantsData = Array.isArray(conv?.participantsData)
            ? conv.participantsData
            : [];

          const otherUser =
            participantsData.find(
              (u) => u?.uid !== currentUser?.uid
            ) ||
            participantsData[0] ||
            {};

          const displayName =
            otherUser?.displayName?.trim() ||
            "Utilisateur";

          const avatar =
            otherUser?.photoURL ||
            otherUser?.avatar ||
            null;

          const badge = otherUser?.badge || "";

          const verified = otherUser?.verified || false;

          const online = otherUser?.online || false;

          const unreadCount =
            Number(conv?.unreadCount) || 0;

          const pinned = conv?.pinned || false;

          const muted = conv?.muted || false;

          const encrypted =
            conv?.encrypted !== false;

          const lastMessage =
            conv?.lastMessage?.text ||
            "Commencez la discussion";

          const lastTime =
            conv?.lastMessage?.time || "";

          const lastType =
            conv?.lastMessage?.type || "text";

          const lastSender =
            conv?.lastMessage?.senderId ===
            currentUser?.uid;

          const delivered =
            conv?.lastMessage?.delivered;

          const seen = conv?.lastMessage?.seen;

          const active =
            selectedConversation?.id === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() =>
                setSelectedConversation?.(conv)
              }
              style={{
                ...s.card,
                ...(active ? s.activeCard : {}),
              }}
            >
              {/* AVATAR */}
              <div style={s.avatarWrapper}>
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    style={s.avatar}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={s.avatarFallback}>
                    {displayName[0]?.toUpperCase()}
                  </div>
                )}

                {online && <div style={s.onlineDot} />}
              </div>

              {/* CONTENT */}
              <div style={s.content}>
                {/* TOP */}
                <div style={s.rowTop}>
                  <div style={s.nameArea}>
                    <span style={s.name}>
                      {displayName}
                    </span>

                    {verified && (
                      <ShieldCheck
                        size={13}
                        color="#00d2ff"
                      />
                    )}

                    {badge && (
                      <span style={s.badge}>
                        {badge}
                      </span>
                    )}

                    {encrypted && (
                      <div style={s.encrypted}>
                        🔒
                      </div>
                    )}

                    {pinned && (
                      <Pin
                        size={12}
                        color="#8b5cf6"
                      />
                    )}

                    {muted && (
                      <BellOff
                        size={12}
                        color="#777"
                      />
                    )}
                  </div>

                  <span style={s.time}>
                    {lastTime}
                  </span>
                </div>

                {/* MESSAGE */}
                <div style={s.rowBottom}>
                  <div style={s.lastMessage}>
                    {lastSender && (
                      <>
                        {seen ? (
                          <CheckCheck
                            size={14}
                            color="#00d2ff"
                          />
                        ) : delivered ? (
                          <CheckCheck
                            size={14}
                            color="#666"
                          />
                        ) : (
                          <Check
                            size={14}
                            color="#666"
                          />
                        )}
                      </>
                    )}

                    {getMessageIcon(lastType)}

                    <span style={s.messageText}>
                      {lastMessage}
                    </span>
                  </div>

                  {/* UNREAD */}
                  {unreadCount > 0 && (
                    <div style={s.unreadBadge}>
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STORAGE STATUS */}
      <div style={s.footer}>
        <Archive size={13} />
        Messages sauvegardés localement
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#050505",
    color: "#fff",
    overflow: "hidden",
  },

  topBar: {
    padding: "14px 14px 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "-0.4px",
  },

  subtitle: {
    fontSize: "10px",
    color: "#666",
    marginTop: "2px",
  },

  headerBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "#0d0d0d",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  searchWrapper: {
    margin: "0 14px 12px",
    height: "42px",
    borderRadius: "14px",
    background: "#0f0f10",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 14px",
    flexShrink: 0,
  },

  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "13px",
  },

  list: {
    flex: 1,
    overflowY: "auto",
    padding: "0 10px 90px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  card: {
    display: "flex",
    gap: "12px",
    padding: "10px",
    borderRadius: "18px",
    cursor: "pointer",
    transition: "0.18s ease",
    background: "#0b0b0c",
    border: "1px solid rgba(255,255,255,0.04)",
  },

  activeCard: {
    background:
      "linear-gradient(135deg,#10131b,#0b1016)",
    border: "1px solid rgba(0,210,255,0.18)",
    boxShadow: "0 0 15px rgba(0,210,255,0.08)",
  },

  avatarWrapper: {
    position: "relative",
    width: "52px",
    height: "52px",
    flexShrink: 0,
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "18px",
    objectFit: "cover",
    background: "#111",
  },

  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#111,#1f2937)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },

  onlineDot: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#00ff85",
    border: "2px solid #050505",
  },

  content: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "5px",
  },

  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  rowBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  nameArea: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    minWidth: 0,
  },

  name: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  badge: {
    fontSize: "9px",
    background: "#1e293b",
    color: "#8ec5ff",
    padding: "2px 5px",
    borderRadius: "20px",
    fontWeight: "700",
  },

  encrypted: {
    fontSize: "10px",
    opacity: 0.7,
  },

  time: {
    fontSize: "10px",
    color: "#666",
    flexShrink: 0,
  },

  lastMessage: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    minWidth: 0,
    color: "#8b8b8b",
    fontSize: "12px",
    flex: 1,
  },

  messageText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  unreadBadge: {
    minWidth: "20px",
    height: "20px",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg,#00d2ff,#3a7bff)",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 6px",
    flexShrink: 0,
    boxShadow: "0 0 12px rgba(0,210,255,0.35)",
  },

  empty: {
    textAlign: "center",
    color: "#555",
    paddingTop: "40px",
    fontSize: "13px",
  },

  footer: {
    position: "absolute",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "10px",
    color: "#666",
    background: "rgba(10,10,10,0.7)",
    padding: "6px 12px",
    borderRadius: "999px",
    backdropFilter: "blur(10px)",
  },
};