// src/components/Navbar.jsx
import CacheManager from "./CacheManager";

export default function NavBar({ onLogoClick }) {
    return (
      <nav className="sticky top-0 z-20" style={{ backgroundColor: '#070707' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onLogoClick}
            className="text-2xl font-extrabold hover:opacity-90 active:opacity-80"
            style={{ color: '#EFDB00' }}
            aria-label="Go to Home"
          >
            TropeSearch
          </button>
          <CacheManager />
        </div>
      </nav>
    );
}
  