import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Share2, CheckCircle } from "lucide-react";

const ShareComplaint: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const email = localStorage.getItem("email");

  // 🔥 Generate shareable link
  const shareLink = `${window.location.origin}/public/complaint?user=${email}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Share2 className="text-indigo-600" />
          Share Complaint Link
        </h1>
        <p className="text-gray-500">
          Share this link so others can submit complaints
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <p className="text-sm text-gray-500">
          Anyone with this link can submit a complaint.
        </p>

        {/* LINK BOX */}
        <div className="flex items-center gap-2">
          <input
            value={shareLink}
            readOnly
            className="flex-1 px-4 py-3 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-sm"
          />

          <button
            onClick={copyToClipboard}
            className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Copy size={16} />
            Copy
          </button>
        </div>

        {/* SUCCESS */}
        {copied && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle size={16} />
            Link copied successfully!
          </div>
        )}

        {/* SHARE OPTIONS */}
        <div className="flex gap-3 mt-4">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
          >
            WhatsApp
          </a>

          <a
            href={`mailto:?subject=Submit Complaint&body=${shareLink}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            Email
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ShareComplaint;