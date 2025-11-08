import { useState } from "react";
import FilmCard from "./FilmCard";
import FilmModal from "./FilmModal";

export default function FilmList({ films, onClearFilters }) {
  const [selectedFilm, setSelectedFilm] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {films.length} {films.length === 1 ? 'Film' : 'Films'} Found
        </h2>
      </div>

      {films.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No films found matching your criteria</p>
          <button
            onClick={onClearFilters}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {films.map((film) => (
            <FilmCard key={film.id} film={film} onClick={() => setSelectedFilm(film)} />
          ))}
        </div>
      )}

      {selectedFilm && (
        <FilmModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
      )}
    </div>
  );
}