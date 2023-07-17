import PodcastCard from "./PodcastCard";

const PodcastsList = () => {
  return (
    <section className="podcasts__list">
      <div className="container">
        <PodcastCard />
        <PodcastCard />
        <PodcastCard />
        <PodcastCard />
        <PodcastCard />
      </div>
    </section>
  );
};

export default PodcastsList;
