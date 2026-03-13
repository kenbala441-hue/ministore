import React from "react";

// Fonction pour sérialiser les props sans planter sur les objets circulaires ou cross-origin
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

class DebugErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.group("🚨 ANALYSE DE L'ERREUR");
    console.error("Message:", error.message);
    console.error("Localisation (Stack):", errorInfo.componentStack);
    console.groupEnd();

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "20px",
          backgroundColor: "#1a0000",
          color: "#ff4d4d",
          border: "2px solid #ff0000",
          borderRadius: "12px",
          margin: "20px",
          fontFamily: "monospace",
          fontSize: "13px",
          overflowX: "auto",
          whiteSpace: "pre-wrap"
        }}>
          <h2 style={{ color: "#fff" }}>⚠️ Une erreur est survenue</h2>

          <div style={{ marginTop: "10px" }}>
            <strong>Message :</strong>
            <pre style={{ color: "#ff8080" }}>
              {this.state.error?.message || this.state.error?.toString()}
            </pre>
          </div>

          <div style={{ marginTop: "15px" }}>
            <strong>📍 Stack / Localisation :</strong>
            <pre style={{
              backgroundColor: "#000",
              padding: "15px",
              borderRadius: "8px",
              color: "#00f7ff",
              marginTop: "10px"
            }}>
              {this.state.errorInfo?.componentStack || this.state.error?.stack || "Stack non disponible"}
            </pre>
          </div>

          <div style={{ marginTop: "15px" }}>
            <strong>Props :</strong>
            <pre style={{
              backgroundColor: "#000",
              padding: "15px",
              borderRadius: "8px",
              color: "#00ff7f",
              marginTop: "10px"
            }}>
              {safeStringify(this.props)}
            </pre>
          </div>

          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Réessayer (Reload)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DebugErrorBoundary;