import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function UserList({ setView }) {
  const [users,setUsers] = useState([]);

  useEffect(()=>{
    const fetchUsers = async()=>{
      const snap = await getDocs(collection(db,"users"));
      setUsers(snap.docs.map(d=>({id:d.id,...d.data()})));
    };
    fetchUsers();
  },[]);

  return (
    <div style={{minHeight:"100vh",backgroundColor:"#050508",color:"#fff",padding:"20px"}}>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(u=><li key={u.id}>{u.pseudo} - {u.role}</li>)}
      </ul>
      <button onClick={()=>setView("home")}>← Retour accueil</button>
    </div>
  );
}