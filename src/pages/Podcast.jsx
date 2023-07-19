import React from "react";
import Header from "../components/Header";

import { animated } from "@react-spring/web";
import { bounceInLeft, bounceInRight } from "../utils/springAnimations";

import { Link } from "react-router-dom";
import usePodcastData from "../hooks/usePodcastData.jsx";

const Podcast = () => {
  const { podcastDetails, loading, error, hasEpisodes } = usePodcastData();

  const sidebarAnim = bounceInLeft();
  const episodesSectionAnim = bounceInRight();

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
              <animated.div className="sidebar shadow" style={sidebarAnim}>
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
              </animated.div>
              <animated.div
                className="episodes__section"
                style={episodesSectionAnim}
              >
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
              </animated.div>
            </>
          ) : null}
        </section>
      </main>
    </>
  );
};

export default Podcast;
