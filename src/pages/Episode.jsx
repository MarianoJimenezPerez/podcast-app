import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { transformHtmlToText } from "../utils/transformHtmlToText.js";
import { Link, useParams } from "react-router-dom";
import usePodcastData from "../hooks/usePodcastData.jsx";

const Episode = () => {
  const { podcastDetails, loading, error } = usePodcastData();
  const [episodeDetails, setEpisodeDetails] = useState([]);

  const { episodeId } = useParams();

  useEffect(() => {
    const fetchPodcastEpisode = async () => {
      try {
        const response = await fetch(podcastDetails.episodes);
        const feedData = await response.text();

        if (window.DOMParser) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(feedData, "text/xml");

          const tags = xmlDoc.getElementsByTagName("item");

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

              setEpisodeDetails((prevDetails) => [
                ...prevDetails,
                {
                  guid: guid,
                  title: title,
                  description: transformHtmlToText(description),
                  enclosure: enclosure,
                },
              ]);
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener los episodios del podcast:", error);
      }
      console.log(episodeDetails);
    };
    fetchPodcastEpisode();
  }, [episodeId, podcastDetails]);

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
                <Link to={`../`}>
                  <img src={podcastDetails.image} alt={podcastDetails.title} />
                </Link>
              </div>
              <div>
                <Link to={`../`}>
                  <h2>{podcastDetails.title}</h2>
                </Link>
                <h3>
                  by{" "}
                  <Link to={`../`} style={{ fontStyle: "italic" }}>
                    {podcastDetails.author}
                  </Link>
                </h3>
                <p>
                  <span>Description: </span> {podcastDetails.description}
                </p>
              </div>
            </div>
          ) : null}
          {episodeDetails.length > 0 ? (
            <div className="episodes__section">
              <div className="shadow">
                <h3>{episodeDetails[0].title}</h3>
                <p>{episodeDetails[0].description}</p>
                <audio
                  controls
                  autoPlay
                  name="media"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  <source src={episodeDetails[0].enclosure} type="audio/mpeg" />
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
