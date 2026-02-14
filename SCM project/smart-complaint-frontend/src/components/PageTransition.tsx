// src/components/PageTransition.tsx
import React from "react";
import { motion } from "framer-motion";

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
      {children}
    </motion.div>
  );
};

export default PageTransition;
