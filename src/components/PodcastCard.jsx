import { Link } from "react-router-dom";

const PodcastCard = ({ podcast }) => {
  const { id, author, image, title } = podcast;
  return (
    <Link className="podcast__card shadow" to={`/podcast/${id}`}>
      <article>
        <div className="heading">
          <img src={image} alt="Mujer" />
        </div>
        <div className="description">
          <h3>{title}</h3>
          <h5>Author: {author}</h5>
        </div>
      </article>
    </Link>
  );
};

export default PodcastCard;
