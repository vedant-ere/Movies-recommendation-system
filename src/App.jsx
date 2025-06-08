import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";


const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSeachTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const fecthMovieData = async () => {
    setisLoading(true);

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      console.log(data);
      if (data.response == "False") {
        setErrorMessage(data.Error || "Failed to fetch Movies");
        setMoviesList([]);
        return;
      }
      setMoviesList(data.results);
    } catch (error) {
      console.log(`Error fetching movies ${error}`);
      setErrorMessage(`Error fetching movies. Please try again later`);
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    fecthMovieData();
  }, []);
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="" />
          <h1>
            Find <span className="text-gradient">Movies</span> You Enjoy without
            hassle
          </h1>
          <Search term={searchTerm} setSeachTerm={setSeachTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <p className="text-white"><Spinner></Spinner></p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
