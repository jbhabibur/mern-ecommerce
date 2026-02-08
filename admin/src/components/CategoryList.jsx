import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Monitor,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories/list-all`);
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Toggle "Show on Home" (Carousel Control)
  const handleToggleHome = async (id, currentState) => {
    try {
      // We send the opposite of current state to the DB
      const res = await axios.patch(`${BASE_URL}/api/categories/${id}`, {
        showOnHome: !currentState,
      });

      if (res.data.success) {
        // Update local state so the UI reflects the DB change immediately
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === id ? { ...cat, showOnHome: !currentState } : cat,
          ),
        );
        console.log(`Category ${id} updated to: ${!currentState}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update status in Database");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-sans">
              Manage Categories
            </h2>
            <p className="text-gray-500 text-sm">
              Control which categories appear on your homepage carousel.
            </p>
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
            Total: {categories.length}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Banner
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">
                  Show on Home
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr
                  key={category._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {category.parent ? "Sub-category" : "Main Category"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {category.bannerImage ? (
                      <img
                        src={category.bannerImage}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        alt="banner"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono italic">
                    /{category.slug}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        handleToggleHome(category._id, category.showOnHome)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        category.showOnHome ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.showOnHome
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-500 hover:text-blue-700 transition">
                      <ExternalLink size={18} />
                    </button>
                    <button className="text-red-400 hover:text-red-600 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="p-10 text-center text-gray-400 italic">
              No categories found. Start by adding one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
