import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { fetchFilmDetails } from "../services/filmService";

export default function FilmModal({ film, onClose }) {
  const [hasPoster, setHasPoster] = useState(Boolean(film?.poster_url && film.poster_url !== 'N/A'));
  const [fullDetails, setFullDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch full film details when modal opens
  useEffect(() => {
    async function loadDetails() {
      if (!film?.id) return;
      setLoadingDetails(true);
      const details = await fetchFilmDetails(film.id);
      setFullDetails(details);
      setLoadingDetails(false);
    }
    loadDetails();
  }, [film?.id]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${film?.name ?? "Selected film"}`}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{film.name}</h3>
            <p className="text-sm text-gray-600">{film.year}{film.director ? ` • Directed by ${film.director}` : ''}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-600 hover:text-gray-800"
            autoFocus
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {hasPoster && film.poster_url && (
            <img
              src={film.poster_url}
              alt={`${film.name} poster`}
              className="w-full h-auto rounded"
              onError={() => setHasPoster(false)}
              onLoad={() => setHasPoster(true)}
            />
          )}

          <div className={`md:col-span-2 ${!hasPoster ? 'md:col-span-1' : ''}`}>
            <div className="flex items-center gap-4 mb-3">
              {film.imdb_rating && <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">⭐ {film.imdb_rating}</div>}
              {film.runtime && <div className="text-sm text-gray-600">{film.runtime} min</div>}
            </div>

            {loadingDetails ? (
              <p className="text-gray-500 text-sm mb-3">Loading details...</p>
            ) : (
              <>
                {(fullDetails?.plot || film.plot) && (
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {fullDetails?.plot || film.plot}
                  </p>
                )}

                <div className="text-sm text-gray-600 space-y-1">
                  {(fullDetails?.language || film.language) && (
                    <div><strong>Language:</strong> {fullDetails?.language || film.language}</div>
                  )}
                  {(fullDetails?.genre || film.genre) && (
                    <div><strong>Genre:</strong> {fullDetails?.genre || film.genre}</div>
                  )}
                  {(fullDetails?.imdb_id || film.imdb_id) && (
                    <div><strong>IMDb ID:</strong> {fullDetails?.imdb_id || film.imdb_id}</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
