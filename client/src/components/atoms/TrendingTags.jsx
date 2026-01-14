import { Search } from "lucide-react";

export const TrendingTags = ({ tag = "sample" }) => {
  return (
    <button className="flex items-center gap-2 bg-[#f8f8f8] text-gray-500 px-2 py-2 text-sm rounded-sm hover:bg-gray-200 transition-colors">
      <span className="text-xs">
        <Search className="w-5 h-5" />
      </span>{" "}
      {tag}
    </button>
  );
};
