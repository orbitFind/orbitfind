import React from "react";
import "cropperjs/dist/cropper.css";
import { motion } from "framer-motion";
import { selectUser } from "@/store/store";
import { useSelector } from "react-redux";
import DetailsForm from "@/components/profile/DetailsForm";

const UserProfileView: React.FC = () => {

  const { user } = useSelector(selectUser);

  return (
    <div className="min-h-screen bg-[#070F2B] flex flex-col md:flex-row">
      {/* Sidebar/Profile Section */}
      <motion.div
        className="w-full md:w-1/3 bg-[#1B1A55] p-6 flex flex-col items-center md:items-start space-y-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <DetailsForm />
      </motion.div >

      {/* Main Content Section */}
      <motion.div
        className="w-full md:w-2/3 p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl text-[#E5E7EB] mb-4">Your Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.hostedEvents.map(({ name, description }, index) => (
            <motion.div
              key={index}
              className="bg-[#1B1A55] p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl text-[#E5E7EB]">{name}</h3>
              <p className="text-[#9290C3]">{description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div >
    </div >
  );
};

export default UserProfileView;
