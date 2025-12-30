import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Displays a random customer review in the hero section
 */
export default function HeroReviewCard({ isVisible }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchRandomReview = async () => {
    try {
      const response = await fetch("/api/reviews/random");

      if (!response.ok) {
        throw new Error("No reviews found");
      }

      const data = await response.json();
      setReview(data);
    } catch (error) {
      console.error("Random review fetch failed:", error);

      // FALLBACK REVIEW
      setReview({
        _id: "fallback",
        user: {
          name: "Ajay Panchal",
          avatar: null,
        },
        rating: 5,
        comment:
          "Absolutely worth the price. Strong wood quality and elegant minimalist design. Easy to...",
        product: {
          _id: null,
          title: "Modular Modern Kitchen Setup",
          image:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&q=80",
          price: 249999,
          category: "Kitchen Furniture",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  fetchRandomReview();
}, []);


  // Generate avatar from name initials
  const getInitialsAvatar = (name) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Generate consistent color from name
  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-500";
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-indigo-500",
      "bg-red-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < rating ? "text-yellow-400" : "text-gray-600"
          }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const handleProductClick = () => {
  if (!review?.product?._id) return;
  navigate(`/product/${review.product._id}`);
};


  if (loading || !review) {
    return null;
  }

  const userName = review.user?.name || "User";
  const userAvatar = review.user?.avatar;

  return (
    <div
      onClick={handleProductClick}
     className="
  absolute
  
  /* Mobile: Higher position + more to the right */
  top-[320px] right-3
  
  /* Tablet & Desktop: Bottom-right corner */
  sm:top-auto sm:bottom-4 sm:right-4
  lg:bottom-6 lg:right-6
  
  bg-gray-800/95 backdrop-blur-sm
  w-[260px] sm:w-[300px] lg:w-[320px]
  p-3 sm:p-4
  shadow-2xl border border-gray-700/50
  rounded-lg cursor-pointer
  hover:bg-gray-800 transition-all duration-300
  hover:scale-[1.02]
  z-10
"

      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.8s ease-out 0.6s",
      }}
    >
      {/* User Info & Rating */}
      <div className="flex items-start gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
        {/* User Avatar */}
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-gray-700 flex-shrink-0"
          />
        ) : (
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm border-2 border-gray-700 flex-shrink-0 ${getAvatarColor(
              userName
            )}`}
          >
            {getInitialsAvatar(userName)}
          </div>
        )}

        {/* User Name & Stars */}
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-semibold text-white truncate">
            {userName}
          </div>
          <div className="flex gap-0.5 mt-0.5 sm:mt-1">
            {renderStars(review.rating)}
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-[11px] sm:text-xs text-gray-300 mb-2.5 sm:mb-3 line-clamp-2 leading-relaxed">
        "{review.comment}"
      </p>

      {/* Product Info */}
      <div className="flex items-center gap-2 sm:gap-2.5 pt-2.5 sm:pt-3 border-t border-gray-700">
        {/* Product Image */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-gray-700 flex-shrink-0 shadow-md">
          <img
            src={review.product?.image}
            alt={review.product?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] sm:text-xs font-semibold text-white truncate mb-1">
            {review.product?.title}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-bold text-white">
              ₹{Number(review.product?.price).toLocaleString("en-IN")}
            </span>
            <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded border border-green-500/30 whitespace-nowrap">
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}