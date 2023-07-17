import React, { createContext, useState, useEffect } from "react";
import { makeRequest } from "../utils/makeRequest.js";

export const PodcastsContext = createContext();

export const PodcastsProvider = ({ children }) => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const URL = "/toppodcasts/limit=100/json";
  const localStorageKey = "podcastsData";
  const localStorageTimestampKey = "podcastsDataTimestamp";
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const lastRequestTimestamp = localStorage.getItem(localStorageTimestampKey);
    const now = Date.now();

    if (
      !lastRequestTimestamp ||
      now - lastRequestTimestamp > oneDayInMilliseconds
    ) {
      fetchPodcastsData();
    } else {
      const storedPodcastsData = JSON.parse(
        localStorage.getItem(localStorageKey)
      );
      setPodcasts(storedPodcastsData);
      setLoading(false);
    }
  }, []);

  const fetchPodcastsData = () => {
    makeRequest
      .get(URL)
      .then((response) => {
        const data = response.data;
        const podcastsData = data.feed.entry.map((entry) => ({
          id: entry.id.attributes["im:id"],
          title: entry["im:name"].label,
          author: entry["im:artist"].label,
          image: entry["im:image"][0].label,
        }));
        setPodcasts(podcastsData);
        setLoading(false);
        setError(false);

        // Data and timestamp save
        localStorage.setItem(localStorageKey, JSON.stringify(podcastsData));
        localStorage.setItem(localStorageTimestampKey, Date.now());
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
        console.error(`Error al obtener los datos del feed: ${error.message}`);
      });
  };

  return (
    <PodcastsContext.Provider value={{ podcasts, loading, error }}>
      {children}
    </PodcastsContext.Provider>
  );
};
