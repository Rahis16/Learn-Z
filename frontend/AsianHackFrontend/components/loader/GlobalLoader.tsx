'use client';

import { motion } from 'framer-motion';

export default function GlobalLoader() {
  return (
    <div className="fixed top-30 left-1/2 -translate-x-1/2 z-[9999]">
      <motion.div
        className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full shadow"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 0.8,
        }}
      />
    </div>
  );
}
