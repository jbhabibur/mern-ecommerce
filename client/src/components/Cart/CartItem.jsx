import { Plus, Minus, X, SquarePen } from "lucide-react";
import { getFullImagePath } from "../../api/apiConfig";

// Import redux
import { cartActions } from "../../redux/slices/cartSlice";

// Internal Component for individual Cart Items
export const CartItem = ({ item, dispatch, handleEditItem }) => {
  const { id, image, name, size, price, quantity } = item;

  const imageUrl = image?.url || "";

  return (
    <div className="flex gap-4 relative">
      <div className="flex-shrink-0">
        <img
          src={getFullImagePath(imageUrl)}
          alt={name}
          className="w-24 h-24 object-cover border border-gray-100"
        />
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-[13px]! font-medium text-gray-800 leading-tight mb-1 truncate">
          {name}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2 uppercase tracking-wider">
          <span>{size}</span>
          <button className="hover:text-black transition-colors">
            <SquarePen onClick={handleEditItem} size={15} />
          </button>
        </div>
        <p className="text-sm font-bold mb-3 font-mono tracking-tighter">
          Tk {price.toLocaleString()}.00
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-200 w-fit rounded-sm">
          <button
            onClick={() =>
              dispatch(
                cartActions.updateQuantity({
                  id,
                  size,
                  type: "decrement",
                }),
              )
            }
            className="px-2 py-1 text-gray-400 hover:text-black transition-all hover:bg-gray-50"
          >
            <Minus size={12} />
          </button>
          <span className="w-8 text-center text-xs font-bold border-x py-1 border-gray-200">
            {quantity}
          </span>
          <button
            onClick={() =>
              dispatch(
                cartActions.updateQuantity({
                  id,
                  size,
                  type: "increment",
                }),
              )
            }
            className="px-2 py-1 text-gray-400 hover:text-black transition-all hover:bg-gray-50"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      {/* Remove Item Button */}
      <button
        onClick={() => dispatch(cartActions.removeFromCart({ id, size }))}
        className="absolute top-0 right-0 text-gray-300 hover:text-black transition-all"
      >
        <X size={18} />
      </button>
    </div>
  );
};
