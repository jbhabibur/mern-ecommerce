import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Star,
  Trash2,
  Filter,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Import RTK Query hooks
import {
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} from "../../redux/service/reviewApi";

// Import Redux Slice actions
import { setFilterStatus, setSearchTerm } from "../../redux/slices/reviewSlice";

/**
 * Helper to define styles based on review status
 */
const getReviewStatusStyles = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "approved":
      return "bg-green-500/10 text-green-600 border-green-200";
    case "pending":
      return "bg-amber-500/10 text-amber-600 border-amber-200";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

export const ReviewManager = () => {
  const dispatch = useDispatch();

  // Get UI state from Redux Slice
  const { filterStatus, searchTerm } = useSelector((state) => state.review);

  // Fetch data using RTK Query
  const { data, isLoading } = useGetAllReviewsQuery();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateReviewStatusMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // Extract reviews from the API response structure { success, data: [] }
  const reviews = data?.data || [];

  /**
   * FIXED FILTER LOGIC
   * Matches nested properties: rev.user.name and rev.product.name
   */
  const filteredReviews = reviews.filter((rev) => {
    const userName = rev.user?.name || "";
    const productName = rev.product?.name || "";
    const comment = rev.comment || "";

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "All" ||
      (filterStatus === "Pending" && rev.status === "pending") ||
      (filterStatus === "5 Stars" && rev.rating === 5) ||
      (filterStatus === "Under 3" && rev.rating < 3);

    return matchesSearch && matchesFilter;
  });

  // Action: Approve or Reject a review
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to update status");
    }
  };

  // Action: Delete a review
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id).unwrap();
      } catch (err) {
        alert("Failed to delete review");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-theme-base">
        <Loader2 className="animate-spin text-theme-act" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-base p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Search Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase">
              Reviews Management
            </h1>
            <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
              Moderate Customer Feedback & Product Ratings
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search user, product or comment..."
              className="w-full bg-theme-sub border border-theme-line rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-theme-act outline-none"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>
        </header>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 pr-4 border-r border-theme-line mr-2">
            <Filter size={14} className="text-theme-muted" />
            <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest">
              Filter:
            </span>
          </div>
          {["All", "5 Stars", "Pending", "Under 3"].map((opt) => (
            <button
              key={opt}
              onClick={() => dispatch(setFilterStatus(opt))}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                filterStatus === opt
                  ? "bg-theme-act text-theme-actfg border-transparent shadow-md scale-105"
                  : "bg-theme-sub text-theme-muted border-theme-line hover:border-theme-muted"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-theme-line bg-theme-base shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-theme-sub text-[10px] uppercase text-theme-muted font-black tracking-widest border-b border-theme-line">
                <tr>
                  <th className="px-6 py-4">Review ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Rating & Comment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-line">
                {filteredReviews.map((review) => (
                  <tr
                    key={review._id}
                    className="hover:bg-theme-sub/40 transition-colors"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-theme-act font-black uppercase">
                          #{review._id.slice(-6)}
                        </span>
                        <span className="text-[10px] text-theme-muted mt-1 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-theme-front">
                          {review.user?.name || "Deleted User"}
                        </span>
                        <span className="text-[11px] text-theme-muted">
                          {review.user?.email}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-theme-sub rounded border border-theme-line flex items-center justify-center">
                          <ExternalLink
                            size={12}
                            className="text-theme-muted"
                          />
                        </div>
                        <p className="text-[11px] font-bold text-theme-front truncate w-32">
                          {review.product?.name || "Unknown Product"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-0.5 text-yellow-500 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-theme-muted italic line-clamp-1 max-w-xs">
                        "{review.comment}"
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${getReviewStatusStyles(review.status)}`}
                      >
                        {review.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right whitespace-nowrap space-x-2">
                      {review.status === "pending" && (
                        <button
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(review._id, "approved")
                          }
                          className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                          title="Approve"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {(review.status === "approved" ||
                        review.status === "pending") && (
                        <button
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(review._id, "rejected")
                          }
                          className="p-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-600 hover:text-white transition-all"
                          title="Reject"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReviews.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-theme-muted uppercase text-xs font-black tracking-widest">
                  No reviews found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between px-6 py-4 bg-theme-sub/20 border-t border-theme-line">
            <p className="text-[10px] font-black uppercase text-theme-muted tracking-widest">
              Showing {filteredReviews.length} of {reviews.length} total reviews
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-theme-line text-theme-muted hover:bg-theme-sub cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              <span className="text-[10px] font-bold px-3">Page 1</span>
              <button className="p-2 rounded-lg border border-theme-line text-theme-muted hover:bg-theme-sub cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
