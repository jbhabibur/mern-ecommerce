export const ImagePlaceholder = () => {
  return (
    <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-lg border border-gray-100 bg-[#f8f9fa]">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-md border-2 border-gray-200/60 bg-transparent">
        {/* Inner Icon Graphic */}
        <div className="relative flex flex-col items-center gap-1 opacity-20">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      </div>
    </div>
  );
};
