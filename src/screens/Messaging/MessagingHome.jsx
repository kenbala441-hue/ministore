// src/screens/Messaging/MessagingHome.jsx

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Camera,
  MoreVertical,
  Send
} from "lucide-react";

import ConversationList from "./ConversationList";
import Contacts from "./contacts";
import SearchPage from "./conversation/Search";
import SettingsPage from "./conversation/Settings";

import {
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy
} from "firebase/firestore";

import { auth, db } from "../../firebase/index.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

// ✅ CHAT UI KIT
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

export default function MessagingHome({ conversations, selectedConversation, setSelectedConversation }) {

  const [currentUser,setCurrentUser] = useState(null);
  const [activeTab,setActiveTab] = useState("chat");
  const [showMenu,setShowMenu] = useState(false);
  const [darkMode,setDarkMode] = useState(true);
  const [loading,setLoading] = useState(true);
  const [searchMode,setSearchMode] = useState(false);

  const [messageText,setMessageText] = useState("");
  const [targetUser,setTargetUser] = useState(null);
  const [messages,setMessages] = useState([]);

  const theme = darkMode ? neonTheme : lightTheme;

  // 🔐 AUTH
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth,(user)=>{
      if(user){
        setCurrentUser(user);
      }else{
        window.location.href="/login";
      }
      setLoading(false);
    });
    return ()=>unsub();
  },[]);

  // 🔹 TARGET USER SYNCHRO
  useEffect(()=>{
    if(selectedConversation && currentUser){
      const otherId = selectedConversation.participants.find(id => id !== currentUser.uid);
      if(otherId){
        setTargetUser({ uid: otherId, email: selectedConversation.participantsEmail?.[otherId] || "Utilisateur" });
      }
    }
  },[selectedConversation, currentUser]);

  // 💬 REALTIME MESSAGES
  useEffect(()=>{
    if(!currentUser || !targetUser) return;
    const q = query(
      collection(db,"messages"),
      where("participants","array-contains",currentUser.uid),
      orderBy("createdAt")
    );
    const unsub = onSnapshot(q,(snapshot)=>{
      const msgs = snapshot.docs
        .map(doc=>({ id:doc.id, ...doc.data() }))
        .filter(msg => [currentUser.uid,targetUser.uid].includes(msg.from) && [currentUser.uid,targetUser.uid].includes(msg.to));
      setMessages(msgs);
    });
    return ()=>unsub();
  },[currentUser,targetUser]);

  const toggleTheme = ()=> setDarkMode(!darkMode);
  const logout = async ()=> await signOut(auth);

  const sendMessage = async ()=>{
    if(!currentUser || !targetUser || messageText.trim()==="") return;
    await addDoc(collection(db,"messages"),{
      participants:[currentUser.uid,targetUser.uid],
      from: currentUser.uid,
      to: targetUser.uid,
      text: messageText,
      createdAt: serverTimestamp()
    });
    setMessageText("");
  };

  if(loading){
    return(
      <div style={s.loaderContainer}>
        <div style={{...s.loader,background:theme.primary}}/>
      </div>
    );
  }

  return(
    <div style={{...s.container,background:theme.bg}}>
      <style>{`
        @keyframes neonPulse {
          0%{box-shadow:0 0 4px ${theme.primary}}
          50%{box-shadow:0 0 18px ${theme.primary}}
          100%{box-shadow:0 0 4px ${theme.primary}}
        }
        @keyframes fadeSlide {
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>

      <header style={{...s.header,background:theme.header}}>
        <div style={s.headerRow}>
          <h1 style={{...s.logo,color:theme.primary}}>ComicCrafte Message</h1>
          <div style={s.headerIcons}>
            <Camera size={20} color={theme.text}/>
            <Search size={20} color={theme.text} onClick={()=>setSearchMode(true)} />
            <div style={{position:"relative"}}>
              <MoreVertical size={22} color={theme.text} onClick={()=>setShowMenu(!showMenu)} />
              {showMenu && (
                <div style={{...s.menu,background:theme.header}}>
                  <div style={s.menuItem} onClick={()=>setActiveTab("settings")}>Paramètres</div>
                  <div style={s.menuItem} onClick={toggleTheme}>{darkMode ? "Mode clair" : "Mode sombre"}</div>
                  <div style={s.menuItem} onClick={logout}>Déconnexion</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={s.tabs}>
          <div style={{...s.tab,borderBottomColor:activeTab==="chat"?theme.primary:"transparent",color:activeTab==="chat"?theme.primary:theme.textMuted}} onClick={()=>setActiveTab("chat")}>DISCUSSIONS</div>
          <div style={{...s.tab,borderBottomColor:activeTab==="contacts"?theme.primary:"transparent",color:activeTab==="contacts"?theme.primary:theme.textMuted}} onClick={()=>setActiveTab("contacts")}>CONTACTS</div>
        </div>
      </header>

      <main style={s.content}>
        {!targetUser && activeTab==="chat" && <ConversationList currentUser={currentUser} setTargetUser={setTargetUser} />}
        {!targetUser && activeTab==="contacts" && <Contacts currentUser={currentUser} setTargetUser={setTargetUser} />}
        {activeTab==="settings" && <SettingsPage user={currentUser}/>}
        {searchMode && <SearchPage close={()=>setSearchMode(false)}/>}

        {targetUser && (
          <div style={{height:"100%",animation:"fadeSlide 0.3s"}}>
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {messages.map(msg=>{
                    const isMe = msg.from === currentUser.uid;
                    return(
                      <Message key={msg.id} model={{
                        message: msg.text,
                        sender: isMe ? "Moi" : targetUser.email,
                        direction: isMe ? "outgoing" : "incoming",
                        position: "single"
                      }}/>
                    );
                  })}
                </MessageList>
                <MessageInput
                  placeholder="Écrire un message..."
                  value={messageText}
                  onChange={setMessageText}
                  onSend={sendMessage}
                />
              </ChatContainer>
            </MainContainer>
          </div>
        )}
      </main>

      <div style={{...s.fab,background:theme.primary}} onClick={()=>setActiveTab("contacts")}>
        <MessageSquare size={26} color="#000"/>
      </div>
    </div>
  );
}

const neonTheme={
  bg:"#050505",
  header:"#0b0b0b",
  primary:"#00ffd5",
  text:"#ffffff",
  textMuted:"#777",
  input:"#111"
};

const lightTheme={
  bg:"#f0f2f5",
  header:"#ffffff",
  primary:"#00a884",
  text:"#111",
  textMuted:"#667",
  input:"#ffffff"
};

const s={
  container:{height:"100vh",display:"flex",flexDirection:"column"},
  header:{paddingTop:10,borderBottom:"1px solid #222"},
  headerRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 15px"},
  logo:{fontSize:20,fontWeight:700,letterSpacing:1.2},
  headerIcons:{display:"flex",gap:18},
  tabs:{display:"flex"},
  tab:{flex:1,textAlign:"center",padding:12,fontWeight:700,fontSize:13,borderBottom:"3px solid",cursor:"pointer"},
  content:{flex:1,overflowY:"auto",position:"relative"},
  menu:{position:"absolute",right:0,top:30,borderRadius:6,boxShadow:"0 5px 15px rgba(0,0,0,0.4)"},
  menuItem:{padding:"10px 20px",cursor:"pointer"},
  fab:{position:"fixed",right:25,bottom:25,width:60,height:60,borderRadius:30,display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer",boxShadow:"0 0 12px #00ffd5",animation:"neonPulse 2s infinite"},
  loaderContainer:{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"},
  loader:{width:40,height:40,borderRadius:40,animation:"neonPulse 1.5s infinite"}
};