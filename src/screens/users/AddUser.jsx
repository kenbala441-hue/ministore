import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import NeonButton from "../../components/NeonButton";

export default function AddUser({ setView }) {
  const [pseudo,setPseudo] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("user");

  const handleAdd = async () => {
    if(!pseudo||!password) return;
    await addDoc(collection(db,"users"),{
      pseudo,password,role,
      createdAt: serverTimestamp(),
      followers:0,following:0,nbStories:0
    });
    setView("userList");
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#050508",color:"#fff"}}>
      <h2>Ajouter un utilisateur</h2>
      <input placeholder="Pseudo" value={pseudo} onChange={e=>setPseudo(e.target.value)} style={inputStyle}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle}/>
      <select value={role} onChange={e=>setRole(e.target.value)} style={inputStyle}>
        <option value="user">Utilisateur</option>
        <option value="author">Auteur</option>
        <option value="admin">Admin</option>
      </select>
      <NeonButton color="#00f5ff" label="Créer" onClick={handleAdd}/>
    </div>
  );
}

const inputStyle = {margin:"8px 0",padding:"10px",borderRadius:"8px",border:"1px solid #00fff2",background:"#111",color:"#fff",width:"200px"}