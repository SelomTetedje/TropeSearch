import { useState, useRef, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function FilmCardLarge({ film, onSelect }) {
  const poster =
    film.poster_url || film.poster || "https://via.placeholder.com/80x120?text=No+Image";
  const rating = film.imdb_rating ?? film.rating;

  // Handle tropes pagination
  const tropes = Array.isArray(film.tropes) ? film.tropes : [];
  const [visibleCount, setVisibleCount] = useState(15);
  const containerRef = useRef(null);

  // Lazy-load more tropes when scrolled near the end
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const nearEnd = scrollLeft + clientWidth >= scrollWidth - 100;
      if (nearEnd && visibleCount < tropes.length) {
        setVisibleCount((prev) => Math.min(prev + 15, tropes.length));
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [visibleCount, tropes.length]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(film);
    }
  };

  return (
    <div
      className="rounded-lg p-4 bg-gray-800 text-gray-100 border border-gray-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${film.name}`}
      onClick={() => onSelect?.(film)}
      onKeyDown={handleKeyDown}
    >
      <div className="flex gap-4">
        {/* Lazy-loaded poster */}
        <LazyLoadImage
          src={poster}
          alt={`${film.name} poster`}
          effect="blur"
          className="w-20 h-28 object-cover rounded-md flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* Title + Rating */}
          <div className="flex items-start gap-3 flex-wrap">
            <h3 className="text-xl font-semibold">{film.name}</h3>
            {rating && (
              <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full text-sm font-semibold">
                <span role="img" aria-label="star">⭐</span>
                {Number(rating).toFixed(1)}
              </span>
            )}
          </div>

          {/* Plot */}
          {film.plot && <p className="text-sm text-gray-300 mt-2">{film.plot}</p>}

          {/* Tropes Section */}
          {tropes.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-400">Tropes:</span>

              <div className="mt-1 relative max-w-full">
                <div
                  ref={containerRef}
                  className="flex gap-2 whitespace-nowrap overflow-x-auto hide-scrollbar py-1"
                >
                  {tropes.slice(0, visibleCount).map((t) => (
                    <span
                      key={t.id || t.name}
                      className="text-xs inline-block bg-gray-700 px-2 py-1 rounded-full flex-shrink-0 hover:bg-gray-600 transition-colors"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>

                {/* Right-side gradient fade */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-gray-800 to-transparent" />
              </div>
            </div>
          )}

          {/* Directors */}
          {(film.director || film.directors) && (
            <p className="text-sm text-gray-300 mt-2">
              <span className="text-gray-400">Director(s):</span>{" "}
              {film.directors?.join?.(", ") || film.director}
            </p>
          )}

          {/* Genres */}
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
