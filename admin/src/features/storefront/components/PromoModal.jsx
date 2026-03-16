import React, { useState } from "react";
import { X, Upload, Link, Hash } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [uploadMethod, setUploadMethod] = useState(
    form.imagePreview?.startsWith("http") ? "url" : "file",
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-6 transition-all">
      <div
        className={`
        w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border transition-all duration-300
        ${isDark ? "bg-[#1A1A1A] border-white/10" : "bg-white border-slate-200"}
      `}
      >
        {/* Header */}
        <div
          className={`
          flex justify-between items-center p-8 border-b
          ${isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50/50"}
        `}
        >
          <div>
            <h2
              className={`text-3xl font-black uppercase tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {editingSlot ? "Edit Banner" : "New Banner"}
            </h2>
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-70 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Configuration & Display Logic
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-3 rounded-2xl transition-all ${isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-8">
          {/* Toggle Switch */}
          <div className="space-y-3">
            <label
              className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              Upload Strategy
            </label>
            <div
              className={`flex p-1.5 rounded-2xl border w-fit ${isDark ? "bg-black/20 border-white/5" : "bg-slate-100 border-slate-200"}`}
            >
              <button
                type="button"
                onClick={() => setUploadMethod("file")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                  uploadMethod === "file"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xl"
                      : "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-400"
                }`}
              >
                <Upload size={14} /> FILE
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod("url")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                  uploadMethod === "url"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xl"
                      : "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-400"
                }`}
              >
                <Link size={14} /> URL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Visual */}
            <div className="space-y-3">
              <label
                className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                Banner Preview
              </label>

              {uploadMethod === "file" ? (
                <div
                  className={`
                    group relative border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all min-h-[220px] overflow-hidden
                    ${isDark ? "border-white/10 bg-white/[0.02] hover:border-blue-500/50" : "border-slate-200 bg-slate-50 hover:border-blue-500"}
                  `}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="preview"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload
                        className="mx-auto mb-2 text-slate-400"
                        size={28}
                      />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Select Image
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
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      className={`w-full border rounded-2xl p-4 text-sm font-bold outline-none pl-12 transition-all ${
                        isDark
                          ? "bg-black/20 border-white/10 text-white focus:border-blue-500"
                          : "bg-white border-slate-200 focus:border-blue-500"
                      }`}
                      placeholder="Paste image link..."
                      value={form.imagePreview || ""}
                      onChange={(e) =>
                        setForm({ ...form, imagePreview: e.target.value })
                      }
                    />
                    <Link
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                  </div>
                  {form.imagePreview && (
                    <div className="rounded-[2rem] overflow-hidden border border-white/10 h-32 shadow-2xl">
                      <img
                        src={form.imagePreview}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Meta */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Slot Position
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className={`w-full border rounded-2xl p-4 text-sm font-bold outline-none pl-12 transition-all ${
                      isDark
                        ? "bg-black/20 border-white/10 text-white focus:border-blue-500"
                        : "bg-white border-slate-200 focus:border-blue-500"
                    }`}
                    value={form.slot_number || ""}
                    onChange={(e) =>
                      setForm({ ...form, slot_number: e.target.value })
                    }
                    required
                  />
                  <Hash
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Target Category
                </label>
                <select
                  className={`w-full border rounded-2xl p-4 text-sm font-bold outline-none appearance-none transition-all ${
                    isDark
                      ? "bg-black/20 border-white/10 text-white focus:border-blue-500"
                      : "bg-white border-slate-200 focus:border-blue-500"
                  }`}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="">Choose...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Banner Label
                </label>
                <input
                  className={`w-full border rounded-2xl p-4 text-sm font-bold outline-none transition-all ${
                    isDark
                      ? "bg-black/20 border-white/10 text-white focus:border-blue-500"
                      : "bg-white border-slate-200 focus:border-blue-500"
                  }`}
                  placeholder="e.g. NEW ARRIVALS"
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                isDark
                  ? "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-500/20 transition-all"
            >
              {loading
                ? "Processing..."
                : editingSlot
                  ? "Update Changes"
                  : "Deploy Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
