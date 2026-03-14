import { addStory } from "../src/firebase/stories.js";

const publishConceptsStory = async () => {

  const story = {
    title: "Les Concepts Oubliés",
    description: `
Dans un monde identique au nôtre, certaines personnes ne meurent pas.

Elles disparaissent.

Pas seulement de la vie…
mais de l’histoire elle-même.

Photos modifiées.
Archives réécrites.
Souvenirs effacés.

Comme si ces personnes n’avaient jamais existé.

Pourtant, certains ressentent encore un vide.
Une absence impossible à expliquer.

Ethan Cole est l’un d’eux.

À son arrivée au Black Hollow Institute, il découvre une clé étrange et un carnet contenant des messages qui semblent lui être destinés.

Pendant ce temps, Clara Weiss, une étudiante journaliste, poursuit une enquête personnelle : son père a disparu des années auparavant… et personne ne se souvient qu’il a existé.

Personne, sauf elle.

En unissant leurs recherches, ils commencent à découvrir un secret terrifiant.

Dans l’ombre agit une organisation ancienne connue sous le nom de la Main Noire, dirigée par cinq figures mystérieuses appelées les Pacificateurs.

Leur mission : maintenir un ordre invisible en effaçant ceux qui menacent l’équilibre du monde.

Mais derrière eux se cache une entité encore plus ancienne.

Une présence primordiale nommée Morrow.

Une entité capable d’effacer les concepts eux-mêmes : existence, identité, mémoire.

Et si ces disparitions n’étaient que la première étape d’un plan bien plus vaste ?

Alors qu’Ethan et Clara se rapprochent de la vérité, ils découvrent que certaines réponses pourraient détruire leur humanité… et que certains secrets sont peut-être faits pour rester oubliés.
`,
    genre: "Mystère • Thriller psychologique • Fantastique sombre • Enquête • Cosmique",

    authorId: "craftcomic_studio",

    coverImage:
      "https://res.cloudinary.com/dn9c4ctav/image/upload/f_auto,q_auto,w_800/v1772147595/1751816044094_fvqghc.png",

    pages: [

      {
        type: "text",
        text: "Certaines personnes ne meurent pas."
      },

      {
        type: "text",
        text: "Elles disparaissent."
      },

      {
        type: "text",
        text: "Pas seulement de la vie… mais de l’histoire elle-même."
      },

      {
        type: "text",
        text: "Photos modifiées. Archives réécrites. Souvenirs effacés."
      },

      {
        type: "text",
        text: "Comme si ces personnes n’avaient jamais existé."
      },

      {
        type: "text",
        text: "Mais certaines personnes ressentent encore un vide."
      },

      {
        type: "text",
        text: "Ethan Cole est l’une d’elles."
      },

      {
        type: "text",
        text: "Le jour de son arrivée au Black Hollow Institute, il découvre une clé étrange."
      },

      {
        type: "text",
        text: "Et un carnet contenant des messages qui semblent lui être destinés."
      },

      {
        type: "text",
        text: "Pendant ce temps, Clara Weiss enquête sur la disparition de son père."
      },

      {
        type: "text",
        text: "Un homme que personne ne se souvient avoir connu."
      },

      {
        type: "text",
        text: "Personne… sauf elle."
      },

      {
        type: "text",
        text: "Leur enquête va les mener vers une organisation ancienne appelée : La Main Noire."
      },

      {
        type: "text",
        text: "Cinq dirigeants mystérieux appelés les Pacificateurs."
      },

      {
        type: "text",
        text: "Mais derrière eux se cache une entité bien plus ancienne."
      },

      {
        type: "text",
        text: "Un nom oublié par l’histoire."
      },

      {
        type: "text",
        text: "Morrow."
      },

      {
        type: "text",
        text: "Une entité capable d’effacer les concepts eux-mêmes."
      }

    ],

    likes: [],
    comments: [],
    shares: []
  };

  const docRef = await addStory(story);

  console.log("Story publiée avec ID :", docRef.id);
};

publishConceptsStory();