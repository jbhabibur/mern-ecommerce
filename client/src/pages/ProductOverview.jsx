import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

// Import components
import { SectionLayout } from "../layout/SectionLayout";
import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { ProductDetailsView } from "../features/product-details/components/ProductDetailsView";
import { ReviewSection } from "../features/product-details/components/ReviewSection";
import { RelatedProducts } from "../features/product-details/components/RelatedProducts";
import { ComponentLoader } from "../components/loaders/ComponentLoader";
import { ErrorState } from "../components/shared/ErrorState";

// Import hooks
import { useProduct } from "../hooks/useProduct";
import { useScrollThreshold } from "../features/product-details/hooks/useScrollThreshold";

// Import redux
import { useDispatch } from "react-redux";
import {
  setActiveProduct,
  clearActiveProduct,
  setStickyVisibility,
} from "../redux/slices/productSlice";
import { resetSelection, setSize } from "../redux/slices/selectionSlice";

/**
 * ProductOverview Component
 * Serves as the main container for individual product pages.
 * Handles data fetching, synchronization with Redux, and scroll-based UI states.
 */
export const ProductOverview = () => {
  const { slug } = useParams();
  const location = useLocation();

  // Tracks scroll position to manage sticky UI elements (e.g., sticky add-to-cart)
  const isVisible = useScrollThreshold(730);

  // Fetch product data based on URL slug
  const { data: product, isLoading, isError } = useProduct(slug);

  const dispatch = useDispatch();

  /**
   * Effect: Synchronizes product data and manages initial variant selection.
   * Logic:
   * 1. Resets previous selections and sets current product to global state.
   * 2. Prioritizes size passed via navigation state (e.g., from ProductCard).
   * 3. Falls back to the first available in-stock variant if no size is pre-selected.
   * * Optimization: We use product?._id as a dependency instead of the entire 'product' object
   * or 'location' object. This prevents state resets when URL search parameters (like 'sp'
   * for reviews) are modified or removed.
   */
  useEffect(() => {
    if (product) {
      // Clear previous variant/quantity selections
      dispatch(resetSelection());

      // Update global active product state
      dispatch(setActiveProduct(product));

      // Check if a specific size was passed from the previous page
      const passedSize = location.state?.selectedSize;

      if (
        passedSize &&
        product.variants?.some((v) => v.size === passedSize && v.stock > 0)
      ) {
        dispatch(setSize(passedSize));
      } else {
        // Default to the first in-stock variant
        const firstAvailable = product.variants?.find((v) => v.stock > 0);

        if (firstAvailable) {
          dispatch(setSize(firstAvailable.size));
        }
      }
    }

    // Cleanup: Clear active product from Redux when navigating away
    return () => {
      dispatch(clearActiveProduct());
    };
  }, [product?._id, dispatch]); // Optimized dependency array to prevent flickering

  /**
   * Effect: Updates Redux with the visibility state of the sticky add-to-cart bar.
   */
  useEffect(() => {
    dispatch(setStickyVisibility(isVisible));
  }, [isVisible, dispatch]);

  // Render loading state while fetching data
  if (isLoading) {
    return <ComponentLoader />;
  }

  // Render error state if fetching fails or product is missing
  if (isError || !product) {
    return <ErrorState />;
  }

  return (
    <>
      <SectionLayout>
        <div className="max-w-7xl mx-auto p-2 md:p-8 lg:px-12">
          {/* Breadcrumb Navigation */}
          <Breadcrumb />

          {/* Main Product View: Includes Gallery, Info, and CTA buttons */}
          <ProductDetailsView product={product} />

          {/* Customer Reviews: Handles review display and submission logic */}
          <ReviewSection
            productId={product._id}
            productAnalytics={product.analytics}
            isAdmin={false}
          />

          {/* Cross-selling Section: Displays contextually relevant products */}
          <RelatedProducts product={product} />
        </div>
      </SectionLayout>
    </>
  );
};
