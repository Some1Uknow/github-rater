"use client";

import { motion } from "framer-motion";
import { LanguageSkill } from "@/lib/types";

interface LanguageBarProps {
  languages: Record<string, LanguageSkill>;
}

const languageColors: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#239120",
  Go: "#00add8",
  Rust: "#dea584",
  Ruby: "#cc342d",
  PHP: "#4f5d95",
  Swift: "#fa7343",
  Kotlin: "#a97bff",
  Dart: "#00b4ab",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Lua: "#000080",
  R: "#198ce7",
  Julia: "#9558b2",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
  Perl: "#0298c3",
  Assembly: "#6e4c13",
};

export function LanguageBar({ languages }: LanguageBarProps) {
  const entries = Object.entries(languages)
    .sort((a, b) => b[1].level - a[1].level)
    .slice(0, 8);

  if (entries.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="font-vt323 text-xl text-green-400 text-center mb-6 tracking-wider">
        LANGUAGE PROFICIENCY
      </h3>

      <div className="space-y-4">
        {entries.map(([lang, skill], index) => {
          const color = languageColors[lang] || "#888888";
          
          return (
            <motion.div
              key={lang}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                  />
                  <span className="font-vt323 text-white">{lang}</span>
                  <span className="font-vt323 text-gray-500 text-sm">
                    ({skill.projects} projects)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="font-vt323 text-sm px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                      border: `1px solid ${color}50`,
                    }}
                  >
                    {skill.mastery}
                  </span>
                  <span className="font-press-start text-xs text-gray-400">
                    {skill.level}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-gray-900 rounded-sm overflow-hidden border border-gray-700">
                <motion.div
                  className="h-full relative"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 1.5, delay: 1 + index * 0.1 }}
                  />
                  {/* Glow */}
                  <div
                    className="absolute inset-0"
                    style={{ boxShadow: `0 0 10px ${color}, inset 0 0 5px rgba(255,255,255,0.3)` }}
                  />
                </motion.div>
              </div>

              {/* Lines estimate */}
              <div className="text-right mt-1">
                <span className="font-vt323 text-gray-600 text-xs">
                  ~{skill.linesEstimate} lines
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
