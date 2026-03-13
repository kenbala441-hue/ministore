import { addStory } from "../src/firebase/stories.js";
// ou ../src/firebase/stories.js si c'est là

const publierStory = async () => {
  const nouvelleStory = {
    title: "Story Test",
    description: "Ceci est un test",
    genre: "Action",
    authorId: "uid_test",
    coverImage: "https://res.cloudinary.com/dn9c4ctav/image/upload/f_auto,q_auto,w_800/v1772147595/1751816044094_fvqghc.png",
    pages: [
      { type: "text", text: "Première ligne du chapitre" },
      { type: "image", src: "https://tonlien.com/image1.png" }
    ],
    likes: [],
    comments: [],
    shares: [],
  };

  const docRef = await addStory(nouvelleStory);
  console.log("Story publiée avec ID :", docRef.id);
};

publierStory();