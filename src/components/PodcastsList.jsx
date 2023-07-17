import React, { useContext } from "react";
import { PodcastsContext } from "./../contexts/PodcastsContext";
import PodcastCard from "./PodcastCard";

const PodcastsList = () => {
  const { podcasts, loading, error } = useContext(PodcastsContext);

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
