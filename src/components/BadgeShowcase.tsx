"use client";

import { motion } from "framer-motion";
import { Badge } from "@/lib/types";

interface BadgeShowcaseProps {
  badges: Badge[];
}

const rarityColors = {
  Common: { bg: "bg-gray-600", border: "border-gray-500", glow: "gray" },
  Uncommon: { bg: "bg-green-600", border: "border-green-500", glow: "#00ff00" },
  Rare: { bg: "bg-blue-600", border: "border-blue-500", glow: "#0088ff" },
  Epic: { bg: "bg-purple-600", border: "border-purple-500", glow: "#9d00ff" },
  Legendary: { bg: "bg-orange-500", border: "border-orange-400", glow: "#ff6600" },
  Mythic: { bg: "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500", border: "border-pink-400", glow: "#ff00ff" },
};

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  if (badges.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="font-vt323 text-xl text-pink-500 text-center mb-6 tracking-wider">
        ACHIEVEMENTS UNLOCKED
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => {
          const colors = rarityColors[badge.rarity];
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20, rotateY: -90 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative p-4 rounded-lg border-2 ${colors.border} ${colors.bg} bg-opacity-20 backdrop-blur-sm cursor-pointer group`}
              style={{
                boxShadow: `0 0 15px ${colors.glow}40, inset 0 0 15px ${colors.glow}20`,
              }}
            >
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Badge content */}
              <div className="relative z-10 text-center">
                <motion.div
                  className="text-4xl mb-2"
                  animate={{ 
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3 + index,
                  }}
                >
                  {badge.icon}
                </motion.div>
                
                <div className="font-vt323 text-white text-sm mb-1 leading-tight">
                  {badge.name}
                </div>
                
                <div
                  className={`font-press-start text-[8px] ${
                    badge.rarity === "Mythic" ? "text-pink-400" :
                    badge.rarity === "Legendary" ? "text-orange-400" :
                    badge.rarity === "Epic" ? "text-purple-400" :
                    badge.rarity === "Rare" ? "text-blue-400" :
                    badge.rarity === "Uncommon" ? "text-green-400" :
                    "text-gray-400"
                  }`}
                >
                  {badge.rarity.toUpperCase()}
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 border border-cyan-500/50 rounded text-xs text-gray-300 font-vt323 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                {badge.description}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
