import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";

const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const endpoint = query ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies.");
      }

      const data = await response.json();
      console.log(data);
      setMovies(data.results);
    }
    catch (error) {
      setError("Error fetching movies: Please try again later.");
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>


        <section className="all-movies">
          <h2 className="mt-5">All Movies</h2>

          {
            loading ? (
              <p className="text-white">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul>
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )
          }
        </section>
      </div>
    </main>
  );
};

export default App;