"use client";
import toast, { Toaster } from "react-hot-toast";

export const showCustomToast = (message: string) => {
  toast((t) => (
    <div className="relative bg-gray-800 text-white shadow-md px-4 py-3 rounded-lg w-80 border border-gray-700">
      {/* Toast Content */}
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">{message}</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-gray-300 hover:text-gray-100 transition"
        >
          ✖
        </button>
      </div>

      {/* Gradient Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden rounded-b-lg">
        <div
          className="h-full animate-progress"
          style={{
            background:
              "linear-gradient(to right, rgb(251, 113, 133), rgb(217, 70, 239), rgb(99, 102, 241))",
            animationDuration: "4000ms",
          }}
        ></div>
      </div>
    </div>
  ), { duration: 4000 });
};

const CustomToast = () => {
  return <Toaster toastOptions={{ style: { background: "transparent", boxShadow: "none" } }} />;
};

export default CustomToast;
