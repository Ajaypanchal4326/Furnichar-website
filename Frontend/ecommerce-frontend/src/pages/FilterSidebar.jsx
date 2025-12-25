import React, { memo, useCallback } from "react";

function FilterSidebar({ filters, setFilters, categories }) {
  const toggleCategory = useCallback(
    (category) => {
      setFilters((prev) => {
        const exists = prev.categories.includes(category);
        return {
          ...prev,
          categories: exists
            ? prev.categories.filter((c) => c !== category)
            : [...prev.categories, category],
        };
      });
    },
    [setFilters]
  );

  const handlePriceChange = useCallback(
    (e) => {
      setFilters((prev) => ({
        ...prev,
        maxPrice: Number(e.target.value),
      }));
    },
    [setFilters]
  );

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Category</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-medium mb-2">
          Max Price: ₹{filters.maxPrice}
        </h3>
        <input
          type="range"
          min="0"
          max="300000"
          step="1000"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full"
        />
      </div>
    </aside>
  );
}

export default memo(FilterSidebar);
