export const MultiItemCarouselSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 px-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`aspect-square w-full bg-gray-200 animate-pulse border-[1px] border-white 
            ${i >= 2 ? "hidden md:block" : ""} ${i >= 3 ? "hidden lg:block" : ""}`}
        />
      ))}
    </div>
  );
};
