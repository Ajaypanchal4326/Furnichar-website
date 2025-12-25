import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchProducts } from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import RelatedProducts from "../components/product/RelatedProducts";
import { getReviews } from "../services/reviewService";
import ReviewForm from "../components/review/ReviewForm";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("details");
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { product, products } = useSelector((state) => state.product);
  
  const refreshReviews = () => {
    getReviews(id).then(setReviews);
  };

  /* =======================
     FETCH PRODUCT + PRODUCTS
  ======================== */
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchProducts());
    }
  }, [dispatch, id]);

  /* =======================
     FETCH REVIEWS
  ======================== */
  useEffect(() => {
    if (id) {
      getReviews(id).then(setReviews);
    }
  }, [id]);

  /* =======================
     LOADING STATE
  ======================== */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  /* =======================
     RELATED PRODUCTS
  ======================== */
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p._id !== product._id
  );

  /* =======================
     FORMAT REVIEWS (SAFE)
  ======================== */
  const formattedReviews = reviews.map((r) => ({
    id: r._id,
    name: r.user?.name || "Anonymous",
    date: new Date(r.createdAt).toLocaleDateString(),
    rating: r.rating,
    comment: r.comment,
  }));

  /* =======================
     AVERAGE RATING
  ======================== */
  const averageRating = formattedReviews.length > 0
    ? (formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length).toFixed(1)
    : 0;

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "packaging", label: "Packaging" },
    { id: "shipping", label: "Shipping" },
  ];

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    );
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* =======================
          BREADCRUMB
      ======================== */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <span>›</span>
            <span className="hover:text-gray-900 dark:hover:text-white">
              {product.category}
            </span>
            <span>›</span>
            <span className="font-medium text-gray-900 dark:text-white truncate">
              {product.title}
            </span>
          </div>
        </div>
      </div>

      {/* =======================
          MAIN CONTENT
      ======================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* IMAGE */}
          <div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-block px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded">
                {product.category}
              </span>
              {formattedReviews.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= Math.round(averageRating) ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-gray-700"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {averageRating} ({formattedReviews.length})
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="py-4 border-y border-gray-200 dark:border-gray-700">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{product.price}
                </span>
                <span className="text-lg text-gray-400 dark:text-gray-600 line-through">
                  ₹{Math.round(product.price * 1.3)}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold rounded">
                  23% OFF
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white uppercase">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold text-gray-900 dark:text-white border-x border-gray-300 dark:border-gray-700">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                isAddingToCart
                  ? "bg-gray-400 dark:bg-gray-700 text-white cursor-not-allowed"
                  : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
              }`}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* =======================
            TABS
        ======================== */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></div>
                )}
              </button>
            ))}
          </div>

          <div className="py-6 bg-white dark:bg-gray-800 px-6 rounded-b-lg border border-t-0 border-gray-200 dark:border-gray-700">
            {activeTab === "details" && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            )}
            {activeTab === "packaging" && (
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Eco-Friendly Packaging:</strong> We use sustainable, recyclable materials to minimize environmental impact.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  All products are carefully wrapped to ensure they arrive in perfect condition.
                </p>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Fast Delivery:</strong> Standard delivery in 5–7 business days.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Express shipping options available at checkout for faster delivery.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =======================
            REVIEWS
        ======================== */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Reviews & Ratings
              </h2>
              {formattedReviews.length > 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {formattedReviews.length} customer review{formattedReviews.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {formattedReviews.length > 0 && (
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {averageRating}
                </div>
                <div className="flex justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= Math.round(averageRating) ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-gray-700"}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ReviewForm productId={id} onReviewAdded={refreshReviews} />

          {formattedReviews.length > 0 ? (
            <div className="mt-6 space-y-4">
              {formattedReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded border border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white">★</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>

        {/* =======================
            RELATED PRODUCTS
        ======================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              You May Also Like
            </h2>
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}