import React, { useState, useRef, ChangeEvent } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FaUser, FaEnvelope, FaPhone, FaCamera } from "react-icons/fa";
import { motion } from "framer-motion";

const UserProfileView: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [phone, setPhone] = useState("+1 234 567 890");
  const [bio, setBio] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum."
  );
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150x150?text=JD");
  const [imagePreview, setImagePreview] = useState(profilePic);
  const [showCropper, setShowCropper] = useState(false);
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropperRef = useRef<HTMLImageElement | null>(null);


  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      setProfilePic(canvas.toDataURL());
      setShowCropper(false);
    }
  };

  const handleCropperInit = (instance: Cropper) => {
    setCropper(instance);
  };

  return (
    <div className="min-h-screen bg-[#070F2B] flex flex-col md:flex-row">
      {/* Sidebar/Profile Section */}
      <motion.div
        className="w-full md:w-1/3 bg-[#1B1A55] p-6 flex flex-col items-center md:items-start space-y-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Profile Picture */}
        <div className="relative mb-6">
          <img
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-[#535C91] object-cover shadow-lg transition-transform duration-300 transform hover:scale-105"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-[#9290C3] rounded-full shadow-md transition-transform duration-300 transform hover:scale-110"
          >
            <FaCamera className="text-white text-lg" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* User Details */}
        <div className="w-full space-y-4">
          {[
            { label: "Username", icon: <FaUser />, value: username, onChange: setUsername },
            { label: "Email", icon: <FaEnvelope />, value: email, onChange: setEmail },
            { label: "Phone", icon: <FaPhone />, value: phone, onChange: setPhone }
          ].map(({ label, icon, value, onChange }, index) => (
            <motion.div
              key={index}
              className="w-full flex flex-col mb-4"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <label className="text-[#E5E7EB] text-sm mb-1">{label}</label>
              <motion.div
                className="flex items-center bg-[#070F2B] p-2 rounded-lg border border-[#535C91] transition-transform duration-300 transform hover:scale-105"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-[#9290C3] text-xl mr-2">{icon}</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-transparent flex-1 text-[#E5E7EB] focus:outline-none"
                  />
                ) : (
                  <span className="text-[#E5E7EB]">{value}</span>
                )}
              </motion.div>
            </motion.div>
          ))}

          {/* Bio */}
          <motion.div
            className="w-full mb-4"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <label className="text-[#E5E7EB] text-sm mb-1">Bio</label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-[#070F2B] p-2 rounded-lg border border-[#535C91] w-full h-32 text-[#E5E7EB] focus:outline-none"
              />
            ) : (
              <p className="bg-[#070F2B] p-2 rounded-lg border border-[#535C91] text-[#E5E7EB]">
                {bio}
              </p>
            )}
          </motion.div>

          {/* Edit/Save Button */}
          <div className="w-full flex justify-center md:justify-start">
            <motion.button
              onClick={toggleEdit}
              className="bg-[#9290C3] text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-[#E5E7EB] hover:text-[#1B1A55]"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <motion.div
        className="w-full md:w-2/3 p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl text-[#E5E7EB] mb-4">Your Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            className="bg-[#1B1A55] p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl text-[#E5E7EB]">Event Title</h3>
            <p className="text-[#9290C3]">Event Description</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <motion.div
            className="relative bg-[#1B1A55] p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl text-[#E5E7EB] mb-4">Crop Your Image</h2>
            <Cropper
              src={imagePreview}
              style={{ height: '100%', width: '100%' }}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
              onInitialized={handleCropperInit}
            />
            <div className="flex justify-between mt-4">
              <motion.button
                onClick={() => setShowCropper(false)}
                className="bg-[#9290C3] text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-[#E5E7EB] hover:text-[#1B1A55]"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleCrop}
                className="bg-[#4CAF50] text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-[#388E3C]"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserProfileView;
