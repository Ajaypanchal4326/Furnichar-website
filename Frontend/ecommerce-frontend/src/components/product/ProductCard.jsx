import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  // ✅ SAFETY CHECK (VERY IMPORTANT)
  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <div className="bg-white rounded-3xl p-3 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <Link to={`/product/${product._id}`} className="block">
        {/* Product Image Container with rounded corners */}
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-center h-56 mb-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="px-2">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
            {product.title}
          </h3>
          <p className="text-xl font-bold text-gray-900 mb-4">
            ₹{product.price}
          </p>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-2 pb-2">
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all duration-200 shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../features/cart/cartSlice";

// export default function ProductCard({ product }) {
//   const dispatch = useDispatch();

//   // ✅ SAFETY CHECK (VERY IMPORTANT)
//   if (!product) return null;

//   return (
//     <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
//       <Link to={`/product/${product._id}`}>
//         <img
//           src={product.image}
//           alt={product.title}
//           className="h-40 w-full object-cover rounded-lg"
//         />
//         <h3 className="mt-2 font-semibold">{product.title}</h3>
//         <p className="text-gray-600">₹{product.price}</p>
//       </Link>

//       <button
//         onClick={() =>
//           dispatch(
//             addToCart({
//               _id: product._id,
//               title: product.title,
//               price: product.price,
//               image: product.image,
//               quantity: 1,
//             })
//           )
//         }
//         className="mt-3 w-full bg-black text-white py-2 rounded-lg"
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// }
