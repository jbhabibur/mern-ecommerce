import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfoSection } from "./ProductInfoSection";
import { ProductExtraInfo } from "./ProductExtraInfo";

export const ProductDetailsView = ({ product }) => {
  if (!product) return null;

  return (
    <>
      {/* 1. Removed 'overflow-hidden' because it breaks sticky positioning */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start w-full">
        {/* Module 1: Gallery */}
        <div className="w-full lg:w-[58%]">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Module 2: Info (Sticky Section) */}
        {/* 2. Added 'h-fit' to ensure the container doesn't stretch, allowing it to stick */}
        <div className="w-full lg:w-[42%] min-w-0 lg:sticky lg:top-10 self-start h-fit">
          <ProductInfoSection product={product} />
        </div>
      </div>

      <div className="mt-2 sm:mt-12 sm:pt-10">
        <ProductExtraInfo product={product} />
      </div>
    </>
  );
};
