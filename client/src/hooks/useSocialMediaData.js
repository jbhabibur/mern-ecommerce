import { useState, useEffect } from "react";
import { getSocialMediaService } from "../services/socialMediaService";

export const useSocialMediaData = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const res = await getSocialMediaService();
        if (res.success) {
          setPosts(res.data);
          setError(null);
        } else {
          setError(res.message || "Something went wrong");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError("Failed to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, []);

  return { posts, loading, error };
};
