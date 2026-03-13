import { getStories } from "../src/firebase/stories.js";

async function countStories() {
  const stories = await getStories();
  console.log("Nombre de stories / chapitres :", stories.length);
}

countStories();