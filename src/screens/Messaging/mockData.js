// 🔥 MOCK DATA V3 — Spécial Messagerie Comiccrafte
export const mockConversations = [
  {
    id: "convo_alice_001",
    name: "Alice", // Nom affiché dans la liste
    avatar: "https://i.pravatar.cc/150?u=alice",
    status: "En ligne",
    role: "author", // Pour afficher un badge néon vert
    lastMessage: "J'ai adoré le dernier chapitre de ta story ! 🎭",
    updatedAt: Date.now(),
    unreadCount: 2,
    participants: ["uid_currentUser", "uid_alice"],
    // Détails pour simuler les bulles de chat
    messages: [
      { 
        id: "msg_1", 
        text: "Salut ! Tu as vu les nouveaux styles néon ?", 
        senderId: "uid_currentUser", 
        timestamp: Date.now() - 3600000 
      },
      { 
        id: "msg_2", 
        text: "Oui ! C'est incroyable. J'ai hâte de recharger mes Ink.", 
        senderId: "uid_alice", 
        timestamp: Date.now() - 1800000 
      },
      { 
        id: "msg_3", 
        text: "J'ai adoré le dernier chapitre de ta story ! 🎭", 
        senderId: "uid_alice", 
        timestamp: Date.now() - 600000 
      },
    ]
  },
  {
    id: "convo_bob_002",
    name: "Bob (Admin)",
    avatar: "https://i.pravatar.cc/150?u=bob",
    status: "Absent",
    role: "admin", // Pour afficher un badge néon rose/violet
    lastMessage: "Ton badge VIP a été activé avec succès. 💎",
    updatedAt: Date.now() - 86400000,
    unreadCount: 0,
    participants: ["uid_currentUser", "uid_bob"],
    messages: [
      { 
        id: "msg_4", 
        text: "Problème avec mon paiement Ink...", 
        senderId: "uid_currentUser", 
        timestamp: Date.now() - 90000000 
      },
      { 
        id: "msg_5", 
        text: "Ton badge VIP a été activé avec succès. 💎", 
        senderId: "uid_bob", 
        timestamp: Date.now() - 86400000 
      },
    ]
  },
  {
    id: "convo_seraphine_003",
    name: "Séraphine",
    avatar: "https://i.pravatar.cc/150?u=seraphine",
    status: "Hors ligne",
    role: "vip",
    lastMessage: "On se capte sur le InkMarket demain ?",
    updatedAt: Date.now() - 500000,
    unreadCount: 0,
    participants: ["uid_currentUser", "uid_seraphine"],
    messages: []
  }
];

// 🔹 Mock de l'utilisateur actuel pour tes tests de composants
export const mockCurrentUser = {
  uid: "uid_currentUser",
  displayName: "Kinh Dztoi",
  photoURL: "https://i.pravatar.cc/150?u=kinh",
  role: "premium",
  inkBalance: 1250,
  pseudo: "Kinh_Artiste"
};
