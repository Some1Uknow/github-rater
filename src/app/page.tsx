"use client";

import { motion } from "framer-motion";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { MatrixRain } from "@/components/MatrixRain";
import { RetroTerminal } from "@/components/RetroTerminal";
import { GlitchText } from "@/components/GlitchText";
import { NeonText } from "@/components/NeonText";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
      {/* Background effects */}
      <MatrixRain />
      <ScanlineOverlay />

      {/* Grid background */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-16 md:pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          {/* Logo/Title */}
          <div className="mb-6 md:mb-8">
            <GlitchText
              text="GITHUB RATER"
              className="font-press-start text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-wider"
            />
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-vt323 text-3xl md:text-4xl lg:text-5xl text-gray-400 mb-6 md:mb-8 font-bold"
          >
            <NeonText color="cyan">ANALYZE YOUR CODE POWER LEVEL</NeonText>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-vt323 text-2xl md:text-3xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Discover your developer archetype, get roasted by AI, and find out
            if your power level is over 9000
          </motion.p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <RetroTerminal />
        </motion.div>

        {/* Leaderboard Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => router.push("/leaderboard")}
            className="font-vt323 text-2xl md:text-3xl px-8 py-4 bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-400 rounded hover:bg-yellow-500/30 hover:border-yellow-500 transition-all font-bold"
          >
            🏆 VIEW LEADERBOARD
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-20 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            { icon: "⚡", label: "Power Level", desc: "DBZ-style rating" },
            { icon: "🎭", label: "Archetype", desc: "Your dev class" },
            { icon: "🔥", label: "Roast/Praise", desc: "AI feedback" },
            { icon: "🏆", label: "Badges", desc: "Achievements" },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 md:p-8 rounded-lg border border-cyan-500/20 bg-cyan-900/5 backdrop-blur-sm text-center group cursor-pointer"
            >
              <motion.div
                className="text-5xl md:text-6xl mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: index }}
              >
                {feature.icon}
              </motion.div>
              <div className="font-vt323 text-2xl md:text-3xl text-cyan-400 group-hover:text-cyan-300 transition-colors font-bold mb-2">
                {feature.label}
              </div>
              <div className="font-vt323 text-gray-600 text-lg md:text-xl">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-20 md:mt-24 mb-8 text-center font-vt323 text-gray-600"
        >
          <p className="text-xl md:text-2xl mb-4">
            Built with{" "}
            <span className="text-pink-500">♥</span> and{" "}
            <span className="text-green-500">caffeine</span>
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            Uses GitHub public API • No data stored • 100% client-side analysis
          </p>
        </motion.footer>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="fixed top-6 left-6 font-vt323 text-green-500/50 text-base md:text-lg hidden md:block font-bold"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        SYS.ONLINE
      </motion.div>
      <motion.div
        className="fixed top-6 right-6 font-vt323 text-cyan-500/50 text-base md:text-lg hidden md:block font-bold"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        v2.0.0
      </motion.div>
      <motion.div
        className="fixed bottom-6 left-6 font-vt323 text-purple-500/50 text-base md:text-lg hidden md:block font-bold"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        NEURAL.NET.ACTIVE
      </motion.div>
      <motion.div
        className="fixed bottom-6 right-6 font-vt323 text-pink-500/50 text-base md:text-lg hidden md:block font-bold"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      >
        PWR.SCAN.READY
      </motion.div>
    </main>
  );
}
