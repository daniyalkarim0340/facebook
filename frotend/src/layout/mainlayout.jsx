
import Headers from "../componets/header";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Headers/>

      <div className="flex">
      

        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;