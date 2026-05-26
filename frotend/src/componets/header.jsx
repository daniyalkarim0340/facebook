import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaHome,
  FaUserFriends,
  FaVideo,
  FaStore,
  FaSearch,
} from "react-icons/fa";

import { IoMdNotifications } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";

// Added useLocation so the blue active indicator stays synced with the browser URL bar
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  // 1. Updated navItems to hold explicit URL paths mapping to your router configurations
  const navItems = [
    { id: "home", icon: <FaHome />, label: "Home", path: "/" }, // Or "/home" depending on your App.js routing setup
    { id: "friends", icon: <FaUserFriends />, label: "Friends", path: "/friends" },
    { id: "watch", icon: <FaVideo />, label: "Watch", path: "/watch" },
    { id: "market", icon: <FaStore />, label: "Marketplace", path: "/marketplace" },
  ];

  // 2. Set the initial active tab based on the current window location path
  const currentTab = navItems.find((item) => item.path === location.pathname)?.id || "home";
  const [activeTab, setActiveTab] = useState(currentTab);

  // Sync active state if the route changes outside of a manual header icon click
  useEffect(() => {
    if (currentTab) setActiveTab(currentTab);
  }, [location.pathname, currentTab]);

  return (
    <header className="fixed top-0 z-50 w-full h-[56px] bg-white shadow-sm flex items-center justify-between px-4">

      {/* LEFT */}
      <div className="flex items-center gap-2 flex-1">
        <Link to="/">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaFacebook className="text-[#1877F2] text-[40px] cursor-pointer" />
          </motion.div>
        </Link>

        <div className="flex items-center bg-gray-100 p-2.5 rounded-full w-full max-w-[240px] ml-1">
          <FaSearch className="text-gray-500 ml-1" />
          <input
            type="text"
            placeholder="Search Facebook"
            className="bg-transparent ml-2 outline-none hidden lg:block placeholder-gray-500 text-[15px]"
          />
        </div>
      </div>

      {/* CENTER */}
      <div className="hidden md:flex items-center h-full flex-[1.5] justify-center">
        {navItems.map((item) => (
          /* 3. Wrapped each item block inside a Link tag for native SPA routing execution */
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setActiveTab(item.id)}
            className="relative flex items-center justify-center px-8 lg:px-12 h-full cursor-pointer group"
          >
            <div
              className={`text-2xl transition-colors duration-200 ${
                activeTab === item.id
                  ? "text-[#1877F2]"
                  : "text-gray-500 group-hover:bg-gray-100 p-3 rounded-xl"
              }`}
            >
              {item.icon}
            </div>

            {activeTab === item.id && (
              <motion.div
                layoutId="indicator"
                className="absolute bottom-0 w-full h-[3px] bg-[#1877F2]"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}

            <span className="absolute -bottom-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end gap-2 flex-1">
        {[
          { icon: <CgMenuGridO />, label: "Menu" },
          { icon: <MdMessage />, label: "Messenger" },
          { icon: <IoMdNotifications />, label: "Notifications" },
        ].map((btn, idx) => (
          <button
            key={idx}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl hover:bg-gray-300 transition-colors"
          >
            {btn.icon}
          </button>
        ))}

        {/* PROFILE LINK */}
        <Link to="/profile">
          <div className="relative cursor-pointer ml-1">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover hover:brightness-95"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;