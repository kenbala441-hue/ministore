import React from "react";

export default function ConversationList({
  conversations,
  selectedConversation,
  setSelectedConversation,
  currentUser,
}) {
  const safeConversations = Array.isArray(conversations)
    ? conversations
    : [];

  return (
    <div className="conversation-list">
      {safeConversations.map((conv) => {
        if (!conv?.id) return null;

        const participantsData = Array.isArray(conv.participantsData)
          ? conv.participantsData
          : [];

        const otherUser =
          participantsData.find(
            (u) => u?.uid && u.uid !== currentUser?.uid
          ) || participantsData[0] || {};

        const displayName =
          typeof otherUser.displayName === "string" &&
          otherUser.displayName.trim()
            ? otherUser.displayName
            : "Utilisateur";

        const badge =
          typeof otherUser.badge === "string" ? otherUser.badge : "";

        const lastText =
          typeof conv?.lastMessage?.text === "string"
            ? conv.lastMessage.text
            : "";

        const lastTime =
          typeof conv?.lastMessage?.time === "string"
            ? conv.lastMessage.time
            : "";

        return (
          <div
            key={conv.id}
            className={`conversation-item ${
              selectedConversation?.id === conv.id ? "active" : ""
            }`}
            onClick={() => setSelectedConversation?.(conv)}
          >
            <div className="avatar">
              {displayName?.[0] || "U"}
              <div className="online-dot"></div>
            </div>

            <div className="conversation-info">
              <div className="name-row">
                <span className="conversation-name">
                  {displayName}
                  {badge && <span className="badge"> {badge}</span>}
                </span>
                <span className="time">{lastTime}</span>
              </div>

              <div className="conversation-last">{lastText}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}