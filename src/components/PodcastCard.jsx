const PodcastCard = ({ podcast }) => {
  const { author, image, title } = podcast;
  return (
    <div className="podcast__card">
      <div className="heading">
        <img src={image} alt="Mujer" />
      </div>
      <div className="description">
        <h3>{title}</h3>
        <h5>Author: {author}</h5>
      </div>
    </div>
  );
};

export default PodcastCard;
