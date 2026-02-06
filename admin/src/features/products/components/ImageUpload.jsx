import React, { useState } from "react";
import {
  Upload,
  X,
  Star,
  Link as LinkIcon,
  Maximize2,
  Crosshair,
  FileImage,
} from "lucide-react";
import { ImagePreviewModal } from "../components/ImagePreviewModal";

export const ImageUpload = ({ formData, setFormData }) => {
  const [urlInput, setUrlInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadMode, setUploadMode] = useState("file");

  // logic to update images in formData
  const updateImages = (newImages) => {
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const setPrimary = (id) => {
    const updated = formData.images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    updateImages(updated);
  };

  const setAsZoomView = (id) => {
    const updated = formData.images.map((img) => ({
      ...img,
      isZoomView: img.id === id,
    }));
    updateImages(updated);
  };

  const processFiles = (files) => {
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file), // For frontend preview
      file: file, // Critical for Cloudinary upload
      isPrimary: (formData.images || []).length === 0,
      isZoomView: false,
    }));
    updateImages([...(formData.images || []), ...newImages]);
  };

  const handleUrlUpload = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const newImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: urlInput,
      file: null, // No binary file for URLs
      isPrimary: (formData.images || []).length === 0,
      isZoomView: false,
    };
    updateImages([...(formData.images || []), newImage]);
    setUrlInput("");
  };

  const removeImage = (id) => {
    const updated = formData.images.filter((img) => img.id !== id);
    // Revoke object URL to prevent memory leaks
    const removedImg = formData.images.find((img) => img.id === id);
    if (removedImg?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(removedImg.url);
    }
    updateImages(updated);
  };

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">Product Media</h2>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              uploadMode === "file"
                ? "bg-white text-indigo-600 shadow-sm"
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
                ? "bg-white text-indigo-600 shadow-sm"
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
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-indigo-50/30 transition-all cursor-pointer group">
            <Upload className="text-indigo-600 w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-gray-600 font-medium">
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
          <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-indigo-50/20">
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
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-sm"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-700 font-bold"
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
                ? "border-indigo-600 ring-2 ring-indigo-100"
                : "border-gray-100"
            }`}
          >
            <img
              src={img.url}
              alt="preview"
              className="w-full h-full object-cover"
            />

            {/* Overlay Buttons */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPrimary(img.id)}
                className={`p-2 rounded-full ${img.isPrimary ? "bg-indigo-600" : "bg-white text-indigo-600"}`}
              >
                <Star
                  className={`w-5 h-5 ${img.isPrimary ? "fill-current text-white" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => setAsZoomView(img.id)}
                className={`p-2 rounded-full ${img.isZoomView ? "bg-amber-500 text-white" : "bg-white text-amber-500"}`}
              >
                <Crosshair className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-white text-red-600 rounded-lg"
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
