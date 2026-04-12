// Exemple de structure pour un item de la liste
const NewArrivalItem = ({ story }) => (
  <div className="new-arrival-card">
    <img src={story.coverUrl} alt={story.title} className="story-thumbnail" />
    <div className="story-details">
      <span className="genre-tag">{story.genre}</span>
      <h3>{story.title}</h3>
      <p className="update-info">Nouveau Chapitre : {story.lastChapter}</p>
    </div>
    <div className="badge-new">NEW</div>
  </div>
);
