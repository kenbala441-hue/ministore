import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";

import {
  Heart,
  MessageCircle,
  Star,
  Send,
  Loader2
} from "lucide-react";

import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  setDoc,
  runTransaction,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

import { db } from "../../firebase";
import { useUserContext } from "../users/userContext";

export const SocialFooter = ({ storyId }) => {
  const { user, userData } = useUserContext();

  const [meta, setMeta] = useState({
    likesCount: 0,
    commentsCount: 0,
    ratingAverage: 0,
    ratingCount: 0,
    likedBy: []
  });

  const [commentsList, setCommentsList] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [dailyComments, setDailyComments] = useState(0);
  const [cooldown, setCooldown] = useState(null);

  const [userRating, setUserRating] = useState(0);
const formatCooldown = () => {
  if (!cooldown) return "";
  const diff = cooldown - Date.now();
  if (diff <= 0) return "0s";
  
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  
  return `${h}h ${m}m ${s}s`;
};

  const lastSendRef = useRef(0);

  const isLiked =
    !!user &&
    Array.isArray(meta.likedBy) &&
    meta.likedBy.includes(user.uid);

  const ensureStoryDoc = useCallback(async () => {
    if (!storyId) return null;

    const ref = doc(db, "stories_meta", storyId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        likesCount: 0,
        commentsCount: 0,
        ratingAverage: 0,
        ratingCount: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return ref;
  }, [storyId]);

  useEffect(() => {
    if (!storyId) return;

    const unsubMeta = onSnapshot(
      doc(db, "stories_meta", storyId),
      (snap) => {
        if (!snap.exists()) return;

        const data = snap.data();

        setMeta({
          likesCount: data.likesCount || 0,
          commentsCount: data.commentsCount || 0,
          ratingAverage: data.ratingAverage || 0,
          ratingCount: data.ratingCount || 0,
          likedBy: data.likedBy || []
        });
      }
    );

    const commentsQuery = query(
      collection(db, "stories_meta", storyId, "comments"),
      orderBy("createdAt", "desc")
    );

    const unsubComments = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setCommentsList(list);

        if (user) {
          const now = Date.now();

          const recent = list.filter((item) => {
            if (item.userId !== user.uid) return false;

            const date =
              item.createdAt?.toDate?.() ||
              new Date();

            return (
              now - date.getTime() <
              24 * 60 * 60 * 1000
            );
          });

          setDailyComments(recent.length);

          if (recent.length >= 3) {
            const oldest =
              recent[recent.length - 1];

            const created =
              oldest.createdAt?.toDate?.();

            if (created) {
              setCooldown(
                created.getTime() +
                  24 * 60 * 60 * 1000
              );
            }
          } else {
            setCooldown(null);
          }
        }
      }
    );

    return () => {
      unsubMeta();
      unsubComments();
    };
  }, [storyId, user]);

  useEffect(() => {
    if (!cooldown) return;

    const timer = setInterval(() => {
      if (Date.now() > cooldown) {
        setCooldown(null);
        setDailyComments(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleLike = useCallback(async () => {
    if (!user || !storyId) return;

    try {
      const storyRef = await ensureStoryDoc();

      if (isLiked) {
        await updateDoc(storyRef, {
          likedBy: arrayRemove(user.uid),
          likesCount: increment(-1),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(storyRef, {
          likedBy: arrayUnion(user.uid),
          likesCount: increment(1),
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    user,
    storyId,
    isLiked,
    ensureStoryDoc
  ]);

  const handleRate = useCallback(async () => {
  if (!user || !storyId) return;

  try {
    const rateRef = doc(
      db,
      "stories_meta",
      storyId,
      "ratings",
      user.uid
    );

    const rateSnap = await getDoc(rateRef);

    // =========================
    // UTILISATEUR A DÉJÀ NOTÉ
    // =========================
    if (rateSnap.exists()) {
      const data = rateSnap.data();

      const lastUpdate =
        data.updatedAt?.toMillis?.() ||
        data.createdAt?.toMillis?.() ||
        0;

      const hours24 =
        24 * 60 * 60 * 1000;

      const remaining =
        hours24 - (Date.now() - lastUpdate);

      if (remaining > 0) {
        const h = Math.floor(
          remaining / 3600000
        );

        const m = Math.floor(
          (remaining % 3600000) / 60000
        );

        alert(
          `Merci pour votre participation ⭐

Vous avez déjà donné votre avis sur cette histoire.

Vous pourrez modifier votre note dans ${h}h ${m}m.`
        );

        return;
      }

      const updateVote = window.confirm(
        `Merci pour votre participation ⭐

Vous avez déjà noté cette histoire (${data.value}/5).

Voulez-vous mettre à jour votre note ?`
      );

      if (!updateVote) return;

      const newValue = Number(
        prompt(
          "Nouvelle note (1 à 5 étoiles)"
        )
      );

      if (
        Number.isNaN(newValue) ||
        newValue < 1 ||
        newValue > 5
      ) {
        alert(
          "Veuillez entrer une note entre 1 et 5."
        );
        return;
      }

      const storyRef = doc(
        db,
        "stories_meta",
        storyId
      );

      const oldValue = data.value;

      const newAverage =
        (
          (meta.ratingAverage *
            meta.ratingCount) -
          oldValue +
          newValue
        ) / meta.ratingCount;

      await updateDoc(storyRef, {
        ratingAverage: Number(
          newAverage.toFixed(1)
        ),
        updatedAt: serverTimestamp()
      });

      await updateDoc(rateRef, {
        value: newValue,
        updatedAt: serverTimestamp()
      });

      setUserRating(newValue);

      alert(
        "Votre note a été mise à jour avec succès ⭐"
      );

      return;
    }

    // =========================
    // PREMIÈRE NOTE
    // =========================

    const value = Number(
      prompt(
        "Donnez une note de 1 à 5 étoiles"
      )
    );

    if (
      Number.isNaN(value) ||
      value < 1 ||
      value > 5
    ) {
      alert(
        "Veuillez entrer une note entre 1 et 5."
      );
      return;
    }

    await setDoc(rateRef, {
      userId: user.uid,
      value,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const storyRef =
      await ensureStoryDoc();

    const newCount =
      (meta.ratingCount || 0) + 1;

    const newAverage =
      (
        (meta.ratingAverage || 0) *
          (meta.ratingCount || 0) +
        value
      ) / newCount;

    await updateDoc(storyRef, {
      ratingAverage: Number(
        newAverage.toFixed(1)
      ),
      ratingCount: newCount,
      updatedAt: serverTimestamp()
    });

    setUserRating(value);

    alert(
      "Merci pour votre participation ⭐\n\nVotre avis a bien été enregistré."
    );

  } catch (err) {
    console.error(
      "Erreur notation :",
      err
    );
  }
}, [
  user,
  storyId,
  meta,
  ensureStoryDoc
]);
const postComment = useCallback(async () => {
  // Sécurité renforcée
  if (!user || !storyId) {
    alert("Veuillez vous connecter pour commenter.");
    return;
  }
  
  const text = comment.trim();
  if (!text) return;

    if (dailyComments >= 3)
      return alert("Limite de 3 commentaires atteinte.");

    if (Date.now() - lastSendRef.current < 2500) return;

    try {
      setLoading(true);
      lastSendRef.current = Date.now();
      const storyRef = await ensureStoryDoc();

      await addDoc(collection(db, "stories_meta", storyId, "comments"), {
        userId: user.uid,
        username: userData?.username || user.displayName || user.email || "Lecteur",
        photoURL: user.photoURL || "",
        text,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await updateDoc(storyRef, {
        commentsCount: increment(1),
        updatedAt: serverTimestamp()
      });

      setComment("");
    } catch (err) {
      console.error("Erreur en postant le commentaire :", err);
    } finally {
      setLoading(false);
    }
  }, [user, userData, storyId, comment, dailyComments, ensureStoryDoc, ensureStoryDoc]);

  return (
    <section style={styles.section}>
      <div style={styles.divider} />

      <div style={styles.stats}>
        <button
          onClick={handleLike}
          style={{
            ...styles.btn,
            color: isLiked
              ? "#ff4081"
              : "inherit"
          }}
        >
          <Heart
            size={18}
            fill={
              isLiked
                ? "#ff4081"
                : "none"
            }
          />
          <span>
            {meta.likesCount || 0}
          </span>
        </button>

        <button
          onClick={handleRate}
          style={styles.btn}
        >
          <Star size={18} />
          <span>
            {Number(
              meta.ratingAverage || 0
            ).toFixed(1)}
          </span>
        </button>

        <div style={styles.btn}>
          <MessageCircle size={18} />
          <span>
            {meta.commentsCount || 0}
          </span>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.inputRow}>
        <input
          value={comment}
          maxLength={500}
          disabled={!user || loading}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder={
            user
              ? "Ajouter un commentaire..."
              : "Connectez-vous pour commenter"
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            postComment()
          }
          style={styles.input}
        />

        <button
          onClick={postComment}
          disabled={!user || loading}
          style={styles.sendBtn}
        >
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      {cooldown && (
        <div style={styles.limit}>
          Limite atteinte •
          Réinitialisation dans{" "}
          {formatCooldown()}
        </div>
      )}

      <div style={styles.comments}>
        {commentsList.map((c) => (
          <div
            key={c.id}
            style={styles.comment}
          >
            <div
              style={
                styles.username
              }
            >
              {c.username}
            </div>

            <div style={styles.text}>
              {c.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: {
    marginTop: 40,
    padding: 16
  },

  divider: {
    height: 1,
    background:
      "rgba(255,255,255,0.08)",
    margin: "16px 0"
  },

  stats: {
    display: "flex",
    justifyContent: "center",
    gap: 30
  },

  btn: {
    border: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontWeight: 700,
    color: "inherit"
  },

  inputRow: {
    display: "flex",
    gap: 10,
    marginTop: 16
  },

  input: {
    flex: 1,
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    outline: "none",
    background:
      "rgba(255,255,255,0.06)",
    color: "inherit"
  },

  sendBtn: {
    border: "none",
    borderRadius: 14,
    padding: "14px 18px",
    cursor: "pointer"
  },

  limit: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7
  },

  comments: {
    marginTop: 24,
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  comment: {
    padding: 12,
    borderRadius: 12,
    background:
      "rgba(255,255,255,0.04)"
  },

  username: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 4
  },

  text: {
    fontSize: 14,
    lineHeight: 1.5
  }
};