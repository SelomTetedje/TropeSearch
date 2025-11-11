import { useState } from "react";
import { Search } from "lucide-react";

export default function FilterBox({ title, items, selectedItems, onItemToggle, placeholder }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* Title */}
      <h3 className="text-lg font-semibold text-left">{title}</h3>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-gray-800 text-white rounded-tl-md rounded-tr-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Scrollable List */}
      <div className="bg-gray-700 rounded-bl-md rounded-br-md p-2 h-44 overflow-y-auto space-y-1.5">
        {filteredItems.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-2">No results...</div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedItems.some(selected => selected.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => onItemToggle(item)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors
                ${isSelected ? "bg-yellow-500 text-black" : "hover:bg-gray-700 text-white"}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onItemToggle(item)}
                  className="rounded border-gray-400 accent-yellow-500"
                />
                <span className="text-sm">{item.name}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
