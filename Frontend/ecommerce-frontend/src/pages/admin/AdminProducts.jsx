import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  deleteProduct,
} from "../../features/admin/adminProductSlice";
import EditProduct from "./EditProduct";
import { Edit, Trash2, Package, Search } from "lucide-react";

export default function AdminProducts() {
  const dispatch = useDispatch();

  const { products = [], loading } = useSelector(
    (state) => state.adminProduct
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black text-white rounded-lg p-4 sm:p-6 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Manage Products</h2>
              <p className="text-gray-300 text-sm sm:text-base">
                {products.length} {products.length === 1 ? 'product' : 'products'} in total
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 w-full sm:w-auto">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-black w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading products...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start by adding your first product'}
            </p>
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && filteredProducts.length > 0 && (
          <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Image</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Stock</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr 
                      key={p._id} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{p.title}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {p.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">₹{p.price}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          p.stock > 10 
                            ? 'bg-green-100 text-green-700' 
                            : p.stock > 0 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteHandler(p._id)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
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
              <div 
                key={p._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
                    {p.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {p.category || 'Uncategorized'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-bold text-gray-800">₹{p.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        p.stock > 10 
                          ? 'bg-green-100 text-green-700' 
                          : p.stock > 0 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {p.stock} units
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(p._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Product Modal */}
        {selectedProduct && (
          <EditProduct
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAdminProducts,
//   deleteProduct,
// } from "../../features/admin/adminProductSlice";
// import EditProduct from "./EditProduct";

// export default function AdminProducts() {
//   const dispatch = useDispatch();

//   const { products = [], loading } = useSelector(
//     (state) => state.adminProduct
//   );

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAdminProducts());
//   }, [dispatch]);

//   const deleteHandler = (id) => {
//     if (window.confirm("Delete this product?")) {
//       dispatch(deleteProduct(id));
//     }
//   };

//   return (
//     <div>
//       <h2>Manage Products</h2>

//       {loading && <p>Loading...</p>}

//       {products.length === 0 && !loading && (
//         <p>No products found</p>
//       )}

//       {products.length > 0 && (
//         <table border="1" cellPadding="10">
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Price</th>
//               <th>Stock</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {products.map((p) => (
//               <tr key={p._id}>
//                 <td>{p.title}</td>
//                 <td>₹{p.price}</td>
//                 <td>{p.stock}</td>
//                 <td>
//                   <button
//                     onClick={() => setSelectedProduct(p)}
//                     style={{ marginRight: "8px" }}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => deleteHandler(p._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* EDIT PRODUCT MODAL / SECTION */}
//       {selectedProduct && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Edit Product</h3>
//           <EditProduct
//             product={selectedProduct}
//             onClose={() => setSelectedProduct(null)}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
