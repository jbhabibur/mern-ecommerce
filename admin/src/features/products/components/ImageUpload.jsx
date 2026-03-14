import React, { useState } from "react";
import {
  Upload,
  X,
  Star,
  Link as LinkIcon,
  Crosshair,
  FileImage,
} from "lucide-react";
import { ImagePreviewModal } from "../components/ImagePreviewModal";
import { useTheme } from "../../../contexts/ThemeContext";

export const ImageUpload = ({ formData, setFormData }) => {
  const [urlInput, setUrlInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadMode, setUploadMode] = useState("file");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const setPrimary = (id) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).map((img) => ({
        ...img,
        isPrimary: img.id === id,
      })),
    }));
  };

  const setAsZoomView = (id) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).map((img) => ({
        ...img,
        isZoomView: img.id === id,
      })),
    }));
  };

  const processFiles = (files) => {
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
      isPrimary: (formData.images || []).length === 0,
      isZoomView: false,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImages],
    }));
  };

  const handleUrlUpload = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const newImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: urlInput,
      file: null,
      isPrimary: (formData.images || []).length === 0,
      isZoomView: false,
    };

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImage],
    }));
    setUrlInput("");
  };

  const removeImage = (id) => {
    const imageToRemove = formData.images.find((img) => img.id === id);
    if (imageToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  return (
    <section className="space-y-6">
      {/* Header & Toggle */}
      <div
        className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-theme-line/10" : "border-gray-100"}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
          <h2
            className={`text-xl font-bold ${isDark ? "text-theme-front" : "text-gray-800"}`}
          >
            Product Media
          </h2>
        </div>

        <div
          className={`flex p-1 rounded-xl ${isDark ? "bg-theme-base border border-theme-line/10" : "bg-gray-100"}`}
        >
          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              uploadMode === "file"
                ? isDark
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-indigo-600 shadow-sm"
                : isDark
                  ? "text-theme-muted hover:text-theme-front"
                  : "text-gray-500"
            }`}
          >
            <FileImage className="w-3.5 h-3.5" /> FILE
          </button>
          <button
            type="button"
            onClick={() => setUploadMode("url")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              uploadMode === "url"
                ? isDark
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-indigo-600 shadow-sm"
                : isDark
                  ? "text-theme-muted hover:text-theme-front"
                  : "text-gray-500"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> URL
          </button>
        </div>
      </div>

      {/* Upload Zones */}
      <div className="relative min-h-[160px]">
        {uploadMode === "file" ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group ${
              isDark
                ? "border-theme-line/20 bg-theme-base hover:bg-theme-line/5"
                : "border-gray-200 bg-gray-50 hover:bg-indigo-50/30"
            }`}
          >
            <Upload className="text-indigo-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
            <p
              className={`font-medium ${isDark ? "text-theme-muted" : "text-gray-600"}`}
            >
              Drag & drop or click to upload
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => processFiles(Array.from(e.target.files))}
            />
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center ${
              isDark
                ? "border-indigo-900/40 bg-indigo-950/10"
                : "border-indigo-200 bg-indigo-50/20"
            }`}
          >
            <LinkIcon className="text-indigo-600 w-8 h-8 mb-4" />
            <form
              onSubmit={handleUrlUpload}
              className="w-full max-w-md flex gap-2"
            >
              <input
                type="url"
                placeholder="Paste image URL here..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-xl border outline-none shadow-sm text-sm transition-colors ${
                  isDark
                    ? "bg-theme-base border-theme-line/20 text-theme-front focus:ring-indigo-500/50"
                    : "bg-white border-gray-200 focus:ring-indigo-500"
                }`}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-700 font-bold transition-colors shadow-lg"
              >
                ADD
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {formData.images?.map((img) => (
          <div
            key={img.id}
            className={`relative group rounded-xl overflow-hidden border-2 transition-all aspect-square ${
              img.isPrimary
                ? "border-indigo-600 ring-2 ring-indigo-500/20"
                : isDark
                  ? "border-theme-line/20"
                  : "border-gray-100"
            }`}
          >
            <img
              src={img.url}
              alt="preview"
              className="w-full h-full object-cover"
            />

            {/* Flags for User Feedback */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {img.isPrimary && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> PRIMARY
                </span>
              )}
              {img.isZoomView && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Crosshair className="w-3 h-3" /> ZOOM VIEW
                </span>
              )}
            </div>

            {/* Overlay Buttons */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPrimary(img.id)}
                className={`p-2 rounded-full transition-transform hover:scale-110 ${img.isPrimary ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"}`}
              >
                <Star
                  className={`w-5 h-5 ${img.isPrimary ? "fill-current" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => setAsZoomView(img.id)}
                className={`p-2 rounded-full transition-transform hover:scale-110 ${img.isZoomView ? "bg-amber-500 text-white" : "bg-white text-amber-500"}`}
              >
                <Crosshair className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ImagePreviewModal
        previewImage={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </section>
  );
};
