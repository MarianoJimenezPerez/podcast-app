import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../utils/makeRequest.js";
import Header from "../components/Header";
import { formatDate } from "../utils/formatDate.js";
import { transformHtmlToText } from "../utils/transformHtmlToText.js";

const Episode = () => {
  const { podcastId, episodeId } = useParams();
  const [podcastDetails, setPodcastDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [episodeFetched, setEpisodeFetched] = useState(false);

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

  const fetchPodcastEpisode = async () => {
    try {
      const response = await fetch(podcastDetails.episodes);
      const feedData = await response.text();

      if (window.DOMParser) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(feedData, "text/xml");

        const tags = xmlDoc.getElementsByTagName("item");

        const processedEpisodes = [];

        for (let i = 0; i < tags.length; i++) {
          const item = tags[i];
          const guid = item.getElementsByTagName("guid")[0].textContent;
          if (guid === episodeId) {
            const title = item.getElementsByTagName("title")[0].textContent;
            const description =
              item.getElementsByTagName("description")[0].textContent;

            const enclosureTag = item.getElementsByTagName("enclosure")[0];
            let enclosure = enclosureTag
              ? enclosureTag.getAttribute("url")
              : null;

            processedEpisodes.push({
              guid: guid,
              title: title,
              description: transformHtmlToText(description),
              enclosure: enclosure,
            });
          }
        }

        setPodcastDetails((prevDetails) => ({
          ...prevDetails,
          episodes: processedEpisodes,
        }));
        setEpisodeFetched(true); // Set the flag to true after fetching episode data
      }
    } catch (error) {
      console.error("Error al obtener los episodios del podcast:", error);
    }
  };

  useEffect(() => {
    fetchPodcastDetails();
  }, []);

  useEffect(() => {
    if (podcastDetails && podcastDetails.episodes && !episodeFetched) {
      // Only run if episodes are available and not fetched yet
      fetchPodcastEpisode();
    }
    console.log(podcastDetails);
  }, [podcastDetails, episodeFetched]);

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
            <div className="sidebar shadow">
              <div>
                <img src={podcastDetails.image} alt={podcastDetails.title} />
              </div>
              <div>
                <h2>{podcastDetails.title}</h2>
                <h3>
                  by <i>{podcastDetails.author}</i>
                </h3>
                <p>
                  <span>Description: </span> {podcastDetails.description}
                </p>
              </div>
            </div>
          ) : null}
          {podcastDetails?.episodes ? (
            <div className="episodes__section">
              <div className="shadow">
                <h3>{podcastDetails.episodes[0].title}</h3>
                <p>{podcastDetails.episodes[0].description}</p>
                <audio controls autoPlay name="media" style={{width: "100%", marginTop: "1rem"}} >
                  <source
                    src={podcastDetails.episodes[0].enclosure}
                    type="audio/mpeg"
                  />
                  Tu navegador no soporta la reproducción de audio.
                </audio>
              </div>
            </div>
          ) : (
            <div>Error al cargar los episodios</div>
          )}
        </section>
      </main>
    </>
  );
};

export default Episode;
