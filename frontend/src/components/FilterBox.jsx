import { useState } from 'react';
import { Search } from 'lucide-react';

export default function FilterBox({ title, items, selectedItems, onItemToggle, placeholder }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
      <div className="bg-gray-700 rounded-lg p-2 h-40 overflow-y-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-600 rounded cursor-pointer"
            onClick={() => onItemToggle(item)}
          >
            <input
              type="checkbox"
              checked={selectedItems.some(selected => selected.id === item.id)}
              onChange={() => onItemToggle(item)}
              className="rounded border-gray-400"
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}