import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import FilmList from "./components/FilmList";
import NavBar from "./components/Navbar";
import HomeScreen from "./components/HomeScreen"; // NEW

function App() {
  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // View mode (persist user choice)
  const [viewMode, setViewMode] = useState(() => (
    localStorage.getItem("viewMode") || "large"
  ));
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // Filters
  const [filters, setFilters] = useState({
    minYear: "",
    maxYear: "",
    minRating: "",
    director: "",
    genres: [],
    languages: [],
    tropes: []
  });

  // Panels & loading
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Home vs Results
  const [isHome, setIsHome] = useState(true);

  useEffect(() => { getFilms(); }, []);

  useEffect(() => {
    applyFilters();
  }, [films, searchQuery, filters]);

  // Leave Home automatically if the user types or applies any filter
  const activeFilterCount = Object.entries(filters).reduce((count, [, v]) => {
    if (Array.isArray(v)) return count + (v.length ? 1 : 0);
    return count + (v !== "" ? 1 : 0);
  }, 0);

  useEffect(() => {
    const hasQuery = searchQuery.trim().length > 0;
    const hasFilters = activeFilterCount > 0;
    if (hasQuery || hasFilters) setIsHome(false);
  }, [searchQuery, activeFilterCount]);

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
      setFilms([]);
      setFilteredFilms([]);
    } else {
      // Flatten nested relations for easier use
      const transformed = (data || []).map(film => ({
        ...film,
        genres: film.film_genres?.map(fg => fg.genres) || [],
        languages: film.film_languages?.map(fl => fl.languages) || [],
        tropes: film.film_tropes?.map(ft => ft.tropes) || []
      }));
      setFilms(transformed);
      setFilteredFilms(transformed);
    }
    setLoading(false);
  }

  function applyFilters() {
    let results = [...films];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(f =>
        f.name?.toLowerCase().includes(q) ||
        f.director?.toLowerCase().includes(q)
      );
    }

    // Year
    if (filters.minYear) results = results.filter(f => f.year >= parseInt(filters.minYear));
    if (filters.maxYear) results = results.filter(f => f.year <= parseInt(filters.maxYear));

    // Rating
    if (filters.minRating) results = results.filter(f => (f.imdb_rating ?? 0) >= parseFloat(filters.minRating));

    // Director
    if (filters.director) {
      const dq = filters.director.toLowerCase();
      results = results.filter(f => f.director?.toLowerCase().includes(dq));
    }

    // Genres
    if (filters.genres?.length) {
      results = results.filter(f =>
        filters.genres.every(g => f.genres.some(fg => fg.id === g.id))
      );
    }

    // Languages
    if (filters.languages?.length) {
      results = results.filter(f =>
        filters.languages.every(l => f.languages.some(fl => fl.id === l.id))
      );
    }

    // Tropes
    if (filters.tropes?.length) {
      results = results.filter(f =>
        filters.tropes.every(t => f.tropes.some(ft => ft.id === t.id))
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
      tropes: []
    });
  }

  function handleFilterChange(field, value) {
    setFilters(prev => ({ ...prev, [field]: value }));
  }

  // --- Home interactions ---

  function handleLogoClick() {
    setIsHome(true);
    setShowFilters(false);
    setSearchQuery("");
    clearFilters();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePickGenre(genre) {
    setFilters(prev => ({ ...prev, genres: [genre] }));
    setIsHome(false);
  }

  function handlePickTrope(trope) {
    setFilters(prev => ({ ...prev, tropes: [trope] }));
    setIsHome(false);
  }

  function handleBrowseAll() {
    clearFilters();
    setIsHome(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading films…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Make sure Navbar calls onLogoClick when the logo is pressed */}
      <NavBar onLogoClick={handleLogoClick} />

      <div className="max-w-6xl mx-auto mt-6">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFilterCount={activeFilterCount}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Keep the panel toggleable on both Home and Results */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          isVisible={showFilters}
        />

        {/* Home vs Results */}
        {isHome ? (
          <HomeScreen
            films={films}
            onPickGenre={handlePickGenre}
            onPickTrope={handlePickTrope}
            onBrowseAll={handleBrowseAll}
          />
        ) : (
          <FilmList
            films={filteredFilms}
            onClearFilters={clearFilters}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;
