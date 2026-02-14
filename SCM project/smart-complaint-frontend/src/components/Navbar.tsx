import React from "react";

const Navbar: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth?mode=login";
  };

  return (
    <div className="
      w-full h-16 bg-gradient-to-r from-indigo-500 to-purple-600
      shadow-lg flex items-center justify-between px-6 rounded-bl-3xl
    ">
      <h2 className="text-xl font-bold text-white tracking-wide">
        Smart Complaint System
      </h2>

      <div className="flex items-center gap-4">

        <div className="text-right text-white">
          <div className="text-sm opacity-80">Welcome,</div>
          <div className="font-semibold text-lg -mt-1">{user.name ?? "User"}</div>
        </div>

        <div className="
          w-10 h-10 rounded-full bg-white/40 text-white font-bold 
          flex items-center justify-center backdrop-blur-xl shadow-md
        ">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>

        <button
          onClick={handleLogout}
          className="
            px-4 py-2 rounded-xl text-white bg-red-500 
            hover:bg-red-600 transition shadow-md
          "
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
