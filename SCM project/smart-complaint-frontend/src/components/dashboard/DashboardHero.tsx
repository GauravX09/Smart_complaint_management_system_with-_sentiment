import { motion } from "framer-motion";
import Button from "../ui/Button";
import { Plus } from "lucide-react";

interface DashboardHeroProps {
  userName?: string;
  onNewComplaint?: () => void;
}

const DashboardHero = ({ userName = "User", onNewComplaint }: DashboardHeroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white
      bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-xl"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent)]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left Content */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm md:text-base opacity-90 mt-1">
            Track, manage and resolve your complaints efficiently.
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onNewComplaint}
          className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 transition-all"
        >
          <Plus size={18} />
          Submit Complaint
        </Button>
      </div>
    </motion.div>
  );
};

export default DashboardHero;