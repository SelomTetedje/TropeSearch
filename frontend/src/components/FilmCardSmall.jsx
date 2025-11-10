export default function FilmCard({ film, index }) {
  const genres = Array.isArray(film.genres)
    ? film.genres.map((g) => g.name).join(", ")
    : film.genre || "—";

  return (
    <div
      className={`grid grid-cols-3 items-center px-4 py-2 text-gray-200 ${
        index % 2 === 0 ? "bg-gray-800" : "bg-gray-850"
      } hover:bg-gray-700 transition-colors`}
    >
      {/* Film Name */}
      <div className="font-medium truncate">{film.name}</div>

      {/* Genre */}
      <div className="text-sm text-gray-400 truncate">{genres}</div>

      {/* Rating */}
      <div className="justify-self-end">
        {film.imdb_rating ? (
          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full text-sm font-semibold">
            ⭐ {Number(film.imdb_rating).toFixed(1)}
          </span>
        ) : (
          <span className="text-gray-500 text-sm">N/A</span>
        )}
      </div>
    </div>
  );
}
