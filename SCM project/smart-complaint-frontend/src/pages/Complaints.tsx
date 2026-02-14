import React, { useState } from "react";
import { motion } from "framer-motion";

const Complaints: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && complaint) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setName("");
      setEmail("");
      setComplaint("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-cyan-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-[400px]"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Complaint Form
        </h2>

        {submitted ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-center font-semibold"
          >
            ✅ Complaint submitted successfully!
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <textarea
              placeholder="Describe your complaint..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
            >
              Submit Complaint
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Complaints;
