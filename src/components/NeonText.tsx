"use client";

import { motion } from "framer-motion";

interface NeonTextProps {
  children: React.ReactNode;
  color?: "cyan" | "pink" | "green" | "purple" | "gold";
  className?: string;
  animate?: boolean;
}

const colorMap = {
  cyan: {
    text: "text-cyan-400",
    shadow: "0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff",
    shadowDim: "0 0 2px #00ffff, 0 0 5px #00ffff",
  },
  pink: {
    text: "text-pink-500",
    shadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff",
    shadowDim: "0 0 2px #ff00ff, 0 0 5px #ff00ff",
  },
  green: {
    text: "text-green-400",
    shadow: "0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00",
    shadowDim: "0 0 2px #00ff00, 0 0 5px #00ff00",
  },
  purple: {
    text: "text-purple-500",
    shadow: "0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 40px #9d00ff",
    shadowDim: "0 0 2px #9d00ff, 0 0 5px #9d00ff",
  },
  gold: {
    text: "text-yellow-400",
    shadow: "0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 40px #ffd700",
    shadowDim: "0 0 2px #ffd700, 0 0 5px #ffd700",
  },
};

export function NeonText({ children, color = "cyan", className = "", animate = true }: NeonTextProps) {
  const colors = colorMap[color];

  if (!animate) {
    return (
      <span
        className={`${colors.text} ${className}`}
        style={{ textShadow: colors.shadow }}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={`${colors.text} ${className}`}
      animate={{
        textShadow: [colors.shadow, colors.shadowDim, colors.shadow],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
}
