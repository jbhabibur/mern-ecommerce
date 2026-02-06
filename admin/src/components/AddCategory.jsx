import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const BASE_URL = "http://localhost:5000";

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [useSameImage, setUseSameImage] = useState(false);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [carouselFile, setCarouselFile] = useState(null);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [carouselPreview, setCarouselPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent: "",
    showInCarousel: false,
    showInCategories: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories/list-all`);
      if (res.data?.success) setAllCategories(res.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // HELPER: To format string into a slug
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, ""); // Remove all non-word chars
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      // Auto-generate slug when name changes
      setFormData({
        ...formData,
        name: value,
        slug: createSlug(value),
      });
    } else if (name === "slug") {
      // Manual edit for slug: allow user to type and format on the fly
      setFormData({
        ...formData,
        slug: value.toLowerCase().replace(/\s+/g, "-"),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const previewUrl = URL.createObjectURL(selectedFile);

    if (type === "thumbnail") {
      setThumbnailFile(selectedFile);
      setThumbnailPreview(previewUrl);
    } else if (type === "banner") {
      setBannerFile(selectedFile);
      setBannerPreview(previewUrl);
      if (useSameImage) {
        setCarouselFile(selectedFile);
        setCarouselPreview(previewUrl);
      }
    } else if (type === "carousel") {
      setCarouselFile(selectedFile);
      setCarouselPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("showInCarousel", formData.showInCarousel);
    data.append("showInCategories", formData.showInCategories);

    if (formData.parent) data.append("parent", formData.parent);
    if (thumbnailFile) data.append("thumbnail", thumbnailFile);
    if (bannerFile) data.append("bannerImage", bannerFile);

    if (useSameImage) {
      data.append("carouselSync", "true");
    } else if (carouselFile) {
      data.append("carouselImage", carouselFile);
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/categories`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      parent: "",
      showInCarousel: false,
      showInCategories: true,
    });
    setThumbnailFile(null);
    setBannerFile(null);
    setCarouselFile(null);
    setThumbnailPreview(null);
    setBannerPreview(null);
    setCarouselPreview(null);
    setUseSameImage(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100">
        <header className="border-b pb-6 mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Add Category</h2>
            <p className="text-slate-500">
              Manage visibility and upload images.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              <input
                type="checkbox"
                name="showInCategories"
                id="showInCategories"
                checked={formData.showInCategories}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
              <label
                htmlFor="showInCategories"
                className="text-sm font-bold text-blue-700 cursor-pointer"
              >
                Show in Categories
              </label>
            </div>

            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
              <input
                type="checkbox"
                name="showInCarousel"
                id="showInCarousel"
                checked={formData.showInCarousel}
                onChange={handleChange}
                className="w-5 h-5 accent-green-600 cursor-pointer"
              />
              <label
                htmlFor="showInCarousel"
                className="text-sm font-bold text-green-700 cursor-pointer"
              >
                Show on Slider
              </label>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {/* UPDATED SLUG FIELD: Removed readOnly and added hint */}
            <div className="relative">
              <Input
                label="Slug (Editable)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="category-url-path"
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-2">
                Generated from name, but you can change it.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-2xl w-fit border border-slate-200">
            <input
              type="checkbox"
              id="syncImages"
              checked={useSameImage}
              onChange={(e) => {
                setUseSameImage(e.target.checked);
                if (e.target.checked && bannerFile) {
                  setCarouselFile(bannerFile);
                  setCarouselPreview(bannerPreview);
                }
              }}
              className="w-4 h-4 accent-slate-900 cursor-pointer"
            />
            <label
              htmlFor="syncImages"
              className="text-sm font-extrabold text-slate-700 cursor-pointer"
            >
              Use Banner Image for Carousel as well
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageUploadBox
              label="Thumbnail (Icon)"
              preview={thumbnailPreview}
              onFileChange={(e) => handleFileChange(e, "thumbnail")}
              onClear={() => {
                setThumbnailFile(null);
                setThumbnailPreview(null);
              }}
            />
            <ImageUploadBox
              label="Banner (Page Top)"
              preview={bannerPreview}
              onFileChange={(e) => handleFileChange(e, "banner")}
              onClear={() => {
                setBannerFile(null);
                setBannerPreview(null);
                if (useSameImage) {
                  setCarouselFile(null);
                  setCarouselPreview(null);
                }
              }}
            />
            <div
              className={useSameImage ? "opacity-50 pointer-events-none" : ""}
            >
              <ImageUploadBox
                label="Carousel (Slider)"
                preview={carouselPreview}
                onFileChange={(e) => handleFileChange(e, "carousel")}
                onClear={() => {
                  setCarouselFile(null);
                  setCarouselPreview(null);
                }}
              />
              {useSameImage && (
                <p className="text-[10px] text-blue-600 font-bold mt-2 ml-2 italic">
                  ✓ Synced
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                className="w-full p-4 border border-slate-200 rounded-2xl outline-none"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Parent Category
              </label>
              <select
                name="parent"
                className="w-full p-4 border border-slate-200 rounded-2xl bg-white outline-none cursor-pointer"
                onChange={handleChange}
                value={formData.parent}
              >
                <option value="">None (Main Category)</option>
                {allCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all ${
              loading ? "bg-slate-300" : "bg-slate-900 hover:bg-black shadow-xl"
            }`}
          >
            {loading ? "UPLOADING..." : "SAVE CATEGORY"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Sub-components
const Input = ({ label, className = "", ...props }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">
      {label}
    </label>
    <input
      className={`w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

const ImageUploadBox = ({ label, preview, onFileChange, onClear, error }) => (
  <div className="flex flex-col">
    <label className="block text-sm font-bold text-slate-700 mb-2">
      {label}
    </label>
    <div
      className={`relative h-48 border-2 border-dashed rounded-[2rem] flex items-center justify-center transition-all overflow-hidden ${error ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
    >
      {preview ? (
        <div className="relative w-full h-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center cursor-pointer p-6 w-full h-full justify-center text-center">
          <div className="p-3 bg-white rounded-2xl shadow-sm mb-3 text-slate-400">
            <Upload size={24} />
          </div>
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
            Select Image
          </span>
          <input
            type="file"
            className="hidden"
            onChange={onFileChange}
            accept=".jpg, .jpeg, .png, .webp"
          />
        </label>
      )}
    </div>
  </div>
);

export default AddCategory;
