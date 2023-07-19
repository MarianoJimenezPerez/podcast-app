import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../utils/makeRequest.js";
import Header from "../components/Header";
import { formatDate } from "../utils/formatDate.js";
import { Link } from "react-router-dom";
import { transformHtmlToText } from "../utils/transformHtmlToText.js";
import usePodcastData from "../hooks/usePodcastData.jsx";

const Podcast = () => {
  const { podcastDetails, loading, error, hasPodcastDetails, hasEpisodes } =
    usePodcastData();

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
