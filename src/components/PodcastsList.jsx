import React, { useState, useContext, useEffect } from "react";
import { PodcastsContext } from "./../contexts/PodcastsContext";
import PodcastCard from "./PodcastCard";
import SearchBar from "./SearchBar";

const PodcastsList = () => {
  const { podcasts, loading, error } = useContext(PodcastsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
              {searchResults.map((podcast) => (
                <PodcastCard podcast={podcast} key={podcast.id} />
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default PodcastsList;
