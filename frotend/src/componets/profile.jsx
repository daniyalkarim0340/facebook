import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../app/datastore";
import Button from "../componets/button";

const FacebookProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("timeline");

  // Mock data structure representing logged-in user profile state
  const user = {
    name: "Daniyal Karim",
    bio: "Frontend Developer • React Enthusiast 🚀",
    location: "Pakistan",
    followers: "1.2K",
    following: "300",
    friends: "500",
    work: "Software Engineer at TechCorp",
    joined: "Joined October 2021",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12 text-gray-900 font-sans">
      
      {/* 1. HERO HEADER BANNER BLOCK */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto relative">
          
          {/* Cover Photo */}
          <div className="h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-b-xl relative bg-gray-200">
            <img
              src={user.cover}
              alt="Profile Cover"
              className="h-full w-full object-cover transform hover:scale-105 transition duration-700"
            />
          </div>

          {/* Identity Section Row */}
          <div className="px-6 pb-6 flex flex-col md:flex-row items-center md:items-end md:justify-between gap-6 relative -mt-16 md:-mt-10 z-10">
            
            <div className="flex flex-col md:flex-row items-center md:items-end text-center md:text-left gap-6">
              {/* Profile Avatar */}
              <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Information block */}
              <div className="mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  {user.name}
                </h1>
                <p className="text-gray-600 font-medium mt-1">{user.bio}</p>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2 text-sm text-gray-500">
                  <span>📍 {user.location}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-semibold text-gray-700">{user.friends} Friends</span>
                </div>
              </div>
            </div>

            {/* User Account Action Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              <Button 
                onClick={() => alert("Edit Profile Coming Soon!")}
                className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-bold"
              >
                ✏️ Edit Profile
              </Button>
              <Button
                onClick={handleLogout}
                className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white text-sm font-bold"
              >
                Logout
              </Button>
            </div>

          </div>

          <hr className="mx-6 border-gray-200" />

          {/* Profile Section Tab Navigation Menu Toggle Layout */}
          <div className="flex px-4 overflow-x-auto">
            {["timeline", "about", "friends", "photos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-5 font-bold text-sm transition-all border-b-4 whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2. BODY CONTENT SECTION MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6">
        {activeTab === "timeline" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sidebar Column Info Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-xl font-bold mb-4">Intro</h2>
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💼</span>
                    <p>{user.work}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏠</span>
                    <p>Lives in <span className="font-semibold">{user.location}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <p>{user.joined}</p>
                  </div>
                </div>
              </div>

              {/* Quick Summary Counts */}
              <div className="bg-white rounded-xl shadow p-5 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-extrabold text-blue-600">{user.followers}</p>
                  <p className="text-xs text-gray-500 font-medium uppercase mt-0.5">Followers</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-800">{user.following}</p>
                  <p className="text-xs text-gray-500 font-medium uppercase mt-0.5">Following</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-800">{user.friends}</p>
                  <p className="text-xs text-gray-500 font-medium uppercase mt-0.5">Friends</p>
                </div>
              </div>
            </div>

            {/* Main Content Dynamic Feed Wall Area */}
            <div className="lg:col-span-7 space-y-6">
              {/* Creator Box component view mockup */}
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex gap-3 items-center">
                  <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <input 
                    type="text" 
                    placeholder={`What's on your mind, ${user.name.split(" ")[0]}?`}
                    className="bg-gray-100 hover:bg-gray-200 transition w-full py-2.5 px-4 rounded-full text-sm outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Feed Empty Placeholder View */}
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                <span className="text-4xl block mb-2">📝</span>
                <h3 className="font-bold text-gray-700">No Posts Yet</h3>
                <p className="text-sm mt-1">Share an update or photos to fill your timeline feed profile.</p>
              </div>

            </div>
          </div>
        )}

        {/* Alternate Tab Fallback views */}
        {activeTab !== "timeline" && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
            <h3 className="text-xl font-bold capitalize mb-2">{activeTab} Section</h3>
            <p className="text-sm text-gray-400">Content interface is currently under construction initialization.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default FacebookProfile;