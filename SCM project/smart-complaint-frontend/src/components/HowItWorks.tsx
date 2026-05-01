import { motion } from "framer-motion";

const steps = [
  { title: "Submit Complaint", desc: "Fill form with details & images.", icon: "📝" },
  { title: "AI Analysis", desc: "Priority assigned via sentiment.", icon: "🤖" },
  { title: "Admin Action", desc: "Admin resolves or escalates.", icon: "⚙️" },
  { title: "Track & Feedback", desc: "Track status & give feedback.", icon: "📊" },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="p-6 rounded-xl shadow bg-gray-50"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}