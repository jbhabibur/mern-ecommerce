import { useState, useEffect } from "react";
import { getCategoriesList } from "../../../services/categoryService";

export const useCategoriesData = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Ekhane amra 'thumbnail' field-ti fetch korchi
        const response = await getCategoriesList(
          "name,thumbnail,slug,_id,showInCategories",
        );

        if (response.success) {
          // Filter: Jader thumbnail ache ebong home-e show korbe
          const filtered = response.data.filter(
            (cat) => cat.thumbnail && cat.showInCategories === true,
          );
          setCategories(filtered);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};
