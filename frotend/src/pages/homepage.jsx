

import CreatePost from "../componets/createpost.jsx";

import Stories from "../componets/stories";

const Home = () => {
  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <main className="flex justify-between pt-16 max-w-[100vw] overflow-x-hidden">
        {/* Left Sidebar - Hidden on mobile */}
        

        {/* Center Feed */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-[680px] py-6 flex flex-col gap-5">
            <Stories/>
            <CreatePost/>
           
          </div>
        </div>

        
      </main>
    </div>
  );
};

export default Home;