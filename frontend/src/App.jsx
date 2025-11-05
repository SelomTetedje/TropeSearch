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
      // Transform the data to include nested relations in a more usable format
      const transformedData = data?.map(film => ({
        ...film,
        genres: film.film_genres?.map(fg => fg.genres) || [],
        languages: film.film_languages?.map(fl => fl.languages) || [],
        tropes: film.film_tropes?.map(ft => ft.tropes) || []
      })) || [];

      setFilms(transformedData);
      setFilteredFilms(transformedData);
    }
    setLoading(false);
  }

  function applyFilters() {
    let results = [...films];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(film => 
        film.name?.toLowerCase().includes(query) ||
        film.director?.toLowerCase().includes(query)
      );
    }

    // Year range filter
    if (filters.minYear) {
      results = results.filter(film => film.year >= parseInt(filters.minYear));
    }
    if (filters.maxYear) {
      results = results.filter(film => film.year <= parseInt(filters.maxYear));
    }

    // Rating filter
    if (filters.minRating) {
      results = results.filter(film => film.imdb_rating >= parseFloat(filters.minRating));
    }

    // Director filter
    if (filters.director) {
      const directorQuery = filters.director.toLowerCase();
      results = results.filter(film => 
        film.director?.toLowerCase().includes(directorQuery)
      );
    }

    // Genre filter
    if (filters.genres && filters.genres.length > 0) {
      results = results.filter(film =>
        filters.genres.every(selectedGenre =>
          film.genres.some(filmGenre => filmGenre.id === selectedGenre.id)
        )
      );
    }

    // Language filter
    if (filters.languages && filters.languages.length > 0) {
      results = results.filter(film =>
        filters.languages.every(selectedLanguage =>
          film.languages.some(filmLanguage => filmLanguage.id === selectedLanguage.id)
        )
      );
    }

    // Trope filter
    if (filters.tropes && filters.tropes.length > 0) {
      results = results.filter(film =>
        filters.tropes.every(selectedTrope =>
          film.tropes.some(filmTrope => filmTrope.id === selectedTrope.id)
        )
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

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (Array.isArray(value)) {
      return count + (value.length > 0 ? 1 : 0);
    }
    return count + (value !== "" ? 1 : 0);
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
        />
      </div>
    </div>
  );
}

export default App;