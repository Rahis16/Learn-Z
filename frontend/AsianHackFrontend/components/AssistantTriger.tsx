"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface TriggerButtonProps {
  onTrigger: () => void;
  isActive: boolean;
}

const TriggerButton: React.FC<TriggerButtonProps> = ({
  onTrigger,
  isActive,
}) => {
  const [dragging, setDragging] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum
      dragElastic={0.2}
      dragTransition={{
        bounceStiffness: 600,
        bounceDamping: 20,
        power: 0.8,
        timeConstant: 200,
      }}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onClick={() => {
        if (!dragging) onTrigger();
      }}
      style={{
        position: "fixed",
        left: 20,
        bottom: 20,
        zIndex: 10000,
        cursor: "grab",
      }}
      whileTap={{ cursor: "grabbing" }}
    >
      <motion.img
        src="/icons/learnz-logo.png"
        alt="Assistant"
        style={{
          width: 60,
          height: 60,
          filter: isActive ? "drop-shadow(0 0 5px #0f62fe)" : "none",
          transition: "filter 0.3s ease",
        }}
        animate={{ rotate: 360 }} // rotate continuously
        transition={{ repeat: Infinity, duration: 5, ease: "linear" }} // smooth infinite rotation
        whileTap={{ scale: 0.9 }}
      />
    </motion.div>
  );
};

export default TriggerButton;
