export default function FilmCard({ film }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {film.name}
          </h3>
          {film.director && (
            <p className="text-gray-600 mt-1">
              Directed by {film.director}
            </p>
          )}
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            {film.year && <span>Year: {film.year}</span>}
            {film.runtime && <span>Runtime: {film.runtime} min</span>}
          </div>
          {film.plot && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {film.plot}
            </p>
          )}
        </div>
        {film.imdb_rating && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
            ⭐ {film.imdb_rating}
          </div>
        )}
      </div>
    </div>
  );
}