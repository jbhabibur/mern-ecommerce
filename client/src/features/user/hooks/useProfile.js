import { useState, useEffect } from "react";
import axios from "axios";

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
    isSubscribed: false,
    photo: "",
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/profile/",
        getHeaders(),
      );
      const data = res.data.user;
      setUser({
        ...data,
        birthday: data.birthday ? data.birthday.split("T")[0] : "",
        photo:
          data.photo ||
          `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=111827&color=fff`,
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- New Function: Update Profile Image ---
  const updateProfileImage = async (formData) => {
    try {
      // Axios automatically sets multipart/form-data for FormData objects
      const res = await axios.patch(
        "http://localhost:5000/api/profile/update-image",
        formData,
        getHeaders(),
      );

      // Update the local user state with the new photo URL from backend
      if (res.data.success) {
        setUser((prev) => ({ ...prev, photo: res.data.photo }));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Image upload failed!",
      };
    }
  };

  const updateProfile = async (editData) => {
    setUpdating(true);
    const [fName, ...lNameParts] = editData.fullName.trim().split(" ");
    const payload = {
      firstName: fName,
      lastName: lNameParts.join(" ") || ".",
      phone: editData.phone,
      birthday: editData.birthday,
      gender: editData.gender,
      isSubscribed: editData.isSubscribed,
    };

    try {
      await axios.patch(
        "http://localhost:5000/api/profile/update-profile",
        payload,
        getHeaders(),
      );
      setUser((prev) => ({ ...prev, ...payload }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Update failed!",
      };
    } finally {
      setUpdating(false);
    }
  };

  const changePassword = async (passwordData) => {
    setPassLoading(true);
    try {
      await axios.patch(
        "http://localhost:5000/api/profile/change-password",
        passwordData,
        getHeaders(),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error",
      };
    } finally {
      setPassLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    setUser,
    loading,
    updating,
    passLoading,
    updateProfile,
    changePassword,
    updateProfileImage,
  };
};
