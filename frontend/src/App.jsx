import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import FilmList from "./components/FilmList";
import NavBar from "./components/Navbar";
import HomeScreen from "./components/HomeScreen";
import { getCacheItem, setCacheItem } from "./utils/cache";

const ITEMS_PER_PAGE = 20;

function App() {
  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // View mode
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
    maxRating: "",
    minRuntime: "",
    maxRuntime: "",
    director: "",
    genres: [],
    languages: [],
    tropes: []
  });

  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHome, setIsHome] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { getFilms(); }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to first page when filters change
  }, [films, searchQuery, filters]);

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

    const CACHE_KEY = "films_data";
    const cachedFilms = getCacheItem(CACHE_KEY);

    if (cachedFilms) {
      console.log("Loading films from cache");
      setFilms(cachedFilms);
      setFilteredFilms(cachedFilms);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("films")
      .select(`
        id,
        name,
        year,
        runtime,
        imdb_rating,
        poster_url,
        director,
        film_genres(genre_id, genres(id, name)),
        film_languages(language_id, languages(id, name)),
        film_tropes(trope_id, tropes(id, name))
      `)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching films:", error);
      setError("Unable to connect to database. Please check your internet connection and refresh.");
      setFilms([]);
      setFilteredFilms([]);
    } else {
      setError(null);
      const transformed = (data || []).map(film => ({
        ...film,
        genres: film.film_genres?.map(fg => fg.genres) || [],
        languages: film.film_languages?.map(fl => fl.languages) || [],
        tropes: film.film_tropes?.map(ft => ft.tropes) || [],
      }));

      setFilms(transformed);
      setFilteredFilms(transformed);

      setCacheItem(CACHE_KEY, transformed, 30);
      console.log("Films cached for 30 minutes");
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
    if (filters.maxRating) results = results.filter(f => (f.imdb_rating ?? 0) <= parseFloat(filters.maxRating));

    // Runtime
    if (filters.minRuntime) {
      const minRuntime = parseInt(filters.minRuntime);
      results = results.filter(f => f.runtime && f.runtime >= minRuntime);
    }
    if (filters.maxRuntime) {
      const maxRuntime = parseInt(filters.maxRuntime);
      results = results.filter(f => f.runtime && f.runtime <= maxRuntime);
    }

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
      maxRating: "",
      minRuntime: "",
      maxRuntime: "",
      director: "",
      genres: [],
      languages: [],
      tropes: []
    });
    setCurrentPage(1);
  }

  function handleFilterChange(field, value) {
    setFilters(prev => ({ ...prev, [field]: value }));
  }

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

  // Pagination
  const totalPages = Math.ceil(filteredFilms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFilms = filteredFilms.slice(startIndex, endIndex);

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1C1C1C' }}>
        <div className="text-xl" style={{ color: '#999999' }}>Loading films…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      <NavBar onLogoClick={handleLogoClick} />

      <div className="max-w-6xl mx-auto mt-6 pb-16">
        {error && (
          <div className="mx-4 mb-4 p-4 border rounded-lg" style={{ backgroundColor: '#3B3B3B', borderColor: '#EFDB00', color: '#FFFFFF' }}>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 rounded text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#EFDB00', color: '#1C1C1C' }}
            >
              Reload Page
            </button>
          </div>
        )}

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFilterCount={activeFilterCount}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFiltersPanel={showFilters}
        />

        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          isVisible={showFilters}
        />

        {isHome ? (
          <HomeScreen
            films={films}
            onPickGenre={handlePickGenre}
            onPickTrope={handlePickTrope}
            onBrowseAll={handleBrowseAll}
          />
        ) : (
          <FilmList
            films={paginatedFilms}
            totalFilms={filteredFilms.length}
            onClearFilters={clearFilters}
            viewMode={viewMode}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;