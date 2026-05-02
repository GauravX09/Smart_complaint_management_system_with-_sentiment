import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "image" | "video" | "audio";
  src: string;
}

const MediaPreviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  type,
  src,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* CONTENT */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl p-4 max-w-3xl w-full relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={18} />
            </button>

            {/* MEDIA */}
            {type === "image" && (
              <img
                src={src}
                alt="preview"
                className="w-full h-auto rounded-lg"
              />
            )}

            {type === "video" && (
              <video
                src={src}
                controls
                className="w-full rounded-lg"
              />
            )}

            {type === "audio" && (
              <audio src={src} controls className="w-full mt-4" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaPreviewModal;