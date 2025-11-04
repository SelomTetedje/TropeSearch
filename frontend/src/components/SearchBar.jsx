import { Search, Funnel } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, onToggleFilters, activeFilterCount }) {
  return (
    <div className="rounded-lg shadow-sm mb-4">
      <div className="flex gap-3">
        <div className="flex-1 relative text-gray-400">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 placeholder-gray-400 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
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
      </div>
    </div>
  );
}