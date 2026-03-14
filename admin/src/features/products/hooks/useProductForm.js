import { useState } from "react";
import { createProduct, updateProduct } from "../services/productApi";

export const useProductForm = (initialData = null) => {
  const [loading, setLoading] = useState(false);

  // Initialize with initialData (for Edit) or defaults (for Create)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    compare_at_price: initialData?.compare_at_price || "",
    currency: initialData?.currency || "BDT",
    parentCategory: initialData?.parentCategory || "",
    category: initialData?.category || "",
    subcategory: initialData?.subcategory || "",
    images: initialData?.images || [], // Can contain URLs (strings) or {file} objects
    color: initialData?.color || "",
    fabric: initialData?.fabric || "",
    variants: initialData?.variants || [{ size: "", stock: 0 }],
    isNewArrival: initialData?.isNewArrival || false,
    bestSeller: initialData?.bestSeller || false,
    analytics: initialData?.analytics || {
      totalSales: 0,
      totalViews: 0,
      reviewCount: 0,
      averageRating: 0,
      popularityScore: 0,
    },
    itemType: initialData?.itemType || "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = async (externalCallback = null) => {
    // Basic Validation
    if (!formData.name.trim()) return alert("Product name is required");
    if (!formData.price || isNaN(formData.price))
      return alert("Valid price is required");

    setLoading(true);

    try {
      const data = new FormData();

      // Append basic fields
      data.append("name", formData.name);
      data.append("slug", formData.slug.toLowerCase().trim());
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("compare_at_price", formData.compare_at_price || "");
      data.append("currency", formData.currency);
      data.append("parentCategory", formData.parentCategory);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("itemType", formData.itemType);
      data.append("isNewArrival", formData.isNewArrival);
      data.append("bestSeller", formData.bestSeller);
      data.append("color", formData.color);
      data.append("fabric", formData.fabric);

      // Stringify objects/arrays
      data.append("analytics", JSON.stringify(formData.analytics));
      data.append("variants", JSON.stringify(formData.variants));

      // Handle Images: Distinguish between existing URLs and new Files
      const metadata = [];
      formData.images.forEach((img) => {
        if (img.file) {
          data.append("images", img.file);
          metadata.push({
            isPrimary: img.isPrimary,
            isZoomView: img.isZoomView,
            isNew: true,
          });
        } else {
          // If it's an existing image URL
          metadata.push({
            url: img.url,
            isPrimary: img.isPrimary,
            isZoomView: img.isZoomView,
            isNew: false,
          });
        }
      });
      data.append("imageMetadata", JSON.stringify(metadata));

      let result;
      if (initialData?._id) {
        // UPDATE MODE
        result = await updateProduct(initialData._id, data);
      } else {
        // CREATE MODE
        result = await createProduct(data);
      }

      if (result.success) {
        alert(
          initialData ? "Updated successfully! ✨" : "Created successfully! 🚀",
        );
        if (externalCallback) externalCallback(result.data);
        return true;
      } else {
        alert("Error: " + result.message);
        return false;
      }
    } catch (err) {
      alert("System Error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleInputChange,
    handleVariantChange,
    handleSubmit,
  };
};
