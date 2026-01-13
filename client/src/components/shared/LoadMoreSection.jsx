export const LoadMoreSection = () => {
  // Eigulo pore dynamic hobe (props theke ashbe)
  const currentItems = 20;
  const totalItems = 209;
  const progressPercentage = (currentItems / totalItems) * 100;

  return (
    <div className="flex flex-col items-center justify-center my-12 w-full max-w-md mx-auto">
      {/* 1. Text Section */}
      <p className="text-gray-500 text-sm mb-4 font-light tracking-wide">
        Showing 1 - {currentItems} of {totalItems} total
      </p>

      {/* 2. Progress Bar Container */}
      <div className="w-full h-[2px] bg-gray-200 mb-8 relative">
        {/* Active Blue Progress */}
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* 3. Show More Button */}
      <button className="w-full border border-gray-400 py-4 px-8 text-sm font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors duration-300">
        Show More
      </button>
    </div>
  );
};
