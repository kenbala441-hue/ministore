// src/screens/components/SettingsMenu.jsx

import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Type,
  Play,
  Palette,
  Layout,
  Check,
  X,
  ChevronRight,
  Zap,
  ArrowLeft,
  Volume2,
  Mic2,
  SkipBack,
  SkipForward,
  Pause,
  PlayCircle,
  User,
  Headphones,
  Moon,
  BookOpen,
  Smartphone,
} from "lucide-react";

/* =========================================================
   🎧 AUDIO PANEL
========================================================= */

const AudioPane = ({
  local,
  up,
  isPlaying,
  setIsPlaying,
}) => {
  return (
    <div className="audio-engine-v4">
      {/* VOICE */}
      <div className="voice-selector">
        {[
          {
            id: "male",
            label: "MASCULIN",
          },
          {
            id: "female",
            label: "FÉMININ",
          },
        ].map((voice) => (
          <button
            key={voice.id}
            type="button"
            className={
              local.voice === voice.id
                ? "voice-btn active"
                : "voice-btn"
            }
            onClick={() =>
              up("voice", voice.id)
            }
          >
            <User size={14} />
            {voice.label}
          </button>
        ))}
      </div>

      {/* PLAYER */}
      <div className="audio-player">
        <button
          type="button"
          className="nav-btn"
        >
          <SkipBack size={18} />
        </button>

        <button
          type="button"
          className="play-btn"
          onClick={() =>
            setIsPlaying((p) => !p)
          }
        >
          {isPlaying ? (
            <Pause
              size={22}
              fill="currentColor"
            />
          ) : (
            <PlayCircle
              size={22}
              fill="currentColor"
            />
          )}
        </button>

        <button
          type="button"
          className="nav-btn"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* SLIDERS */}
      <div className="slider-box">
        <div className="slider-top">
          <Volume2 size={13} />
          <span>
            Volume • {local.audioVolume}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={local.audioVolume}
          onChange={(e) =>
            up(
              "audioVolume",
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className="slider-box">
        <div className="slider-top">
          <Zap size={13} />
          <span>
            Lecture •{" "}
            {local.audioSpeed.toFixed(1)}x
          </span>
        </div>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={local.audioSpeed}
          onChange={(e) =>
            up(
              "audioSpeed",
              Number(e.target.value)
            )
          }
        />
      </div>

      {/* ARTICULATION */}
      <button
        type="button"
        className={`toggle-btn ${
          local.isArticulating
            ? "enabled"
            : ""
        }`}
        onClick={() =>
          up(
            "isArticulating",
            !local.isArticulating
          )
        }
      >
        <Mic2 size={14} />
        ARTICULATION IA
      </button>
    </div>
  );
};

/* =========================================================
   ⚡ MAIN COMPONENT
========================================================= */

export const SettingsMenu = ({
  isOpen,
  onClose,
  settings = {},
  actions = {},
}) => {
  const initialState = useMemo(
    () => ({
      theme: "dark",
      fontSize: 18,
      readerMode: "Webtoon",
      autoScroll: false,
      scrollSpeed: 1,
      voice: "male",
      audioVolume: 50,
      audioSpeed: 1,
      isArticulating: false,
      ...settings,
    }),
    [settings]
  );

  const [local, setLocal] =
    useState(initialState);

  const [view, setView] =
    useState("main");

  const [isPlaying, setIsPlaying] =
    useState(false);

  /* =========================================================
     🔄 UPDATE LOCAL IF SETTINGS CHANGE
  ========================================================= */

  useEffect(() => {
    setLocal(initialState);
  }, [initialState]);

  /* =========================================================
     ❌ CLOSE ESC
  ========================================================= */

  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      close
    );

    return () =>
      window.removeEventListener(
        "keydown",
        close
      );
  }, [onClose]);

  /* =========================================================
     🧠 SAFE UPDATE
  ========================================================= */

  const up = (key, value) => {
    setLocal((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =========================================================
     💾 SAVE SETTINGS
  ========================================================= */

  const save = () => {
    try {
      actions?.setTheme?.(local.theme);

      actions?.setFontSize?.(
        local.fontSize
      );

      actions?.setReaderMode?.(
        local.readerMode
      );

      actions?.setIsWebtoonMode?.(
        local.readerMode === "Webtoon"
      );

      actions?.setAutoScroll?.(
        local.autoScroll
      );

      actions?.setScrollSpeed?.(
        local.scrollSpeed
      );

      actions?.setAudioConfig?.({
        volume: local.audioVolume,
        speed: local.audioSpeed,
        voice: local.voice,
        articulation:
          local.isArticulating,
      });

      /* LOCAL STORAGE */
      localStorage.setItem(
        "comicrafte_reader_settings",
        JSON.stringify(local)
      );

      onClose?.();
    } catch (error) {
      console.error(
        "❌ Save Settings Error:",
        error
      );
    }
  };

  /* =========================================================
     ❌ HIDE
  ========================================================= */

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="cc-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <style>{`
        
          *{
            box-sizing:border-box;
          }

          .cc-overlay{
            position:fixed;
            inset:0;
            z-index:99999;
            background:rgba(0,0,0,0.78);
            backdrop-filter:blur(18px);
            display:flex;
            align-items:center;
            justify-content:center;
            padding:16px;
          }

          .cc-kernel{
            width:100%;
            max-width:360px;
            background:#090909;
            border-radius:30px;
            border:1px solid rgba(255,255,255,0.06);
            overflow:hidden;
            box-shadow:
              0 30px 80px rgba(0,0,0,0.8),
              0 0 0 1px rgba(255,255,255,0.03);
          }

          .cc-head{
            padding:18px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            border-bottom:1px solid rgba(255,255,255,0.05);
            background:linear-gradient(
              to bottom,
              rgba(255,255,255,0.03),
              transparent
            );
          }

          .cc-title{
            color:#00f7ff;
            font-size:11px;
            font-weight:900;
            letter-spacing:2px;
          }

          .cc-close{
            width:34px;
            height:34px;
            border:none;
            border-radius:12px;
            background:#121212;
            color:#666;
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
          }

          .cc-body{
            padding:15px;
            min-height:320px;
          }

          .cc-list{
            display:flex;
            flex-direction:column;
            gap:10px;
          }

          .cc-item{
            background:#111;
            border:1px solid rgba(255,255,255,0.05);
            border-radius:18px;
            padding:14px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            cursor:pointer;
            transition:0.18s;
          }

          .cc-item:active{
            transform:scale(0.98);
          }

          .cc-label{
            display:flex;
            align-items:center;
            gap:12px;
            color:#fff;
            font-size:13px;
            font-weight:700;
          }

          .cc-pane{
            display:flex;
            flex-direction:column;
            gap:16px;
            animation:slideIn .2s ease;
          }

          .cc-back{
            background:none;
            border:none;
            color:#888;
            display:flex;
            align-items:center;
            gap:6px;
            font-size:11px;
            font-weight:800;
            cursor:pointer;
          }

          .cc-grid{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
          }

          .cc-btn{
            min-height:52px;
            border:none;
            border-radius:16px;
            background:#121212;
            color:#aaa;
            font-size:12px;
            font-weight:800;
            border:1px solid rgba(255,255,255,0.05);
            cursor:pointer;
            transition:0.18s;
          }

          .cc-btn.active{
            background:linear-gradient(
              135deg,
              #00f7ff,
              #7b61ff
            );
            color:white;
            box-shadow:
              0 0 25px rgba(0,247,255,0.18);
          }

          .audio-engine-v4{
            display:flex;
            flex-direction:column;
            gap:14px;
          }

          .voice-selector{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
          }

          .voice-btn{
            height:48px;
            border:none;
            border-radius:16px;
            background:#121212;
            color:#777;
            border:1px solid rgba(255,255,255,0.05);
            display:flex;
            align-items:center;
            justify-content:center;
            gap:8px;
            font-size:11px;
            font-weight:800;
            cursor:pointer;
          }

          .voice-btn.active{
            background:#00f7ff10;
            color:#00f7ff;
            border-color:#00f7ff40;
          }

          .audio-player{
            display:flex;
            align-items:center;
            justify-content:center;
            gap:20px;
            background:#111;
            border-radius:22px;
            padding:14px;
          }

          .play-btn{
            width:56px;
            height:56px;
            border:none;
            border-radius:50%;
            background:linear-gradient(
              135deg,
              #00f7ff,
              #7b61ff
            );
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:
              0 0 25px rgba(0,247,255,0.25);
            cursor:pointer;
          }

          .nav-btn{
            border:none;
            background:none;
            color:#666;
            cursor:pointer;
          }

          .slider-box{
            background:#111;
            border-radius:16px;
            padding:12px;
          }

          .slider-top{
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:10px;
            color:#aaa;
            font-size:11px;
            font-weight:700;
          }

          .slider-box input{
            width:100%;
            accent-color:#00f7ff;
          }

          .toggle-btn{
            height:48px;
            border:none;
            border-radius:16px;
            background:#121212;
            color:#777;
            border:1px solid rgba(255,255,255,0.05);
            display:flex;
            align-items:center;
            justify-content:center;
            gap:8px;
            font-size:11px;
            font-weight:800;
            cursor:pointer;
          }

          .toggle-btn.enabled{
            color:#ff00ff;
            border-color:#ff00ff40;
            background:#ff00ff10;
          }

          .cc-save{
            width:calc(100% - 30px);
            margin:0 15px 15px;
            height:54px;
            border:none;
            border-radius:18px;
            background:linear-gradient(
              135deg,
              #00f7ff,
              #7b61ff
            );
            color:white;
            font-size:12px;
            font-weight:900;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:8px;
            cursor:pointer;
          }

          @keyframes slideIn{
            from{
              opacity:0;
              transform:translateX(10px);
            }
            to{
              opacity:1;
              transform:translateX(0);
            }
          }

        `}</style>

        <motion.div
          className="cc-kernel"
          initial={{
            scale: 0.92,
            opacity: 0,
            y: 20,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.92,
            opacity: 0,
            y: 20,
          }}
        >
          {/* HEADER */}
          <div className="cc-head">
            <div className="cc-title">
              COMICCRAFTE ENGINE
            </div>

            <button
              className="cc-close"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>

          {/* BODY */}
          <div className="cc-body">
            {view === "main" ? (
              <div className="cc-list">
                <div
                  className="cc-item"
                  onClick={() =>
                    setView("mode")
                  }
                >
                  <div className="cc-label">
                    <Layout
                      size={18}
                      color="#ff00ff"
                    />
                    Mode Lecture
                  </div>

                  <ChevronRight
                    size={15}
                    color="#444"
                  />
                </div>

                <div
                  className="cc-item"
                  onClick={() =>
                    setView("audio")
                  }
                >
                  <div className="cc-label">
                    <Headphones
                      size={18}
                      color="#00f7ff"
                    />
                    Audio IA
                  </div>

                  <ChevronRight
                    size={15}
                    color="#444"
                  />
                </div>

                <div
                  className="cc-item"
                  onClick={() =>
                    setView("scroll")
                  }
                >
                  <div className="cc-label">
                    <Smartphone
                      size={18}
                      color="#00ff88"
                    />
                    Auto Scroll
                  </div>

                  <ChevronRight
                    size={15}
                    color="#444"
                  />
                </div>

                <div
                  className="cc-item"
                  onClick={() =>
                    setView("text")
                  }
                >
                  <div className="cc-label">
                    <Type
                      size={18}
                      color="#ffaa00"
                    />
                    Taille Texte
                  </div>

                  <ChevronRight
                    size={15}
                    color="#444"
                  />
                </div>

                <div
                  className="cc-item"
                  onClick={() =>
                    setView("theme")
                  }
                >
                  <div className="cc-label">
                    <Moon
                      size={18}
                      color="#7b61ff"
                    />
                    Ambiance
                  </div>

                  <ChevronRight
                    size={15}
                    color="#444"
                  />
                </div>
              </div>
            ) : (
              <div className="cc-pane">
                <button
                  className="cc-back"
                  onClick={() =>
                    setView("main")
                  }
                >
                  <ArrowLeft size={14} />
                  RETOUR
                </button>

                {/* MODE */}
                {view === "mode" && (
                  <div className="cc-grid">
                    {[
                      "Livre",
                      "Webtoon",
                      "Manga",
                      "Novel",
                    ].map((m) => (
                      <button
                        key={m}
                        className={`cc-btn ${
                          local.readerMode ===
                          m
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          up(
                            "readerMode",
                            m
                          )
                        }
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}

                {/* AUDIO */}
                {view === "audio" && (
                  <AudioPane
                    local={local}
                    up={up}
                    isPlaying={isPlaying}
                    setIsPlaying={
                      setIsPlaying
                    }
                  />
                )}

                {/* SCROLL */}
                {view === "scroll" && (
                  <div className="cc-grid">
                    {[1, 2, 3, 5].map(
                      (speed) => (
                        <button
                          key={speed}
                          className={`cc-btn ${
                            local.scrollSpeed ===
                              speed &&
                            local.autoScroll
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {
                            up(
                              "scrollSpeed",
                              speed
                            );

                            up(
                              "autoScroll",
                              true
                            );
                          }}
                        >
                          x{speed}
                        </button>
                      )
                    )}

                    <button
                      className={`cc-btn ${
                        !local.autoScroll
                          ? "active"
                          : ""
                      }`}
                      style={{
                        gridColumn:
                          "span 2"}}
                      onClick={() =>
                        up(
                          "autoScroll",
                          false
                        )
                      }
                    >
                      Désactiver
                    </button>
                  </div>
                )}

                {/* TEXT */}
                {view === "text" && (
                  <div className="cc-grid">
                    <button
                      className="cc-btn"
                      onClick={() =>
                        up(
                          "fontSize",
                          Math.max(
                            12,
                            local.fontSize -
                              1
                          )
                        )
                      }
                    >
                      A -
                    </button>

                    <button className="cc-btn active">
                      {local.fontSize}px
                    </button>

                    <button
                      className="cc-btn"
                      onClick={() =>
                        up(
                          "fontSize",
                          Math.min(
                            40,
                            local.fontSize +
                              1
                          )
                        )
                      }
                    >
                      A +
                    </button>
                  </div>
                )}

                {/* THEME */}
                {view === "theme" && (
                  <div className="cc-grid">
                    {[
                      "dark",
                      "sepia",
                      "neon",
                      "amoled",
                    ].map((theme) => (
                      <button
                        key={theme}
                        className={`cc-btn ${
                          local.theme ===
                          theme
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          up(
                            "theme",
                            theme
                          )
                        }
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SAVE */}
          {view === "main" && (
            <button
              className="cc-save"
              onClick={save}
            >
              <Check size={16} />
              VALIDER LES RÉGLAGES
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};