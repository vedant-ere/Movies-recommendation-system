import { useEffect, useState } from "react";
import Search from "./components/Search";

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

  const fecthMovieData = async () => {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()
    } catch (error) {
      console.log(`Error fetching movies ${error}`);
      setErrorMessage(`Error fetching movies. Please try again later`)
    }
  };
  useEffect(() => {
    fecthMovieData
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
        <div>
          <h2 className="text-red-500">{errorMessage}</h2>
        </div>
      </div>
    </main>
  );
}

export default App;
