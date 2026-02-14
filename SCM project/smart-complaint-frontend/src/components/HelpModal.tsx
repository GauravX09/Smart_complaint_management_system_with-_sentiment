import React from "react";
import { motion } from "framer-motion";

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-indigo-600">
            Help & FAQ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✖
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-gray-700 dark:text-gray-300 text-sm">
          <div>
            <h3 className="font-semibold text-indigo-500">
              ❓ How do I register a complaint?
            </h3>
            <p>
              Login to the system, go to the complaint section, fill the form,
              and submit your issue with optional images.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-indigo-500">
              🔍 How is complaint priority decided?
            </h3>
            <p>
              The system uses sentiment analysis and category-based rules to
              automatically assign priority.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-indigo-500">
              📩 How will I get updates?
            </h3>
            <p>
              You will receive updates via dashboard notifications and
              email/WhatsApp (if enabled).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-indigo-500">
              🛡 Who can access complaints?
            </h3>
            <p>
              Only authorized users (Admins and Super Admins) can view and
              manage complaints.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpModal;
