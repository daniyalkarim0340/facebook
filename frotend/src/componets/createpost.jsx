import { FaVideo, FaImages, FaRegSmile } from "react-icons/fa";

const CreatePost = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 border-b pb-3">
        <img src="https://via.placeholder.com/40" className="w-10 h-10 rounded-full" alt="Profile" />
        <input 
          type="text" 
          placeholder="What's on your mind?" 
          className="bg-[#F0F2F5] hover:bg-gray-200 cursor-pointer flex-1 rounded-full px-4 py-2 outline-none transition-colors"
        />
      </div>
      <div className="flex justify-between pt-3">
        <div className="flex items-center gap-2 hover:bg-gray-100 flex-1 justify-center py-2 rounded-lg cursor-pointer">
          <FaVideo className="text-[#F3425F] text-xl" />
          <span className="text-gray-600 font-semibold text-[15px]">Live video</span>
        </div>
        <div className="flex items-center gap-2 hover:bg-gray-100 flex-1 justify-center py-2 rounded-lg cursor-pointer">
          <FaImages className="text-[#45BD62] text-xl" />
          <span className="text-gray-600 font-semibold text-[15px]">Photo/video</span>
        </div>
        <div className="flex items-center gap-2 hover:bg-gray-100 flex-1 justify-center py-2 rounded-lg cursor-pointer">
          <FaRegSmile className="text-[#F7B928] text-xl" />
          <span className="text-gray-600 font-semibold text-[15px]">Feeling/activity</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;