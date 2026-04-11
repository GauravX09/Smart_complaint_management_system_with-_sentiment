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
    }, 70);

    return () => clearInterval(interval);
  }, [idx, forward]);

  return <span>{sub}</span>;
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-28 pb-16 bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white overflow-hidden">

      {/* 🌈 Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500 opacity-20 blur-3xl top-[-100px] left-[-100px] rounded-full"></div>
      <div className="absolute w-[400px] h-[400px] bg-indigo-400 opacity-20 blur-3xl bottom-[-100px] right-[-100px] rounded-full"></div>

      <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

        {/* LEFT CONTENT */}
        <div className="flex-1">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight"
          >
            Smart Complaint <br />
            <span className="text-yellow-400">Management System</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-lg text-indigo-200 max-w-xl"
          >
            Empowering Amity University students and faculty with an intelligent
            platform for submitting, tracking and resolving campus complaints.
          </motion.p>


          {/* ✨ Typing Animation */}
          <div className="mt-10 text-lg text-indigo-200 min-h-[28px] tracking-wide">
            <Typing />
          </div>
        </div>

        {/* RIGHT CARD (GLASS) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/2"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl">
            <div className="space-y-4">

              <div className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition">
                <div className="text-sm text-indigo-200">
                  Submit complaint with images
                </div>
                <div className="font-semibold mt-1">
                  Easy form
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition">
                <div className="text-sm text-indigo-200">
                  Auto-priority
                </div>
                <div className="font-semibold mt-1">
                  Sentiment + Category
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition">
                <div className="text-sm text-indigo-200">
                  Escalation
                </div>
                <div className="font-semibold mt-1">
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