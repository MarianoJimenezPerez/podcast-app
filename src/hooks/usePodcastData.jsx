import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../utils/makeRequest.js";
import { transformHtmlToText } from "../utils/transformHtmlToText.js";
import { formatDate } from "../utils/formatDate.js";

const usePodcastData = () => {
  const { podcastId } = useParams();
  const [podcastDetails, setPodcastDetails] = useState(null);
  const [hasEpisodes, setHasEpisodes] = useState(false);
  const [hasPodcastDetails, setHasPodcastDetails] = useState(false);
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

  const checkLocalStorage = () => {
    const storedPodcastDetails = localStorage.getItem(podcastId);
    if (storedPodcastDetails) {
      const parsedPodcastDetails = JSON.parse(storedPodcastDetails);
      const timestamp = parsedPodcastDetails.timestamp;
      const now = new Date().getTime();
      const oneDayInMillis = 24 * 60 * 60 * 1000;

      if (now - timestamp < oneDayInMillis) {
        setPodcastDetails(parsedPodcastDetails);
        setHasPodcastDetails(true);
        setLoading(false);
        return true;
      }
    }
    return false;
  };

  const fetchPodcastDetails = () => {
    makeRequest
      .get(URL)
      .then(async (response) => {
        const data = response.data;
        const podcastDetailsData = {
          title: data.results[0].collectionName,
          author: data.results[0].artistName,
          image: getPodcastImage(),
          episodes: data.results[0].feedUrl,
          timestamp: new Date().getTime(),
        };
        try {
          const res = await fetch(podcastDetailsData.episodes);
          const feedData = await res.text();

          if (window.DOMParser) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(feedData, "text/xml");

            const desc = xmlDoc.getElementsByTagName("description");

            podcastDetailsData.description = transformHtmlToText(
              desc[0].textContent
            );
          }
        } catch (error) {
          console.error("Error al obtener los episodios del podcast:", error);
        }
        setPodcastDetails(podcastDetailsData);
        setLoading(false);
        setError(false);
        setHasPodcastDetails(true);

        localStorage.setItem(podcastId, JSON.stringify(podcastDetailsData));
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
    const storedPodcastDetails = checkLocalStorage();
    if (!storedPodcastDetails) {
      fetchPodcastDetails();
    }
  }, [podcastId]);

  useEffect(() => {
    fetchPodcastEpisodes();
  }, [hasPodcastDetails]);

  return {
    podcastDetails,
    loading,
    error,
    hasPodcastDetails,
    hasEpisodes,
  };
};

export default usePodcastData;
