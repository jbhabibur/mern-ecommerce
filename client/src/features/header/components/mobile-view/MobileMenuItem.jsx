import { ChevronRight } from "lucide-react"; // You can use lucide-react for the icon

export const MobileMenuItem = ({
  label,
  icon: Icon,
  hasArrow = false,
  isBold = true,
  isCapital = false,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[1px] border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        {/* If there is an icon, it will be rendered */}
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}

        <span
          className={`text-sm ${isBold ? "font-bold" : "font-normal"} ${isCapital ? "uppercase" : "capitalize"}  tracking-tight text-gray-900`}
        >
          {label}
        </span>
      </div>

      {/* If an arrow (>) is needed on the right */}
      {hasArrow && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </div>
  );
};
