import { useEffect } from "react";
import Button from "./button";


const Popup = ({
  type = "success",
  message,
  show,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

      <div className="bg-white w-80 p-6 rounded-xl shadow-lg text-center animate-fadeIn">

        {/* ICON */}
        <div className={`text-4xl mb-2 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
          {isSuccess ? "✔" : "✖"}
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 capitalize">
          {type}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-600 mt-2">
          {message}
        </p>

        {/* BUTTON (using reusable Button component) */}
        <div className="mt-4">
          <Button
            onClick={onClose}
            className={
              isSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }
          >
            Close
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Popup;