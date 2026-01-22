import { BeatLoader } from "react-spinners";

export const LoadMoreSection = ({
  text,
  currentItems,
  totalItems,
  loading,
  onLoadMore,
}) => {
  return (
    <div className="flex flex-col items-center mt-12 mb-20">
      <p className="text-[13px] text-gray-500 mb-4 tracking-wide">
        Showing {currentItems} of {totalItems} products
      </p>

      <button
        onClick={onLoadMore}
        disabled={loading}
        className="min-w-[180px] h-[50px] border border-black bg-white px-8 flex items-center justify-center font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-black! hover:text-white! transition-all duration-300 disabled:bg-gray-50 disabled:border-gray-300 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <BeatLoader size={8} color="currentColor" />
        ) : (
          /* text prop thakle sheta dekhabe, na thakle 'Load More' dekhabe */
          <span>{text || "Load More"}</span>
        )}
      </button>
    </div>
  );
};
