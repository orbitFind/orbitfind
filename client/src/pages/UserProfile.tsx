import React, { useEffect } from "react";
import "cropperjs/dist/cropper.css";
import { motion } from "framer-motion";
import { selectUser, useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import DetailsForm from "@/components/profile/DetailsForm";
import { getUser } from "@/api/user";
import SignedUpToEvents from "@/components/profile/SignedUpToEvents";
import HostedEvents from "@/components/profile/HostedEvents";
import { useNavigate } from "react-router-dom";
import CompletedEvents from "@/components/profile/CompletedEvents";
import BadgesList from "@/components/profile/BadgesList";

const UserProfileView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(selectUser);

  const fetchUser = async () => {
    await dispatch(getUser())
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#070F2B] flex flex-col md:flex-row">
      {/* Sidebar/Profile Section */}
      <motion.div
        className="w-full md:w-1/3 bg-[#1B1A55] p-6 flex flex-col items-center md:items-start space-y-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <DetailsForm user={user!} fetchUser={fetchUser} />
        <BadgesList user={user!} />
      </motion.div >

      {/* Main Content Section */}
      <motion.div
        className="w-full md:w-2/3 p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl text-[#E5E7EB] mb-4">Events You're Attending</h1>
        {user?.signedUpTo && user?.signedUpTo.length > 0 ? (
          <SignedUpToEvents user={user} />) : (
          <div>
            <p className="text-[#E5E7EB]">You're not signed up to any events yet! Go to the events page to sign up to some events.</p>
          </div>
        )}
        <hr className="my-8 border-[#535C91]" />
        <div className="flex mb-5">
          <h1 className="text-3xl text-[#E5E7EB] mr-5">Events You're Hosting</h1>
          <button className="bg-[#1B5A55] text-[#E5E7EB] px-4 py-2 rounded-lg ml-5" onClick={() => navigate("/admin")}>Manage Events</button>
        </div>

        {user?.hostedEvents && user?.hostedEvents.length > 0 ? (
          <HostedEvents user={user} />) : (
          <div>
            <p>You're not hosting any events yet! Go to the events page to host some events.</p>
          </div>
        )}
        <hr className="my-8 border-[#535C91]" />
        <h1 className="text-3xl text-[#E5E7EB] mb-4">Events You've Completed</h1>
        {user?.completedEvents && user?.completedEvents.length > 0 ? (
          <CompletedEvents user={user} />) : (
          <div>
            <p>You haven't completed any events yet! Go to the events page to complete some events.</p>
          </div>
        )}
      </motion.div >

    </div >
  );
};

export default UserProfileView;
