import React from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
} from "lucide-react";

const Help: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="text-indigo-600" />
          Help & Support
        </h1>
        <p className="text-gray-500">
          Get assistance and system usage guidance
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQ */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow p-6"
        >
          <h2 className="font-semibold mb-4">FAQs</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• How to approve a new user?</li>
            <li>• How complaints are categorized?</li>
            <li>• Who receives notification emails?</li>
            <li>• How admin roles are assigned?</li>
          </ul>
        </motion.div>

        {/* CONTACT */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow p-6"
        >
          <h2 className="font-semibold mb-4">Contact Support</h2>

          <div className="space-y-3 text-gray-700">
            <p className="flex items-center gap-2">
              <Mail className="text-indigo-500" />
              support@smartcomplaint.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="text-green-500" />
              +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <Clock className="text-orange-500" />
              Mon–Fri (9 AM – 6 PM)
            </p>
          </div>
        </motion.div>
      </div>

      {/* FOOTER NOTE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2"
      >
        <CheckCircle className="text-green-600" />
        <span className="text-green-700 text-sm">
          This system is monitored 24/7 for performance & security.
        </span>
      </motion.div>
    </motion.div>
  );
};

export default Help;
