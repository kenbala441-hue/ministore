import React, { useEffect } from "react";

export default function MessagingSplash({ onComplete }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      <style>{`

        @keyframes cinematicIntro {
          0% {
            opacity: 0;
            transform: scale(1.12);
            filter: blur(25px);
          }

          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
          }
        }

        @keyframes floatingLogo {
          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes logoGlow {
          0% {
            box-shadow:
              0 0 10px rgba(0,229,255,0.1),
              0 0 30px rgba(124,58,237,0.1);
          }

          50% {
            box-shadow:
              0 0 40px rgba(0,229,255,0.45),
              0 0 90px rgba(124,58,237,0.35);
          }

          100% {
            box-shadow:
              0 0 10px rgba(0,229,255,0.1),
              0 0 30px rgba(124,58,237,0.1);
          }
        }

        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(18px);
            letter-spacing: 8px;
          }

          100% {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: 1px;
          }
        }

        @keyframes progressLoad {
          0% {
            width: 0%;
          }

          100% {
            width: 100%;
          }
        }

        @keyframes movingGlow {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(220%);
          }
        }

        @keyframes backgroundMove {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

      `}</style>

      <div style={s.container}>

        {/* BACKGROUND FX */}
        <div style={s.bgGlowOne} />
        <div style={s.bgGlowTwo} />

        {/* CENTER */}
        <div style={s.content}>

          {/* LOGO */}
          <div style={s.logoWrap}>

            <div style={s.logoBorder}>
              <div style={s.logoInner}>
                <span style={s.logoText}>C</span>
              </div>
            </div>

          </div>

          {/* BRAND */}
          <h1 style={s.brand}>
            Comic<span style={s.brandAccent}>Crafte</span>
          </h1>

          {/* SUB */}
          <div style={s.sub}>
            Messaging Experience
          </div>

          {/* TEXT */}
          <p style={s.text}>
            Préparation de votre espace de discussion immersif...
          </p>

        </div>

        {/* PROGRESS */}
        <div style={s.progressBox}>
          <div style={s.progress}>
            <div style={s.progressFx} />
          </div>
        </div>

      </div>
    </>
  );
}

const s = {

  container: {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100vh",

    overflow: "hidden",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    background:
      "linear-gradient(-45deg,#020202,#07111d,#090014,#020202)",

    backgroundSize: "400% 400%",
    animation: "backgroundMove 10s ease infinite",

    zIndex: 999999,

    fontFamily:
      "'Inter','Segoe UI',sans-serif"
  },

  bgGlowOne: {
    position: "absolute",
    top: "-120px",
    right: "-80px",

    width: "260px",
    height: "260px",

    borderRadius: "50%",

    background:
      "rgba(0,229,255,0.12)",

    filter: "blur(90px)"
  },

  bgGlowTwo: {
    position: "absolute",
    bottom: "-100px",
    left: "-70px",

    width: "240px",
    height: "240px",

    borderRadius: "50%",

    background:
      "rgba(124,58,237,0.16)",

    filter: "blur(90px)"
  },

  content: {
    position: "relative",
    zIndex: 2,

    textAlign: "center",

    padding: "0 24px",

    animation:
      "cinematicIntro 1.1s ease forwards"
  },

  logoWrap: {
    marginBottom: "28px",

    display: "flex",
    justifyContent: "center",

    animation:
      "floatingLogo 4s ease-in-out infinite"
  },

  logoBorder: {
    width: "108px",
    height: "108px",

    borderRadius: "34px",

    padding: "2px",

    background:
      "linear-gradient(135deg,#00e5ff,#7c3aed,#00e5ff)",

    animation:
      "logoGlow 3s ease-in-out infinite",
  },

  logoInner: {
    width: "100%",
    height: "100%",

    borderRadius: "32px",

    background:
      "rgba(5,5,10,0.95)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    backdropFilter: "blur(12px)"
  },

  logoText: {
    fontSize: "58px",
    fontWeight: "900",

    background:
      "linear-gradient(135deg,#00e5ff,#7c3aed)",

    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",

    textShadow:
      "0 0 25px rgba(0,229,255,0.35)"
  },

  brand: {
    margin: 0,

    fontSize: "30px",
    fontWeight: "900",

    color: "#fff",

    animation:
      "fadeSlide 1s ease 0.3s forwards",

    opacity: 0
  },

  brandAccent: {
    background:
      "linear-gradient(135deg,#00e5ff,#7c3aed)",

    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  sub: {
    marginTop: "10px",

    fontSize: "11px",
    fontWeight: "700",

    color: "rgba(255,255,255,0.5)",

    letterSpacing: "5px",
    textTransform: "uppercase",

    animation:
      "fadeSlide 1s ease 0.55s forwards",

    opacity: 0
  },

  text: {
    marginTop: "18px",

    color: "#b8bcc8",

    fontSize: "14px",
    lineHeight: 1.5,

    maxWidth: "290px",

    animation:
      "fadeSlide 1s ease 0.9s forwards",

    opacity: 0
  },

  progressBox: {
    position: "absolute",

    bottom: "42px",

    width: "240px",
    height: "4px",

    borderRadius: "999px",

    overflow: "hidden",

    background:
      "rgba(255,255,255,0.08)",

    backdropFilter: "blur(10px)"
  },

  progress: {
    position: "relative",

    height: "100%",
    width: "100%",

    borderRadius: "999px",

    overflow: "hidden",

    background:
      "linear-gradient(90deg,#00e5ff,#7c3aed)",

    animation:
      "progressLoad 3.2s linear forwards"
  },

  progressFx: {
    position: "absolute",
    top: 0,
    left: 0,

    width: "45%",
    height: "100%",

    background:
      "rgba(255,255,255,0.95)",

    filter: "blur(10px)",

    animation:
      "movingGlow 1.3s linear infinite"
  }
};