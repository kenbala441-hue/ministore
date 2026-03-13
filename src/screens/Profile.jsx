// 🔥 PROFILE V2 PRO — FUSION COMPLETE AVEC selectedUser
// Premium / VIP / Standard / Commerçant
// Support profil personnel + profil externe (Top Creator)

import React, { useState, useEffect } from "react";

const DEFAULT_PROFILE =
  "https://res.cloudinary.com/dn9c4ctav/image/upload/v1772147595/1751816044094_fvqghc.png";

export default function Profile({
  setView,
  userStatus = "standard",
  selectedUser = null,
}) {
  /* ---------------- DETECT USER ---------------- */

  const isExternalProfile = !!selectedUser;

  if (selectedUser === undefined) return null;

  const profileUsername =
    selectedUser?.username || "Ken Mikael";

  const profilePhoto =
    selectedUser?.photoURL || DEFAULT_PROFILE;

  const profileRole =
    selectedUser?.role || userStatus;

  const followers =
    selectedUser?.followers ?? 2300;

  const following =
    selectedUser?.following ?? 180;

  const storiesCount =
    selectedUser?.storiesCount ?? 12;

  /* ---------------- STATE ---------------- */

  const [darkMode, setDarkMode] = useState(true);
  const [username, setUsername] = useState(profileUsername);
  const [editing, setEditing] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState(null);
  const [role, setRole] = useState(profileRole);

  /* ---------------- ROLE CONFIG ---------------- */

  const roleConfig = {
    admin: { color: "#ff4dff", label: "ADMIN" },
    vip: { color: "#ffd700", label: "VIP" },
    premium: { color: "#00f5ff", label: "PREMIUM" },
    merchant: { color: "#22c55e", label: "COMMERÇANT" },
    standard: { color: "#a855f7", label: "STANDARD" },
  };

  const currentRole = roleConfig[role] || roleConfig.standard;

  /* ---------------- SUBSCRIPTION LOGIC (PERSONAL ONLY) ---------------- */

  useEffect(() => {
    if (isExternalProfile) return;

    const savedEnd = localStorage.getItem("subscriptionEnd");
    const savedRole = localStorage.getItem("userRole");

    if (savedEnd) setSubscriptionEnd(new Date(savedEnd));
    if (savedRole) setRole(savedRole);
  }, [isExternalProfile]);

  useEffect(() => {
    if (!subscriptionEnd || isExternalProfile) return;

    const now = new Date();
    if (now > subscriptionEnd) {
      setRole("standard");
      localStorage.setItem("userRole", "standard");
      localStorage.removeItem("subscriptionEnd");
      setSubscriptionEnd(null);
    }
  }, [subscriptionEnd, isExternalProfile]);

  const activateOffer = (type) => {
    if (isExternalProfile) return;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    setRole(type);
    setSubscriptionEnd(endDate);

    localStorage.setItem("userRole", type);
    localStorage.setItem("subscriptionEnd", endDate.toISOString());
  };

  const daysLeft = subscriptionEnd
    ? Math.max(
        0,
        Math.ceil((subscriptionEnd - new Date()) / (1000 * 60 * 60 * 24))
      )
    : null;

  /* ---------------- UI ---------------- */

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 30,
        backgroundColor: darkMode ? "#050508" : "#f4f4f8",
        color: darkMode ? "#fff" : "#111",
        transition: "0.3s",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            margin: "0 auto",
            overflow: "hidden",
            border: `3px solid ${currentRole.color}`,
            boxShadow: `0 0 25px ${currentRole.color}`,
          }}
        >
          <img
            src={profilePhoto}
            alt="profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_PROFILE;
            }}
          />
        </div>

        {editing && !isExternalProfile ? (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              marginTop: 15,
              padding: 8,
              borderRadius: 8,
              border: "none",
              textAlign: "center",
            }}
          />
        ) : (
          <h2 style={{ marginTop: 15 }}>
            {isExternalProfile ? profileUsername : username}
          </h2>
        )}

        <div
          style={{
            marginTop: 8,
            fontWeight: "bold",
            color: currentRole.color,
          }}
        >
          {currentRole.label}
        </div>

        {subscriptionEnd && !isExternalProfile && (
          <div style={{ marginTop: 5, fontSize: 14 }}>
            Offre valide : {daysLeft} jours restants
          </div>
        )}
      </div>

      {/* ACTIONS (PERSONAL PROFILE ONLY) */}
      {!isExternalProfile && (
        <>
          <div style={{ display: "flex", gap: 15, justifyContent: "center" }}>
            <button onClick={() => setEditing(!editing)}>
              Modifier Nom
            </button>

            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Mode Clair" : "Mode Sombre"}
            </button>
          </div>

          {/* SUBSCRIPTION SECTION */}
          <div style={{ marginTop: 40 }}>
            <h3>Activer une offre (1 mois)</h3>

            <div style={{ display: "grid", gap: 10, marginTop: 15 }}>
              <button onClick={() => activateOffer("premium")}>
                🔹 Activer Premium
              </button>

              <button onClick={() => activateOffer("vip")}>
                🟡 Activer VIP
              </button>

              <button onClick={() => activateOffer("merchant")}>
                🟢 Activer Commerçant
              </button>
            </div>

            <p style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>
              (Activation possible par Admin ou paiement via Ink système)
            </p>
          </div>
        </>
      )}

      {/* STATS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 50,
        }}
      >
        <div>
          <div style={{ fontWeight: "bold", fontSize: 20 }}>
            {followers}
          </div>
          <div>Abonnés</div>
        </div>

        <div>
          <div style={{ fontWeight: "bold", fontSize: 20 }}>
            {following}
          </div>
          <div>Abonnements</div>
        </div>

        <div>
          <div style={{ fontWeight: "bold", fontSize: 20 }}>
            {storiesCount}
          </div>
          <div>Séries</div>
        </div>
      </div>

      {/* MENU */}
      <div style={{ marginTop: 50 }}>
        {!isExternalProfile && (
          <>
            <div
              style={{ padding: 10, cursor: "pointer" }}
              onClick={() => setView?.("profile_theme")}
            >
              🎨 Thème & Apparence
            </div>

            <div
              style={{ padding: 10, cursor: "pointer" }}
              onClick={() => setView?.("profile_security")}
            >
              🔐 Sécurité & 2FA
            </div>

            {role === "admin" && (
              <div
                style={{
                  padding: 10,
                  cursor: "pointer",
                  color: "#ff4dff",
                }}
                onClick={() => setView?.("admin")}
              >
                🛠️ Admin Panel
              </div>
            )}
          </>
        )}

        <div
          style={{ padding: 10, cursor: "pointer" }}
          onClick={() => setView?.("home")}
        >
          ← Retour Accueil
        </div>
      </div>
    </div>
  );
}