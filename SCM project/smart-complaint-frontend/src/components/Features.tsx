// src/components/Features.tsx
import React from "react";
import { motion } from "framer-motion";

const features = [
  { title: "Complaint Submission", text: "Students submit complaints quickly with photos & descriptions." },
  { title: "Sentiment Analysis", text: "Detect emotionally critical complaints to prioritize." },
  { title: "Escalation Alerts", text: "Auto WhatsApp & Email alerts to HOD/Director/VC." },
  { title: "Admin Dashboard", text: "View, manage and analyze complaints." },
  { title: "Feedback Module", text: "Users rate resolution quality to improve services." },
  { title: "Secure Login", text: "Only Amity emails allowed; JWT-based sessions." },
];

const Features: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="p-6 rounded-xl shadow bg-gray-50">
              <h3 className="font-semibold text-indigo-700">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
