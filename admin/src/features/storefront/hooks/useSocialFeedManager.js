import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getSocialFeed,
  addSocialMedia,
  deleteSocialMedia,
} from "../services/socialMediaService";

export const useSocialFeedManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [useExternalLink, setUseExternalLink] = useState(false);

  // 1. Fetch all posts on load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getSocialFeed();
        console.log(res);
        if (res.success) setPosts(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 2. Handle local file selection (Multiple)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  // 3. Remove image from selection (Before Upload)
  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => {
      URL.revokeObjectURL(prev[index].preview); // Memory cleanup
      return prev.filter((_, i) => i !== index);
    });
  };

  // 4. Main Upload Logic (Multiple Files or Single URL)
  const uploadFeed = async () => {
    if (useExternalLink && !externalUrl) {
      return toast.error("Please provide a valid URL");
    }
    if (!useExternalLink && selectedImages.length === 0) {
      return toast.error("Please select at least one image");
    }

    setIsUploading(true);
    try {
      let res;
      if (useExternalLink) {
        // Mode: Single URL (JSON object pathachhi)
        res = await addSocialMedia({ url: externalUrl });
      } else {
        // Mode: Multiple Local Files (FormData pathachhi)
        const formData = new FormData();
        selectedImages.forEach((item) => {
          formData.append("images", item.file);
        });
        res = await addSocialMedia(formData);
      }

      if (res.success) {
        // Backend jodi array pathay (multiple upload) ba single object
        const newPosts = Array.isArray(res.data) ? res.data : [res.data];
        setPosts((prev) => [...newPosts, ...prev]);

        // Resetting states
        setSelectedImages([]);
        setExternalUrl("");
        toast.success(useExternalLink ? "Link added!" : "Images uploaded!");
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  // 5. Delete Logic
  const removePost = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmDelete) return;

    const loadingToast = toast.loading("Deleting post...");
    try {
      const res = await deleteSocialMedia(id);
      if (res.success) {
        setPosts((prev) => prev.filter((post) => post._id !== id));
        toast.success("Removed successfully", { id: loadingToast });
      } else {
        toast.error(res.message || "Delete failed", { id: loadingToast });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete from server", { id: loadingToast });
    }
  };

  return {
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
  };
};
