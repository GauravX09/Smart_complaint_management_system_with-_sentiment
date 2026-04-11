import React, { useState } from "react";
import { motion } from "framer-motion";

const PublicComplaint: React.FC = () => {
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const userEmail = params.get("user");

  const handleSubmit = () => {
    if (!description) return alert("Please enter complaint");

    console.log({
      userEmail,
      description,
    });

    // 👉 Later connect API here
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        {!submitted ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              Submit Complaint
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Submitting to: <b>{userEmail}</b>
            </p>

            <textarea
              placeholder="Enter your complaint..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Submit
            </button>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-green-600 font-semibold">
              Complaint Submitted ✅
            </h3>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PublicComplaint;