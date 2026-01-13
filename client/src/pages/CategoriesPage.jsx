import { useParams } from "react-router-dom";

export const CategoriesPage = () => {
  const { categoryName } = useParams();
  console.log(categoryName);
  return <div>CategoriesPage</div>;
};
