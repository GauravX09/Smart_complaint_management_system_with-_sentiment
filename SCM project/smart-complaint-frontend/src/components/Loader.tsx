// src/components/Loader.tsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[60vh] w-full">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
  