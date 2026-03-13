import React, { useState } from "react";
import { useUserContext } from "./userContext";
import NeonButton from "../../components/NeonButton";

export default function AccessCode({ setView }) {
  const [code, setCode] = useState("");
  const { user } = useUserContext();
  const [error, setError] = useState("");

  const VALID_CODE = "AUTHOR2026"; // code d’accès pour créer histoire

  const handleSubmit = () => {
    if (code === VALID_CODE) {
      setView("addStory"); // autorisé
    } else {
      setError("🚫 Code invalide !");
    }
  };

  if (!user) return <p>Connectez-vous d'abord</p>;

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#050508",color:"#fff"}}>
      <h2>Entrer le code d'accès pour créer une histoire</h2>
      <input value={code} onChange={e=>setCode(e.target.value)} style={{padding:"10px",borderRadius:"8px",border:"1px solid #00fff2",background:"#111",color:"#fff",margin:"10px 0"}}/>
      {error && <p style={{color:"#ff003c"}}>{error}</p>}
      <NeonButton color="#00f5ff" label="Valider" onClick={handleSubmit}/>
    </div>
  );
}