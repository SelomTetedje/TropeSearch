import { X } from "lucide-react";
import { useEffect, useState } from "react";
import FilterBox from "./FilterBox";
import { fetchGenres, fetchLanguages, fetchTropes } from "../services/filters";

export default function FilterPanel({ filters, onFilterChange, onClearFilters, isVisible }) {
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [tropes, setTropes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enableTropes, setEnableTropes] = useState(true);
  const [enableLanguages, setEnableLanguages] = useState(true);
  const [enableGenres, setEnableGenres] = useState(true);
  const [enableYear, setEnableYear] = useState(true);
  const [enableRuntime, setEnableRuntime] = useState(true);
  const [enableRating, setEnableRating] = useState(true);

  const [localMinRating, setLocalMinRating] = useState(filters.minRating || 1);
  const [localMaxRating, setLocalMaxRating] = useState(filters.maxRating || 10);

  useEffect(() => {
    setLocalMinRating(filters.minRating || 1);
    setLocalMaxRating(filters.maxRating || 10);
  }, [filters.minRating, filters.maxRating]);

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
    onFilterChange("minRating", "");
    onFilterChange("maxRating", "");

    setLocalMinRating(1);
    setLocalMaxRating(10);

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
              const container = e.currentTarget;
              const rect = container.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const clickRatio = clickX / rect.width;
              const clickedValue = 1 + clickRatio * 9;

              const highlight = container.querySelector('.rating-highlight');
              const leftThumb = container.querySelector('.rating-thumb-left');
              const rightThumb = container.querySelector('.rating-thumb-right');

              const leftDist = Math.abs(clickedValue - localMinRating);
              const rightDist = Math.abs(clickedValue - localMaxRating);
              const moveLeft =
                leftDist < rightDist ||
                clickedValue < (localMinRating + localMaxRating) / 2;

              let currentMin = localMinRating;
              let currentMax = localMaxRating;

              const mouseMove = (moveEvent) => {
                const posX = moveEvent.clientX - rect.left;
                const ratio = Math.min(Math.max(posX / rect.width, 0), 1);
                const value = 1 + ratio * 9;

                if (moveLeft) {
                  const newMin = Math.max(1, Math.min(value, currentMax - 1));
                  currentMin = newMin;
                  if (leftThumb) leftThumb.style.left = `calc(${((newMin - 1) / 9) * 100}% - 8px)`;
                  if (highlight) {
                    highlight.style.left = `${((newMin - 1) / 9) * 100}%`;
                    highlight.style.width = `${((currentMax - newMin) / 9) * 100}%`;
                  }
                } else {
                  const newMax = Math.min(10, Math.max(value, currentMin + 1));
                  currentMax = newMax;
                  if (rightThumb) rightThumb.style.left = `calc(${((newMax - 1) / 9) * 100}% - 8px)`;
                  if (highlight) {
                    highlight.style.width = `${((newMax - currentMin) / 9) * 100}%`;
                  }
                }
              };

              const stopMove = () => {
                window.removeEventListener("mousemove", mouseMove);
                window.removeEventListener("mouseup", stopMove);
                const finalMin = Math.round(currentMin);
                const finalMax = Math.round(currentMax);
                setLocalMinRating(finalMin);
                setLocalMaxRating(finalMax);
                onFilterChange("minRating", finalMin);
                onFilterChange("maxRating", finalMax);
              };

              window.addEventListener("mousemove", mouseMove);
              window.addEventListener("mouseup", stopMove);
            }}
          >
            {/* Track */}
            <div className="absolute top-1/2 left-0 w-full h-[4px] bg-gray-700 rounded-full -translate-y-1/2" />

            {/* Highlight */}
            <div
              className="rating-highlight absolute top-1/2 h-[4px] bg-yellow-500 rounded-full -translate-y-1/2"
              style={{
                left: `${(localMinRating - 1) / 9 * 100}%`,
                width: `${(localMaxRating - localMinRating) / 9 * 100}%`,
              }}
            />

            {/* Left thumb */}
            <div
              className={`rating-thumb-left absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-black bg-white cursor-pointer ${
                !enableRating ? "opacity-40 cursor-not-allowed" : ""
              }`}
              style={{
                left: `calc(${(localMinRating - 1) / 9 * 100}% - 8px)`,
                zIndex: 20,
              }}
            ></div>

            {/* Right thumb */}
            <div
              className={`rating-thumb-right absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-black bg-white cursor-pointer ${
                !enableRating ? "opacity-40 cursor-not-allowed" : ""
              }`}
              style={{
                left: `calc(${(localMaxRating - 1) / 9 * 100}% - 8px)`,
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
    </div>
  );
}
