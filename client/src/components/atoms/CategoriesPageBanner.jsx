import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const CategoriesPageBanner = () => {
  const [images, setImages] = useState([]);
  const { categoryName } = useParams();

  useEffect(() => {
    axios
      .get("/categories/shirt")
      .then((res) => {
        console.log(res.data);
        setImages(res.data);
      })
      .catch(() => {
        console.log("Failed");
      });
  }, []);

  return (
    <div className="w-full mb-6">
      <img
        src="https://images.unsplash.com/photo-1441997646720-76756382e370?q=80&w=1200&auto=format&fit=crop"
        alt="Shirt Banner"
        className="w-full h-[250px] md:h-[300px] object-cover rounded-sm"
      />
    </div>
  );
};
