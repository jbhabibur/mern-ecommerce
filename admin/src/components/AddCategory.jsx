import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, X, ChevronRight } from "lucide-react";

const BASE_URL = "http://localhost:5000";

export const AddCategory = () => {
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

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "name") {
      setFormData({ ...formData, name: value, slug: createSlug(value) });
    } else if (name === "slug") {
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
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    if (thumbnailFile) data.append("thumbnail", thumbnailFile);
    if (bannerFile) data.append("bannerImage", bannerFile);
    if (useSameImage) data.append("carouselSync", "true");
    else if (carouselFile) data.append("carouselImage", carouselFile);

    try {
      const response = await axios.post(`${BASE_URL}/api/categories`, data);
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
    <div className="min-h-screen bg-theme-base p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-theme-base border border-theme-line rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm overflow-hidden">
        {/* Header - Stacked on Mobile */}
        <header className="p-6 md:p-10 border-b border-theme-line flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-theme-front">
              Add Category
            </h2>
            <p className="text-theme-muted text-sm">
              Configure your store taxonomy
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 bg-theme-sub px-4 py-2 rounded-xl border border-theme-line cursor-pointer transition-all hover:border-theme-act">
              <input
                type="checkbox"
                name="showInCategories"
                checked={formData.showInCategories}
                onChange={handleChange}
                className="w-4 h-4 accent-theme-act"
              />
              <span className="text-xs font-bold text-theme-front uppercase tracking-tight">
                Show in Menu
              </span>
            </label>
            <label className="flex items-center gap-2 bg-theme-sub px-4 py-2 rounded-xl border border-theme-line cursor-pointer transition-all hover:border-theme-act">
              <input
                type="checkbox"
                name="showInCarousel"
                checked={formData.showInCarousel}
                onChange={handleChange}
                className="w-4 h-4 accent-theme-act"
              />
              <span className="text-xs font-bold text-theme-front uppercase tracking-tight">
                Show on Slider
              </span>
            </label>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Electronics"
            />
            <div className="space-y-1">
              <Input
                label="URL Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auto-generated-slug"
              />
              <span className="text-[10px] text-theme-muted px-2 italic">
                Custom path for SEO
              </span>
            </div>
          </div>

          {/* Image Upload Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-theme-muted">
                Media Assets
              </h3>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={useSameImage}
                  onChange={(e) => {
                    setUseSameImage(e.target.checked);
                    if (e.target.checked && bannerFile) {
                      setCarouselFile(bannerFile);
                      setCarouselPreview(bannerPreview);
                    }
                  }}
                  className="hidden"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${useSameImage ? "bg-theme-act border-theme-act" : "border-theme-line"}`}
                >
                  {useSameImage && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-xs font-bold text-theme-front group-hover:text-theme-act transition-colors">
                  Sync Banner to Carousel
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ImageUploadBox
                label="Thumbnail"
                preview={thumbnailPreview}
                onFileChange={(e) => handleFileChange(e, "thumbnail")}
                onClear={() => {
                  setThumbnailFile(null);
                  setThumbnailPreview(null);
                }}
              />

              <ImageUploadBox
                label="Banner"
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
                className={
                  useSameImage
                    ? "opacity-40 grayscale pointer-events-none relative"
                    : ""
                }
              >
                <ImageUploadBox
                  label="Carousel"
                  preview={carouselPreview}
                  onFileChange={(e) => handleFileChange(e, "carousel")}
                  onClear={() => {
                    setCarouselFile(null);
                    setCarouselPreview(null);
                  }}
                />
                {useSameImage && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-theme-act uppercase bg-theme-base/60">
                    Linked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Meta */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-theme-line">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-theme-front">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="w-full p-4 bg-theme-sub border border-theme-line rounded-2xl focus:border-theme-act outline-none text-theme-front resize-none"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief category summary..."
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-theme-front">
                Parent Category
              </label>
              <div className="relative">
                <select
                  name="parent"
                  className="w-full p-4 bg-theme-sub border border-theme-line rounded-2xl appearance-none outline-none text-theme-front cursor-pointer focus:border-theme-act"
                  onChange={handleChange}
                  value={formData.parent}
                >
                  <option value="">None (Top Level)</option>
                  {allCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-theme-muted">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-theme-sub/50 border border-theme-line border-dashed">
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  Assigning a parent creates a sub-category. This helps in
                  building nested navigation menus.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-theme-act text-theme-actfg rounded-2xl font-black text-lg shadow-lg shadow-theme-act/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? "Processing..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-theme-front">{label}</label>
    <input
      className="w-full p-4 bg-theme-sub border border-theme-line rounded-2xl focus:border-theme-act outline-none text-theme-front transition-all"
      {...props}
    />
  </div>
);

const ImageUploadBox = ({ label, preview, onFileChange, onClear }) => (
  <div className="group">
    <span className="block text-[11px] font-black text-theme-muted uppercase mb-2 ml-1">
      {label}
    </span>
    <div className="relative aspect-video sm:aspect-square md:aspect-video rounded-2xl border-2 border-dashed border-theme-line bg-theme-sub overflow-hidden hover:border-theme-act transition-colors">
      {preview ? (
        <>
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 bg-theme-error text-white rounded-full shadow-xl"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4">
          <Upload
            size={20}
            className="text-theme-muted mb-2 group-hover:text-theme-act transition-colors"
          />
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-tighter">
            Upload Image
          </span>
          <input
            type="file"
            className="hidden"
            onChange={onFileChange}
            accept="image/*"
          />
        </label>
      )}
    </div>
  </div>
);
