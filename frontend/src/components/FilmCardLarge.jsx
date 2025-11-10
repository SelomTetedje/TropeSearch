export default function FilmCardLarge({ film }) {
    const poster =
      film.poster_url || film.poster || "https://via.placeholder.com/80x120?text=No+Image";
    const rating = film.imdb_rating ?? film.rating;
  
    return (
      <div className="rounded-lg p-4 bg-gray-800 text-gray-100 border border-gray-700">
        <div className="flex gap-4">
          <img src={poster} alt={`${film.name} poster`} className="w-20 h-28 object-cover rounded-md" />
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <h3 className="text-xl font-semibold">{film.name}</h3>
              {rating && (
                <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full text-sm font-semibold">
                  <span role="img" aria-label="star">⭐</span>{Number(rating).toFixed(1)}
                </span>
              )}
            </div>
  
            {film.plot && <p className="text-sm text-gray-300 mt-2">{film.plot}</p>}
  
            {Array.isArray(film.tropes) && film.tropes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-sm text-gray-400">Tropes:</span>
                {film.tropes.map((t) => (
                  <span key={t.id || t.name} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                    {t.name}
                  </span>
                ))}
              </div>
            )}
  
            {(film.director || film.directors) && (
              <p className="text-sm text-gray-300 mt-2">
                <span className="text-gray-400">Directors:</span>{" "}
                {film.directors?.join?.(", ") || film.director}
              </p>
            )}
  
            {Array.isArray(film.genres) && film.genres.length > 0 && (
              <p className="text-sm text-gray-300 mt-1">
                <span className="text-gray-400">Genre:</span>{" "}
                {film.genres.map((g) => g.name).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    );
}
  