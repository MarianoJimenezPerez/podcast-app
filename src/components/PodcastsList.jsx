import React, { useState, useContext, useEffect } from "react";

import { animated, useTrail } from "@react-spring/web";

import { PodcastsContext } from "./../contexts/PodcastsContext";
import PodcastCard from "./PodcastCard";
import SearchBar from "./SearchBar";

const PodcastsList = () => {
  const { podcasts, loading, error } = useContext(PodcastsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [showCards, setShowCards] = useState(false);

  const trail = useTrail(searchResults.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: showCards ? 1 : 0,
    x: showCards ? 0 : 40,
    height: showCards ? 110 : 0,
    from: { opacity: 0, x: 40, height: 0 },
    delay: 200, // Delay inicial antes de que comience la animación.
  });

  useEffect(() => {
    setShowCards(true);
  }, [searchResults]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [podcasts, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filteredPodcasts = podcasts.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(term.toLowerCase()) ||
        podcast.author.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filteredPodcasts);
  };

  return (
    <>
    <SearchBar onSearch={handleSearch} searchResults={searchResults} />
    <section className="podcasts__list">
      <div className="container">
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>Se produjo un error al cargar los datos.</p>
        ) : searchResults.length === 0 ? (
          <p>No se encontraron podcasts.</p>
        ) : (
          <>
            {/* Utilizamos la animación aquí */}
            {trail.map((style, index) => (
              <animated.div key={searchResults[index].id} style={style}>
                <PodcastCard podcast={searchResults[index]} />
              </animated.div>
            ))}
          </>
        )}
      </div>
    </section>
  </>
  );
};

export default PodcastsList;
