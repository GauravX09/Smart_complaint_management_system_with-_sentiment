import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-28 pb-20 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 text-white">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          {/* Badge */}
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-4">
            🚀 Streamlined Complaint Management
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Smart Complaint <br />
            <span className="text-blue-300">Management System</span>
          </h1>

          {/* Description */}
          <p className="mt-5 text-lg text-indigo-100 max-w-xl">
            Empowering students and administrators with a modern, efficient platform for seamless complaint resolution and transparent communication.
          </p>

          {/* Stats */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <div className="bg-white/10 px-5 py-3 rounded-lg">
              <p className="text-xl font-bold">500+</p>
              <p className="text-sm text-indigo-200">Complaints Resolved</p>
            </div>

            <div className="bg-white/10 px-5 py-3 rounded-lg">
              <p className="text-xl font-bold">1,000+</p>
              <p className="text-sm text-indigo-200">Active Users</p>
            </div>

            <div className="bg-white/10 px-5 py-3 rounded-lg">
              <p className="text-xl font-bold">150+</p>
              <p className="text-sm text-indigo-200">Institutions</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition"
            >
              Get Started Now →
            </button>

            <button className="px-6 py-3 border border-white/30 rounded-lg hover:bg-white/10 transition">
              ▶ Watch Demo
            </button>
          </div>

          {/* Footer tags */}
          <div className="flex gap-6 mt-6 text-sm text-indigo-200 flex-wrap">
            <span>✔ Secure & Private</span>
            <span>✔ 24/7 Support</span>
            <span>✔ Easy to Use</span>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/9068/9068671.png"
            alt="dashboard"
            className="w-[400px] drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;