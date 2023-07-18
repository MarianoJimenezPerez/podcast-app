import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../utils/makeRequest.js";
import Header from "../components/Header";
import { formatDate } from "../utils/formatDate.js";
import { Link } from "react-router-dom";

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

      if (window.DOMParser) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(feedData, "text/xml");

        const tags = xmlDoc.getElementsByTagName("item");

        const processedEpisodes = [];

        for (let i = 0; i < tags.length; i++) {
          const item = tags[i];
          const guid = item.getElementsByTagName("guid")[0].textContent;
          const title = item.getElementsByTagName("title")[0].textContent;
          const description =
            item.getElementsByTagName("description")[0].textContent;
          const pubDate = item.getElementsByTagName("pubDate")[0].textContent;
          const duration =
            item.getElementsByTagName("itunes:duration")[0].textContent;

          processedEpisodes.push({
            guid: guid,
            title: title,
            description: description,
            pubDate: formatDate(pubDate),
            duration: duration,
          });
        }

        setPodcastDetails((prevDetails) => ({
          ...prevDetails,
          episodes: processedEpisodes,
        }));

        setHasEpisodes(true);
      }
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
                        {podcastDetails?.episodes?.map((episode, index) => (
                          <tr key={index}>
                            <td>
                              <Link to={`./episode/${episode.guid}`}>
                                {episode.title}
                              </Link>
                            </td>
                            <td>{episode.pubDate}</td>
                            <td>{episode.duration}</td>
                          </tr>
                        ))}
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
