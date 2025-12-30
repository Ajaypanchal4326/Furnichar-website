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
      {/* Rating Filter */}
      <div>
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 lg:mb-4">
          Filter by Rating
        </h3>

        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer group py-1"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: rating,
                  }))
                }
                className="w-4 h-4 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                ⭐ {rating}+ & above
              </span>
            </label>
          ))}

          {/* Clear rating */}
          {filters.minRating > 0 && (
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, minRating: 0 }))
              }
              className="text-xs text-gray-500 hover:underline mt-1"
            >
              Clear rating
            </button>
          )}
        </div>
      </div>

    </aside>
  );
}

export default memo(FilterSidebar);
