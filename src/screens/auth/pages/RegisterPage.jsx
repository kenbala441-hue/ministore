import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "../authService";
import { useUserContext } from "../screens/users/userContext";
import "./register.css";

export default function RegisterPage() {

  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const [form,setForm] = useState({
    name:"",
    username:"",
    birthday:"",
    bio:"",
    email:"",
    password:""
  });

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleRegister = async ()=>{

    setError("");
    setLoading(true);

    try{

      const user = await registerWithEmail(form.email,form.password);

      setUser(user);

      navigate("/terms");

    }catch(err){

      setError(err?.message || "Impossible de créer le compte.");

    }

    setLoading(false);
  };

  const handleGoogle = async ()=>{

    setError("");
    setLoading(true);

    try{

      const user = await loginWithGoogle();

      setUser(user);

      navigate("/terms");

    }catch(err){

      setError(err?.message || "Erreur Google.");

    }

    setLoading(false);
  };

  return (

    <div className="register-container">

      <div className="neon-background"></div>

      <div className="register-card">

        <h1 className="title">Créer un compte</h1>
        <p className="subtitle">Rejoignez l'univers ComicCraft</p>

        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="username"
          placeholder="Pseudo"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Votre bio..."
          value={form.bio}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={handleRegister}>
          {loading ? "Création..." : "Créer un compte"}
        </button>

        <button className="google-btn" onClick={handleGoogle}>
          Continuer avec Google
        </button>

        <p className="login-link">
          Déjà un compte ?
          <span onClick={()=>navigate("/login")}> Se connecter</span>
        </p>

        {error && <p className="error">{error}</p>}

      </div>

    </div>

  );
}