import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AuthForm({
  title,
  subtitle,
  onSubmit,
  buttonText,
  onGoogleClick,
  toggleText,
  toggleAction,
  onBetaAccess
}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err?.message || "Erreur de connexion");
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >

        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.primaryBtn}
          >
            {loading ? "Connexion..." : buttonText}
          </button>

        </form>

        {toggleText && (
          <p style={styles.toggle}>
            {toggleText}
            <span
              onClick={toggleAction}
              style={styles.toggleLink}
            >
              CLIQUE ICI
            </span>
          </p>
        )}

        <div style={styles.divider} />

        {onGoogleClick && (
          <button
            onClick={onGoogleClick}
            style={styles.googleBtn}
          >
            Continuer avec Google
          </button>
        )}

        {onBetaAccess && (
          <button
            onClick={onBetaAccess}
            style={styles.betaBtn}
          >
            ⚡ ACCÈS BÊTA
          </button>
        )}

      </motion.div>
    </div>
  );
}


const styles = {

  wrapper:{
    width:"100%",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  card:{
    width:360,
    padding:"30px 25px",
    borderRadius:20,
    background:"rgba(15,23,42,0.9)",
    border:"1px solid #1e293b",
    backdropFilter:"blur(8px)",
    boxShadow:"0 20px 50px rgba(0,0,0,0.5)",
    textAlign:"center"
  },

  title:{
    color:"#fff",
    fontSize:26,
    fontWeight:"bold",
    marginBottom:5
  },

  subtitle:{
    color:"#94a3b8",
    fontSize:14,
    marginBottom:25
  },

  form:{
    display:"flex",
    flexDirection:"column",
    gap:12
  },

  input:{
    padding:14,
    borderRadius:10,
    border:"1px solid #334155",
    background:"#020617",
    color:"#fff",
    outline:"none",
    fontSize:14
  },

  primaryBtn:{
    marginTop:5,
    padding:14,
    borderRadius:10,
    border:"none",
    cursor:"pointer",
    fontWeight:"bold",
    color:"#fff",
    background:"linear-gradient(90deg,#6366f1,#a855f7)"
  },

  toggle:{
    marginTop:18,
    fontSize:13,
    color:"#94a3b8"
  },

  toggleLink:{
    marginLeft:6,
    color:"#00f7ff",
    cursor:"pointer",
    fontWeight:"bold"
  },

  divider:{
    height:1,
    background:"#1e293b",
    margin:"25px 0"
  },

  googleBtn:{
    width:"100%",
    padding:12,
    borderRadius:10,
    border:"1px solid #334155",
    background:"rgba(255,255,255,0.05)",
    color:"#fff",
    cursor:"pointer"
  },

  betaBtn:{
    marginTop:15,
    width:"100%",
    padding:12,
    borderRadius:10,
    border:"none",
    background:"#00f7ff",
    color:"#020617",
    fontWeight:"bold",
    cursor:"pointer"
  },

  error:{
    color:"#f87171",
    fontSize:14,
    marginBottom:10
  }

};