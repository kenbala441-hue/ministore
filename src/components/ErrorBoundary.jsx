import React from "react";

// SAFE STRINGIFY (anti crash debug)
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

// 🔥 EXTRACTION ULTRA PRÉCISE (fichier + ligne + colonne)
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

// 🔥 DÉTECTION SIMPLE DU TYPE D'ERREUR
function detectErrorType(error) {
  if (!error) return "Unknown";

  if (error.name === "ReferenceError") return "Variable non définie";
  if (error.name === "TypeError") return "Erreur de type";
  if (error.name === "AbortError") return "Requête annulée";
  if (error.name === "SyntaxError") return "Erreur de syntaxe";

  return error.name || "Erreur inconnue";
}

class DebugErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.group("🚨 DEBUG ERROR CAPTURE");
    console.log("Message:", error.message);
    console.log("Type:", error.name);
    console.log("Stack:", error.stack);
    console.log("Component Stack:", errorInfo.componentStack);
    console.groupEnd();

    this.setState({ errorInfo });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const error = this.state.error;
    const stackParsed = parseStack(error?.stack || "");
    const type = detectErrorType(error);

    return (
      <div style={{
        padding: "20px",
        backgroundColor: "#0b0b0b",
        color: "#fff",
        border: "2px solid red",
        borderRadius: "12px",
        fontFamily: "monospace",
        fontSize: "13px",
        overflowX: "auto"
      }}>
        <h2 style={{ color: "#ff4d4d" }}>🚨 ERREUR DÉTECTÉE</h2>

        {/* TYPE D'ERREUR */}
        <div style={{ marginTop: "10px" }}>
          <strong>Type :</strong> {type}
        </div>

        {/* MESSAGE */}
        <div style={{ marginTop: "10px" }}>
          <strong>Message :</strong>
          <pre style={{ color: "#ff8080" }}>
            {error?.message}
          </pre>
        </div>

        {/* FICHIER + LIGNE ULTRA PRÉCIS */}
        <div style={{ marginTop: "15px" }}>
          <strong>📍 Localisation précise :</strong>

          {stackParsed.length > 0 ? (
            stackParsed.slice(0, 5).map((item, i) => (
              <div key={i} style={{
                backgroundColor: "#111",
                padding: "8px",
                marginTop: "6px",
                borderRadius: "6px",
                color: "#00f7ff"
              }}>
                <div>📁 {item.file}</div>
                <div>📌 Ligne: {item.line} | Col: {item.column}</div>
              </div>
            ))
          ) : (
            <div>Aucune localisation détectée</div>
          )}
        </div>

        {/* STACK COMPLET */}
        <div style={{ marginTop: "15px" }}>
          <strong>📦 Stack complet :</strong>
          <pre style={{
            backgroundColor: "#000",
            padding: "10px",
            borderRadius: "8px",
            color: "#aaa",
            maxHeight: "200px",
            overflow: "auto"
          }}>
            {error?.stack || "Aucun stack"}
          </pre>
        </div>

        {/* COMPONENT STACK REACT */}
        <div style={{ marginTop: "15px" }}>
          <strong>🧩 React Component Stack :</strong>
          <pre style={{
            backgroundColor: "#000",
            padding: "10px",
            borderRadius: "8px",
            color: "#7CFF7C"
          }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>

        {/* PROPS SAFE */}
        <div style={{ marginTop: "15px" }}>
          <strong>📦 Props :</strong>
          <pre style={{
            backgroundColor: "#000",
            padding: "10px",
            borderRadius: "8px",
            color: "#ffd700"
          }}>
            {safeStringify(this.props)}
          </pre>
        </div>

        {/* BOUTON RELOAD */}
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "20px",
            padding: "10px 15px",
            backgroundColor: "#ff0000",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          🔄 Reload App
        </button>

        {/* BOUTON DEBUG AVANCÉ */}
        <button
          onClick={() => {
            console.log("FULL ERROR OBJECT:", error);
            console.log("STACK PARSED:", stackParsed);
            debugger;
          }}
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            backgroundColor: "#0077ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          🧠 Debug avancé
        </button>
      </div>
    );
  }
}

export default DebugErrorBoundary;