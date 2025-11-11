import { useState } from "react";
import { Trash2, Database } from "lucide-react";
import { clearAllCache, getCacheStats } from "../utils/cache";

export default function CacheManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(null);

  const handleOpen = () => {
    setIsOpen(true);
    setStats(getCacheStats());
  };

  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear all cached data? This will reload data from the server on next visit.")) {
      clearAllCache();
      setStats(getCacheStats());
      alert("Cache cleared! Refresh the page to reload data.");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        title="Manage cached data"
      >
        <Database className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 text-gray-100">
        <h3 className="text-xl font-semibold mb-4">Cache Management</h3>

        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Cache Statistics</h4>
            {stats ? (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-400">Cached items:</span>{" "}
                  <span className="font-semibold">{stats.itemCount}</span>
                </p>
                <p>
                  <span className="text-gray-400">Total size:</span>{" "}
                  <span className="font-semibold">{stats.totalSizeKB} KB</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No cache data</p>
            )}
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">About Caching</h4>
            <p className="text-sm text-gray-400">
              This app caches film data locally to reduce server load and improve performance.
              Cached data expires after 30-60 minutes.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClearCache}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cache
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
