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
    director: ""
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
      .select("*")
      .order("name", { ascending: true });
    
    if (error) {
      console.error("Error fetching films:", error);
    } else {
      setFilms(data || []);
      setFilteredFilms(data || []);
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

    setFilteredFilms(results);
  }

  function clearFilters() {
    setSearchQuery("");
    setFilters({
      minYear: "",
      maxYear: "",
      minRating: "",
      director: ""
    });
  }

  function handleFilterChange(field, value) {
    setFilters(prev => ({ ...prev, [field]: value }));
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

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