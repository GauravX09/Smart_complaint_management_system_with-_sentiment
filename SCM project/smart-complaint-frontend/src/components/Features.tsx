import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Easy Complaint Submission",
    text: "Submit your issues effortlessly with intuitive forms.",
    icon: "🐞",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Real-Time Tracking",
    text: "Track complaint status with instant updates.",
    icon: "⏱️",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Secure & Private",
    text: "Data protected with strong security protocols.",
    icon: "🔒",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Multi-Role Support",
    text: "Supports students, admins and staff roles.",
    icon: "👥",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Data Protection",
    text: "Advanced encryption ensures safe user data.",
    icon: "🛡️",
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Smart Notifications",
    text: "Stay updated with alerts and announcements.",
    icon: "🔔",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Analytics Dashboard",
    text: "Track trends and performance insights.",
    icon: "📊",
    color: "bg-teal-100 text-teal-600",
  },
  {
    title: "Mobile Responsive",
    text: "Fully responsive across all devices.",
    icon: "📱",
    color: "bg-pink-100 text-pink-600",
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need for{" "}
            <span className="text-purple-600">
              Efficient Complaint Management
            </span>
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Our platform provides all the tools needed to streamline complaint resolution and improve communication.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl mb-4 ${f.color}`}
              >
                {f.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg">{f.title}</h3>

              {/* Text */}
              <p className="text-gray-600 mt-2 text-sm">{f.text}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;