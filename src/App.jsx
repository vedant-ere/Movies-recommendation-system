import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "use-debounce";
import { Listbox } from "@headlessui/react";

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
  const [deBouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      const endpoint = `${API_BASE_URL}/genre/movie/list`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      setGenres(data.genres);
      console.log(data.genres);
    };
    fetchGenres();
  }, []);

  const fecthMovieData = async (query = "", genreId = "") => {
    setisLoading(true);
    setErrorMessage("");

    try {
      let endpoint = "";

      if (query) {
        endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
          query
        )}`;
        console.log(endpoint);
      } else if (genreId) {
        endpoint = `${API_BASE_URL}/discover/movie?with_genres=${genreId}`;
        console.log(endpoint);
      } else {
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        console.log(endpoint);
      }
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

  //? Wrong behaviour written only for learning
  //   const searchMovies = async (query) => {
  //     try {
  //       const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;
  //       const response = await fetch(endpoint, API_OPTIONS);

  //       const data = await response.json();
  //       if (data.response == "False") {
  //         setErrorMessage(data.Error || "Failed to fetch Movies");
  //         setMoviesList([]);
  //         return;
  //       }
  //       setMoviesList(data.results);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  useEffect(() => {
    fecthMovieData(deBouncedSearchTerm);
  }, [deBouncedSearchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      fecthMovieData("", selectedGenre);
    }
  }, [selectedGenre]);
  //? Same functionality without any external library
  // useEffect(() => {
  //   if(!searchTerm) return;
  //   const delayDebounce = setTimeout(() => {
  //     fecthMovieData(searchTerm)
  //   }, 1000)

  //   return () => clearTimeout(delayDebounce)
  // }, [searchTerm])

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

          <Listbox value={selectedGenre} onChange={setSelectedGenre}>
            <div className="relative">
              <Listbox.Button className="relative w-[200px] cursor-default bg-gray-800 text-white rounded-md py-2 pl-3 pr-10 text-left">
                {selectedGenre
                  ? genres.find((g) => g.id === +selectedGenre)?.name
                  : "All Genres"}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg">
                <Listbox.Option value="">
                  {({ active }) => (
                    <li
                      className={`px-4 py-2 ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`}
                    >
                      All Genres
                    </li>
                  )}
                </Listbox.Option>
                {genres.map((genre) => (
                  <Listbox.Option key={genre.id} value={genre.id}>
                    {({ active }) => (
                      <li
                        className={`px-4 py-2 ${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        }`}
                      >
                        {genre.name}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <p className="text-white">
              <Spinner></Spinner>
            </p>
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
