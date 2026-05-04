import React from "react";

/* ============================================================
   SAFE STRINGIFY (ANTI CRASH)
============================================================ */
function safeStringify(obj, indent = 2) {
  const cache = new Set();

  return JSON.stringify(obj, (key, value) => {
    if (value instanceof Window || value instanceof Node) return "[Ignored]";

    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) return "[Circular]";
      cache.add(value);
    }

    return value;
  }, indent);
}

/* ============================================================
   PARSE STACK TRACE
============================================================ */
function parseStack(stack = "") {
  const lines = stack.split("\n");

  return lines
    .map((line) => {
      const match = line.match(/(https?:\/\/[^)]+|\/[^)]+):(\d+):(\d+)/);
      if (!match) return null;

      return {
        file: match[1],
        line: match[2],
        column: match[3],
        raw: line.trim(),
      };
    })
    .filter(Boolean);
}

/* ============================================================
   TYPE ERREUR
============================================================ */
function detectErrorType(error) {
  if (!error) return "Unknown";

  if (error.name === "ReferenceError") return "Variable non définie";
  if (error.name === "TypeError") return "Erreur de type";
  if (error.name === "AbortError") return "Requête annulée";
  if (error.name === "SyntaxError") return "Erreur de syntaxe";

  return error.name || "Erreur inconnue";
}

/* ============================================================
   🔥 ANALYSE IA ULTRA AVANCÉE + LOCALISATION + FIREBASE + UI
============================================================ */
function analyzeError(error) {
  if (!error) return "Aucune analyse";

  const msg = error.message || "";
  const stack = error.stack || "";

  /* ============================================================
     🔍 1. EXTRACTION LOCALISATION (ULTRA ROBUSTE)
  ============================================================ */

  // Capture fichiers JS/TS/JSX/TSX + ligne + colonne
  const fullMatch = stack.match(/([a-zA-Z0-9_\-./]+?\.(js|jsx|ts|tsx|html)):(\d+):(\d+)/);

  // Fallback si colonne absente
  const fileOnlyMatch = stack.match(/([a-zA-Z0-9_\-./]+?\.(js|jsx|ts|tsx|html))/);

  let locationInfo = "";

  if (fullMatch) {
    locationInfo = `
📍 LOCALISATION PRÉCISE :
📁 Fichier : ${fullMatch[1]}
📟 Ligne : ${fullMatch[3]}
📌 Colonne : ${fullMatch[4]}
`;
  } else if (fileOnlyMatch) {
    locationInfo = `
📍 LOCALISATION PARTIELLE :
📁 Fichier : ${fileOnlyMatch[1]}
`;
  }

  /* ============================================================
     🧠 2. ANALYSE INTELLIGENTE (PAR PRIORITÉ)
  ============================================================ */

  let diagnostic = "";

  // ================= FIREBASE =================
  if (msg.includes("increment is not defined")) {
    diagnostic = `
🚨 BUG FIREBASE (CRITIQUE)
👉 'increment' n'est PAS importé.

✔️ Solution :
import { increment } from "firebase/firestore";
`;
  }

  else if (msg.includes("permission-denied")) {
    diagnostic = `
🚨 ERREUR FIREBASE SÉCURITÉ
👉 Firestore bloque l'accès.

✔️ Causes possibles :
- Rules Firebase incorrectes
- userId != auth.uid
- Mauvaise collection

✔️ Vérifie :
Firestore Rules
`;
  }

  else if (msg.includes("FirebaseError")) {
    diagnostic = `
🚨 ERREUR FIREBASE
👉 Problème avec transaction ou écriture.

✔️ Vérifie :
- runTransaction
- doc(db, "users", userId)
- existence du document
`;
  }

  else if (msg.includes("No document to update")) {
    diagnostic = `
🚨 FIRESTORE
👉 Document inexistant.

✔️ Solution :
- Vérifie userId
- Crée le document avant update
`;
  }

  // ================= REACT =================
  else if (msg.includes("Cannot read properties of undefined")) {
    diagnostic = `
🚨 ERREUR DATA (React)
👉 Tu accèdes à une donnée inexistante.

✔️ Exemple :
user.name → user est undefined

✔️ Solution :
user?.name
`;
  }

  else if (msg.includes("map is not a function")) {
    diagnostic = `
🚨 ERREUR LISTE
👉 .map() sur une valeur non tableau.

✔️ Solution :
Array.isArray(data) && data.map(...)
`;
  }

  else if (msg.includes("Objects are not valid as a React child")) {
    diagnostic = `
🚨 ERREUR JSX
👉 Tu affiches un objet directement.

❌ Mauvais :
<div>{user}</div>

✔️ Correct :
<div>{user.name}</div>
`;
  }

  // ================= IMPORT =================
  else if (msg.includes("is not defined")) {
    diagnostic = `
🚨 VARIABLE NON DÉFINIE
👉 Import ou variable manquante.

✔️ Vérifie :
- import
- nom exact
- typo
`;
  }

  // ================= NETWORK =================
  else if (msg.includes("AbortError")) {
    diagnostic = `
⚠️ REQUÊTE ANNULÉE
👉 Fetch ou Firestore interrompu.

✔️ Causes :
- Changement de page
- useEffect mal géré
- cleanup abort()
`;
  }

  // ================= IMAGE / UI =================
  else if (msg.includes("Failed to load resource")) {
    diagnostic = `
🖼️ ERREUR IMAGE
👉 Image non chargée.

✔️ Causes :
- URL invalide
- image supprimée
- CORS

✔️ Solution :
Ajouter fallback image
`;
  }

  // ================= CSS / LAYOUT =================
  else if (msg.includes("ResizeObserver loop")) {
    diagnostic = `
📐 BUG LAYOUT
👉 Boucle de resize (CSS instable)

✔️ Vérifie :
- width: 100%
- overflow hidden
- grid mal configuré
`;
  }

  // ================= DEFAULT =================
  else {
    diagnostic = `
⚠️ ERREUR NON IDENTIFIÉE
👉 Analyse manuelle requise.

Message :
${msg}
`;
  }

  /* ============================================================
     💎 3. RÉSULTAT FINAL
  ============================================================ */

  return `
${diagnostic}
${locationInfo}

🧠 CONSEIL IA :
- Vérifie la donnée AVANT affichage
- Log les valeurs (console.log)
- Isole le composant fautif
`;
}

/* ============================================================
   DEBUG ERROR BOUNDARY ULTRA
============================================================ */
class DebugErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,

      layoutBug: null,
      imageErrors: [],
      invisibleElements: [],
      oversizedElements: [],
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidMount() {
    this.checkLayout();
    this.checkImages();
    this.scanDOM();

    window.addEventListener("resize", this.checkLayout);

    this.observer = new MutationObserver(() => {
      this.checkLayout();
      this.checkImages();
      this.scanDOM();
    });

    if (this.wrapperRef.current) {
      this.observer.observe(this.wrapperRef.current, {
        childList: true,
        subtree: true,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkLayout);
    if (this.observer) this.observer.disconnect();
  }

  componentDidCatch(error, errorInfo) {
    console.group("🚨 DEBUG ERROR CAPTURE");
    console.log(error);
    console.log(errorInfo);
    console.groupEnd();

    this.setState({ errorInfo });
  }

  /* ============================================================
     DETECTION OVERFLOW
  ============================================================ */
  checkLayout = () => {
    if (!this.wrapperRef.current) return;

    const node = this.wrapperRef.current;
    const width = node.scrollWidth;
    const screenWidth = window.innerWidth;

    if (width > screenWidth + 2) {
      this.setState({
        layoutBug: `⚠️ OVERFLOW: ${width}px > écran ${screenWidth}px`,
      });
    } else {
      this.setState({ layoutBug: null });
    }
  };

  /* ============================================================
     DETECTION IMAGES CASSEES
  ============================================================ */
  checkImages = () => {
    if (!this.wrapperRef.current) return;

    const imgs = this.wrapperRef.current.querySelectorAll("img");

    const broken = [];

    imgs.forEach((img) => {
      if (!img.complete || img.naturalWidth === 0) {
        broken.push({
          src: img.src,
          width: img.offsetWidth,
          height: img.offsetHeight,
        });
      }
    });

    this.setState({ imageErrors: broken });
  };

  /* ============================================================
     SCAN DOM (OPTIMISÉ)
  ============================================================ */
  scanDOM = () => {
    if (!this.wrapperRef.current) return;
    const elements = this.wrapperRef.current.querySelectorAll("*");
    const invisible = [];
    const oversized = [];

    elements.forEach((el) => {
      // Éviter de scanner les éléments de debug eux-mêmes
      if (el.id?.includes("debug-") || el.tagName === "STYLE") return;

      const rect = el.getBoundingClientRect();
      
      // 1. Nettoyage
      el.classList.remove("is-oversized");

      // 2. Détection Oversize (Largeur)
      if (rect.width > window.innerWidth + 1) {
        el.classList.add("is-oversized"); 
        oversized.push({
          tag: el.tagName,
          width: Math.round(rect.width),
          id: el.id || el.className?.slice(0, 20)
        });
      }

      // 3. Détection Invisible (Éléments qui prennent de la place mais sont vides)
      if (rect.width === 0 && rect.height === 0 && el.children.length === 0) {
        invisible.push(el.tagName);
      }
    });

    // Mise à jour groupée pour éviter trop de re-renders
    this.setState({
      invisibleElements: [...new Set(invisible)].slice(0, 5),
      oversizedElements: oversized,
    });
  };

  /* ============================================================
     RENDER CRASH (SI LE JS EXPLOSE)
  ============================================================ */
  renderCrash() {
    const error = this.state.error;
    const stackParsed = parseStack(error?.stack || "");
    const type = detectErrorType(error);

    return (
      <div style={{
        padding: "20px",
        background: "#0b0b0b",
        color: "#fff",
        border: "3px solid #ff0000",
        borderRadius: "15px",
        fontFamily: "monospace",
        boxShadow: "0 0 20px rgba(255,0,0,0.5)",
        margin: "10px"
      }}>
        <h2 style={{ color: "#ff4d4d", marginTop: 0 }}>🚨 CRASH DÉTECTÉ : {this.props.name}</h2>
        
        <div style={{ background: "#1a1a1a", padding: "15px", borderRadius: "8px", borderLeft: "5px solid #ff0000" }}>
          <strong>Type:</strong> {type} <br/>
          <strong>Message:</strong> <span style={{ color: "#ff8080" }}>{error?.message}</span>
        </div>

        <div style={{ marginTop: "15px" }}>
          <strong>📍 Localisation :</strong>
          <div style={{ maxHeight: "100px", overflow: "auto", fontSize: "11px", color: "#00f7ff", marginTop: "5px" }}>
            {stackParsed.map((s, i) => (
              <div key={i} style={{ marginBottom: "2px" }}>📁 {s.file.split('/').pop()} : Ligne {s.line}</div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "15px", padding: "10px", background: "#222", borderRadius: "5px", border: "1px dashed #ffd700" }}>
          🧠 <strong>Analyse IA :</strong> {analyzeError(error)}
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "#ff0000",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          🔄 REDÉMARRER L'APP
        </button>
      </div>
    );
  }

  /* ============================================================
     RENDER FINAL : BADGE MINI + DRAGGABLE + SCANNER COMPLET
  ============================================================ */
  render() {
    if (this.state.hasError) return this.renderCrash();

    const { isOpen, layoutBug, imageErrors, oversizedElements, invisibleElements, position } = this.state;
    const hasIssue = layoutBug || imageErrors.length > 0 || oversizedElements.length > 0;

    // Gestion du déplacement fluide sur Mobile
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      this.setState({
        position: {
          x: window.innerWidth - touch.clientX - 17,
          y: window.innerHeight - touch.clientY - 17
        }
      });
    };

    return (
      <div ref={this.wrapperRef} style={{ position: "relative" }}>
        
        <style>
          {`
            .is-oversized { 
              outline: 2px solid magenta !important; 
              outline-offset: -2px !important;
            }

            .debug-badge-mini {
              position: fixed;
              bottom: ${position?.y || 80}px; 
              right: ${position?.x || 20}px;
              width: 35px;
              height: 35px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10001;
              touch-action: none;
              box-shadow: 0 4px 12px rgba(0,0,0,0.9);
              border: 1.5px solid ${hasIssue ? "#ff003c" : "#00f7ff"};
              background: ${hasIssue ? "rgba(255, 0, 60, 0.4)" : "rgba(10, 10, 10, 0.9)"};
              backdrop-filter: blur(6px);
              transition: border-color 0.3s, background 0.3s;
            }

            .debug-panel-float {
              position: fixed;
              bottom: ${(position?.y || 80) + 45}px;
              right: ${position?.x || 20}px;
              width: 230px;
              background: rgba(5, 5, 5, 0.98);
              border: 1px solid #333;
              border-radius: 12px;
              padding: 12px;
              z-index: 10000;
              font-family: 'monospace';
              box-shadow: 0 10px 30px rgba(0,0,0,0.8);
              backdrop-filter: blur(15px);
              border-left: 3px solid ${hasIssue ? "#ff003c" : "#00f7ff"};
            }
          `}
        </style>

        {/* LE BADGE : Mobile-First & Draggable */}
        <div 
          className="debug-badge-mini"
          onTouchMove={handleTouchMove}
          onClick={() => this.setState({ isOpen: !isOpen })}
        >
          <span style={{ fontSize: "15px" }}>{hasIssue ? "⚠️" : "🪲"}</span>
        </div>

        {/* LE PANNEAU : Informations détaillées */}
        {isOpen && (
          <div className="debug-panel-float">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid #222", paddingBottom: "4px" }}>
              <span style={{ color: "#ffd700", fontSize: "10px", fontWeight: "bold" }}>
                DEBUG : {this.props.name || "Global"}
              </span>
              <span onClick={() => this.setState({ isOpen: false })} style={{ color: "#ff003c", cursor: "pointer", fontWeight: "bold" }}>✕</span>
            </div>
            
            <div style={{ fontSize: "10px", lineHeight: "1.5" }}>
              <div style={{ color: layoutBug ? "#ff4d4d" : "#0f0" }}>
                 {layoutBug ? `❗ ${layoutBug}` : "✅ Layout : Stable"}
              </div>

              {imageErrors.length > 0 && (
                <div style={{ color: "#ff9800" }}>🖼 Images HS : {imageErrors.length}</div>
              )}

              {oversizedElements.length > 0 && (
                <div style={{ color: "magenta", fontWeight: "bold" }}>📏 Hors-limites : {oversizedElements.length}</div>
              )}

              {invisibleElements?.length > 0 && (
                <div style={{ color: "#aaa" }}>👻 Invisibles : {invisibleElements.length}</div>
              )}
              
              <button 
                onClick={() => { console.clear(); this.scanDOM(); }}
                style={{
                  marginTop: "10px", width: "100%", background: "#111", color: "#00f7ff",
                  border: "1px solid #00f7ff", borderRadius: "5px", padding: "5px", cursor: "pointer",
                  fontSize: "9px", fontWeight: "bold"
                }}
              >
                RE-SCANNER L'ÉCRAN
              </button>
            </div>
          </div>
        )}

        {this.props.children}
      </div>
    );
  }
}

export default DebugErrorBoundary;
