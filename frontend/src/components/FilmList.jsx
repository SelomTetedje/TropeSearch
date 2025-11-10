import { ChevronLeft, ChevronRight } from "lucide-react";
import FilmCard from "./FilmCardSmall";
import FilmCardLarge from "./FilmCardLarge";

export default function FilmList({ 
  films, 
  totalFilms,
  onClearFilters, 
  viewMode,
  currentPage,
  totalPages,
  onPageChange
}) {
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {pages.map((page, index) => (
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-yellow-500 text-gray-900 font-semibold"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="rounded-lg shadow-sm p-6 bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">
          {totalFilms} {totalFilms === 1 ? "Film" : "Films"} Found
          {totalPages > 1 && (
            <span className="text-sm text-gray-400 ml-2">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </h2>
      </div>

      {totalFilms === 0 ? (
        <div className="text-center py-12 text-gray-200">
          <p className="text-lg">No films found matching your criteria</p>
          <button
            onClick={onClearFilters}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === "large"
                ? "flex flex-col gap-5"
                : "space-y-3"
            }
          >
            {films.map((film, i) =>
              viewMode === "large" ? (
                <FilmCardLarge key={film.id || i} film={film} />
              ) : (
                <FilmCard key={film.id || i} film={film} index={i} />
              )
            )}
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  );
}