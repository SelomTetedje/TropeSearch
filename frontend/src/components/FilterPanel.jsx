import { X } from "lucide-react";
import { useEffect, useState } from "react";
import FilterBox from "./FilterBox";
import { fetchGenres, fetchLanguages, fetchTropes } from "../services/filters";

export default function FilterPanel({ filters, onFilterChange, onClearFilters, isVisible }) {
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [tropes, setTropes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggles for each filter section
  const [enableTropes, setEnableTropes] = useState(true);
  const [enableLanguages, setEnableLanguages] = useState(true);
  const [enableGenres, setEnableGenres] = useState(true);
  const [enableYear, setEnableYear] = useState(true);
  const [enableRuntime, setEnableRuntime] = useState(true);
  const [enableRating, setEnableRating] = useState(true);

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [genresData, languagesData, tropesData] = await Promise.all([
          fetchGenres(),
          fetchLanguages(),
          fetchTropes(),
        ]);
        setGenres(genresData);
        setLanguages(languagesData);
        setTropes(tropesData);
      } catch (error) {
        console.error("Error loading filter data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFilterData();
  }, []);

  if (!isVisible) return null;

  const handleClearAll = () => {
    onFilterChange("genres", []);
    onFilterChange("languages", []);
    onFilterChange("tropes", []);
    onFilterChange("minYear", "");
    onFilterChange("maxYear", "");
    onFilterChange("minRuntime", "");
    onFilterChange("maxRuntime", "");
    onFilterChange("minRating", 1);
    onFilterChange("maxRating", 10);

    setEnableTropes(false);
    setEnableLanguages(false);
    setEnableGenres(false);
    setEnableYear(false);
    setEnableRuntime(false);
    setEnableRating(false);
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-yellow-400">Filters</h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1"
        >
          <X className="w-4 h-4" /> Clear all
        </button>
      </div>

      {/* Tropes */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={enableTropes}
            onChange={(e) => setEnableTropes(e.target.checked)}
            className="accent-yellow-500 w-4 h-4"
          />
          <h3 className="text-lg font-semibold">Tropes</h3>
        </label>

        {!loading && (
          <FilterBox
            title=""
            items={tropes}
            selectedItems={filters.tropes || []}
            onItemToggle={(trope) => {
              const current = filters.tropes || [];
              const newList = current.some(t => t.id === trope.id)
                ? current.filter(t => t.id !== trope.id)
                : [...current, trope];
              onFilterChange("tropes", newList);
            }}
            placeholder="Search..."
            disabled={!enableTropes}
          />
        )}
      </div>

      {/* Languages + Genres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Languages */}
        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={enableLanguages}
              onChange={(e) => setEnableLanguages(e.target.checked)}
              className="accent-yellow-500 w-4 h-4"
            />
            <h3 className="text-lg font-semibold">Languages</h3>
          </label>

          {!loading && (
            <FilterBox
              title=""
              items={languages}
              selectedItems={filters.languages || []}
              onItemToggle={(language) => {
                const current = filters.languages || [];
                const newList = current.some(l => l.id === language.id)
                  ? current.filter(l => l.id !== language.id)
                  : [...current, language];
                onFilterChange("languages", newList);
              }}
              placeholder="Search..."
              disabled={!enableLanguages}
            />
          )}
        </div>

        {/* Genres */}
        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={enableGenres}
              onChange={(e) => setEnableGenres(e.target.checked)}
              className="accent-yellow-500 w-4 h-4"
            />
            <h3 className="text-lg font-semibold">Genres</h3>
          </label>

          {!loading && (
            <FilterBox
              title=""
              items={genres}
              selectedItems={filters.genres || []}
              onItemToggle={(genre) => {
                const current = filters.genres || [];
                const newList = current.some(g => g.id === genre.id)
                  ? current.filter(g => g.id !== genre.id)
                  : [...current, genre];
                onFilterChange("genres", newList);
              }}
              placeholder="Search..."
              disabled={!enableGenres}
            />
          )}
        </div>
      </div>

      {/* Year, Runtime, Rating Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Year */}
        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={enableYear}
              onChange={(e) => setEnableYear(e.target.checked)}
              className="accent-yellow-500 w-4 h-4"
            />
            <h3 className="text-lg font-semibold">Year</h3>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Year"
              value={filters.minYear || ""}
              disabled={!enableYear}
              onChange={(e) => onFilterChange("minYear", e.target.value)}
              className={`w-20 px-3 py-1.5 rounded-md focus:outline-none ${
                enableYear
                  ? "bg-gray-800 text-white focus:ring-2 focus:ring-yellow-500"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            />
            <span className="text-gray-400">to</span>
            <input
              type="number"
              placeholder="Year"
              value={filters.maxYear || ""}
              disabled={!enableYear}
              onChange={(e) => onFilterChange("maxYear", e.target.value)}
              className={`w-20 px-3 py-1.5 rounded-md focus:outline-none ${
                enableYear
                  ? "bg-gray-800 text-white focus:ring-2 focus:ring-yellow-500"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {/* Runtime */}
        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={enableRuntime}
              onChange={(e) => setEnableRuntime(e.target.checked)}
              className="accent-yellow-500 w-4 h-4"
            />
            <h3 className="text-lg font-semibold">Runtime</h3>
          </label>

          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="0"
              value={filters.minRuntime || ""}
              disabled={!enableRuntime}
              onChange={(e) => onFilterChange("minRuntime", e.target.value)}
              className={`w-20 px-3 py-1.5 rounded-md focus:outline-none ${
                enableRuntime
                  ? "bg-gray-800 text-white focus:ring-2 focus:ring-yellow-500"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            />
            <span className="text-gray-400">to</span>
            <input
              type="number"
              placeholder="180"
              value={filters.maxRuntime || ""}
              disabled={!enableRuntime}
              onChange={(e) => onFilterChange("maxRuntime", e.target.value)}
              className={`w-20 px-3 py-1.5 rounded-md focus:outline-none ${
                enableRuntime
                  ? "bg-gray-800 text-white focus:ring-2 focus:ring-yellow-500"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            />
            <span className="text-gray-400">minutes</span>
          </div>
        </div>

        {/* Rating (smart dual slider) */}
        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={enableRating}
              onChange={(e) => setEnableRating(e.target.checked)}
              className="accent-yellow-500 w-4 h-4"
            />
            <h3 className="text-lg font-semibold">Rating</h3>
          </label>

          <div
            className="relative w-full h-8 mt-2 select-none"
            onMouseDown={(e) => {
              if (!enableRating) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const clickRatio = clickX / rect.width;
              const clickedValue = 1 + clickRatio * 9;

              // decide which thumb to move
              const leftDist = Math.abs(clickedValue - (filters.minRating || 1));
              const rightDist = Math.abs(clickedValue - (filters.maxRating || 10));
              const moveLeft =
                leftDist < rightDist ||
                clickedValue < (filters.minRating + filters.maxRating) / 2;

              const mouseMove = (moveEvent) => {
                const posX = moveEvent.clientX - rect.left;
                const ratio = Math.min(Math.max(posX / rect.width, 0), 1);
                const value = 1 + ratio * 9;

                if (moveLeft) {
                  const newMin = Math.min(Math.floor(value), (filters.maxRating || 10) - 1);
                  onFilterChange("minRating", newMin);
                } else {
                  const newMax = Math.max(Math.ceil(value), (filters.minRating || 1) + 1);
                  onFilterChange("maxRating", newMax);
                }
              };

              const stopMove = () => {
                window.removeEventListener("mousemove", mouseMove);
                window.removeEventListener("mouseup", stopMove);
              };

              window.addEventListener("mousemove", mouseMove);
              window.addEventListener("mouseup", stopMove);
            }}
          >
            {/* Track */}
            <div className="absolute top-1/2 left-0 w-full h-[4px] bg-gray-700 rounded-full -translate-y-1/2" />

            {/* Highlight */}
            <div
              className="absolute top-1/2 h-[4px] bg-yellow-500 rounded-full -translate-y-1/2 transition-all duration-75"
              style={{
                left: `${((filters.minRating || 1) - 1) / 9 * 100}%`,
                width: `${((filters.maxRating || 10) - (filters.minRating || 1)) / 9 * 100}%`,
              }}
            />

            {/* Left thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-black bg-white cursor-pointer ${
                !enableRating ? "opacity-40 cursor-not-allowed" : ""
              }`}
              style={{
                left: `calc(${((filters.minRating || 1) - 1) / 9 * 100}% - 8px)`,
                zIndex: 20,
              }}
            ></div>

            {/* Right thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-black bg-white cursor-pointer ${
                !enableRating ? "opacity-40 cursor-not-allowed" : ""
              }`}
              style={{
                left: `calc(${((filters.maxRating || 10) - 1) / 9 * 100}% - 8px)`,
                zIndex: 10,
              }}
            ></div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-sm text-gray-400 mt-3">
            {[...Array(10)].map((_, i) => (
              <span key={i + 1}>★{i + 1}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => console.log("Search clicked")}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-10 py-3 rounded-full transition"
        >
          Search
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm mt-4">TropeSearch</div>
    </div>
  );
}
