import React from "react";
import {
  Plus,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
  UploadCloud,
  X,
  Instagram,
  LayoutGrid,
} from "lucide-react";
import { useSocialFeedManager } from "./hooks/useSocialFeedManager";

export const SocialMediaManager = () => {
  const {
    posts,
    loading,
    isUploading,
    selectedImages,
    useExternalLink,
    externalUrl,
    setExternalUrl,
    setUseExternalLink,
    handleFileUpload,
    removeSelectedImage,
    uploadFeed,
    removePost,
  } = useSocialFeedManager();

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center bg-theme-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-theme-act border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">
            Loading Feed...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-theme-base p-4 md:p-8 text-theme-front font-poppins transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header & Input Card */}
        <div className="bg-theme-sub/40 border border-theme-line rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Branding Section */}
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase">
                Social Gallery
              </h1>
              <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
                Manage visual aesthetics & brand feed
              </p>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col gap-4 w-full lg:w-[450px]">
              {/* Tab Switcher */}
              <div className="flex bg-theme-base/60 p-1.5 rounded-2xl border border-theme-line shadow-inner">
                <button
                  onClick={() => setUseExternalLink(false)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase flex items-center justify-center gap-2 rounded-xl transition-all ${
                    !useExternalLink
                      ? "bg-theme-act text-theme-actfg shadow-lg"
                      : "text-theme-muted hover:text-theme-front"
                  }`}
                >
                  <ImageIcon size={14} /> Upload Local
                </button>
                <button
                  onClick={() => setUseExternalLink(true)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase flex items-center justify-center gap-2 rounded-xl transition-all ${
                    useExternalLink
                      ? "bg-theme-act text-theme-actfg shadow-lg"
                      : "text-theme-muted hover:text-theme-front"
                  }`}
                >
                  <LinkIcon size={14} /> Remote URL
                </button>
              </div>

              {/* Input Field */}
              {useExternalLink ? (
                <input
                  type="url"
                  placeholder="https://image-url.com/photo.jpg"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="px-5 py-4 text-xs border border-theme-line rounded-2xl bg-theme-base outline-none focus:ring-2 focus:ring-theme-act/30 transition-all placeholder:opacity-30"
                />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-theme-line rounded-2xl cursor-pointer hover:bg-theme-base hover:border-theme-act transition-all group overflow-hidden relative">
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase group-hover:scale-110 transition-transform">
                    <Plus size={18} className="text-theme-act" /> Select Assets
                  </div>
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
              )}

              {/* Action Button */}
              <button
                onClick={uploadFeed}
                disabled={
                  isUploading || (!externalUrl && selectedImages.length === 0)
                }
                className="flex justify-center items-center gap-2 py-4 bg-theme-front text-theme-base font-black uppercase text-xs rounded-2xl disabled:opacity-20 hover:opacity-90 active:scale-95 transition-all shadow-lg"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <UploadCloud size={18} /> Sync to Feed
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Local Previews */}
          {!useExternalLink && selectedImages.length > 0 && (
            <div className="mt-8 pt-8 border-t border-theme-line animate-in fade-in slide-in-from-bottom-2">
              <p className="text-[10px] uppercase font-black mb-4 text-theme-act tracking-[0.2em]">
                Pending Uploads ({selectedImages.length})
              </p>
              <div className="flex flex-wrap gap-4">
                {selectedImages.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 group">
                    <img
                      src={file.preview}
                      alt="preview"
                      className="w-full h-full object-cover rounded-2xl ring-2 ring-theme-line"
                    />
                    <button
                      onClick={() => removeSelectedImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-lg p-1 shadow-xl hover:scale-110 transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* The Live Feed Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts?.map((post) => (
            <div
              key={post._id}
              className="group relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-theme-sub border border-theme-line shadow-sm"
            >
              <img
                src={post.image?.url || post.url}
                alt="Social feed"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Permanent Action: Delete this post from feed?",
                      )
                    ) {
                      removePost(post._id);
                    }
                  }}
                  className="group/btn relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white transition-all duration-500 ease-out hover:w-36 hover:bg-red-500 active:scale-90"
                >
                  <div className="flex items-center justify-center overflow-hidden">
                    <Trash2
                      size={20}
                      className="text-red-500 transition-colors duration-300 group-hover/btn:text-white"
                    />
                    <span className="w-0 overflow-hidden whitespace-nowrap text-[10px] font-black text-white transition-all duration-500 group-hover/btn:w-20 group-hover/btn:ml-2">
                      DELETE
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
