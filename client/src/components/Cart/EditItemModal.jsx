import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { getFullImagePath } from "../../api/apiConfig";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingCloseButton } from "./FloatingCloseButton";

export const EditItemModal = ({ isOpen, onClose, item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    if (item && isOpen) {
      setQuantity(item.quantity);
      setSelectedSize(item.size);
    }
  }, [item, isOpen]);

  const handleUpdateCart = () => {
    dispatch(cartActions.removeFromCart({ id: item.id, size: item.size }));
    dispatch(
      cartActions.addToCart({
        ...item,
        quantity: quantity,
        size: selectedSize,
      }),
    );
    onClose();
  };

  const sizes = ["M", "L", "XL", "XXL"];

  // --- Shared Components for DRYness inside the return ---
  const QuantitySelector = () => (
    <div className="flex items-center border border-gray-200 w-32 h-11">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="flex-1 flex justify-center items-center hover:bg-gray-50"
      >
        <Minus size={16} />
      </button>
      <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
      <button
        onClick={() => setQuantity(quantity + 1)}
        className="flex-1 flex justify-center items-center hover:bg-gray-50"
      >
        <Plus size={16} />
      </button>
    </div>
  );

  const SizePicker = () => (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          className={`w-11 h-11 flex items-center justify-center text-xs font-bold border transition-all ${
            selectedSize === size
              ? "border-black bg-white text-black ring-1 ring-black"
              : "border-gray-200 text-gray-400"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[121]"
          >
            <FloatingCloseButton isOpen={isOpen} />
          </motion.div>

          {/* --- MOBILE UI (Bottom Sheet) --- */}
          <div className="md:hidden w-full z-[122]">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white flex flex-col max-h-[65vh]"
            >
              <div className="px-2 py-2.5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-sm! font-bold! uppercase m-0">
                  Edit Option
                </h2>
                <button onClick={onClose}>
                  <X size={22} />
                </button>
              </div>

              <div className="p-2 overflow-y-auto">
                <div className="flex gap-4 mb-6">
                  <img
                    src={getFullImagePath(item?.image?.url)}
                    className="w-24 h-24 object-cover border"
                    alt=""
                  />
                  <div className="max-w-full overflow-hidden">
                    {/* Title with Truncate and Smooth Fade */}
                    <h3
                      className="text-[15px]! font-medium! text-gray-700 leading-tight truncate 
                 relative [mask-image:linear-gradient(to_right,black_70%,transparent_100%)]"
                    >
                      {item?.name}
                    </h3>

                    <p className="text-gray-400 text-[10px] uppercase mb-4 tracking-tight">
                      Current Selection: {item?.size}
                    </p>

                    <p className="mt-6 text-lg font-black text-gray-900">
                      Tk {item?.price?.toLocaleString()}
                    </p>

                    <div className="mt-4">
                      <p className="text-[11px] font-bold mb-2 uppercase text-gray-500">
                        Quantity
                      </p>
                      <QuantitySelector />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[11px] font-bold mb-3 uppercase">
                    Select Size:{" "}
                    <span className="text-gray-400 font-medium">
                      {selectedSize}
                    </span>
                  </p>
                  <SizePicker />
                </div>
              </div>

              <div className="px-2.5 py-2">
                <button
                  onClick={handleUpdateCart}
                  className="w-full bg-black text-white py-2.5 font-bold uppercase text-xs tracking-widest"
                >
                  Update Cart
                </button>
              </div>
            </motion.div>
          </div>

          {/* --- DESKTOP UI (Center Modal) --- */}
          <div className="hidden md:block z-[122]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[850px] bg-white shadow-2xl relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black text-white  hover:rotate-90 transition-transform"
              >
                <X size={20} />
              </button>

              <div className="px-8 py-3 border-b border-gray-100">
                <h2 className="text-sm! font-bold! uppercase m-0">
                  Edit Product Options
                </h2>
              </div>

              <div className="p-8 grid grid-cols-[220px_1fr_200px] gap-10">
                <img
                  src={getFullImagePath(item?.image?.url)}
                  className="w-full aspect-square object-cover border"
                  alt=""
                />

                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg! font-medium! text-gray-800 mb-2">
                      {item?.name}
                    </h3>
                    <p className="text-gray-400 text-xs uppercase mb-4">
                      Current Selection: {item?.size}
                    </p>
                    <p>Tk {item?.price?.toLocaleString()}</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-[11px] font-bold mb-2 uppercase">
                      Quantity
                    </p>
                    <QuantitySelector />
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-[11px] font-bold text-gray-800 mb-4 uppercase">
                    Size: <span className="text-gray-400">{selectedSize}</span>
                  </p>
                  <SizePicker />
                </div>
              </div>

              <div>
                <button
                  onClick={handleUpdateCart}
                  className="w-full bg-[#1c1c1c] text-white py-3 font-bold uppercase! hover:bg-black transition-all"
                >
                  Update Cart Content
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
