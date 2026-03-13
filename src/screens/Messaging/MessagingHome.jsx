import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Users,
  Search,
  Camera,
  MoreVertical,
  Sun,
  Moon,
  LogOut,
  Settings,
  Circle,
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
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";


import { auth, db } from "../../firebase/index.js";

import { onAuthStateChanged, signOut } from "firebase/auth";

export default function MessagingHome() {

  const [currentUser,setCurrentUser] = useState(null);
  const [activeTab,setActiveTab] = useState("chat");
  const [showMenu,setShowMenu] = useState(false);
  const [darkMode,setDarkMode] = useState(true);
  const [loading,setLoading] = useState(true);
  const [searchMode,setSearchMode] = useState(false);

  const [messageText,setMessageText] = useState("");
  const [targetUser,setTargetUser] = useState(null);

  const theme = darkMode ? neonTheme : lightTheme;

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

  const toggleTheme = ()=>{

    setDarkMode(!darkMode);

  };

  const logout = async ()=>{

    await signOut(auth);

  };

  const sendMessage = async ()=>{

    if(!currentUser) return;

    if(!targetUser) return;

    if(messageText.trim()==="") return;

    await addDoc(collection(db,"messages"),{

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

  <style>

{`

@keyframes neonPulse {

0%{box-shadow:0 0 4px ${theme.primary}}

50%{box-shadow:0 0 18px ${theme.primary}}

100%{box-shadow:0 0 4px ${theme.primary}}

}

@keyframes fadeSlide {

from{opacity:0;transform:translateY(10px)}

to{opacity:1;transform:translateY(0)}

}

`}

  </style>

  <header style={{...s.header,background:theme.header}}>

  <div style={s.headerRow}>

  <h1 style={{...s.logo,color:theme.primary}}>
  ComicMessaging
  </h1>

  <div style={s.headerIcons}>

  <Camera size={20} color={theme.text}/>

  <Search
  size={20}
  color={theme.text}
  onClick={()=>setSearchMode(true)}
  />

  <div style={{position:"relative"}}>

  <MoreVertical
  size={22}
  color={theme.text}
  onClick={()=>setShowMenu(!showMenu)}
  />

  {showMenu && (

  <div style={{...s.menu,background:theme.header}}>

  <div
  style={s.menuItem}
  onClick={()=>setActiveTab("status")}
  >

  Statut

  </div>

  <div
  style={s.menuItem}
  onClick={()=>setActiveTab("settings")}
  >

  Paramètres

  </div>

  <div
  style={s.menuItem}
  onClick={toggleTheme}
  >

  {darkMode ? "Mode clair" : "Mode sombre"}

  </div>

  <div
  style={s.menuItem}
  onClick={logout}
  >

  Déconnexion

  </div>

  </div>

  )}

  </div>

  </div>

  </div>

  <div style={s.tabs}>

  <div
  style={{
  ...s.tab,
  borderBottomColor:activeTab==="chat"?theme.primary:"transparent",
  color:activeTab==="chat"?theme.primary:theme.textMuted
  }}
  onClick={()=>setActiveTab("chat")}
  >

  DISCUSSIONS

  </div>

  <div
  style={{
  ...s.tab,
  borderBottomColor:activeTab==="contacts"?theme.primary:"transparent",
  color:activeTab==="contacts"?theme.primary:theme.textMuted
  }}
  onClick={()=>setActiveTab("contacts")}
  >

  CONTACTS

  </div>

  <div
  style={{
  ...s.tab,
  borderBottomColor:activeTab==="status"?theme.primary:"transparent",
  color:activeTab==="status"?theme.primary:theme.textMuted
  }}
  onClick={()=>setActiveTab("status")}
  >

  STATUT

  </div>

  </div>

  </header>

  <main style={s.content}>

  <div style={{animation:"fadeSlide 0.3s"}}>

  {activeTab==="chat" && (

  <ConversationList
  currentUser={currentUser}
  setTargetUser={setTargetUser}
  />

  )}

  {activeTab==="contacts" && (

  <Contacts
  currentUser={currentUser}
  setTargetUser={setTargetUser}
  />

  )}

  {activeTab==="status" && (

  <div style={{padding:20,color:theme.text}}>

  Fonction statut en développement

  </div>

  )}

  {activeTab==="settings" && (

  <SettingsPage
  user={currentUser}
  />

  )}

  {searchMode && (

  <SearchPage
  close={()=>setSearchMode(false)}
  />

  )}

  </div>

  </main>

  {targetUser && (

  <div style={{...s.messageBar,background:theme.header}}>

  <input
  value={messageText}
  onChange={(e)=>setMessageText(e.target.value)}
  placeholder="Écrire un message..."
  style={{
  ...s.input,
  background:theme.input,
  color:theme.text
  }}
  />

  <button
  onClick={sendMessage}
  style={{
  ...s.sendBtn,
  background:theme.primary
  }}
  >

  <Send size={18} color="#000"/>

  </button>

  </div>

  )}

  <div
  style={{
  ...s.fab,
  background:theme.primary,
  animation:darkMode?"neonPulse 2s infinite":"none"
  }}
  onClick={()=>setActiveTab("contacts")}
  >

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

container:{
height:"100vh",
display:"flex",
flexDirection:"column"
},

header:{
paddingTop:10,
borderBottom:"1px solid #222"
},

headerRow:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"10px 15px"
},

logo:{
fontSize:20,
fontWeight:700
},

headerIcons:{
display:"flex",
gap:18
},

tabs:{
display:"flex"
},

tab:{
flex:1,
textAlign:"center",
padding:12,
fontWeight:700,
fontSize:13,
borderBottom:"3px solid",
cursor:"pointer"
},

content:{
flex:1,
overflowY:"auto"
},

menu:{
position:"absolute",
right:0,
top:30,
borderRadius:6,
boxShadow:"0 5px 15px rgba(0,0,0,0.4)"
},

menuItem:{
padding:"10px 20px",
cursor:"pointer"
},

fab:{
position:"fixed",
right:25,
bottom:25,
width:60,
height:60,
borderRadius:30,
display:"flex",
justifyContent:"center",
alignItems:"center",
cursor:"pointer",
boxShadow:"0 4px 15px rgba(0,0,0,0.4)"
},

messageBar:{
display:"flex",
padding:10,
gap:10
},

input:{
flex:1,
padding:10,
borderRadius:20,
border:"none",
outline:"none"
},

sendBtn:{
width:45,
height:45,
borderRadius:25,
border:"none",
display:"flex",
alignItems:"center",
justifyContent:"center",
cursor:"pointer"
},

loaderContainer:{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center"
},

loader:{
width:40,
height:40,
borderRadius:40,
animation:"neonPulse 1.5s infinite"
}

};