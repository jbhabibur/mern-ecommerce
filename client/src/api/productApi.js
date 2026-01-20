import axios from "axios";

export const fetchCategoryProducts = async (slug) => {
  // Use 'categories' (plural) to match the URL that worked in Postman
  const response = await axios.get(
    `http://localhost:5000/api/products/categories/${slug}`,
  );
  return response.data;
};
