import { X } from "lucide-react";
import { fetchGenres, fetchLanguages, fetchTropes } from "../services/filters";
import { useEffect, useState } from "react";
import FilterBox from "./FilterBox";

export default function FilterPanel({ filters, onFilterChange, onClearFilters, isVisible }) {
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [tropes, setTropes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [genresData, languagesData, tropesData] = await Promise.all([
          fetchGenres(),
          fetchLanguages(),
          fetchTropes()
        ]);
        setGenres(genresData);
        setLanguages(languagesData);
        setTropes(tropesData);
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFilterData();
  }, []);

  if (!isVisible) return null;

  const renderFilterBoxes = () => {
    if (loading) {
      return (
        <div className="col-span-full flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      );
    }
    return (
      <>
        <div className="md:col-span-4">
          <FilterBox
            title="Genres"
            items={genres}
            selectedItems={filters.genres || []}
            onItemToggle={(genre) => {
              const currentGenres = filters.genres || [];
              const newGenres = currentGenres.some(g => g.id === genre.id)
                ? currentGenres.filter(g => g.id !== genre.id)
                : [...currentGenres, genre];
              onFilterChange("genres", newGenres);
            }}
            placeholder="Search genres..."
          />
        </div>

        <div className="md:col-span-4">
          <FilterBox
            title="Languages"
            items={languages}
            selectedItems={filters.languages || []}
            onItemToggle={(language) => {
              const currentLanguages = filters.languages || [];
              const newLanguages = currentLanguages.some(l => l.id === language.id)
                ? currentLanguages.filter(l => l.id !== language.id)
                : [...currentLanguages, language];
              onFilterChange("languages", newLanguages);
            }}
            placeholder="Search languages..."
          />
        </div>

        <div className="md:col-span-4">
          <FilterBox
            title="Tropes"
            items={tropes}
            selectedItems={filters.tropes || []}
            onItemToggle={(trope) => {
              const currentTropes = filters.tropes || [];
              const newTropes = currentTropes.some(t => t.id === trope.id)
                ? currentTropes.filter(t => t.id !== trope.id)
                : [...currentTropes, trope];
              onFilterChange("tropes", newTropes);
            }}
            placeholder="Search tropes..."
          />
        </div>
      </>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm hover:text-gray-200 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/*Year*/}
        <div className="md:col-span-3 gap-4">
          <h3 className="text-lg font-semibold mb-2">Year</h3>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              placeholder="1900"
              value={filters.minYear}
              onChange={(e) => onFilterChange("minYear", e.target.value)}
              className="w-24 px-3 py-1.5 bg-gray-700 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="2024"
              value={filters.maxYear}
              onChange={(e) => onFilterChange("maxYear", e.target.value)}
              className="w-24 px-3 py-1.5 bg-gray-700 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        {/*Rating*/}
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold mb-2">Minimum Rating</h3>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            placeholder="0.0"
            value={filters.minRating}
            onChange={(e) => onFilterChange("minRating", e.target.value)}
            className="w-24 px-3 py-1.5 bg-gray-700 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/*Director*/}
        <div className="md:col-span-6">
          <h3 className="text-lg font-semibold mb-2">Director</h3>
          <input
            type="text"
            placeholder="Search director..."
            value={filters.director}
            onChange={(e) => onFilterChange("director", e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-700 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Filter Boxes */}
        {renderFilterBoxes()}
      </div>
    </div>
  );
}