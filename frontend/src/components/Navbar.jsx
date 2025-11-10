// src/components/Navbar.jsx
export default function NavBar({ onLogoClick }) {
    return (
      <nav className="bg-gray-900 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button
            onClick={onLogoClick}
            className="text-2xl font-extrabold text-yellow-400 hover:opacity-90 active:opacity-80"
            aria-label="Go to Home"
          >
            TropeSearch
          </button>
        </div>
      </nav>
    );
}
  