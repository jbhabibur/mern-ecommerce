import { Home, Search, Grid, User, ShoppingBag } from "lucide-react";

export const MobileNav = () => {
  return (
    <div className="relative">
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
          {/* Home */}
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <Home className="w-6 h-6 mb-1 text-gray-700 group-hover:text-blue-600" />
            <span className="text-xs text-gray-700 group-hover:text-blue-600">
              Home
            </span>
          </button>

          {/* Search */}
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <Search className="w-6 h-6 mb-1 text-gray-700 group-hover:text-blue-600" />
            <span className="text-xs text-gray-700 group-hover:text-blue-600">
              Search
            </span>
          </button>

          {/* Collection */}
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <Grid className="w-6 h-6 mb-1 text-gray-700 group-hover:text-blue-600" />
            <span className="text-xs text-gray-700 group-hover:text-blue-600">
              Collection
            </span>
          </button>

          {/* Account */}
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <User className="w-7 h-7 mb-1 text-gray-700 group-hover:text-blue-600 border-[1.5px] border-gray-700 rounded-full p-0.5" />
            <span className="text-xs text-gray-700 group-hover:text-blue-600">
              Account
            </span>
          </button>

          {/* Cart */}
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group relative"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6 mb-1 text-gray-700 group-hover:text-blue-600" />
              {/* Badge */}
              <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-gray-800 rounded-full">
                0
              </span>
            </div>
            <span className="text-xs text-gray-700 group-hover:text-blue-600">
              Cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
