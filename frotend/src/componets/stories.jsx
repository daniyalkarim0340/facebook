import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const Stories = () => {
  const stories = [
    { id: 1, name: "Travel Daily", img: "https://picsum.photos/200/300?random=1", user: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Web Dev Tips", img: "https://picsum.photos/200/300?random=2", user: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, name: "Gaming Zone", img: "https://picsum.photos/200/300?random=3", user: "https://randomuser.me/api/portraits/men/3.jpg" },
  ];

  return (
    <div className="flex gap-2 h-48 md:h-60 overflow-x-auto no-scrollbar">
      {/* Create Story Card */}
      <div className="relative min-w-[110px] md:min-w-[140px] h-full bg-white rounded-xl shadow-sm cursor-pointer group overflow-hidden border border-gray-200">
        <div className="h-[70%] overflow-hidden">
          <img src="https://via.placeholder.com/150" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Me" />
        </div>
        <div className="absolute bottom-0 w-full h-[30%] flex flex-col items-center justify-center pb-2">
          <div className="absolute -top-4 p-1 bg-white rounded-full">
            <div className="bg-[#1877F2] p-1.5 rounded-full text-white">
              <FaPlus />
            </div>
          </div>
          <span className="text-[13px] font-semibold mt-3">Create story</span>
        </div>
      </div>

      {/* Story List */}
      {stories.map((story) => (
        <motion.div 
          key={story.id}
          whileHover={{ scale: 1.02 }}
          className="relative min-w-[110px] md:min-w-[140px] h-full rounded-xl cursor-pointer overflow-hidden group shadow-sm"
        >
          <img src={story.img} className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all" alt="Story" />
          <div className="absolute top-3 left-3 border-4 border-[#1877F2] rounded-full overflow-hidden w-10 h-10">
            <img src={story.user} alt="user" />
          </div>
          <span className="absolute bottom-3 left-3 text-white text-xs font-semibold">{story.name}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default Stories;