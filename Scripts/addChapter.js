import { addStory } from "../src/firebase/stories.js";
import { db } from "../src/firebase/index.js";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";

// Configuration des nouvelles histoires basées sur tes images
const storiesToPublish = [
  {
    title: "The Games",
    genre: "Horreur / Thriller",
    description: "Une arène sombre où chaque regard peut être le dernier.",
    cover: "https://picsum.photos/seed/games/500/700" // Image au hasard
  },
  {
    title: "The Mechanist",
    genre: "Science-Fiction",
    description: "Dans l'ombre des néons, la technologie dépasse l'entendement humain.",
    cover: "https://picsum.photos/seed/mechanic/500/700"
  },
  {
    title: "Cult Hunt: The Resurrection",
    genre: "Action / Horreur",
    description: "Ils pensaient l'avoir enterré. Ils avaient tort.",
    cover: "https://picsum.photos/seed/culthunt/500/700"
  },
  {
    title: "L'ixrifying",
    genre: "Horreur",
    description: "Le conte terrifiant d'un tueur masqué qui ne laisse aucune trace.",
    cover: "https://picsum.photos/seed/ixrifying/500/700"
  },
  {
    title: "Princesses of the Stars",
    genre: "Anime / Fantasy",
    description: "Trois héritières galactiques face au destin de l'univers.",
    cover: "https://picsum.photos/seed/princesses/500/700"
  },
  {
    title: "Galaxy Heroes",
    genre: "Action / Shonen",
    description: "L'escouade d'élite pour la protection des systèmes stellaires.",
    cover: "https://picsum.photos/seed/galaxy/500/700"
  },
  {
    title: "Little Jimmy",
    genre: "Aventure / Enfant",
    description: "Les aventures d'un petit ours courageux dans la forêt mystérieuse.",
    cover: "https://picsum.photos/seed/jimmy/500/700"
  },
  {
    title: "Xceleesistes",
    genre: "Mythologie / Manga",
    description: "Le panthéon des dieux s'éveille pour une guerre ancestrale.",
    cover: "https://picsum.photos/seed/xcele/500/700"
  },
  {
    title: "Red Reman",
    genre: "Sci-Fi / Jeunesse",
    description: "Trois enfants, une mission : sauver la planète rouge.",
    cover: "https://picsum.photos/seed/redreman/500/700"
  }
];

async function initialiserDatabase() {
  console.log("🚀 Début de l'importation des histoires ComicCrafte...");

  for (const storyData of storiesToPublish) {
    try {
      const nouvelleStory = {
        title: storyData.title,
        content: "Histoire en cours de rédaction...",
        authorId: "Comiccrafte_Studio_Official",
        likesCount: Math.floor(Math.random() * 100),
        commentsCount: 0,
        sharesCount: 0,
        viewsCount: Math.floor(Math.random() * 500),
        coverImage: storyData.cover,
        description: storyData.description,
        genre: storyData.genre,
        status: "ongoing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        chaptersCount: 1
      };

      // 1. Ajouter la story principale
      const docRef = await addStory(nouvelleStory);
      const storyId = docRef.id;
      console.log(`✅ Story créée : ${storyData.title} (ID: ${storyId})`);

      // 2. Ajouter le chapitre 1 par défaut
      await setDoc(doc(collection(db, "stories", storyId, "chapters"), "chapter1"), {
        title: "CHAPITRE 1 : L'Origine",
        order: 1,
        pages: [
          { type: "text", text: `Bienvenue dans l'univers de ${storyData.title}.` },
          { type: "image", src: storyData.cover },
          { type: "text", text: "Le destin commence ici..." }
        ],
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error(`❌ Erreur sur ${storyData.title} :`, error);
    }
  }

  console.log("✨ Importation terminée !");
}

// Lancer l'importation
initialiserDatabase();
