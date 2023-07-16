import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.scss";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound";
import Podcast from "./pages/Podcast";
import Episode from "./pages/Episode";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="podcast/:podcastId">
          <Route path="episode/:episodeId" element={<Episode />} />
          <Route index element={<Podcast />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);