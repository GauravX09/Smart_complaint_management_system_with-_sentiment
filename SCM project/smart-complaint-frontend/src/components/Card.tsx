import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  value: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, value, color }) => {
  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-md text-white ${color}`}
      whileHover={{ scale: 1.05 }}
    >
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  );
};

export default Card;
