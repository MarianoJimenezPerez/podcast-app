import { useEffect, useState } from "react";
import { makeRequest } from "./../utils/makeRequest.js";
import PodcastCard from "./PodcastCard";

const PodcastsList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const URL = "/toppodcasts/limit=100/json";

  useEffect(() => {
    setLoading(true);
    makeRequest
      .get(URL)
      .then((response) => {
        const data = response.data;
        const podcastsData = data.feed.entry.map((entry) => ({
          title: entry["im:name"].label,
          author: entry["im:artist"].label,
          image: entry["im:image"][0].label,
        }));
        setPodcasts(podcastsData);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        console.error(`Error al obtener los datos del feed: ${error.message}`);
        setLoading(false);
      });
  }, []);

  return (
    <section className="podcasts__list">
      <div className="container">
        {loading
          ? "Cargando..."
          : error
          ? "Se produjo un error al cargar los datos."
          : podcasts.length === 0
          ? "No se encontraron podcasts."
          : podcasts.map((podcast, index) => (
              <PodcastCard podcast={podcast} key={index} />
            ))}
      </div>
    </section>
  );
};

export default PodcastsList;
