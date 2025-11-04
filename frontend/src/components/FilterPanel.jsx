import { X } from "lucide-react";

export default function FilterPanel({ filters, onFilterChange, onClearFilters, isVisible }) {
  if (!isVisible) return null;

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/*Year*/}
        <div className="col-span-2 gap-4">
          <h1 className="text-xl font-bold">Year</h1>
          <div className="flex w-2/3 gap-4 align-bottom">
            <input
              type="number"
              placeholder="1900"
              value={filters.minYear}
              onChange={(e) => onFilterChange("minYear", e.target.value)}
              className="placeholder-gray-400 py-1 w-1/3 px-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <p>to</p>
            <input
              type="number"
              placeholder="2024"
              value={filters.maxYear}
              onChange={(e) => onFilterChange("maxYear", e.target.value)}
              className="w-1/3 py--1 px-3 bg-gray-600 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        {/*Director*/}
        <div className="col-span-2 gap-4">
          <h1 className="text-xl font-bold">Director</h1>
          <div className="flex w-2/3 gap-4 align-bottom">
            <input
              type="text"
              placeholder="Search director..."
              value={filters.director}
              onChange={(e) => onFilterChange("director", e.target.value)}
              className="placeholder-gray-400 py-1 w-full px-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Rating
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            value={filters.minRating}
            onChange={(e) => onFilterChange("minRating", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>
    </div>
  );
}