import React from "react";
import {
  Plus,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
  UploadCloud,
  X,
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

  // Show loading state while fetching initial posts
  if (loading)
    return <p className="p-6 text-center animate-pulse">Loading Feed...</p>;

  return (
    <div className="min-h-screen bg-theme-sub p-4 md:p-8 text-theme-front font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* Header & Input Card */}
        <div className="bg-theme-base border border-theme-line rounded-[2.5rem] p-8 mb-12 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Branding Section */}
            <div className="flex-1">
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
                Social <br /> Media Feed
              </h1>
              <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-theme-muted font-bold">
                Manage your visual presence
              </p>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col gap-4 w-full lg:w-[400px]">
              {/* Tab Switcher: Local vs URL */}
              <div className="flex bg-theme-sub p-1.5 rounded-2xl border border-theme-line">
                <button
                  onClick={() => setUseExternalLink(false)}
                  className={`flex-1 py-2.5 text-[11px] font-black uppercase flex items-center justify-center gap-2 rounded-xl transition-all ${
                    !useExternalLink
                      ? "bg-theme-base shadow-md text-theme-front"
                      : "text-theme-muted"
                  }`}
                >
                  <ImageIcon size={14} /> Local Files
                </button>
                <button
                  onClick={() => setUseExternalLink(true)}
                  className={`flex-1 py-2.5 text-[11px] font-black uppercase flex items-center justify-center gap-2 rounded-xl transition-all ${
                    useExternalLink
                      ? "bg-theme-base shadow-md text-theme-front"
                      : "text-theme-muted"
                  }`}
                >
                  <LinkIcon size={14} /> External URL
                </button>
              </div>

              {/* Input Field: Conditional Rendering */}
              {useExternalLink ? (
                <input
                  type="url"
                  placeholder="Paste image link here..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="px-5 py-4 text-xs border border-theme-line rounded-2xl bg-theme-sub outline-none focus:ring-2 focus:ring-theme-act transition-all"
                />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-theme-line rounded-2xl cursor-pointer hover:bg-theme-sub hover:border-theme-front transition-all group">
                  <div className="flex items-center gap-2 text-xs font-black uppercase group-hover:scale-105 transition-transform">
                    <Plus size={18} /> Choose Images
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
                className="flex justify-center items-center gap-2 py-4 bg-theme-front text-theme-base font-black uppercase text-xs rounded-2xl disabled:opacity-30 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                {isUploading ? (
                  <span className="animate-pulse">Uploading...</span>
                ) : (
                  <>
                    <UploadCloud size={18} /> Publish Feed
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Local Previews: Shown before hitting Publish */}
          {!useExternalLink && selectedImages.length > 0 && (
            <div className="mt-10 pt-8 border-t border-theme-line">
              <p className="text-[10px] uppercase font-bold mb-4 text-theme-muted">
                Pending Uploads ({selectedImages.length})
              </p>
              <div className="flex flex-wrap gap-4">
                {selectedImages.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 group">
                    <img
                      src={file.preview}
                      alt="preview"
                      className="w-full h-full object-cover rounded-2xl ring-1 ring-theme-line"
                    />
                    <button
                      onClick={() => removeSelectedImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* The Live Feed Grid: Responsive columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <div
              key={post._id}
              className="group relative aspect-square w-full overflow-hidden bg-gray-100"
            >
              <img
                src={post.image?.url || post.url}
                alt="Social feed"
                className="h-full w-full object-cover"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100">
                <button
                  onClick={() => removePost(post._id)}
                  className="group/btn relative flex h-14 w-14 items-center justify-center rounded-full bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:w-36 hover:bg-red-500 active:scale-90"
                >
                  <div className="flex items-center justify-center">
                    <Trash2
                      size={20}
                      className="text-red-500 transition-colors duration-2000 group-hover/btn:text-white"
                    />
                    <span className="w-0 overflow-hidden whitespace-nowrap text-sm font-bold text-white transition-all duration-700 ease-out group-hover/btn:w-24 group-hover/btn:ml-2">
                      DELETE POST
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
