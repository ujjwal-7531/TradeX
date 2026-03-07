import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { setFullName, setProfilePicture, getFullName, getProfilePicture } from "../utils/auth";

function ProfileModal({ isOpen, onClose, onUpdateProfile }) {
  const [name, setName] = useState(getFullName() || "");
  const [previewUrl, setPreviewUrl] = useState(getProfilePicture() || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state with local storage when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(getFullName() || "");
      setPreviewUrl(getProfilePicture() || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call to update profile
      const res = await api.patch("/users/me", {
        full_name: name,
        profile_picture_url: previewUrl
      });
      
      // Update local storage
      setFullName(res.data.full_name);
      setProfilePicture(res.data.profile_picture_url);
      
      toast.success("Profile updated successfully!");
      if (onUpdateProfile) {
        onUpdateProfile({ name: res.data.full_name, picture: res.data.profile_picture_url });
      }
      onClose();
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Profile Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize your workspace identity</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center">
            <div 
              className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-3xl font-medium">
                  {name ? name[0].toUpperCase() : 'u'}
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-semibold">Change</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-xs text-gray-400 mt-2">Square images work best</p>
          </div>

          {/* Name Edit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Satoshi Nakamoto"
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-all"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ProfileModal;
