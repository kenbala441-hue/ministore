// src/screens/Messaging/message/MessageItem.jsx
// ⚡ COMICCRAFTE MESSAGE ITEM V15
// Ultra Stable • Android Ready • Firebase Ready • Neon UI

import React, {
  useState,
  useMemo,
  memo,
} from "react";

import {
  Check,
  CheckCheck,
  Clock3,
  AlertCircle,
  SmilePlus,
  Reply,
  Copy,
  Trash2,
  MoreHorizontal,
  Download,
  Play,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

import { formatDate } from "./utils";

function MessageItem({
  message,
  currentUser,
  onReply,
  onDelete,
  onReact,
}) {

  const [showMenu, setShowMenu] = useState(false);
  const [showReactionBar, setShowReactionBar] = useState(false);

  // 🔒 Sécurité
  if (!message || !currentUser) return null;

  // ✅ Vérification auteur
  const isMine =
    message?.senderId === currentUser?.uid;

  // ✅ Texte sécurisé
  const safeText =
    typeof message?.text === "string"
      ? message.text.trim()
      : "";

  // ✅ Avatar fallback
  const avatar =
    message?.senderPhoto ||
    "https://i.pravatar.cc/100";

  // ✅ Nom fallback
  const senderName =
    message?.senderName ||
    "Utilisateur";

  // ✅ Message Type
  const type =
    message?.type || "text";

  // ✅ Horodatage
  const time = useMemo(() => {
    return formatDate(message?.timestamp);
  }, [message?.timestamp]);

  // 🔥 STATUS ICON
  const renderStatus = () => {
    if (!isMine) return null;

    switch (message?.status) {

      case "seen":
        return (
          <CheckCheck
            size={12}
            className="cc-status-seen"
          />
        );

      case "sent":
        return (
          <CheckCheck
            size={12}
            className="cc-status-sent"
          />
        );

      case "sending":
        return (
          <Clock3
            size={12}
            className="cc-status-loading"
          />
        );

      case "error":
        return (
          <AlertCircle
            size={12}
            className="cc-status-error"
          />
        );

      default:
        return (
          <Check
            size={12}
            className="cc-status-default"
          />
        );
    }
  };

  // 🔥 MEDIA CONTENT
  const renderContent = () => {

    // IMAGE
    if (type === "image") {
      return (
        <div className="cc-media-wrap">
          <img
            src={message?.mediaUrl}
            alt="media"
            className="cc-media-image"
            loading="lazy"
          />
        </div>
      );
    }

    // VIDEO
    if (type === "video") {
      return (
        <div className="cc-video-wrap">

          <video
            src={message?.mediaUrl}
            className="cc-video-player"
            controls
          />

          <div className="cc-video-overlay">
            <Play size={22} />
          </div>

        </div>
      );
    }

    // FILE
    if (type === "file") {
      return (
        <div className="cc-file-card">

          <div className="cc-file-left">
            <FileText size={18} />
          </div>

          <div className="cc-file-info">
            <span>
              {message?.fileName || "Document"}
            </span>

            <small>
              {message?.fileSize || "Fichier"}
            </small>
          </div>

          <button className="cc-file-download">
            <Download size={15} />
          </button>

        </div>
      );
    }

    // DEFAULT TEXT
    return (
      <p className="cc-message-text">
        {safeText}
      </p>
    );
  };

  return (
    <div
      className={`cc-message-row ${
        isMine ? "mine" : "theirs"
      }`}
    >

      {/* AVATAR */}
      {!isMine && (
        <img
          src={avatar}
          alt="avatar"
          className="cc-message-avatar"
          loading="lazy"
        />
      )}

      {/* MESSAGE */}
      <div
        className={`cc-message-bubble ${
          isMine ? "mine-bubble" : "their-bubble"
        }`}
      >

        {/* USER */}
        {!isMine && (
          <div className="cc-sender-name">
            {senderName}
          </div>
        )}

        {/* REPLY */}
        {message?.replyTo && (
          <div className="cc-reply-preview">

            <Reply size={12} />

            <span>
              {message.replyTo?.text?.slice(0, 60)}
            </span>

          </div>
        )}

        {/* CONTENT */}
        {renderContent()}

        {/* EDITED */}
        {message?.edited && (
          <div className="cc-edited">
            modifié
          </div>
        )}

        {/* FOOTER */}
        <div className="cc-message-footer">

          <div className="cc-message-time">
            {time}
          </div>

          {renderStatus()}

        </div>

        {/* REACTIONS */}
        {message?.reactions?.length > 0 && (
          <div className="cc-reaction-list">

            {message.reactions.map((r, index) => (
              <span
                key={index}
                className="cc-reaction-badge"
              >
                {r}
              </span>
            ))}

          </div>
        )}

      </div>

      {/* ACTIONS */}
      <div className="cc-message-actions">

        <button
          className="cc-action-btn"
          onClick={() =>
            setShowReactionBar(!showReactionBar)
          }
        >
          <SmilePlus size={14} />
        </button>

        <button
          className="cc-action-btn"
          onClick={() =>
            setShowMenu(!showMenu)
          }
        >
          <MoreHorizontal size={14} />
        </button>

        {/* REACTION BAR */}
        {showReactionBar && (
          <div className="cc-reaction-bar">

            {["❤️", "🔥", "😂", "😮", "👍"].map((emoji) => (
              <button
                key={emoji}
                className="cc-emoji-btn"
                onClick={() =>
                  onReact?.(message, emoji)
                }
              >
                {emoji}
              </button>
            ))}

          </div>
        )}

        {/* MENU */}
        {showMenu && (
          <div className="cc-message-menu">

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  safeText
                )
              }
            >
              <Copy size={14} />
              Copier
            </button>

            <button
              onClick={() =>
                onReply?.(message)
              }
            >
              <Reply size={14} />
              Répondre
            </button>

            {isMine && (
              <button
                className="danger"
                onClick={() =>
                  onDelete?.(message)
                }
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default memo(MessageItem);