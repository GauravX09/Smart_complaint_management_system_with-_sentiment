import React from "react";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        {/* LEFT */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-xl font-bold">Smart Complaint System</h2>
          <p className="text-gray-300 text-sm mt-1">
            © {new Date().getFullYear()} Amity University • All Rights Reserved
          </p>
        </div>

        {/* RIGHT — SOCIAL ICONS */}
        <div className="flex gap-6">
          <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-white text-2xl">
            <FaLinkedin />
          </a>

          <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white text-2xl">
            <FaInstagram />
          </a>

          <a href="#" aria-label="YouTube" className="text-gray-300 hover:text-white text-2xl">
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
