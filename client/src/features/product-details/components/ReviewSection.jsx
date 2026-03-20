import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useReviews } from "../hooks/useReviews";
import { openAuthDrawer } from "../../../redux/slices/authDrawerSlice";

export const ReviewSection = ({ productId, productAnalytics = {} }) => {
  console.log(productId);
  const [showInput, setShowInput] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const formRef = useRef(null);

  const dispatch = useDispatch();
  const { reviews, isLoading, submitReview, isSubmitting } =
    useReviews(productId);

  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  // --- 1. AUTO-OPEN & SCROLL RESTORATION LOGIC ---
  useEffect(() => {
    const hasPendingReview = sessionStorage.getItem("pendingReview");
    const params = new URLSearchParams(window.location.search);
    const scrollPos = params.get("sp");

    // We only trigger if ALL conditions are met to avoid flickering on normal logins
    if (isLoggedIn && hasPendingReview === "true" && scrollPos) {
      // Increased delay to 400ms to ensure the Auth Drawer is fully unmounted
      // and the 'navigate' from useLogin has settled the URL.
      const timer = setTimeout(() => {
        setShowInput(true);
        sessionStorage.removeItem("pendingReview");

        // Use 'smooth' instead of 'instant' for a less jarring transition
        window.scrollTo({
          top: parseInt(scrollPos),
          behavior: "smooth",
        });

        // Cleanup URL params
        const url = new URL(window.location.href);
        url.searchParams.delete("return_to");
        url.searchParams.delete("sp");
        window.history.replaceState(null, "", url.pathname + url.search);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]); // Fires when Redux auth state updates

  // Normal focus scroll (Manual click)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (showInput && formRef.current && !params.get("sp")) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showInput]);

  const handleWriteReviewClick = () => {
    if (!isLoggedIn) {
      sessionStorage.setItem("pendingReview", "true");
      const currentScroll = Math.round(window.scrollY);
      const connector = window.location.search ? "&" : "?";

      const currentFullConfig = encodeURIComponent(
        `${window.location.pathname}${window.location.search}${connector}sp=${currentScroll}`,
      );

      const url = new URL(window.location.href);
      url.searchParams.set("return_to", currentFullConfig);
      window.history.replaceState(null, "", url.pathname + url.search);

      dispatch(openAuthDrawer());
    } else {
      setShowInput(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      handleWriteReviewClick();
      return;
    }

    submitReview(
      { product: productId, rating, comment },
      {
        onSuccess: (res) => {
          if (res.success) {
            setComment("");
            setRating(5);
            setShowInput(false);
          }
        },
      },
    );
  };

  const renderStars = (count, interactive = false) => {
    if (!interactive) return "★".repeat(Math.round(count)).padEnd(5, "☆");
    return [1, 2, 3, 4, 5].map((num) => (
      <button
        key={num}
        type="button"
        onClick={() => setRating(num)}
        className={`text-lg transition-colors ${
          num <= rating ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 md:py-16 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6 px-4 sm:px-0">
        <div>
          <h2 className="text-xl! md:text-2xl! font-medium tracking-[0.15em] uppercase text-gray-900">
            Customer Reviews ({productAnalytics?.reviewCount || reviews.length})
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-yellow-500 text-sm tracking-tighter">
              {renderStars(productAnalytics?.averageRating || 0)}
            </span>
            <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest border-l pl-3 border-gray-200">
              {productAnalytics?.averageRating || "0.0"} Rating
            </span>
          </div>
        </div>

        {!showInput && (
          <button
            onClick={handleWriteReviewClick}
            className="w-full sm:w-auto px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
          >
            {isLoggedIn ? "Write a Review" : "Login to Review"}
          </button>
        )}
      </div>

      {showInput && isLoggedIn && (
        <div
          ref={formRef}
          className="max-w-4xl mb-16 border border-gray-100 bg-gray-50/50 p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-500 mx-4 sm:mx-0"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                Your Rating
              </label>
              <div className="flex gap-1">{renderStars(5, true)}</div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                Your Experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Hi ${user?.name || "there"}, share your experience...`}
                required
                className="w-full p-4 text-sm border-b border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors min-h-[120px] resize-none"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest disabled:bg-gray-400 transition-all"
              >
                {isSubmitting ? "Submitting..." : "Post Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInput(false);
                  sessionStorage.removeItem("pendingReview");
                }}
                className="px-8 py-3 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="max-w-4xl space-y-10 mt-10 px-4 sm:px-0">
        {isLoading ? (
          <p className="text-[10px] uppercase tracking-widest text-gray-400 animate-pulse">
            Loading reviews...
          </p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-50 pb-8 last:border-0"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="font-bold text-[11px] uppercase tracking-wider block">
                    {review.user?.name}
                  </span>
                  <div className="text-black text-[9px] tracking-widest mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 uppercase">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};
