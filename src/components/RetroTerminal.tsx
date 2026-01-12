"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function RetroTerminal() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lines, setLines] = useState<string[]>([
    "GITHUB RATER v2.0",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Initializing neural network...",
    "Loading developer archetypes...",
    "Calibrating power level scanner...",
    "System ready.",
    "",
    "Enter GitHub username to analyze:",
  ]);
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const username = input.trim();
    setIsTyping(true);

    // Add user input to terminal
    setLines((prev) => [...prev, `> ${username}`, "", "Scanning GitHub profile..."]);

    // Simulate typing effect for loading messages
    const loadingMessages = [
      "Fetching repository data...",
      "Analyzing commit patterns...",
      "Calculating power level...",
      "Generating developer profile...",
    ];

    for (const msg of loadingMessages) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setLines((prev) => [...prev, msg]);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setLines((prev) => [...prev, "", "Analysis complete! Redirecting..."]);

    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push(`/report/${username}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Terminal window */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          boxShadow: "0 0 50px rgba(0, 255, 0, 0.2), inset 0 0 100px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Title bar */}
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center font-vt323 text-gray-400 text-xs md:text-sm font-bold">
            github-rater@terminal ~ /analyze
          </div>
        </div>

        {/* Terminal content */}
        <div
          className="bg-[#0d1117] p-4 md:p-6 min-h-[300px] md:min-h-[400px] font-vt323 text-green-400 text-base md:text-lg relative overflow-hidden"
          onClick={() => inputRef.current?.focus()}
        >
          {/* CRT effect overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.1),
                rgba(0, 0, 0, 0.1) 1px,
                transparent 1px,
                transparent 2px
              )`,
            }}
          />

          {/* Glow effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0, 255, 0, 0.03) 0%, transparent 70%)",
            }}
          />

          {/* Terminal lines */}
          <div className="relative z-10 space-y-1">
            {lines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={line.startsWith(">") ? "text-cyan-400" : ""}
              >
                {line || "\u00A0"}
              </motion.div>
            ))}

            {/* Input line */}
            {!isTyping && (
              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-cyan-400 mr-2">&gt;</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-transparent outline-none text-green-400 font-vt323 text-lg caret-transparent"
                    placeholder=""
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {/* Custom cursor */}
                  <span
                    className={`absolute top-0 text-green-400 ${showCursor ? "opacity-100" : "opacity-0"}`}
                    style={{ left: `${input.length}ch` }}
                  >
                    ▌
                  </span>
                </div>
              </form>
            )}

            {/* Loading cursor */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-green-400"
                >
                  ▌
                </motion.span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-6 font-vt323 text-gray-500 px-4"
      >
        <p className="text-base md:text-lg">Type a GitHub username and press ENTER to analyze</p>
        <p className="text-xs md:text-sm mt-2 text-gray-600">
          Try: torvalds, gaearon, sindresorhus, yyx990803
        </p>
      </motion.div>
    </motion.div>
  );
}
