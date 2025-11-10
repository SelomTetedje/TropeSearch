import { Search, Funnel, List, LayoutGrid } from "lucide-react";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  onToggleFilters,
  activeFilterCount,
  viewMode,
  setViewMode,
}) {
  return (
    <div className="rounded-lg shadow-sm mb-4">
      <div className="flex gap-3 items-center justify-between">
        {/* Search input */}
        <div className="flex-1 relative text-gray-400">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 placeholder-gray-400 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Right-side controls: Filters + View toggle */}
        <div className="flex items-center gap-2">
          {/* Filters */}
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Funnel className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-yellow-300 text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View toggle (icons + text) */}
          <div className="flex items-stretch bg-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("compact")}
              className={`px-3 py-2 flex items-center gap-1 hover:bg-gray-600 transition-colors ${
                viewMode === "compact" ? "bg-gray-600" : ""
              }`}
              title="Small list view"
              aria-pressed={viewMode === "compact"}
            >
              <List className="w-4 h-4 text-gray-200" />
              <span className="text-sm text-gray-200">Small</span>
            </button>

            <div className="w-px bg-gray-600" />

            <button
              type="button"
              onClick={() => setViewMode("large")}
              className={`px-3 py-2 flex items-center gap-1 hover:bg-gray-600 transition-colors ${
                viewMode === "large" ? "bg-gray-600" : ""
              }`}
              title="Large poster view"
              aria-pressed={viewMode === "large"}
            >
              <LayoutGrid className="w-4 h-4 text-gray-200" />
              <span className="text-sm text-gray-200">Large</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
