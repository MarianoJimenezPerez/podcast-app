import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../utils/makeRequest.js";
import Header from "../components/Header";
import parse from "xml-parser";

const Podcast = () => {
  const { podcastId } = useParams();
  const [podcastDetails, setPodcastDetails] = useState(null);
  const [hasEpisodes, setHasEpisodes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const URL = `/lookup?id=${podcastId}`;

  const getPodcastImage = () => {
    const storedPodcasts = localStorage.getItem("podcastsData");
    if (storedPodcasts) {
      const podcastsData = JSON.parse(storedPodcasts);
      const found = podcastsData.find((el) => el.id === podcastId);
      if (found) {
        return found.image;
      }
    }
    return null;
  };

  const fetchPodcastDetails = () => {
    makeRequest
      .get(URL)
      .then((response) => {
        const data = response.data;
        const podcastDetailsData = {
          title: data.results[0].collectionName,
          author: data.results[0].artistName,
          description: data.results[0].collectionDescription,
          image: getPodcastImage(),
          episodes: data.results[0].feedUrl,
        };
        setPodcastDetails(podcastDetailsData);
        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
        console.error(
          `Error al obtener los detalles del podcast: ${error.message}`
        );
      });
  };

  const fetchPodcastEpisodes = async () => {
    try {
      const response = await fetch(podcastDetails.episodes);
      const feedData = await response.text();
  
      const parsedFeed = await parse(feedData);
      console.log(parsedFeed)
      const episodes = parsedFeed.root.children.filter((node) => node.name === "item");
      const processedEpisodes = episodes.map((episode) => ({
        title: episode.children.find((node) => node.name === "itunes:title").content,
        releaseDate: episode.children.find((node) => node.name === "pubDate").content,
        duration: episode.children.find((node) => node.name === "itunes:duration").content,
      }));
  
      setPodcastDetails((prevDetails) => ({
        ...prevDetails,
        episodes: processedEpisodes,
      }));
      
      console.log(processedEpisodes)
      setHasEpisodes(true);
    } catch (error) {
      console.error("Error al obtener los episodios del podcast:", error);
    }
  };

  useEffect(() => {
    fetchPodcastDetails();
  }, [podcastId]);

  useEffect(() => {
    if (podcastDetails && podcastDetails.episodes && !hasEpisodes) {
      fetchPodcastEpisodes();
    }
  }, [podcastDetails, hasEpisodes]);

  return (
    <>
      <Header />
      <main className="container">
        <section className="podcast__details">
          {loading ? (
            "Cargando..."
          ) : error ? (
            "Se produjo un error al cargar los datos."
          ) : podcastDetails ? (
            <>
              <div className="sidebar shadow">
                <img src={podcastDetails.image} alt={podcastDetails.title} />
                <h2>{podcastDetails.title}</h2>
                <h3>
                  by <i>{podcastDetails.author}</i>
                </h3>
                <p>
                  <span>Description: </span> {podcastDetails.description}
                </p>
              </div>
              <div className="episodes__section">
                <h3 className="shadow">
                  Episodios:{" "}
                  {hasEpisodes ? podcastDetails.episodes.length : "Cargando..."}
                </h3>
                {hasEpisodes && (
                  <div className="shadow">
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Date</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                       {/*  {podcastDetails.episodes.map((episode, index) => (
                          <tr key={index}>
                            <td>{episode.title}</td>
                            <td>{episode.releaseDate}</td>
                            <td>{episode.duration} ms</td>
                          </tr>
                        ))} */}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </section>
      </main>
    </>
  );
};

export default Podcast;
