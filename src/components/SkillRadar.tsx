"use client";

import { motion } from "framer-motion";

interface SkillRadarProps {
  skills: Record<string, number>;
  title?: string;
}

export function SkillRadar({ skills, title = "SKILL MATRIX" }: SkillRadarProps) {
  const entries = Object.entries(skills).slice(0, 6);
  const count = entries.length;

  if (count === 0) return null;

  const centerX = 170;
  const centerY = 170;
  const maxRadius = 120;
  const levels = 5;

  // Calculate points for each skill
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Generate polygon points
  const polygonPoints = entries
    .map((entry, i) => {
      const point = getPoint(i, entry[1]);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  // Generate grid lines
  const gridLines = [];
  for (let level = 1; level <= levels; level++) {
    const radius = (level / levels) * maxRadius;
    const points = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    gridLines.push(points);
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <h3 className="font-vt323 text-xl text-cyan-400 text-center mb-4 tracking-wider">
        {title}
      </h3>

      <svg viewBox="0 0 340 340" className="w-full h-auto">
        {/* Grid polygons */}
        {gridLines.map((points, level) => (
          <polygon
            key={level}
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="rgba(0, 255, 255, 0.2)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {entries.map((_, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const endX = centerX + maxRadius * Math.cos(angle);
          const endY = centerY + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="rgba(0, 255, 255, 0.3)"
              strokeWidth="1"
            />
          );
        })}

        {/* Skill polygon */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(0, 255, 255, 0.2)"
          stroke="#00ffff"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            filter: "drop-shadow(0 0 10px #00ffff)",
            transformOrigin: "center",
          }}
        />

        {/* Skill points */}
        {entries.map((entry, i) => {
          const point = getPoint(i, entry[1]);
          return (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#00ffff"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
              style={{ filter: "drop-shadow(0 0 5px #00ffff)" }}
            />
          );
        })}

        {/* Labels */}
        {entries.map((entry, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const labelRadius = maxRadius + 35;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);

          return (
            <motion.text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-vt323 text-xs sm:text-sm fill-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              {entry[0]}
            </motion.text>
          );
        })}

        {/* Value labels */}
        {entries.map((entry, i) => {
          const point = getPoint(i, entry[1]);
          return (
            <motion.text
              key={`val-${i}`}
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              className="font-vt323 text-xs fill-cyan-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.1 }}
            >
              {entry[1]}
            </motion.text>
          );
        })}
      </svg>
    </div>
  );
}
