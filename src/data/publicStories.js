// COMICCRAFTE OFFLINE DATABASE — FULL MERGED VERSION (NO FIREBASE)

export const PUBLIC_STORIES = [

/* ===================== BASE STORIES ===================== */

{
  id: "peter-pan-01",
  title: "Peter Pan",
  author: "J.M. Barrie",
  coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500",
  genres: ["aventure", "fantastique"],
  viewsCount: 1500,
  likesCount: 850,
  chapters: [
    {
      id: 0,
      title: "Chapitre 1 - L'enfant qui ne voulait pas grandir",
      pages: [
        "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800",
        "La nuit était calme. Wendy observait les étoiles.",
        "https://images.unsplash.com/photo-1526318472351-bc6f2e2c1c1f?w=800",
        "— Tu veux voler ?",
        "Fin du chapitre"
      ]
    },
    {
      id: 1,
      title: "Chapitre 2 - Neverland",
      pages: [
        "Peter emmène Wendy vers Neverland.",
        "Un monde rempli de pirates et de magie.",
        "Fin du chapitre"
      ]
    }
  ]
},

{
  id: "alice-01",
  title: "Alice au pays des merveilles",
  author: "Lewis Carroll",
  coverImage: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=500",
  genres: ["fantastique"],
  viewsCount: 2200,
  likesCount: 940,
  chapters: [
    {
      id: 0,
      title: "Chapitre 1 - Le terrier du lapin",
      pages: [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
        "Alice s'ennuyait profondément.",
        "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800",
        "Elle suivit un lapin blanc.",
        "Fin du chapitre"
      ]
    },
    {
      id: 1,
      title: "Chapitre 2 - La chute",
      pages: [
        "Alice tombe dans un monde étrange.",
        "Tout devient absurde.",
        "Fin du chapitre"
      ]
    }
  ]
},

{
  id: "dracula-01",
  title: "Dracula",
  author: "Bram Stoker",
  coverImage: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500",
  genres: ["horreur"],
  viewsCount: 2800,
  likesCount: 1200,
  chapters: [
    {
      id: 0,
      title: "Chapitre 1 - Le château",
      pages: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
        "Jonathan arriva au château.",
        "Bienvenue...",
        "Fin du chapitre"
      ]
    }
  ]
},

{
  id: "sherlock-01",
  title: "Sherlock Holmes",
  author: "Arthur Conan Doyle",
  coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
  genres: ["mystère"],
  viewsCount: 3000,
  likesCount: 1500,
  chapters: [
    {
      id: 0,
      title: "Chapitre 1 - Une étrange affaire",
      pages: [
        "Londres. Brouillard.",
        "Chaque détail compte.",
        "Fin du chapitre"
      ]
    }
  ]
},

{
  id: "frankenstein-01",
  title: "Frankenstein",
  author: "Mary Shelley",
  coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500",
  genres: ["horreur"],
  viewsCount: 2600,
  likesCount: 1100,
  chapters: [
    {
      id: 0,
      title: "Chapitre 1 - La création",
      pages: [
        "Il donna vie à la créature.",
        "Fin du chapitre"
      ]
    }
  ]
},

{
  id: "odyssey-01",
  title: "L'Odyssée",
  author: "Homère",
  coverImage: "https://images.unsplash.com/photo-1526318472351-bc6f2e2c1c1f?w=500",
  genres: ["mythologie"],
  viewsCount: 3200,
  likesCount: 1700,
  chapters: [
    {
      id: 0,
      title: "Chapitre 1 - Le retour",
      pages: [
        "Ulysse rentre chez lui.",
        "Fin du chapitre"
      ]
    }
  ]
},

{
  id: "heritier-01",
  title: "Les Héritiers de l’Oubli",
  author: "ComicCrafte Studio",
  coverImage: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500",
  genres: ["dark fantasy"],
  viewsCount: 0,
  likesCount: 0,
  chapters: [
    {
      id: 0,
      title: "Chapitre 1 - L'Éveil",
      pages: [
        "Le monde a oublié.",
        "Tu te souviens.",
        "Fin du chapitre"
      ]
    },
    {
      id: 1,
      title: "Chapitre 2 - La mémoire",
      pages: [
        "La vérité revient.",
        "Fin du chapitre"
      ]
    }
  ]
},

/* ===================== AUTO GENERATION (40 STORIES) ===================== */

...Array.from({ length: 40 }).map((_, i) => ({
  id: `story-${i}`,
  title: `Histoire ${i + 1}`,
  author: i % 2 === 0 ? "ComicCrafte Studio" : "Auteur Classique",
  coverImage: `https://picsum.photos/seed/${i}/500/700`,
  genres: ["aventure", "fantasy"],
  viewsCount: Math.floor(Math.random() * 5000),
  likesCount: Math.floor(Math.random() * 2000),
  chapters: [
    {
      id: 0,
      title: "Chapitre 1",
      pages: [
        `Début de l’histoire ${i + 1}`,
        `Un événement mystérieux survient.`,
        `Fin du chapitre`
      ]
    },
    {
      id: 1,
      title: "Chapitre 2",
      pages: [
        `Le héros agit.`,
        `Une bataille commence.`,
        `Fin du chapitre`
      ]
    }
  ]
}))

];