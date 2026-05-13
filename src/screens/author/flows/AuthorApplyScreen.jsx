import React, { useState, useMemo } from "react";
import { db } from "../../../firebase/index"; 
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft,
  User,
  PenSquare,
  ShieldCheck,
  Target,
  BookOpen,
  Sparkles
} from "lucide-react";

const STEPS = [
  "Identité",
  "Auteur",
  "Objectifs",
  "Validation"
];

export default function AuthorApply({
  setView,
  onSubmit
}) {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    penName: "",
    birthDate: "",
    country: "",
    email: "",

    level: "",
    experience: "",
    alreadyWritten: "",
    genres: [],
    bio: "",

    motivation: "",
    objective: "",
    projectType: [],
    communityGoal: "",

    originality: false,
    acceptRules: false
  });

  const genresList = [
    "Fantasy",
    "Action",
    "Romance",
    "Drama",
    "Sci-Fi",
    "Horreur",
    "Mystère",
    "Cyberpunk",
    "Webtoon",
    "Manga",
    "Mythologie",
    "Historique"
  ];

  const projectOptions = [
    "Gagner de l'argent",
    "Développer ma communauté",
    "Publier un manga",
    "Créer un webtoon",
    "Trouver des lecteurs",
    "Être reconnu",
    "Créer une équipe",
    "Adapter en anime"
  ];

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArray = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value]
    }));
  };

  // VALIDATION STEP
  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return (
          form.firstName &&
          form.penName &&
          form.birthDate &&
          form.country &&
          form.email
        );

      case 1:
        return (
          form.level &&
          form.experience &&
          form.alreadyWritten &&
          form.genres.length > 0
        );

      case 2:
        return (
          form.motivation &&
          form.objective &&
          form.projectType.length > 0
        );

      case 3:
        return (
          form.originality &&
          form.acceptRules
        );

      default:
        return false;
    }
  }, [step, form]);

  const next = () => {
    if (!canNext) return;
    setStep((p) => Math.min(p + 1, STEPS.length - 1));
  };

  const prev = () => {
    setStep((p) => Math.max(p - 1, 0));
  };

  const submit = async () => {
  if (!canNext) return;

  try {
    // 🔥 DATA CLEAN + SAFE
    const payload = {
      // IDENTITÉ
      firstName: form.firstName || "",
      lastName: form.lastName || "",
      penName: form.penName || "",
      birthDate: form.birthDate || "",
      country: form.country || "",
      email: form.email || "",

      // PROFIL AUTEUR
      level: form.level || "",
      experience: form.experience || "",
      alreadyWritten: form.alreadyWritten || "",
      genres: Array.isArray(form.genres)
        ? form.genres
        : [],
      bio: form.bio || "",

      // OBJECTIFS
      motivation: form.motivation || "",
      objective: form.objective || "",
      projectType: Array.isArray(form.projectType)
        ? form.projectType
        : [],
      communityGoal: form.communityGoal || "",

      // VALIDATION
      originality: !!form.originality,
      acceptRules: !!form.acceptRules,

      // 🔥 INFOS SYSTÈME
      status: "en_attente",
      role: "author_candidate",
      profileCompleted: true,
      reviewed: false,

      submittedAt: serverTimestamp(),
      createdAt: new Date().toISOString(),

      // 🔥 POUR PANEL ADMIN
      adminReadable: `
===== CANDIDATURE AUTEUR =====

👤 IDENTITÉ
Nom : ${form.lastName || "Non défini"}
Prénom : ${form.firstName || "Non défini"}
Nom de plume : ${form.penName || "Non défini"}
Date de naissance : ${form.birthDate || "Non défini"}
Pays : ${form.country || "Non défini"}
Email : ${form.email || "Non défini"}

✍️ PROFIL AUTEUR
Niveau : ${form.level || "Non défini"}
Déjà publié : ${form.alreadyWritten || "Non défini"}

Genres :
${
  Array.isArray(form.genres) && form.genres.length
    ? form.genres.join(", ")
    : "Aucun"
}

Parcours :
${form.experience || "Aucun"}

Présentation :
${form.bio || "Aucune"}

🎯 OBJECTIFS
Motivation :
${form.motivation || "Aucune"}

Objectif :
${form.objective || "Aucun"}

Projet :
${
  Array.isArray(form.projectType) &&
  form.projectType.length
    ? form.projectType.join(", ")
    : "Aucun"
}

Communauté :
${form.communityGoal || "Aucun"}

🛡 VALIDATION
Originalité validée : ${
        form.originality ? "Oui" : "Non"
      }

Conditions acceptées : ${
        form.acceptRules ? "Oui" : "Non"
      }

================================
      `
    };

    // 🔥 ENVOI FIREBASE
    const docRef = await addDoc(
      collection(db, "author_applications"),
      payload
    );

    console.log("✅ Auteur envoyé :", docRef.id);

    // 🔥 RESET OPTIONNEL
    /*
    setForm({
      firstName: "",
      lastName: "",
      penName: "",
      birthDate: "",
      country: "",
      email: "",
      level: "",
      experience: "",
      alreadyWritten: "",
      genres: [],
      bio: "",
      motivation: "",
      objective: "",
      projectType: [],
      communityGoal: "",
      originality: false,
      acceptRules: false
    });
    */

    // 🔥 PAGE CONDITIONS
    setView?.("author_terms");

  } catch (error) {
    console.error(
      "❌ Erreur Firebase détaillée :",
      error
    );

    alert(
      "Erreur : " +
      (error?.message || "Impossible d'envoyer la fiche.")
    );
  }
};

  return (
    <div className="author-page">

      {/* TOP PREMIUM */}
      <div className="top-header">

        <button
          className="back-btn"
          onClick={() => setView?.("home")}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="hero-box">
          <div className="hero-badge">
            <Sparkles size={14} />
            Programme Auteur
          </div>

          <h1>
            Bienvenue sur <span>ComicCrafte</span>
          </h1>

          <p>
            Publiez vos histoires, développez votre univers
            et rejoignez une nouvelle génération de créateurs.
          </p>
        </div>

      </div>

      {/* PROGRESS */}
      <div className="step-wrapper">
        {STEPS.map((item, i) => (
          <div
            key={item}
            className={`step-item ${step >= i ? "active" : ""}`}
          >
            <div className="step-circle">
              {i + 1}
            </div>

            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div className="form-card">

        {/* STEP 1 */}
        {step === 0 && (
          <div className="section">

            <div className="section-title">
              <User size={18} />
              Informations personnelles
            </div>

            <div className="grid-2">
              <input
                placeholder="Prénom *"
                className="input"
                value={form.firstName}
                onChange={(e) =>
                  handleChange("firstName", e.target.value)
                }
              />

              <input
                placeholder="Nom"
                className="input"
                value={form.lastName}
                onChange={(e) =>
                  handleChange("lastName", e.target.value)
                }
              />
            </div>

            <input
              placeholder="Nom de plume *"
              className="input"
              value={form.penName}
              onChange={(e) =>
                handleChange("penName", e.target.value)
              }
            />

            <div className="grid-2">
              <input
                type="date"
                className="input"
                value={form.birthDate}
                onChange={(e) =>
                  handleChange("birthDate", e.target.value)
                }
              />

              <input
                placeholder="Pays *"
                className="input"
                value={form.country}
                onChange={(e) =>
                  handleChange("country", e.target.value)
                }
              />
            </div>

            <input
              placeholder="Adresse email *"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />

          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="section">

            <div className="section-title">
              <PenSquare size={18} />
              Profil Auteur
            </div>

            <select
              className="input"
              value={form.level}
              onChange={(e) =>
                handleChange("level", e.target.value)
              }
            >
              <option value="">Niveau de l'auteur *</option>
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Professionnel</option>
              <option>Écrivain confirmé</option>
            </select>

            <textarea
              placeholder="Votre parcours / expérience *"
              className="textarea"
              value={form.experience}
              onChange={(e) =>
                handleChange("experience", e.target.value)
              }
            />

            <select
              className="input"
              value={form.alreadyWritten}
              onChange={(e) =>
                handleChange("alreadyWritten", e.target.value)
              }
            >
              <option value="">
                Avez-vous déjà publié une œuvre ? *
              </option>
              <option>Oui</option>
              <option>Non</option>
            </select>

            <div className="chips">
              {genresList.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleArray("genres", g)}
                  className={
                    form.genres.includes(g)
                      ? "chip active"
                      : "chip"
                  }
                >
                  {g}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Présentez votre univers ou votre style..."
              className="textarea"
              value={form.bio}
              onChange={(e) =>
                handleChange("bio", e.target.value)
              }
            />

          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="section">

            <div className="section-title">
              <Target size={18} />
              Objectifs & Motivation
            </div>

            <textarea
              placeholder="Pourquoi voulez-vous rejoindre ComicCrafte ? *"
              className="textarea"
              value={form.motivation}
              onChange={(e) =>
                handleChange("motivation", e.target.value)
              }
            />

            <textarea
              placeholder="Votre objectif principal *"
              className="textarea"
              value={form.objective}
              onChange={(e) =>
                handleChange("objective", e.target.value)
              }
            />

            <div className="chips">
              {projectOptions.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    toggleArray("projectType", item)
                  }
                  className={
                    form.projectType.includes(item)
                      ? "chip active"
                      : "chip"
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              placeholder="Objectif communauté / lecteurs"
              className="input"
              value={form.communityGoal}
              onChange={(e) =>
                handleChange("communityGoal", e.target.value)
              }
            />

          </div>
        )}

        {/* STEP 4 */}
        {step === 3 && (
          <div className="section">

            <div className="section-title">
              <ShieldCheck size={18} />
              Validation & Authenticité
            </div>

            <div className="validate-box">

              <label className="check-row">
                <input
                  type="checkbox"
                  checked={form.originality}
                  onChange={(e) =>
                    handleChange(
                      "originality",
                      e.target.checked
                    )
                  }
                />

                <span>
                  Je confirme que mes histoires sont
                  100% originales et m'appartiennent.
                </span>
              </label>

              <label className="check-row">
                <input
                  type="checkbox"
                  checked={form.acceptRules}
                  onChange={(e) =>
                    handleChange(
                      "acceptRules",
                      e.target.checked
                    )
                  }
                />

                <span>
                  J'accepte les règles de publication
                  et les conditions de ComicCrafte.
                </span>
              </label>

            </div>

            <div className="final-box">
              <BookOpen size={20} />

              <div>
                Après validation, votre profil auteur
                sera analysé avant activation.
              </div>
            </div>

          </div>
        )}

        {/* ACTIONS */}
        <div className="bottom-bar">

          <button
            className="nav-btn ghost"
            onClick={prev}
            disabled={step === 0}
          >
            Retour
          </button>

          {step < STEPS.length - 1 ? (
            <button
              className={`nav-btn ${
                canNext ? "primary" : "disabled"
              }`}
              disabled={!canNext}
              onClick={next}
            >
              Continuer
            </button>
          ) : (
            <button
              className={`nav-btn ${
                canNext ? "primary" : "disabled"
              }`}
              disabled={!canNext}
              onClick={submit}
            >
              Envoyer
            </button>
          )}

        </div>

      </div>

      <style>{`
        *{
          box-sizing:border-box;
        }

        body{
          background:#050505;
        }

        .author-page{
          min-height:100vh;
          background:
          radial-gradient(circle at top,#101827 0%,#050505 70%);
          padding:16px;
          color:white;
          font-family:Inter,Arial,sans-serif;
        }

        .top-header{
          max-width:720px;
          margin:auto;
        }

        .back-btn{
          width:42px;
          height:42px;
          border:none;
          border-radius:14px;
          background:rgba(255,255,255,0.06);
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:18px;
          backdrop-filter:blur(10px);
        }

        .hero-box{
          padding:24px;
          border-radius:28px;
          background:
          linear-gradient(
            135deg,
            rgba(0,255,255,0.10),
            rgba(255,255,255,0.03)
          );

          border:1px solid rgba(255,255,255,0.08);
          backdrop-filter:blur(20px);
        }

        .hero-badge{
          width:max-content;
          display:flex;
          align-items:center;
          gap:6px;
          padding:7px 14px;
          border-radius:999px;
          background:rgba(0,255,255,0.08);
          color:#00f2ff;
          font-size:11px;
          font-weight:700;
          margin-bottom:14px;
        }

        .hero-box h1{
          margin:0;
          font-size:28px;
          line-height:1.1;
        }

        .hero-box h1 span{
          color:#00f2ff;
        }

        .hero-box p{
          margin-top:12px;
          color:#9ca3af;
          font-size:14px;
          line-height:1.5;
        }

        .step-wrapper{
          max-width:720px;
          margin:18px auto;
          display:flex;
          justify-content:space-between;
          gap:8px;
        }

        .step-item{
          flex:1;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:6px;
          opacity:0.4;
        }

        .step-item.active{
          opacity:1;
        }

        .step-circle{
          width:32px;
          height:32px;
          border-radius:50%;
          background:rgba(255,255,255,0.06);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:13px;
          font-weight:700;
          border:1px solid rgba(255,255,255,0.08);
        }

        .step-item.active .step-circle{
          background:#00f2ff;
          color:#000;
          box-shadow:0 0 25px rgba(0,242,255,0.4);
        }

        .step-item span{
          font-size:10px;
          font-weight:700;
          color:#999;
        }

        .form-card{
          max-width:720px;
          margin:auto;
          padding:22px;
          border-radius:30px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          backdrop-filter:blur(18px);
        }

        .section{
          display:flex;
          flex-direction:column;
          gap:16px;
        }

        .section-title{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:15px;
          font-weight:800;
          color:#00f2ff;
          margin-bottom:4px;
        }

        .grid-2{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
        }

        .input,
        .textarea{
          width:100%;
          border:none;
          outline:none;
          border-radius:18px;
          padding:16px;
          background:rgba(255,255,255,0.05);
          color:#fff;
          font-size:14px;
          border:1px solid transparent;
          transition:0.25s;
        }

        .input:focus,
        .textarea:focus{
          border-color:#00f2ff;
          box-shadow:0 0 0 4px rgba(0,242,255,0.08);
        }

        .textarea{
          resize:none;
          min-height:110px;
        }

        .chips{
          display:flex;
          flex-wrap:wrap;
          gap:10px;
        }

        .chip{
          border:none;
          border-radius:999px;
          padding:10px 14px;
          background:rgba(255,255,255,0.06);
          color:#bbb;
          font-size:12px;
          font-weight:700;
        }

        .chip.active{
          background:#00f2ff;
          color:#000;
          box-shadow:0 0 18px rgba(0,242,255,0.35);
        }

        .validate-box{
          display:flex;
          flex-direction:column;
          gap:18px;
          padding:18px;
          border-radius:20px;
          background:rgba(255,255,255,0.03);
        }

        .check-row{
          display:flex;
          align-items:flex-start;
          gap:12px;
          font-size:13px;
          color:#d1d5db;
          line-height:1.5;
        }

        .check-row input{
          margin-top:4px;
          accent-color:#00f2ff;
        }

        .final-box{
          margin-top:10px;
          padding:16px;
          border-radius:18px;
          background:
          linear-gradient(
            135deg,
            rgba(0,255,255,0.08),
            rgba(255,255,255,0.02)
          );

          display:flex;
          gap:12px;
          align-items:center;
          color:#9fdfff;
          font-size:13px;
        }

        .bottom-bar{
          margin-top:28px;
          display:flex;
          justify-content:space-between;
          gap:12px;
        }

        .nav-btn{
          flex:1;
          height:54px;
          border:none;
          border-radius:18px;
          font-size:14px;
          font-weight:800;
          transition:0.25s;
        }

        .nav-btn.ghost{
          background:rgba(255,255,255,0.06);
          color:#fff;
        }

        .nav-btn.primary{
          background:#00f2ff;
          color:#000;
          box-shadow:0 0 30px rgba(0,242,255,0.3);
        }

        .nav-btn.disabled{
          background:#1a1a1a;
          color:#555;
        }

        @media(max-width:640px){

          .grid-2{
            grid-template-columns:1fr;
          }

          .hero-box h1{
            font-size:23px;
          }

          .form-card{
            padding:18px;
            border-radius:24px;
          }
        }
      `}</style>
    </div>
  );
}