export const QUIZ_CATEGORIES = [
  {
    id: 'comic-crafte',
    title: 'ComicCrafte Studio',
    difficulty: 'EASY',
    image: 'https://res.cloudinary.com/dn9c4ctav/image/upload/v1775596909/1775596869041_cr23s6.png',
    pointsPerQ: 50,
    questions: [
      { q: "Quel studio produit 'Blackline' ?", options: ["ComicCrafte", "Mappa", "Ufotable"], correct: 0 },
      { q: "Combien d'Ink gagne-t-on par jour ?", options: ["10", "50", "100"], correct: 1 },
      { q: "Quel est le premier projet du studio ?", options: ["Les Héritiers de l'Oubli", "Naruto", "Bleach"], correct: 0 }
    ]
  },

  {
    id: 'anime',
    title: 'Anime Universe',
    difficulty: 'MEDIUM',
    image: 'https://res.cloudinary.com/dn9c4ctav/image/upload/v1775596532/1775596478661_kqogwc.png',
    pointsPerQ: 70,
    questions: [
      { q: "Quel anime contient Luffy ?", options: ["Naruto", "One Piece", "Bleach"], correct: 1 },
      { q: "Qui est Naruto ?", options: ["Pirate", "Ninja", "Mage"], correct: 1 },
      { q: "Quel anime parle de Titans ?", options: ["SNK", "DBZ", "OP"], correct: 0 }
    ]
  },

  {
    id: 'manga',
    title: 'Manga Master',
    difficulty: 'HARD',
    image: 'https://res.cloudinary.com/dn9c4ctav/image/upload/v1775600029/1775599941355_wdm59m.png',
    pointsPerQ: 100,
    questions: [
      { q: "Qui a créé One Piece ?", options: ["Kishimoto", "Oda", "Toriyama"], correct: 1 },
      { q: "Quel manga est en noir et blanc ?", options: ["Tous", "Aucun", "Certains"], correct: 0 },
      { q: "Naruto est publié dans ?", options: ["Shonen Jump", "Seinen Pro", "Kodomo Mag"], correct: 0 }
    ]
  },

  {
    id: 'nature',
    title: 'Nature & Monde',
    difficulty: 'EASY',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    pointsPerQ: 40,
    questions: [
      { q: "Quelle est la plus grande forêt ?", options: ["Amazonie", "Sahara", "Alpes"], correct: 0 },
      { q: "Les arbres produisent ?", options: ["CO2", "Oxygène", "Fer"], correct: 1 }
    ]
  },

  {
    id: 'fantasy',
    title: 'Fantasy Stories',
    difficulty: 'MEDIUM',
    image: 'https://res.cloudinary.com/dn9c4ctav/image/upload/v1775600388/Definition-of-Fantasy-Novel_Twitter_mknf0g.jpg',
    pointsPerQ: 80,
    questions: [
      { q: "Un dragon est ?", options: ["Créature mythique", "Animal réel", "Robot"], correct: 0 },
      { q: "La magie appartient à ?", options: ["Fantasy", "Science pure", "Sport"], correct: 0 }
    ]
  },

  {
    id: 'science',
    title: 'Science Fiction',
    difficulty: 'MEDIUM',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    pointsPerQ: 80,
    questions: [
      { q: "Un robot est ?", options: ["Machine", "Animal", "Plante"], correct: 0 },
      { q: "La SF parle souvent de ?", options: ["Futur", "Passé", "Cuisine"], correct: 0 }
    ]
  },

  {
    id: 'books',
    title: 'Livres & Romans',
    difficulty: 'EASY',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    pointsPerQ: 50,
    questions: [
      { q: "Un roman est ?", options: ["Livre", "Film", "Jeu"], correct: 0 },
      { q: "Un auteur écrit ?", options: ["Livres", "Voitures", "Maisons"], correct: 0 }
    ]
  },

  {
    id: 'poetry',
    title: 'Poésie',
    difficulty: 'MEDIUM',
    image: 'https://res.cloudinary.com/dn9c4ctav/image/upload/v1775601147/poesie1-1_haeae1.jpg',
    pointsPerQ: 70,
    questions: [
      { q: "Un poème contient ?", options: ["Vers", "Pixels", "Codes"], correct: 0 },
      { q: "La poésie exprime ?", options: ["Émotions", "Calculs", "Sport"], correct: 0 }
    ]
  },

  {
    id: 'history',
    title: 'Histoires & Mythes',
    difficulty: 'MEDIUM',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
    pointsPerQ: 70,
    questions: [
      { q: "Un mythe est ?", options: ["Récit ancien", "Jeu vidéo", "Film"], correct: 0 },
      { q: "Les légendes viennent ?", options: ["Du passé", "Du futur", "Internet"], correct: 0 }
    ]
  },

  {
    id: 'writing',
    title: 'Écriture',
    difficulty: 'EASY',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    pointsPerQ: 50,
    questions: [
      { q: "Écrire sert à ?", options: ["Exprimer", "Dormir", "Manger"], correct: 0 },
      { q: "Un texte contient ?", options: ["Mots", "Images", "Sons"], correct: 0 }
    ]
  },

  {
    id: 'cinema',
    title: 'Cinéma & Adaptations',
    difficulty: 'MEDIUM',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    pointsPerQ: 80,
    questions: [
      { q: "Un film adapté vient ?", options: ["D’un livre", "D’un arbre", "D’un jeu"], correct: 0 },
      { q: "Harry Potter est ?", options: ["Livre & film", "Sport", "Musique"], correct: 0 }
    ]
  },

  {
    id: 'philosophy',
    title: 'Philosophie',
    difficulty: 'HARD',
    image: 'https://res.cloudinary.com/dn9c4ctav/image/upload/v1775596590/635928118532119034-789826585_philosophy-1_a5bmm4.jpg',
    pointsPerQ: 100,
    questions: [
      { q: "La philosophie étudie ?", options: ["Pensée", "Sport", "Cuisine"], correct: 0 },
      { q: "Un philosophe est ?", options: ["Penseur", "Guerrier", "Pilote"], correct: 0 }
    ]
  },

  {
    id: 'comics',
    title: 'Comics & BD',
    difficulty: 'MEDIUM',
    image: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400',
    pointsPerQ: 80,
    questions: [
      { q: "Un comics vient ?", options: ["USA", "Japon", "France"], correct: 0 },
      { q: "Une BD contient ?", options: ["Bulles", "Tableaux", "Cartes"], correct: 0 }
    ]
  },

  {
    id: 'creativity',
    title: 'Créativité',
    difficulty: 'EASY',
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=400',
    pointsPerQ: 50,
    questions: [
      { q: "Créer c’est ?", options: ["Imaginer", "Copier", "Dormir"], correct: 0 },
      { q: "Une idée vient ?", options: ["Esprit", "Téléphone", "Voiture"], correct: 0 }
    ]
  },

  {
    id: 'legends',
    title: 'Légendes Épiques',
    difficulty: 'HARD',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400',
    pointsPerQ: 120,
    questions: [
      { q: "Un héros légendaire est ?", options: ["Mythique", "Réel", "Robot"], correct: 0 },
      { q: "Une épopée est ?", options: ["Grand récit", "Jeu", "Film court"], correct: 0 }
    ]
  }
];