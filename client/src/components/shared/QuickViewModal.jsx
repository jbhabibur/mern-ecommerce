import { useSelector, useDispatch } from "react-redux";
import { closeQuickView } from "../../redux/slices/productViewSlice";
import { ProductDetailsView } from "../../features/product-details/components/ProductDetailsView";
import { X } from "lucide-react";
import { useCustomCursor } from "../../hooks/useCustomCursor";

export const QuickViewModal = () => {
  const dispatch = useDispatch();

  // Note: Ensure your store key is 'productView' or 'productview' accordingly
  const { isQuickViewOpen, quickViewProduct } = useSelector(
    (state) => state.productview,
  );

  const { mousePos } = useCustomCursor(isQuickViewOpen);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  return (
    <>
      {/* 1. Overlay - Custom cursor scope */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isQuickViewOpen
            ? "opacity-100 visible md:cursor-none"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => dispatch(closeQuickView())}
      >
        {/* 2. Floating Close Button - Visible on background only */}
        <div
          className="fixed pointer-events-none z-[110] hidden md:flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-xl transition-transform duration-100 ease-out"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <X className="w-6 h-6 text-black" />
        </div>
      </div>

      {/* 3. Main Modal Panel */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none transition-all duration-300 ${
          isQuickViewOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl p-6 pointer-events-auto cursor-auto"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
        >
          {/* Mobile/Default Close Button */}
          <button
            onClick={() => dispatch(closeQuickView())}
            className="absolute right-4 top-4 z-50 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-zinc-500 hover:text-black" />
          </button>

          {/* Reusing ProductDetailsView */}
          <ProductDetailsView product={quickViewProduct} isQuickView={true} />
        </div>
      </div>
    </>
  );
};
