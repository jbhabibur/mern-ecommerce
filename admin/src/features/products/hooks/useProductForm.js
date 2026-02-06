import { useState } from "react";
import { createProduct } from "../services/productApi";

export const useProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compare_at_price: "",
    currency: "BDT",
    parentCategory: "",
    category: "",
    subcategory: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validation (Name & Price)
    const name = formData.name.trim();
    if (!name) {
      return alert("Product name cannot be empty");
    }

    // 2. Slug Processing
    const slug = formData.slug ? formData.slug.toLowerCase().trim() : "";

    // 3. Description
    const description = formData.description || "";

    // 4. Price Validation (Positive Number)
    const price = Number(formData.price);
    if (!formData.price || isNaN(price)) {
      return alert("Price is required and must be a number");
    }
    if (price <= 0) {
      return alert("Price must be a positive number");
    }

    // 5. Compare At Price Validation (Optional)
    let compare_at_price = undefined;
    if (formData.compare_at_price && formData.compare_at_price !== "") {
      compare_at_price = Number(formData.compare_at_price);
      if (isNaN(compare_at_price) || compare_at_price <= 0) {
        return alert("Compare price must be a positive number");
      }
    }

    // 6. Currency
    const currency = formData.currency || "BDT";

    // 7. Category ID Validation (Hex check for MongoDB ObjectId)
    const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

    if (formData.parentCategory && !isValidId(formData.parentCategory)) {
      return alert("Invalid Parent Category ID");
    }
    if (formData.category && !isValidId(formData.category)) {
      return alert("Invalid Category ID");
    }
    if (formData.subcategory && !isValidId(formData.subcategory)) {
      return alert("Invalid Subcategory ID");
    }

    setLoading(true);

    try {
      const payload = {
        name,
        slug,
        description,
        price,
        compare_at_price,
        currency,
        parentCategory: formData.parentCategory || null,
        category: formData.category || null,
        subcategory: formData.subcategory || null,
      };

      // API Call
      const result = await createProduct(payload);

      if (result.success) {
        alert("Product added successfully! 🚀");

        // Form Reset
        setFormData({
          name: "",
          slug: "",
          description: "",
          price: "",
          compare_at_price: "",
          currency: "BDT",
          parentCategory: "",
          category: "",
          subcategory: "",
        });
      }
    } catch (err) {
      console.error("Submission Error:", err);
      const errorMessage =
        err.response?.data?.message || "Server error occurred.";
      alert("Error: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleInputChange,
    handleSubmit,
  };
};
