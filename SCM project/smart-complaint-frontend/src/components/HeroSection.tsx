import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const phrases = [
  "Fast. Transparent. Automated.",
  "Priority via Sentiment Analysis.",
  "WhatsApp & Email Escalation",
];

const Typing: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState("");
  const [forward, setForward] = useState(true);

  useEffect(() => {
    const phrase = phrases[idx % phrases.length];
    const interval = setInterval(() => {
      setSub((s) => {
        if (forward) {
          if (s.length < phrase.length) return phrase.slice(0, s.length + 1);
          setForward(false);
          return s;
        } else {
          if (s.length > 0) return phrase.slice(0, s.length - 1);
          setForward(true);
          setIdx((i) => (i + 1) % phrases.length);
          return "";
        }
      });
    }, 80);

    return () => clearInterval(interval);
  }, [idx, forward]);

  return <span className="text-indigo-600 font-semibold">{sub}</span>;
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-28 pb-12 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight"
          >
            Smart Complaint Management System
          </motion.h1>

          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="mt-4 text-lg text-indigo-100 max-w-xl"
          >
            Empowering Amity University students and faculty with an intelligent
            platform for submitting, tracking and resolving campus complaints.
          </motion.p>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-wrap gap-3">
            {/* LOGIN */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="px-8 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow-lg hover:bg-gray-200"
              onClick={() => navigate("/auth")}
            >
              Login
            </motion.button>

            {/* REGISTER */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="px-8 py-3 rounded-lg bg-yellow-400 text-black font-semibold shadow-lg hover:bg-yellow-500"
              onClick={() => navigate("/register")}
            >
              Register
            </motion.button>

            {/* SUPER ADMIN */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700"
              onClick={() => navigate("/super-admin/login")}
            >
              Super Admin
            </motion.button>
          </div>

          <div className="mt-8 text-lg">
            <Typing />
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="w-full md:w-1/2"
        >
          <div className="bg-white/10 p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-white/6 rounded-md">
                <div className="text-sm text-indigo-100">
                  Submit complaint with images
                </div>
                <div className="text-white font-semibold mt-1">
                  Easy form
                </div>
              </div>
              <div className="p-4 bg-white/6 rounded-md">
                <div className="text-sm text-indigo-100">
                  Auto-priority
                </div>
                <div className="text-white font-semibold mt-1">
                  Sentiment + Category
                </div>
              </div>
              <div className="p-4 bg-white/6 rounded-md">
                <div className="text-sm text-indigo-100">
                  Escalation
                </div>
                <div className="text-white font-semibold mt-1">
                  WhatsApp & Email
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
