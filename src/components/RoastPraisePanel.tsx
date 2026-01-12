"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RoastPraise } from "@/lib/types";

interface RoastPraisePanelProps {
  data: RoastPraise;
}

export function RoastPraisePanel({ data }: RoastPraisePanelProps) {
  const [mode, setMode] = useState<"roast" | "praise">("praise");

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <div className="relative flex bg-black/50 rounded-full p-1 border border-gray-700">
          {/* Sliding background */}
          <motion.div
            className={`absolute top-1 bottom-1 w-1/2 rounded-full ${
              mode === "praise" ? "bg-green-500/30" : "bg-red-500/30"
            }`}
            animate={{ x: mode === "praise" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              boxShadow: mode === "praise" 
                ? "0 0 15px rgba(0, 255, 0, 0.5)" 
                : "0 0 15px rgba(255, 0, 0, 0.5)",
            }}
          />
          
          <button
            onClick={() => setMode("praise")}
            className={`relative z-10 px-6 py-2 font-vt323 text-lg transition-colors ${
              mode === "praise" ? "text-green-400" : "text-gray-500"
            }`}
          >
            PRAISE 🙏
          </button>
          <button
            onClick={() => setMode("roast")}
            className={`relative z-10 px-6 py-2 font-vt323 text-lg transition-colors ${
              mode === "roast" ? "text-red-400" : "text-gray-500"
            }`}
          >
            ROAST 🔥
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 15 }}
          transition={{ duration: 0.3 }}
          className={`relative p-6 rounded-lg border-2 ${
            mode === "praise" 
              ? "border-green-500/50 bg-green-900/10" 
              : "border-red-500/50 bg-red-900/10"
          }`}
          style={{
            boxShadow: mode === "praise"
              ? "0 0 30px rgba(0, 255, 0, 0.1), inset 0 0 30px rgba(0, 255, 0, 0.05)"
              : "0 0 30px rgba(255, 0, 0, 0.1), inset 0 0 30px rgba(255, 0, 0, 0.05)",
          }}
        >
          {/* Quote marks */}
          <div
            className={`absolute top-4 left-4 text-6xl opacity-20 font-serif ${
              mode === "praise" ? "text-green-500" : "text-red-500"
            }`}
          >
            &ldquo;
          </div>

          {/* Main text */}
          <motion.p
            className={`font-vt323 text-2xl text-center py-8 px-4 ${
              mode === "praise" ? "text-green-300" : "text-red-300"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mode === "praise" ? data.praise : data.roast}
          </motion.p>

          {/* Quote marks end */}
          <div
            className={`absolute bottom-4 right-4 text-6xl opacity-20 font-serif ${
              mode === "praise" ? "text-green-500" : "text-red-500"
            }`}
          >
            &rdquo;
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Constructive feedback */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-lg border border-cyan-500/30 bg-cyan-900/10"
      >
        <div className="font-vt323 text-cyan-400 text-sm mb-2">💡 CONSTRUCTIVE FEEDBACK</div>
        <p className="font-vt323 text-gray-300">{data.constructiveFeedback}</p>
      </motion.div>

      {/* Motivational quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 text-center"
      >
        <p className="font-vt323 text-purple-400 italic">
          &quot;{data.motivationalQuote}&quot;
        </p>
      </motion.div>
    </div>
  );
}
