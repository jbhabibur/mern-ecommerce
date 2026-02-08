import React, { useState } from "react";
import { X, Upload, Link, Image as ImageIcon, Hash } from "lucide-react";

export const PromoModal = ({
  editingSlot,
  form,
  setForm,
  categories,
  loading,
  onClose,
  onImageChange,
  onSubmit,
}) => {
  const [uploadMethod, setUploadMethod] = useState(
    form.imagePreview?.startsWith("http") ? "url" : "file",
  );

  return (
    <div className="fixed inset-0 bg-theme-front/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6">
      <div className="bg-theme-base rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-theme-line transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-theme-line bg-theme-sub/20">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              {editingSlot ? "Edit Banner" : "New Banner"}
            </h2>
            <p className="text-xs text-theme-muted font-medium mt-1">
              Configure your promotional display
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-theme-muted hover:text-theme-front p-2 hover:bg-theme-sub rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Toggle Switch */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-theme-muted ml-1">
              Upload Method
            </label>
            <div className="flex p-1 bg-theme-sub/20 rounded-2xl border border-theme-line w-fit">
              <button
                type="button"
                onClick={() => setUploadMethod("file")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  uploadMethod === "file"
                    ? "bg-theme-base shadow-sm text-theme-front"
                    : "text-theme-muted hover:text-theme-front"
                }`}
              >
                <Upload size={14} /> File Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod("url")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  uploadMethod === "url"
                    ? "bg-theme-base shadow-sm text-theme-front"
                    : "text-theme-muted hover:text-theme-front"
                }`}
              >
                <Link size={14} /> Image URL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Image Management */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-theme-muted ml-1">
                Banner Visual
              </label>

              {uploadMethod === "file" ? (
                <div
                  className="group relative border-2 border-dashed border-theme-line rounded-2xl p-2 flex flex-col items-center justify-center hover:border-theme-act bg-theme-sub/10 hover:bg-theme-sub/30 cursor-pointer transition-all min-h-[180px]"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      className="h-44 w-full object-cover rounded-xl"
                      alt="preview"
                    />
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-theme-sub rounded-full flex items-center justify-center mx-auto mb-3 border border-theme-line">
                        <Upload className="text-theme-muted" size={20} />
                      </div>
                      <p className="text-xs text-theme-muted font-bold">
                        Browse local files
                      </p>
                    </div>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => onImageChange(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      className="w-full bg-theme-sub/20 border border-theme-line rounded-xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-theme-act outline-none pl-11"
                      placeholder="https://example.com/image.jpg"
                      value={form.imagePreview || ""}
                      onChange={(e) =>
                        setForm({ ...form, imagePreview: e.target.value })
                      }
                    />
                    <Link
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
                      size={18}
                    />
                  </div>
                  {form.imagePreview && (
                    <div className="relative rounded-2xl overflow-hidden border border-theme-line h-32">
                      <img
                        src={form.imagePreview}
                        className="w-full h-full object-cover"
                        alt="URL preview"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="space-y-4">
              {/* SLOT NUMBER FIELD */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-theme-muted ml-1">
                  Slot Position (ID)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-theme-sub/20 border border-theme-line rounded-xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-theme-act outline-none pl-11"
                    placeholder="e.g. 1"
                    value={form.slot_number || ""}
                    onChange={(e) =>
                      setForm({ ...form, slot_number: e.target.value })
                    }
                    required
                  />
                  <Hash
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-theme-muted ml-1">
                  Linked Category
                </label>
                <select
                  className="w-full bg-theme-sub/20 border border-theme-line rounded-xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-theme-act outline-none appearance-none"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select a category...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-theme-muted ml-1">
                  Banner Title / Badge
                </label>
                <input
                  className="w-full bg-theme-sub/20 border border-theme-line rounded-xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-theme-act outline-none"
                  placeholder="e.g. Summer Collection"
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 border border-theme-line rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-theme-sub transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-1 px-4 py-4 bg-theme-act text-theme-actfg rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 shadow-lg shadow-theme-act/30 transition-all"
            >
              {loading
                ? "Saving..."
                : editingSlot
                  ? "Update Banner"
                  : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
