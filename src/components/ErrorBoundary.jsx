import React from "react";

/* ============================================================
   SAFE STRINGIFY
============================================================ */
function safeStringify(obj, indent = 2) {
  const cache = new WeakSet();

  try {
    return JSON.stringify(
      obj,
      (key, value) => {
        if (
          value instanceof Window ||
          value instanceof Document ||
          value instanceof HTMLElement
        ) {
          return "[DOM_ELEMENT]";
        }

        if (typeof value === "function") {
          return `[Function ${value.name || "anonymous"}]`;
        }

        if (
          typeof value === "object" &&
          value !== null
        ) {
          if (cache.has(value)) {
            return "[Circular]";
          }

          cache.add(value);
        }

        return value;
      },
      indent
    );
  } catch (err) {
    return `Stringify Error: ${err.message}`;
  }
}

/* ============================================================
   DETECT SOURCE
============================================================ */
function detectSource(error) {
  const stack = error?.stack || "";
  const match = stack.match(/(\/src\/.*?\.js|\.jsx|\.ts|\.tsx)/);
  return match ? match[1] : "unknown-source";
}

/* ============================================================
   STACK PARSER PRO
============================================================ */
function parseStack(stack = "") {
  if (!stack) return [];

  return stack
    .split("\n")
    .map((line) => {
      const clean = line.trim();

      const match = clean.match(
        /(?:at\s.*\()?(https?:\/\/.*?|\/.*?|[A-Z]:\\.*?)(?::(\d+))?(?::(\d+))?\)?$/i
      );

      if (!match) return null;

      let file = match[1] || "unknown";

      try {
        file = file
          .replace(window.location.origin, "")
          .replace(/\?.*/, "");
      } catch {}

      const segments = file.split("/");

      return {
        raw: clean,
        fullPath: file,
        fileName:
          segments[segments.length - 1] ||
          "unknown",
        folder:
          segments.slice(0, -1).join("/") ||
          "/",
        line: match[2] || "?",
        column: match[3] || "?",
      };
    })
    .filter(Boolean);
}

/* ============================================================
   COMPONENT DETECTOR
============================================================ */
function extractReactComponent(stack = "", componentStack = "") {
  const reactMatch = componentStack.match(/\s+at\s([A-Z][A-Za-z0-9]+)/m);
  if (reactMatch) return reactMatch[1];

  const jsMatch = stack.match(/at\s([A-Z][A-Za-z0-9]+)/);
  if (jsMatch) return jsMatch[1];

  return "UnknownComponent";
}

/* ============================================================
   ERROR TYPE
============================================================ */
function detectErrorType(error) {
  if (!error) return "UnknownError";
  return error.name || error.constructor?.name || "UnknownError";
}

/* ============================================================
   ERROR SEVERITY
============================================================ */
function detectSeverity(error) {
  const msg = error?.message?.toLowerCase?.() || "";

  if (msg.includes("permission-denied") || msg.includes("firebase")) {
    return "critical";
  }
  if (msg.includes("undefined") || msg.includes("null")) {
    return "high";
  }
  if (msg.includes("aborterror")) {
    return "low";
  }
  return "medium";
}

/* ============================================================
   IGNORABLE ERRORS
============================================================ */
function isIgnorableError(error) {
  if (!error) return false;
  const msg = error.message?.toLowerCase?.() || "";

  return (
    error.name === "AbortError" ||
    msg.includes("the user aborted a request") ||
    msg.includes("signal is aborted") ||
    msg.includes("load failed") ||
    msg.includes("network request aborted")
  );
}

/* ============================================================
   FIREBASE ANALYSIS
============================================================ */
function analyzeFirebaseError(msg = "") {
  const lower = msg.toLowerCase();

  if (
    lower.includes("permission-denied") ||
    lower.includes("missing or insufficient permissions")
  ) {
    return `
🚨 FIREBASE ACCESS DENIED

CAUSES POSSIBLES:
• Utilisateur non connecté
• request.auth absent
• auth.uid incorrect
• Mauvais document ID
• Collection incorrecte
• Rules Firestore invalides
• Champ interdit dans rules

DIAGNOSTIC:
✔ Vérifie request.auth != null
✔ Vérifie auth.currentUser.uid
✔ Vérifie path Firestore
✔ Vérifie règles Firestore
✔ Vérifie nom collection
✔ Vérifie document exists

EXEMPLE:
match /users/{userId} {
  allow read, write:
  if request.auth.uid == userId;
}
`;
  }

  if (lower.includes("no document to update")) {
    return `
🚨 FIRESTORE DOCUMENT INTROUVABLE

CAUSE:
Le document n'existe pas.

CHECK:
✔ doc(db, "users", uid)
✔ createDoc before updateDoc
✔ uid valide
`;
  }

  if (lower.includes("increment is not defined")) {
    return `
🚨 IMPORT FIREBASE MANQUANT

FIX:
import { increment } from "firebase/firestore";
`;
  }

  if (lower.includes("quota")) {
    return `
🚨 FIREBASE QUOTA

CAUSE:
Limite Firebase atteinte.

CHECK:
✔ plan Firebase
✔ lectures excessives
✔ boucles Firestore
`;
  }

  return null;
}

/* ============================================================
   AI ANALYZER PRO
============================================================ */
function analyzeError(error) {
  if (!error) return "No analysis available.";
  const msg = error.message || "";

  const firebase = analyzeFirebaseError(msg);
  if (firebase) return firebase;

  if (error.name === "AbortError") {
    return `
⚠️ REQUEST ABORTED

CAUSE:
Requête interrompue volontairement.
CE N'EST PAS UN CRASH RÉEL.

ORIGINES POSSIBLES:
• changement de page
• useEffect cleanup()
• AbortController.abort()
• composant démonté
• navigation React Router

FIX:
✔ ignorer AbortError
✔ ne pas déclencher setState crash
✔ filtrer unhandledrejection
`;
  }

  if (msg.includes("Cannot read properties of undefined")) {
    return `
🚨 UNDEFINED ACCESS

BAD:  user.name
GOOD: user?.name

FIX:
✔ optional chaining
✔ valeur par défaut
✔ vérifier données avant render
`;
  }

  if (msg.includes("Cannot read properties of null")) {
    return `
🚨 NULL ACCESS

CAUSE: Objet null utilisé.

FIX:
✔ data?.field
✔ if (!data) return null
`;
  }

  if (msg.includes("Objects are not valid as a React child")) {
    return `
🚨 INVALID JSX OBJECT

BAD:  <div>{user}</div>
GOOD: <div>{user.name}</div>
`;
  }

  if (msg.includes("map is not a function")) {
    return `
🚨 ARRAY ERROR

CAUSE: .map() sur valeur non-array

FIX:
✔ Array.isArray(data)
✔ data || []
`;
  }

  if (msg.includes("trim")) {
    return `
🚨 TRIM ERROR

BAD:  form.name.trim()
GOOD: (form?.name || "").trim()
`;
  }

  if (msg.includes("is not defined")) {
    return `
🚨 VARIABLE NON DÉFINIE

CHECK:
✔ imports
✔ orthographe
✔ scope
`;
  }

  if (msg.includes("ResizeObserver loop")) {
    return `
🚨 RESIZE LOOP

CAUSE: Boucle layout infinie.

CHECK:
✔ flex unstable
✔ width 100%
✔ overflow hidden
`;
  }

  if (msg.includes("Failed to load resource")) {
    return `
🚨 RESOURCE FAILED

CAUSE:
• image supprimée
• URL invalide
• CORS
• serveur offline
`;
  }

  return `
🚨 UNKNOWN ERROR

MESSAGE:
${msg}
`;
}

/* ============================================================
   DEBUG ERROR BOUNDARY PRO MAX
============================================================ */
class DebugErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      capturedProps: null,
      layoutBug: null,
      imageErrors: [],
      oversizedElements: [],
      isOpen: false,
      position: { x: 20, y: 90 },
    };
  }

  static getDerivedStateFromError(error) {
    if (isIgnorableError(error)) return null;
    return { hasError: true, error };
  }

  componentDidMount() {
    this.checkLayout();
    window.addEventListener("resize", this.checkLayout);
    window.addEventListener("unhandledrejection", this.handlePromiseError);
    window.addEventListener("error", this.handleGlobalError);

    this.observer = new MutationObserver(() => {
      this.checkLayout();
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
    window.removeEventListener("unhandledrejection", this.handlePromiseError);
    window.removeEventListener("error", this.handleGlobalError);
    this.observer?.disconnect();
  }

  componentDidCatch(error, errorInfo) {
    if (isIgnorableError(error)) {
      console.warn("IGNORED ERROR:", error);
      return;
    }

    console.group("🚨 ERROR BOUNDARY");
    console.error(error);
    console.log("COMPONENT STACK:", errorInfo);
    console.log("PROPS:", this.props);
    console.groupEnd();

    this.setState({
      errorInfo,
      capturedProps: safeStringify(this.props),
    });
  }

  handleGlobalError = (event) => {
    const error = event.error || new Error(event.message);
    if (isIgnorableError(error)) {
      console.warn("IGNORED GLOBAL ERROR:", error);
      return;
    }
    console.error("GLOBAL ERROR:", error);
    this.setState({ hasError: true, error });
  };

  handlePromiseError = (event) => {
    const error = event.reason || new Error("Unhandled Promise");
    if (isIgnorableError(error)) {
      console.warn("IGNORED PROMISE ERROR:", error);
      event.preventDefault();
      return;
    }
    console.error("PROMISE ERROR:", error);
    this.setState({ hasError: true, error });
  };

  checkLayout = () => {
    if (!this.wrapperRef.current) return;
    const node = this.wrapperRef.current;
    const width = node.scrollWidth;
    const screen = window.innerWidth;

    if (width > screen + 2) {
      this.setState({ layoutBug: `${width}px > ${screen}px` });
    } else {
      this.setState({ layoutBug: null });
    }
  };

  scanDOM = () => {
    if (!this.wrapperRef.current) return;
    const oversized = [];
    const elements = this.wrapperRef.current.querySelectorAll("*");

    elements.forEach((el) => {
      if (el.id?.includes("debug")) return;
      const rect = el.getBoundingClientRect();
      el.classList.remove("debug-oversized");

      if (rect.width > window.innerWidth + 1) {
        el.classList.add("debug-oversized");
        oversized.push({
          tag: el.tagName,
          width: Math.round(rect.width),
          className: el.className,
        });
      }
    });

    this.setState({ oversizedElements: oversized });
  };

  renderCrash() {
    const error = this.state.error;
    const stackParsed = parseStack(error?.stack || "");
    const component = extractReactComponent(error?.stack || "", this.state.errorInfo?.componentStack || "");
    const severity = detectSeverity(error);
    const sourceFile = detectSource(error);

    const severityColor = {
      low: "#ffd700",
      medium: "#ff9800",
      high: "#ff4d4d",
      critical: "#ff003c",
    };

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          padding: "20px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              background: "#0b0b0b",
              border: `2px solid ${severityColor[severity]}`,
              borderRadius: "18px",
              padding: "25px",
              boxShadow: "0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            <h1 style={{ color: severityColor[severity], marginTop: 0 }}>
              🚨 APPLICATION CRASHED
            </h1>

            <div style={{ display: "grid", gap: "15px" }}>
              
              {/* 🔥 ERROR INFO CARD */}
              <div
                style={{
                  background: "#111",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <div>
                  <strong>TYPE:</strong> {error?.name}
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    color: "#ff8080",
                    wordBreak: "break-word",
                  }}
                >
                  {error?.message}

                  {/* 🔥 SOURCE FILE */}
                  <div
                    style={{
                      marginTop: "12px",
                      color: "#39ff14",
                      fontSize: "12px",
                    }}
                  >
                    📁 SOURCE FILE:{" "}
                    {sourceFile === "unknown-source" ? "Non détecté" : sourceFile}
                  </div>
                </div>

                <div style={{ marginTop: "10px", color: "#00f7ff" }}>
                  🧩 COMPONENT: {component}
                </div>
              </div>

              {/* 🔥 SOURCE TRACE CARD */}
              <div
                style={{
                  background: "#111",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: "#ffd700",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  📍 SOURCE TRACE
                </div>

                <div style={{ maxHeight: "350px", overflow: "auto" }}>
                  {stackParsed.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#0d0d0d",
                        padding: "12px",
                        marginBottom: "12px",
                        borderRadius: "10px",
                        borderLeft: "3px solid #00f7ff",
                      }}
                    >
                      <div style={{ color: "#00f7ff", fontWeight: "bold" }}>
                        📄 {s.fileName}
                      </div>

                      <div style={{ color: "#777", marginTop: "6px", fontSize: "11px" }}>
                        📁 {s.folder}
                      </div>

                      <div style={{ color: "#ffd700", marginTop: "8px" }}>
                        Ligne {s.line} • Colonne {s.column}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🔥 AI ANALYSIS */}
              <div
                style={{
                  background: "#111",
                  padding: "16px",
                  borderRadius: "12px",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                }}
              >
                <div style={{ color: "#00f7ff", marginBottom: "10px", fontWeight: "bold" }}>
                  🧠 AI ANALYSIS
                </div>
                {analyzeError(error)}
              </div>

              {/* 🔥 CAPTURED PROPS */}
              <details>
                <summary style={{ cursor: "pointer", color: "#00f7ff" }}>
                  📦 CAPTURED PROPS
                </summary>
                <pre
                  style={{
                    background: "#111",
                    padding: "15px",
                    borderRadius: "10px",
                    overflow: "auto",
                    maxHeight: "300px",
                    marginTop: "10px",
                    fontSize: "11px",
                  }}
                >
                  {this.state.capturedProps}
                </pre>
              </details>

              {/* 🔥 RAW STACK */}
              <details>
                <summary style={{ cursor: "pointer", color: "#ffd700" }}>
                  🪵 RAW STACK
                </summary>
                <pre
                  style={{
                    background: "#111",
                    padding: "15px",
                    borderRadius: "10px",
                    overflow: "auto",
                    maxHeight: "400px",
                    marginTop: "10px",
                    fontSize: "10px",
                  }}
                >
                  {error?.stack}
                </pre>
              </details>

              <button
                onClick={() => window.location.reload()}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "linear-gradient(90deg,#ff003c,#ff4d4d)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                🔄 RELOAD APPLICATION
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     MAIN RENDER
  ============================================================ */
  render() {
    if (this.state.hasError) {
      return this.renderCrash();
    }

    const {
      isOpen,
      layoutBug,
      oversizedElements,
      position,
    } = this.state;

    const hasIssue = layoutBug || oversizedElements.length > 0;

    return (
      <div ref={this.wrapperRef} style={{ position: "relative" }}>
        <style>
          {`
            .debug-oversized {
              outline: 2px solid magenta !important;
            }

            .debug-float-btn {
              position: fixed;
              bottom: ${position.y}px;
              right: ${position.x}px;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: rgba(5,5,5,0.95);
              border: 2px solid ${hasIssue ? "#ff003c" : "#00f7ff"};
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 999999;
              backdrop-filter: blur(10px);
              box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            }

            .debug-panel {
              position: fixed;
              bottom: ${position.y + 55}px;
              right: ${position.x}px;
              width: 280px;
              background: rgba(10,10,10,0.98);
              border: 1px solid #222;
              border-radius: 16px;
              padding: 15px;
              z-index: 999999;
              font-family: monospace;
              backdrop-filter: blur(16px);
            }
          `}
        </style>

        <div
          className="debug-float-btn"
          onClick={() => this.setState({ isOpen: !isOpen })}
        >
          <span>{hasIssue ? "⚠️" : "🪲"}</span>
        </div>

        {isOpen && (
          <div className="debug-panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <strong style={{ color: "#00f7ff" }}>DEBUG ENGINE</strong>
              <span
                style={{ cursor: "pointer", color: "#ff003c" }}
                onClick={() => this.setState({ isOpen: false })}
              >
                ✕
              </span>
            </div>

            <div style={{ fontSize: "11px", lineHeight: "1.8" }}>
              <div style={{ color: layoutBug ? "#ff4d4d" : "#0f0" }}>
                {layoutBug ? `⚠️ OVERFLOW ${layoutBug}` : "✅ Layout Stable"}
              </div>

              <div style={{ color: oversizedElements.length > 0 ? "magenta" : "#0f0" }}>
                📏 Oversized: {oversizedElements.length}
              </div>

              <button
                onClick={() => this.scanDOM()}
                style={{
                  marginTop: "12px",
                  width: "100%",
                  padding: "8px",
                  background: "#111",
                  color: "#00f7ff",
                  border: "1px solid #00f7ff",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                RE-SCAN DOM
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
