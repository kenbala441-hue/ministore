// src/screens/Messaging/conversation/MessageInput.jsx
// ⚡ MESSAGE INPUT V11 — COMICCRAFTE MESSENGER 2026
// Style WhatsApp · Réponse · Draft · Retry · Audio · Media preview

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/index.js";
import {
  Send,
  Paperclip,
  Smile,
  ImageIcon,
  Mic,
  X,
  Reply,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { fetchGiphy } from "./giphyAPI";
import "./messaging.css"; // Ajuste le chemin si ton fichier CSS est dans un autre dossier

// ─── EMOJI QUICK PANEL ───────────────────────────────────────────────────────

const QUICK_EMOJIS = [
  "😀","😂","😍","😎","🥰","😭","😤","🤔",
  "👍","👎","❤️","🔥","🎉","💯","🙏","👀",
];

function EmojiPanel({ onPick, onClose }) {
  return (
    <div className="mi-emoji-panel">
      {QUICK_EMOJIS.map((e) => (
        <button key={e} className="mi-emoji-item" onClick={() => onPick(e)}>
          {e}
        </button>
      ))}
    </div>
  );
}

// ─── MEDIA PREVIEW ───────────────────────────────────────────────────────────

function MediaPreview({ image, audio, file, onClear }) {
  if (!image && !audio && !file) return null;
  return (
    <div className="mi-media-preview">
      {image && (
        <img src={image} alt="aperçu" className="mi-preview-img" />
      )}
      {audio && (
        <audio controls src={audio} className="mi-preview-audio" />
      )}
      {file && (
        <div className="mi-preview-file">
          <Paperclip size={13} />
          <span>{file.name}</span>
        </div>
      )}
      <button className="mi-preview-clear" onClick={onClear} aria-label="Supprimer le média">
        <X size={13} />
      </button>
    </div>
  );
}

// ─── REPLY BANNER (affiché si replyTo passé depuis ChatThread) ───────────────

function ReplyBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mi-reply-banner">
      <div className="mi-reply-bar" />
      <div className="mi-reply-content">
        <span className="mi-reply-author">
          {message.senderName || "Utilisateur"}
        </span>
        <span className="mi-reply-text">
          {message.text?.slice(0, 90) || "Message"}
        </span>
      </div>
    </div>
  );
}

// ─── ERROR TOAST ──────────────────────────────────────────────────────────────

function ErrorToast({ message, onRetry }) {
  return (
    <div className="mi-error-toast">
      <AlertCircle size={13} />
      <span>{message}</span>
      <button className="mi-error-retry" onClick={onRetry}>
        <RefreshCw size={12} /> Réessayer
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function MessageInput({
  conversationId,
  currentUser,
  theme = "dark",
  onMessageSent,
  onTyping,
  replyTo,        // { id, text, senderName } passé depuis ChatThread
  onReplySent,    // callback pour vider le replyTarget dans ChatThread
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedAudio, setAttachedAudio] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [error, setError] = useState(null);
  const [pendingRetry, setPendingRetry] = useState(null);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const emojiRef = useRef(null);

  const draftKey = `draft-${conversationId}-${currentUser?.uid}`;
  const hasContent =
    text.trim().length > 0 || attachedImage || attachedAudio || attachedFile;
  const canSend =
    Boolean(conversationId) && Boolean(currentUser?.uid) && hasContent && !sending;

  // ── Draft ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (draftLoaded) return;
    const saved = localStorage.getItem(draftKey);
    if (saved) setText(saved);
    setDraftLoaded(true);
  }, [draftKey, draftLoaded]);

  useEffect(() => {
    localStorage.setItem(draftKey, text);
  }, [text, draftKey]);

  // ── Auto-grow textarea ────────────────────────────────────────────────────
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [text]);

  // ── Ferme emoji si clic hors ──────────────────────────────────────────────
  useEffect(() => {
    if (!showEmoji) return;
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const buildPayload = useCallback(() => ({
    text: text.trim(),
    senderId: currentUser.uid,
    senderName: currentUser.displayName || "Utilisateur",
    timestamp: serverTimestamp(),
    ...(replyTo && {
      replyToId: replyTo.id,
      replyToText: replyTo.text?.slice(0, 100),
      replyToAuthor: replyTo.senderName,
    }),
    ...(attachedImage && { imageUrl: attachedImage }),
    ...(attachedAudio && { audioUrl: attachedAudio }),
    ...(attachedFile  && { fileUrl: attachedFile.name }),
  }), [text, currentUser, replyTo, attachedImage, attachedAudio, attachedFile]);

  const sendMessage = useCallback(async (payload) => {
    const data = payload || buildPayload();

    setText("");
    setAttachedImage(null);
    setAttachedAudio(null);
    setAttachedFile(null);
    setError(null);
    setPendingRetry(null);
    onReplySent?.();

    try {
      setSending(true);
      const msgsRef = collection(db, "conversations", String(conversationId), "messages");
      await addDoc(msgsRef, data);

      await updateDoc(doc(db, "conversations", String(conversationId)), {
        lastMessage: data.text || "[Média]",
        lastSenderId: currentUser.uid,
        updatedAt: serverTimestamp(),
        unread: true,
      });

      onMessageSent?.(data);
      try { new Audio("/sounds/message-sent.mp3").play(); } catch (_) {}
    } catch (err) {
      console.error("Envoi échoué:", err);
      setError("Message non envoyé.");
      setPendingRetry(data);
    } finally {
      setSending(false);
    }
  }, [buildPayload, conversationId, currentUser, onMessageSent, onReplySent]);

  const handleSend = useCallback(() => {
    if (!canSend) return;
    sendMessage();
  }, [canSend, sendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    onTyping?.();
  }, [handleSend, onTyping]);

  const clearMedia = useCallback(() => {
    setAttachedImage(null);
    setAttachedAudio(null);
    setAttachedFile(null);
  }, []);

  const insertEmoji = useCallback((emoji) => {
    setText((p) => p + emoji);
    inputRef.current?.focus();
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`mi-root mi-${theme}`}>

      {/* ERROR */}
      {error && (
        <ErrorToast
          message={error}
          onRetry={() => sendMessage(pendingRetry)}
        />
      )}

      {/* REPLY BANNER */}
      <ReplyBanner message={replyTo} />

      {/* MEDIA PREVIEW */}
      <MediaPreview
        image={attachedImage}
        audio={attachedAudio}
        file={attachedFile}
        onClear={clearMedia}
      />

      {/* EMOJI PANEL */}
      {showEmoji && (
        <div ref={emojiRef}>
          <EmojiPanel
            onPick={insertEmoji}
            onClose={() => setShowEmoji(false)}
          />
        </div>
      )}

      {/* INPUT ROW */}
      <div className="mi-row">

        {/* CAPSULE */}
        <div className="mi-capsule">

          {/* Emoji toggle */}
          <button
            type="button"
            className="mi-icon-btn mi-emoji-toggle"
            onClick={() => setShowEmoji((v) => !v)}
            aria-label="Emojis"
          >
            <Smile size={22} />
          </button>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => { setText(e.target.value); onTyping?.(); }}
            onKeyDown={handleKeyDown}
            placeholder={currentUser ? "Message" : "Connectez-vous pour parler"}
            disabled={!currentUser?.uid || sending}
            rows={1}
            className="mi-textarea"
            aria-label="Zone de message"
          />

          {/* Attach icons */}
          <div className="mi-attach-group">
            <label className="mi-icon-btn" aria-label="Joindre un fichier">
              <Paperclip size={20} />
              <input
                ref={fileInputRef}
                type="file"
                className="mi-hidden-input"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) setAttachedFile(f);
                }}
              />
            </label>

            <label className="mi-icon-btn" aria-label="Joindre une image">
              <ImageIcon size={20} />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="mi-hidden-input"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => setAttachedImage(reader.result);
                  reader.readAsDataURL(f);
                }}
              />
            </label>

            {/* Micro upload (visible seulement si texte vide) */}
            {!text.trim() && (
              <label className="mi-icon-btn" aria-label="Joindre un audio">
                <Mic size={20} />
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="mi-hidden-input"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) setAttachedAudio(URL.createObjectURL(f));
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* SEND / MIC BUTTON */}
        <button
          type="button"
          className={`mi-send-btn ${canSend ? "mi-send-btn--active" : ""} ${sending ? "mi-send-btn--sending" : ""}`}
          onClick={handleSend}
          disabled={!canSend && !(!text.trim() && !hasContent)}
          aria-label={hasContent ? "Envoyer" : "Message vocal"}
        >
          {sending ? (
            <span className="mi-send-spinner" />
          ) : hasContent ? (
            <Send size={18} className="mi-send-icon" />
          ) : (
            <Mic size={20} />
          )}
        </button>

      </div>
    </div>
  );
}