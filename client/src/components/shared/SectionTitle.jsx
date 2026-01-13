import { Link } from "react-router-dom";

export const SectionTitle = ({
  title,
  linkText = "View All",
  linkUrl = "#",
}) => {
  return (
    // Removed "container" to prevent nesting issues inside the grid
    <div className="w-ful">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center w-full gap-4">
          <div className="flex-1 h-[2px] bg-black"></div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-[0.1em] text-center whitespace-nowrap">
            {title}
          </h2>
          <div className="flex-1 h-[2px] bg-black"></div>
        </div>

        <div className="mt-2">
          {/* CHANGED href TO to */}
          <Link
            to={linkUrl}
            className="no-underline! text-xs md:text-sm font-medium text-gray-600 hover:text-black transition-colors uppercase border-b border-gray-400 hover:border-black pb-0.5"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};
