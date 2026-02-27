import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

// Import components
import { SectionLayout } from "../layout/SectionLayout";
import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { ProductDetailsView } from "../features/product-details/components/ProductDetailsView";
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

export const ProductOverview = () => {
  const { slug } = useParams();
  const location = useLocation();

  // Custom hook to track scroll position for UI elements like sticky add-to-cart
  const isVisible = useScrollThreshold(730);

  // Data Fetching based on product slug
  const { data: product, isLoading, isError } = useProduct(slug);

  const dispatch = useDispatch();

  /**
   * Effect: Handles product data synchronization and initial variant selection logic.
   * Logic:
   * 1. If a size is already in Redux/LocalStorage (from ProductCard), keep it.
   * 2. If no size is selected (Image click), find the first available in-stock variant.
   */
  useEffect(() => {
    if (product) {
      dispatch(resetSelection());

      dispatch(setActiveProduct(product));

      const passedSize = location.state?.selectedSize;

      if (
        passedSize &&
        product.variants?.some((v) => v.size === passedSize && v.stock > 0)
      ) {
        dispatch(setSize(passedSize));
      } else {
        const firstAvailable = product.variants?.find((v) => v.stock > 0);

        if (firstAvailable) {
          dispatch(setSize(firstAvailable.size));
        }
      }
    }

    return () => {
      dispatch(clearActiveProduct());
    };
  }, [product, location.state, dispatch]);

  /**
   * Effect: Syncs sticky element visibility state with Redux for global UI components.
   */
  useEffect(() => {
    dispatch(setStickyVisibility(isVisible));
  }, [isVisible, dispatch]);

  // Handle Loading State
  if (isLoading) {
    return <ComponentLoader />;
  }

  // Handle Error or Not Found State
  if (isError || !product) {
    return <ErrorState />;
  }

  return (
    <>
      <SectionLayout>
        <div className="max-w-7xl mx-auto p-2 md:p-8 lg:px-12">
          {/* Breadcrumb Navigation */}
          <Breadcrumb />

          {/* Main Product Section: 
            Renders core product details including Gallery, Pricing, and CTA 
          */}
          <ProductDetailsView product={product} />

          {/* Supplementary Content: 
            Displays related items to drive cross-selling and engagement 
          */}
          <RelatedProducts product={product} />
        </div>
      </SectionLayout>
    </>
  );
};
