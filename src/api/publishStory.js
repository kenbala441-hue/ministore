export const publierStory = async (storyData) => {
  const response = await fetch("http://localhost:4000/story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(storyData)
  });

  const data = await response.json();
  console.log(data);
};