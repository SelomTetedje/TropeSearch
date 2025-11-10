import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import FilmList from "./components/FilmList";
import NavBar from "./components/Navbar";

function App() {
  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Start in large view (change to "compact" if you prefer) and persist choice
  const [viewMode, setViewMode] = useState(() => (
    localStorage.getItem("viewMode") || "large"
  ));
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const [filters, setFilters] = useState({
    minYear: "",
    maxYear: "",
    minRating: "",
    director: "",
    genres: [],
    languages: [],
    tropes: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [films, searchQuery, filters]);

  async function getFilms() {
    setLoading(true);
    const { data, error } = await supabase
      .from("films")
      .select(`
        *,
        film_genres(genre_id, genres(id, name)),
        film_languages(language_id, languages(id, name)),
        film_tropes(trope_id, tropes(id, name))
      `)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching films:", error);
    } else {
      const transformedData =
        data?.map((film) => ({
          ...film,
          genres: film.film_genres?.map((fg) => fg.genres) || [],
          languages: film.film_languages?.map((fl) => fl.languages) || [],
          tropes: film.film_tropes?.map((ft) => ft.tropes) || [],
        })) || [];

      setFilms(transformedData);
      setFilteredFilms(transformedData);
    }
    setLoading(false);
  }

  function applyFilters() {
    let results = [...films];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (f) =>
          f.name?.toLowerCase().includes(q) ||
          f.director?.toLowerCase().includes(q)
      );
    }

    if (filters.minYear) results = results.filter((f) => f.year >= +filters.minYear);
    if (filters.maxYear) results = results.filter((f) => f.year <= +filters.maxYear);
    if (filters.minRating) results = results.filter((f) => f.imdb_rating >= +filters.minRating);

    if (filters.director) {
      const dq = filters.director.toLowerCase();
      results = results.filter((f) => f.director?.toLowerCase().includes(dq));
    }

    if (filters.genres?.length) {
      results = results.filter((f) =>
        filters.genres.every((g) => f.genres.some((fg) => fg.id === g.id))
      );
    }

    if (filters.languages?.length) {
      results = results.filter((f) =>
        filters.languages.every((l) => f.languages.some((fl) => fl.id === l.id))
      );
    }

    if (filters.tropes?.length) {
      results = results.filter((f) =>
        filters.tropes.every((t) => f.tropes.some((ft) => ft.id === t.id))
      );
    }

    setFilteredFilms(results);
  }

  function clearFilters() {
    setSearchQuery("");
    setFilters({
      minYear: "",
      maxYear: "",
      minRating: "",
      director: "",
      genres: [],
      languages: [],
      tropes: [],
    });
  }

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  const activeFilterCount = Object.entries(filters).reduce((count, [, v]) => {
    if (Array.isArray(v)) return count + (v.length ? 1 : 0);
    return count + (v !== "" ? 1 : 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading films...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <div className="max-w-6xl mx-auto">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFilterCount={activeFilterCount}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          isVisible={showFilters}
        />

        <FilmList
          films={filteredFilms}
          onClearFilters={clearFilters}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}

export default App;
