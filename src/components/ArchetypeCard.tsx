"use client";

import { motion } from "framer-motion";
import { Archetype } from "@/lib/types";

interface ArchetypeCardProps {
  archetype: Archetype;
  username: string;
  avatarUrl: string;
}

const spiritAnimalEmojis: Record<string, string> = {
  Phoenix: "🔥",
  Dragon: "🐉",
  Wolf: "🐺",
  Owl: "🦉",
  Fox: "🦊",
  Tiger: "🐅",
  Eagle: "🦅",
  Shark: "🦈",
  Octopus: "🐙",
  Raven: "🐦‍⬛",
  Bear: "🐻",
  Panther: "🐆",
  Hawk: "🦅",
  Cobra: "🐍",
  Lion: "🦁",
};

export function ArchetypeCard({ archetype, username, avatarUrl }: ArchetypeCardProps) {
  const spiritEmoji = spiritAnimalEmojis[archetype.spiritAnimal] || "🔮";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="relative w-full max-w-sm mx-auto"
      style={{ perspective: "1000px" }}
    >
      {/* Card container */}
      <div
        className="relative p-4 md:p-6 rounded-xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 via-black/50 to-pink-900/30 backdrop-blur-sm overflow-hidden"
        style={{
          boxShadow: "0 0 30px rgba(157, 0, 255, 0.3), inset 0 0 30px rgba(157, 0, 255, 0.1)",
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(157, 0, 255, 0.5) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Glowing orb effect */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-purple-500 overflow-hidden"
                style={{
                  boxShadow: "0 0 20px rgba(157, 0, 255, 0.5)",
                }}
              >
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Spirit animal badge */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black border-2 border-pink-500 flex items-center justify-center text-lg md:text-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {spiritEmoji}
              </motion.div>
            </motion.div>
          </div>

          {/* Username */}
          <motion.h2
            className="font-press-start text-base md:text-lg text-center text-white mb-2 font-bold"
            style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" }}
          >
            @{username}
          </motion.h2>

          {/* Primary Archetype */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="font-vt323 text-gray-400 text-xs md:text-sm mb-1 font-bold">PRIMARY CLASS</div>
            <div
              className="font-press-start text-xs md:text-sm text-purple-400 font-bold"
              style={{ textShadow: "0 0 10px rgba(157, 0, 255, 0.8)" }}
            >
              {archetype.primary}
            </div>
          </motion.div>

          {/* Secondary Archetype */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="font-vt323 text-gray-400 text-xs md:text-sm mb-1 font-bold">SECONDARY CLASS</div>
            <div className="font-vt323 text-base md:text-lg text-pink-400 font-bold">
              {archetype.secondary}
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center p-2 rounded bg-black/30 border border-cyan-500/30">
              <div className="font-vt323 text-gray-500 text-xs font-bold">SPIRIT ANIMAL</div>
              <div className="font-vt323 text-cyan-400 text-sm md:text-base font-bold">{archetype.spiritAnimal}</div>
            </div>
            <div className="text-center p-2 rounded bg-black/30 border border-pink-500/30">
              <div className="font-vt323 text-gray-500 text-xs font-bold">ALIGNMENT</div>
              <div className="font-vt323 text-pink-400 text-sm md:text-base font-bold">{archetype.alignment}</div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="font-vt323 text-gray-300 text-center text-xs md:text-sm italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            &quot;{archetype.description}&quot;
          </motion.p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-purple-500/50" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-purple-500/50" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-500/50" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-purple-500/50" />
      </div>
    </motion.div>
  );
}
