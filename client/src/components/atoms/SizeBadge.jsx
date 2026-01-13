export const SizeBadge = ({ sizes = ["M", "L", "XL", "XXL"] }) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      {sizes.map((size, index) => (
        <div
          key={index}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black text-sm font-medium shadow-sm border border-gray-100"
        >
          {size}
        </div>
      ))}
    </div>
  );
};
