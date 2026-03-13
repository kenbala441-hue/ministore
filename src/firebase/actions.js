import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase'; // <-- adapte le chemin si besoin

// Ajouter un like à une story
export async function likeStory(userId, storyId) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      likes: arrayUnion(userId)
    });
  } catch (err) {
    console.error("Impossible de liker la story :", err);
  }
}

// Ajouter un commentaire
export async function commentStory(userId, storyId, commentText) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      comments: arrayUnion({
        userId,
        text: commentText,
        createdAt: new Date()
      })
    });
  } catch (err) {
    console.error("Impossible de commenter :", err);
  }
}

// Partager une story
export async function shareStory(userId, storyId) {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      shares: arrayUnion(userId)
    });
  } catch (err) {
    console.error("Impossible de partager :", err);
  }
}