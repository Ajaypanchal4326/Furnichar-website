import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  deleteProduct,
} from "../../features/admin/adminProductSlice";
import EditProduct from "./EditProduct";
import { Edit, Trash2, Package, Search } from "lucide-react";

// Memoized Product Card Component
const ProductCard = memo(({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-800">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-gray-400 dark:text-gray-600" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg mb-2 line-clamp-2">
          {product.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs border border-gray-200 dark:border-gray-700">
              {product.category || 'Uncategorized'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Price:</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">₹{product.price}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Stock:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 10
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : product.stock > 0
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}>
              {product.stock} units
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors font-medium"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Memoized Table Row Component
const ProductRow = memo(({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="p-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={24} className="text-gray-400 dark:text-gray-600" />
            </div>
          )}
        </div>
      </td>
      <td className="p-4">
        <p className="font-medium text-gray-800 dark:text-gray-200">{product.title}</p>
      </td>
      <td className="p-4">
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-700">
          {product.category || 'Uncategorized'}
        </span>
      </td>
      <td className="p-4">
        <p className="font-semibold text-gray-800 dark:text-gray-200">₹{product.price}</p>
      </td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 10
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : product.stock > 0
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
          }`}>
          {product.stock} units
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
});

ProductRow.displayName = 'ProductRow';

export default function AdminProducts() {
  const dispatch = useDispatch();

  const { products = [], loading } = useSelector(
    (state) => state.adminProduct,
    (prev, next) => prev.products === next.products && prev.loading === next.loading
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Memoized delete handler
  const deleteHandler = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  }, [dispatch]);

  // Memoized edit handler
  const handleEdit = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  // Memoized close handler
  const handleClose = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // Memoized filtered products with debouncing effect
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    const lowerSearch = searchTerm.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(lowerSearch) ||
      p.category?.toLowerCase().includes(lowerSearch)
    );
  }, [products, searchTerm]);

  // Memoized products count
  const productsCount = useMemo(() => products.length, [products.length]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black dark:bg-gray-900 text-white rounded-lg p-4 sm:p-6 mb-6 shadow-lg border border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Manage Products</h2>
              <p className="text-gray-300 dark:text-gray-400 text-sm sm:text-base">
                {productsCount} {productsCount === 1 ? 'product' : 'products'} in total
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 w-full sm:w-auto border border-gray-200 dark:border-gray-700">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-black dark:text-white bg-transparent w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black dark:border-white mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading products...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-800">
            <Package size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {searchTerm ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start by adding your first product'}
            </p>
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && filteredProducts.length > 0 && (
          <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Image</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                    <th className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <ProductRow
                      key={p._id}
                      product={p}
                      onEdit={handleEdit}
                      onDelete={deleteHandler}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile/Tablet Card View */}
        {!loading && filteredProducts.length > 0 && (
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onEdit={handleEdit}
                onDelete={deleteHandler}
              />
            ))}
          </div>
        )}

        {/* Edit Product Modal */}
        {selectedProduct && (
          <EditProduct
            product={selectedProduct}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}