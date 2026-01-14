import { useParams } from "react-router-dom";

export const Breadcrumb = () => {
  const { categoryName } = useParams();
  console.log(categoryName);

  return (
    <nav className="text-sm text-gray-500 mb-6">
      Home <span className="mx-2">&gt;</span>{" "}
      <span className="text-gray-800 font-medium">
        {categoryName.toUpperCase()}
      </span>
    </nav>
  );
};
