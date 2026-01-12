"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PowerLevelMeterProps {
  level: number;
  maxLevel?: number;
  rank: string;
  title: string;
}

export function PowerLevelMeter({ level, maxLevel = 10000, rank, title }: PowerLevelMeterProps) {
  const [displayLevel, setDisplayLevel] = useState(0);
  const percentage = Math.min((level / maxLevel) * 100, 100);

  // Animate the number counting up
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = level / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), level);
      setDisplayLevel(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayLevel(level);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [level]);

  const getColor = () => {
    if (level >= 9000) return { bar: "bg-yellow-400", glow: "#ffd700", text: "text-yellow-400" };
    if (level >= 7000) return { bar: "bg-purple-500", glow: "#9d00ff", text: "text-purple-500" };
    if (level >= 5000) return { bar: "bg-pink-500", glow: "#ff00ff", text: "text-pink-500" };
    if (level >= 3000) return { bar: "bg-cyan-400", glow: "#00ffff", text: "text-cyan-400" };
    return { bar: "bg-green-400", glow: "#00ff00", text: "text-green-400" };
  };

  const colors = getColor();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <div className="font-vt323 text-xl md:text-2xl text-gray-400 mb-1 font-bold">POWER LEVEL</div>
        <motion.div
          className={`font-press-start text-3xl md:text-5xl ${colors.text} font-bold`}
          style={{
            textShadow: `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
          }}
          animate={{
            textShadow: [
              `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
              `0 0 5px ${colors.glow}, 0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}`,
              `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {displayLevel.toLocaleString()}
        </motion.div>
      </motion.div>

      {/* Power Bar Container */}
      <div className="relative">
        {/* Background bar */}
        <div className="h-6 md:h-8 bg-gray-900 border-2 border-gray-700 rounded-sm overflow-hidden">
          {/* Animated fill */}
          <motion.div
            className={`h-full ${colors.bar} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              boxShadow: `0 0 20px ${colors.glow}, inset 0 0 10px rgba(255,255,255,0.3)`,
            }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.div>
        </div>

        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-px h-full bg-gray-600/50" />
          ))}
        </div>
      </div>

      {/* Rank and Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-between items-center mt-4"
      >
        <div className="flex items-center gap-2">
          <span className="font-vt323 text-gray-500 text-base md:text-lg font-bold">RANK:</span>
          <motion.span
            className={`font-press-start text-lg md:text-2xl ${colors.text} font-bold`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            {rank}
          </motion.span>
        </div>
        <div
          className={`font-vt323 text-base md:text-xl ${colors.text} tracking-wider font-bold`}
          style={{ textShadow: `0 0 5px ${colors.glow}` }}
        >
          {title}
        </div>
      </motion.div>

      {/* Over 9000 Easter Egg */}
      {level >= 9000 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, type: "spring" }}
          className="text-center mt-4"
        >
          <span className="font-press-start text-yellow-400 text-xs md:text-sm animate-pulse font-bold">
            IT&apos;S OVER 9000!!!
          </span>
        </motion.div>
      )}
    </div>
  );
}
