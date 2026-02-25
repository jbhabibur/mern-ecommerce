import React, { useState, useEffect } from "react";
import {
  Edit3,
  Lock,
  Loader2,
  ShieldCheck,
  Mail,
  User,
  Phone,
  Calendar,
  CheckSquare,
  Square,
  Camera,
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { EditProfileModal } from "./EditProfileModal"; // Import modal

export const UserProfile = () => {
  const {
    user,
    loading,
    updating,
    passLoading,
    updateProfile,
    changePassword,
    updateProfileImage,
  } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const handleProfileSubmit = async () => {
    const res = await updateProfile(editData);
    if (res.success) {
      setIsModalOpen(false);
      alert("Profile updated!");
    } else alert(res.message);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const res = await changePassword(passwordData);
    if (res.success) {
      alert("Password updated!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else alert(res.message);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setImgLoading(true);
    const res = await updateProfileImage(formData);
    setImgLoading(false);

    if (res.success) {
      alert("Profile picture updated!");
    } else {
      alert(res.message);
    }
  };

  if (loading)
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-900" size={40} />
      </div>
    );

  return (
    <div className="w-full">
      {/* Header & Info Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b">
        <div className="flex items-center gap-5">
          <div className="relative group">
            {/* Hidden File Input */}
            <input
              type="file"
              id="profileUpload"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Label works as a trigger */}
            <label
              htmlFor="profileUpload"
              className="relative cursor-pointer block"
            >
              <div className="relative w-20 h-20">
                <img
                  src={user.photo}
                  className={`w-20 h-20 rounded-full border-4 border-gray-50 object-cover shadow-sm transition ${
                    imgLoading ? "opacity-30" : "hover:opacity-80"
                  }`}
                  alt="profile"
                />
                {imgLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-900" size={24} />
                  </div>
                )}
              </div>
            </label>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            <p className="text-gray-500 text-sm">Manage personal info</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditData({
              fullName: `${user.firstName} ${user.lastName}`,
              phone: user.phone || "",
              birthday: user.birthday || "",
              gender: user.gender || "Select Gender",
              isSubscribed: user.isSubscribed,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition"
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 mb-12">
        <InfoBox
          label="Full Name"
          value={`${user.firstName} ${user.lastName}`}
          icon={<User size={16} />}
        />
        <InfoBox
          label="Email Address"
          value={user.email}
          icon={<Mail size={16} />}
          isLocked
        />
        <InfoBox
          label="Phone Number"
          value={user.phone}
          icon={<Phone size={18} />}
        />
        <InfoBox
          label="Birthday"
          value={user.birthday}
          icon={<Calendar size={18} />}
        />
        <InfoBox label="Gender" value={user.gender} />
        <InfoBox
          label="Newsletter"
          value={user.isSubscribed ? "Subscribed" : "Not Active"}
          icon={
            user.isSubscribed ? (
              <CheckSquare size={18} className="text-green-600" />
            ) : (
              <Square size={18} />
            )
          }
        />
      </div>

      {/* Security Section */}
      <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <ShieldCheck className="text-gray-400" size={20} /> Security
        </h3>
        <form
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          onSubmit={handlePasswordSubmit}
        >
          <input
            type="password"
            placeholder="Current"
            required
            className="bg-white border rounded-xl px-4 py-3 outline-none text-sm focus:border-black"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
          />
          <input
            type="password"
            placeholder="New"
            required
            className="bg-white border rounded-xl px-4 py-3 outline-none text-sm focus:border-black"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm"
            required
            className="bg-white border rounded-xl px-4 py-3 outline-none text-sm focus:border-black"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
          />
          <button
            disabled={passLoading}
            className="sm:col-span-3 px-6 py-2.5 bg-white border border-gray-900 text-gray-900 font-semibold rounded-xl transition hover:bg-black! hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {passLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Clean Modal Call */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}
        setEditData={setEditData}
        onSubmit={handleProfileSubmit}
        updating={updating}
      />
    </div>
  );
};

const InfoBox = ({ label, value, icon, isLocked }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-400">{icon}</span>}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0">
        {label}
      </p>
      {isLocked && <Lock size={10} className="text-gray-300" />}
    </div>
    <p
      className={`text-base font-semibold ${isLocked ? "text-gray-500" : "text-gray-800"}`}
    >
      {value || "Not Provided"}
    </p>
  </div>
);
