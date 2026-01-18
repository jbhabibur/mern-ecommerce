import { Heart } from "lucide-react";

export const RoundActionButton = ({
  icon: Icon = Heart,
  expandable = false,
  expandableText = "Add to Wishlist",
}) => {
  return (
    /* Using 'group/btn' to distinguish this button's hover state 
       from the parent Card's hover state.
    */
    <button className="group/btn flex items-center bg-white text-black border border-gray-200 p-2 rounded-full! shadow-md active:scale-95 hover:bg-gray-50 hover:shadow-lg transition-all duration-300">
      {/* Text is hidden by default. 
          It only shows when the specific button (group/btn) is hovered.
      */}

      {expandable && (
        <span className="hidden group-hover/btn:inline-block mr-2 text-sm font-medium whitespace-nowrap">
          {expandableText}
        </span>
      )}

      {/* Icon - Stays visible on the right side */}
      <span className="flex items-center justify-center flex-shrink-0">
        <Icon size={20} />
      </span>
    </button>
  );
};
