import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import ProductCard from "../components/product/ProductCard";

/* ---------------- DEBOUNCE HOOK ---------------- */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

/* ---------------- FILTER SIDEBAR (MEMOIZED & RESPONSIVE) ---------------- */
const FilterSidebar = memo(({ filters, setFilters, categories, onClose }) => {
  const toggleCategory = useCallback(
    (category) => {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      }));
    },
    [setFilters]
  );

  const togglePriceRange = useCallback(
    (range) => {
      setFilters((prev) => ({
        ...prev,
        priceRange: prev.priceRange === range ? null : range,
      }));
    },
    [setFilters]
  );

  // Price ranges as checkboxes
  const priceRanges = [
    { label: "Under ₹10,000", value: "0-10000", min: 0, max: 10000 },
    { label: "₹10,000 - ₹25,000", value: "10000-25000", min: 10000, max: 25000 },
    { label: "₹25,000 - ₹50,000", value: "25000-50000", min: 25000, max: 50000 },
    { label: "₹50,000 - ₹100,000", value: "50000-100000", min: 50000, max: 100000 },
    { label: "₹100,000 - ₹200,000", value: "100000-200000", min: 100000, max: 200000 },
    { label: "Above ₹200,000", value: "200000-999999", min: 200000, max: 999999 },
  ];

  return (
    <aside className="w-full lg:w-64 space-y-6 lg:space-y-8">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="flex items-center justify-between lg:hidden mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close filters"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 lg:mb-4">
          Product Categories
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group py-1"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Ranges - Checkbox Style */}
      <div>
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 lg:mb-4">
          Filter by Price
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-3 cursor-pointer group py-1"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range.value}
                onChange={() => togglePriceRange(range.value)}
                className="w-4 h-4 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
});

FilterSidebar.displayName = "FilterSidebar";

/* ---------------- PRODUCT PAGE ---------------- */
export default function ProductPage() {
  const dispatch = useDispatch();
  
  // Safe state extraction
  const productState = useSelector((state) => state.product);
  const products = Array.isArray(productState?.products)
    ? productState.products
    : Array.isArray(productState)
    ? productState
    : [];
  const status = productState?.status || productState?.loading;
  const error = productState?.error;

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: null,
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Memoized categories
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...new Set(products.map((p) => p?.category).filter(Boolean))].sort();
  }, [products]);

  // Price ranges
  const priceRanges = {
    "0-10000": { min: 0, max: 10000 },
    "10000-25000": { min: 10000, max: 25000 },
    "25000-50000": { min: 25000, max: 50000 },
    "50000-100000": { min: 50000, max: 100000 },
    "100000-200000": { min: 100000, max: 200000 },
    "200000-999999": { min: 200000, max: 999999 },
  };

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const query = debouncedSearch?.trim().toLowerCase();
    return products.filter((product) => {
      if (!product) return false;

      // Search filter
      if (query) {
        const title = String(product.title || product.name || "").toLowerCase();
        if (!title.includes(query)) return false;
      }

      // Category filter
      if (filters.categories.length && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const range = priceRanges[filters.priceRange];
        const price = Number(product.price);
        if (price < range.min || price > range.max) {
          return false;
        }
      }

      return true;
    });
  }, [products, debouncedSearch, filters.categories, filters.priceRange]);

  // Check if filters are active
  const hasActiveFilters = useMemo(
    () =>
      filters.categories.length > 0 ||
      filters.priceRange !== null ||
      (debouncedSearch && debouncedSearch.length > 0),
    [filters.categories, filters.priceRange, debouncedSearch]
  );

  // Clear filters callback
  const clearFilters = useCallback(() => {
    setFilters({ categories: [], priceRange: null });
    setSearchQuery("");
  }, []);

  // Search change handler
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Toggle mobile filter
  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen((prev) => !prev);
  }, []);

  // Close mobile filter
  const closeMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(false);
  }, []);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  // Loading state
  const isLoading = status === "loading" || status === true;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
<div className="sticky top-[56px] sm:top-[64px] z-30 bg-gray-50 dark:bg-gray-900">

  <div className="border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Products
        </h1>

        {/* Search */}
        <div className="relative w-full sm:w-80 lg:w-96">
          <svg
            className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 lg:pl-11 pr-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                categories={categories}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Filter Button (Mobile) & Results Count */}
            <div className="mb-4 lg:mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={toggleMobileFilter}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filters
                  {hasActiveFilters && (
                    <span className="flex items-center justify-center w-5 h-5 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full">
                      {filters.categories.length + (filters.priceRange ? 1 : 0)}
                    </span>
                  )}
                </button>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="hidden sm:inline">Showing </span>
                  {filteredProducts.length} of {products.length}
                  <span className="hidden sm:inline"> products</span>
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12 lg:py-16">
                <div className="text-red-500 dark:text-red-400 mb-2">
                  <svg
                    className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-base lg:text-lg font-medium">Error loading products</p>
                  <p className="text-xs lg:text-sm mt-2">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(fetchProducts())}
                  className="mt-4 px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm lg:text-base"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && !error ? (
              <div className="flex flex-col items-center justify-center py-12 lg:py-16">
                <div className="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-b-2 border-gray-900 dark:border-gray-100 mb-4"></div>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Loading products...</p>
              </div>
            ) : !isLoading && filteredProducts.length === 0 && !error ? (
              <div className="text-center py-12 lg:py-16">
                <svg
                  className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-base lg:text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No products found
                </p>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={closeMobileFilter}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-full sm:w-80 bg-white dark:bg-gray-800 z-50 overflow-y-auto lg:hidden transform transition-transform duration-300">
            <div className="p-6">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                onClose={closeMobileFilter}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}