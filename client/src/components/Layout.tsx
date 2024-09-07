import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import useSignOut from "@/components/auth/SignOut";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/store";

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("User");

  const { user } = useSelector(selectUser);
  const signOut = useSignOut();

  useEffect(() => {
    setUsername(user?.username || "User");
  }, [user]);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // User details - these should be dynamic in a real application
  const profilePic = "https://via.placeholder.com/150?text=User"; // Placeholder image

  return (
    <nav className="w-full flex justify-end items-center py-3 px-4 sticky top-0 z-50 bg-[#070F2B] shadow-lg">
      <div className="relative">
        {/* Button Container for Profile Image */}
        <button
          className="relative w-12 h-12 rounded-full overflow-hidden p-0 border-none bg-opacity-50 backdrop-blur-md"
          onClick={handleDropdownToggle}
        >
          <img
            src={user?.profilePic ?? profilePic}
            alt="User Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute z-50 mt-2 bg-gradient-to-b from-[#070F2B] to-[#1A2240] rounded-lg shadow-xl transform transition-all duration-300 ease-out
            ${dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
            ${window.innerWidth >= 768 ? 'left-0 top-full md:left-auto md:right-0 md:top-12' : 'right-0 top-full'}
            w-56`}
        >
          {/* User Info */}
          <div className="flex items-center p-4 border-b border-[#535C91] bg-opacity-50 backdrop-blur-md">
            <img
              src={user?.profilePic ?? profilePic}
              alt="User Profile"
              className="w-10 h-10 object-cover rounded-full mr-3 border-2 border-[#1A2240]"
            />
            <div className="text-white flex-1">
              <div className="flex items-center text-sm font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                <FaUser className="mr-2" />
                <span className="truncate">{username}</span>
              </div>
            </div>
          </div>
          {/* Navigation Links */}
          <div className="py-2">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-200 hover:bg-[#535C91] hover:text-white transition-colors rounded-md font-medium"
              onClick={handleDropdownToggle}
            >
              Profile
            </Link>
            <Link
              to="/events"
              className="block px-4 py-2 text-gray-200 hover:bg-[#535C91] hover:text-white transition-colors rounded-md font-medium"
              onClick={handleDropdownToggle}
            >
              Explore
            </Link>
            <Link
              to="/admin"
              className="block px-4 py-2 text-gray-200 hover:bg-[#535C91] hover:text-white transition-colors rounded-md font-medium"
              onClick={handleDropdownToggle}
            >
              Manage Events
            </Link>
            <span
              className="block px-4 py-2 text-red-500 cursor-pointer rounded-md hover:bg-[#ff0d0d] hover:text-white transition-colors font-medium"
              onClick={() => {
                handleDropdownToggle();
                signOut();
              }}
            >
              Sign Out
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#070F2B]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
