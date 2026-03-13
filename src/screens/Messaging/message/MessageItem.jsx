import React from "react";
import { formatDate } from "./utils";

export default function MessageItem({ message, currentUser }) {
  if (!message) return null;

  const isMine = message?.senderId && currentUser?.uid
    ? message.senderId === currentUser.uid
    : false;

  const safeText =
    typeof message.text === "string" && message.text.trim()
      ? message.text
      : "";

  return (
    <div className={`message-item ${isMine ? "mine" : "theirs"}`}>
      <div className="message-text">{safeText}</div>
      <div className="message-time">
        {formatDate(message?.timestamp)}
      </div>
    </div>
  );
}