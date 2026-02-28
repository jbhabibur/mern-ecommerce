import React, { useEffect } from "react";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchWishlist,
  removeFromWishlistDB,
  removeFromWishlistLocal,
} from "../redux/slices/wishlistSlice";
import { cartActions } from "../redux/slices/cartSlice";
import { SectionLayout } from "../layout/SectionLayout";
import { Breadcrumb } from "../components/atoms/Breadcrumb";

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems = [] } = useSelector((state) => state.wishlist || {});
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, token]);

  const handleRemove = (productId) => {
    if (!productId) return;
    if (token) {
      dispatch(removeFromWishlistDB({ productId }));
    } else {
      dispatch(removeFromWishlistLocal(productId));
    }
  };

  const handleAddToCart = (product) => {
    if (!product) return;

    // 1. Find the primary image object, or fall back to the first image object
    const imageObject =
      product.images?.find((img) => img.isPrimary === true) ||
      product.images?.[0];

    // 2. Extract the URL string (handling cases where the array might contain strings or objects)
    const productFullImage =
      typeof imageObject === "object" ? imageObject.url : imageObject;

    console.log(productFullImage);

    dispatch(
      cartActions.addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: product.variants?.length > 0 ? product.variants[0].size : "M",
        image: productFullImage,
      }),
    );

    dispatch(cartActions.setCartOpen(true));
  };

  // Empty State
  if (!wishlistItems || wishlistItems.filter((p) => p != null).length === 0) {
    return (
      <SectionLayout>
        <div className="py-4">
          <Breadcrumb />
        </div>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="bg-gray-50 p-8 rounded-full inline-block mb-6 border border-gray-100">
              <Heart size={40} className="text-gray-300" strokeWidth={1} />
            </div>
            <h2 className="text-xl font-light uppercase tracking-[0.2em] text-gray-800 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
              Looks like you haven't added anything to your wishlist yet.
            </p>
            <Link
              to="/categories"
              className="inline-block no-underline! bg-black! text-white! px-10 py-3 border border-black hover:bg-white! hover:text-black! transition-all duration-500 uppercase text-[11px] font-bold tracking-[0.2em] no-underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout>
      <div className="py-6 md:py-8">
        <Breadcrumb />

        {/* Header Section */}
        <div className="mt-6 md:mt-8 mb-6 md:mb-10 border-b border-gray-100 pb-6">
          <h1 className="text-2xl! md:text-3xl! font-light tracking-[0.1em] text-gray-900 uppercase">
            My Wishlist
            <span className="text-[10px]! md:text-xs! font-bold text-gray-400 ml-4">
              / {wishlistItems.length} ITEMS
            </span>
          </h1>
        </div>

        <div className="w-full">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <div className="col-span-6">Product Details</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-4 text-center">Action</div>
          </div>

          {/* Product List */}
          <div className="flex flex-col">
            {wishlistItems
              .filter((p) => p != null)
              .map((product) => {
                const primaryImg =
                  product.images?.find((img) => img.isPrimary === true)?.url ||
                  product.images?.[0]?.url ||
                  product.images?.[0];

                return (
                  <div
                    key={product._id}
                    className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-50 px-2 md:px-4 group hover:bg-gray-50/50 transition-all duration-300"
                  >
                    {/* 1. Product Details (Image + Name) */}
                    <div className="w-full md:col-span-6 flex items-center gap-4 md:gap-6">
                      <div className="w-20 h-24 md:w-24 md:h-28 shrink-0 overflow-hidden bg-gray-100 border border-gray-100">
                        <img
                          src={primaryImg}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm! md:text-[13px]! font-medium text-gray-900 uppercase">
                          {product.name}
                        </h3>
                        <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-widest">
                          Fabric: {product.fabric || "Linen"}
                        </p>
                        {/* Mobile Price (Hidden on Desktop) */}
                        <span className="md:hidden text-sm font-bold text-black mt-1">
                          Tk {product.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* 2. Price (Desktop Only) */}
                    <div className="hidden md:block md:col-span-2 text-center">
                      <span className="text-sm font-bold text-black">
                        Tk {product.price?.toLocaleString()}
                      </span>
                    </div>

                    {/* 3. Actions (Add to Cart + Remove) */}
                    <div className="w-full md:col-span-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-black text-white py-3 px-4 text-[10px]! md:text-[11px]! font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>

                      <button
                        onClick={() => handleRemove(product._id)}
                        className="p-3 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
