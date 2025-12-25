// ProductCard.jsx
import React, { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";

/**
 * Lightweight cart icon extracted so it's not recreated on every render.
 */
const CartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

function ProductCardInner({ product }) {
  const dispatch = useDispatch();

  // Safety guard
  if (!product) return null;

  // stable derived values
  const imageSrc = product.image || product.images?.[0] || "";
  const formattedPrice = useMemo(
    () => `₹${Number(product.price || 0).toLocaleString()}`,
    [product.price]
  );

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(
        addToCart({
          _id: product._id,
          title: product.title,
          price: product.price,
          image: imageSrc,
          quantity: 1,
        })
      );
    },
    [dispatch, product._id, product.title, product.price, imageSrc]
  );

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col group">
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
        {/* Image container: aspect ratio preserved */}
        <div className="relative bg-gray-50 dark:bg-gray-700 aspect-[4/3] overflow-hidden">
          <img
            src={imageSrc}
            alt={product.title || "Product"}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 min-h-[48px] flex-1">
            {product.title}
          </h3>

          <div className="flex items-center justify-between gap-3 mt-auto">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formattedPrice}
            </p>

            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg active:scale-95 transition-transform duration-150 font-medium text-sm"
              aria-label={`Add ${product.title} to cart`}
            >
              <CartIcon />
              <span>Add</span>
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * only re-render when the meaningful visible fields change.
 * This prevents re-renders if parent re-fetches data but key product fields unchanged.
 */
function areEqual(prevProps, nextProps) {
  const a = prevProps.product || {};
  const b = nextProps.product || {};

  // unique id and main visible fields used for comparison
  const imgA = a.image || (a.images && a.images[0]) || "";
  const imgB = b.image || (b.images && b.images[0]) || "";

  return (
    a._id === b._id &&
    a.title === b.title &&
    String(a.price) === String(b.price) &&
    imgA === imgB
  );
}

export default memo(ProductCardInner, areEqual);
