import { useEffect } from "react";
import { useParams } from "react-router-dom";

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
import { resetSelection } from "../redux/slices/selectionSlice";

export const ProductOverview = () => {
  const { slug } = useParams();

  const isVisible = useScrollThreshold(730);

  // Data Fetching
  const { data: product, isLoading, isError } = useProduct(slug);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetSelection());
    if (product) {
      dispatch(setActiveProduct(product));
    }
    // Cleanup: Page theke ber hoye gele clear hobe
    return () => {
      dispatch(clearActiveProduct());
      dispatch(resetSelection());
    };
  }, [product, slug, dispatch]);

  useEffect(() => {
    // isVisible true/false holei Redux update hobe
    dispatch(setStickyVisibility(isVisible));
  }, [isVisible, dispatch]);

  // LOADING & ERROR STATES
  if (isLoading) {
    return <ComponentLoader />;
  }

  if (isError || !product) {
    return <ErrorState />;
  }

  return (
    <>
      <SectionLayout>
        <div className="max-w-7xl mx-auto p-2 md:p-8 lg:px-12">
          {/* 1. Navigation */}
          <Breadcrumb />

          {/* 
          Main Product Section: 
          Renders core product details including Gallery, Pricing, and CTA 
        */}
          <ProductDetailsView product={product} />

          {/* 
          Supplementary Content: 
          Displays related items to drive cross-selling and engagement 
        */}
          <RelatedProducts product={product} />
        </div>
      </SectionLayout>
    </>
  );
};
