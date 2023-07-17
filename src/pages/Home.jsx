import Header from "../components/Header";
import PodcastsList from "../components/PodcastsList";
import SearchBar from "../components/SearchBar";

const Home = () => {
  return (
    <main>
      <Header />
      <SearchBar />
      <PodcastsList />
    </main>
  );
};

export default Home;
