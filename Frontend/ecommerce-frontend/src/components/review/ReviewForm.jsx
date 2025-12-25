import { useState } from "react";
import { useSelector } from "react-redux";
import { submitReview } from "../../services/reviewService";

export default function ReviewForm({ productId, onReviewAdded }) {
  const user = useSelector((state) => state.auth?.user);
  const token = localStorage.getItem("token");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const maxCharacters = 500;
  const remainingChars = maxCharacters - comment.length;

  if (!token) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          Please login to write a review.
        </p>
      </div>
    );
  }

  const submitHandler = async () => {
    setError("");
    
    if (!rating) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment about your experience");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReview(productId, { rating, comment }, token);

      setRating(0);
      setComment("");
      setSuccess(true);
      onReviewAdded();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white dark:text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Review Submitted!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for sharing your experience
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Write a Review
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your experience with this product
            </p>
          </div>

          {/* Stars */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-3xl transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-300 dark:text-gray-700"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {ratingLabels[hoverRating || rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, maxCharacters))}
              placeholder="Share your thoughts about this product..."
              rows={4}
              maxLength={maxCharacters}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Minimum 10 characters
              </p>
              <p className="text-xs text-gray-500">
                {remainingChars} characters remaining
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submitHandler}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isSubmitting
                ? "bg-gray-400 dark:bg-gray-700 text-white cursor-not-allowed"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </>
      )}
    </div>
  );
}