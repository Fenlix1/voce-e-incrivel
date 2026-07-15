"use client";

import { motion } from "framer-motion";

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      onClick={() => {
        const nextSection = document.getElementById("sobre");
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
        Role para descobrir
      </span>
      <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-white"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
