"use client";

import { motion } from "framer-motion";

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  color: "cyan" | "pink" | "green" | "purple" | "gold";
}

interface StatsGridProps {
  stats: Stat[];
  title?: string;
}

const colorClasses = {
  cyan: { text: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-900/10", glow: "#00ffff" },
  pink: { text: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-900/10", glow: "#ff00ff" },
  green: { text: "text-green-400", border: "border-green-500/30", bg: "bg-green-900/10", glow: "#00ff00" },
  purple: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-900/10", glow: "#9d00ff" },
  gold: { text: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-900/10", glow: "#ffd700" },
};

export function StatsGrid({ stats, title }: StatsGridProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="font-vt323 text-xl text-cyan-400 text-center mb-6 tracking-wider">
          {title}
        </h3>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colors = colorClasses[stat.color];
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`relative p-4 rounded-lg border ${colors.border} ${colors.bg} backdrop-blur-sm overflow-hidden group`}
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  boxShadow: `inset 0 0 20px ${colors.glow}30`,
                }}
              />
              
              <div className="relative z-10">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className={`font-press-start text-lg ${colors.text} mb-1`}>
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="font-vt323 text-gray-500 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
