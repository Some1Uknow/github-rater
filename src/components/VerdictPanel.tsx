"use client";

import { motion } from "framer-motion";
import { Verdict, Comparisons, Predictions } from "@/lib/types";

interface VerdictPanelProps {
  verdict: Verdict;
  comparisons: Comparisons;
  predictions: Predictions;
  funFacts: string[];
}

export function VerdictPanel({ verdict, comparisons, predictions, funFacts }: VerdictPanelProps) {
  return (
    <div className="w-full space-y-8">
      {/* Main Verdict */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-8 rounded-xl border-2 border-gold/50 bg-gradient-to-br from-yellow-900/20 via-black/50 to-orange-900/20"
        style={{
          boxShadow: "0 0 40px rgba(255, 215, 0, 0.2), inset 0 0 40px rgba(255, 215, 0, 0.05)",
        }}
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 215, 0, 0.3)",
              "0 0 40px rgba(255, 215, 0, 0.5)",
              "0 0 20px rgba(255, 215, 0, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="relative z-10 text-center">
          {/* Emoji */}
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {verdict.emoji}
          </motion.div>

          {/* One word */}
          <motion.h2
            className="font-press-start text-3xl md:text-4xl text-yellow-400 mb-4"
            style={{ textShadow: "0 0 20px rgba(255, 215, 0, 0.8)" }}
            animate={{
              textShadow: [
                "0 0 20px rgba(255, 215, 0, 0.8)",
                "0 0 40px rgba(255, 215, 0, 1)",
                "0 0 20px rgba(255, 215, 0, 0.8)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {verdict.oneWord}
          </motion.h2>

          {/* Summary */}
          <p className="font-vt323 text-xl text-gray-300 max-w-2xl mx-auto">
            {verdict.summary}
          </p>
        </div>
      </motion.div>

      {/* Hiring Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="p-4 rounded-lg border border-green-500/30 bg-green-900/10 text-center">
          <div className="font-vt323 text-gray-500 text-sm mb-2">SHOULD YOU HIRE?</div>
          <div className="font-vt323 text-xl text-green-400">{verdict.shouldYouHire}</div>
        </div>
        <div className="p-4 rounded-lg border border-cyan-500/30 bg-cyan-900/10 text-center">
          <div className="font-vt323 text-gray-500 text-sm mb-2">WOULD COLLABORATE?</div>
          <div className="font-vt323 text-xl text-cyan-400">{verdict.wouldCollaborate}</div>
        </div>
        <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-900/10 text-center">
          <div className="font-vt323 text-gray-500 text-sm mb-2">TRUST WITH PROD?</div>
          <div className="font-vt323 text-xl text-purple-400">{verdict.trustWithProduction}</div>
        </div>
      </motion.div>

      {/* Comparisons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-lg border border-pink-500/30 bg-pink-900/10"
      >
        <h3 className="font-vt323 text-xl text-pink-400 mb-4 text-center">COMPARISONS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-vt323 text-gray-500 text-sm mb-1">SIMILAR TO</div>
            <div className="font-vt323 text-pink-300 text-sm">
              {comparisons.similarTo.slice(0, 2).join(", ")}
            </div>
          </div>
          <div>
            <div className="font-vt323 text-gray-500 text-sm mb-1">BETTER THAN</div>
            <div className="font-vt323 text-pink-300 text-sm">{comparisons.betterThan}</div>
          </div>
          <div>
            <div className="font-vt323 text-gray-500 text-sm mb-1">COULD LEARN FROM</div>
            <div className="font-vt323 text-pink-300 text-sm">{comparisons.couldLearnFrom}</div>
          </div>
          <div>
            <div className="font-vt323 text-gray-500 text-sm mb-1">PEER GROUP</div>
            <div className="font-vt323 text-pink-300 text-sm">{comparisons.peerGroup}</div>
          </div>
        </div>
      </motion.div>

      {/* Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-lg border border-cyan-500/30 bg-cyan-900/10"
      >
        <h3 className="font-vt323 text-xl text-cyan-400 mb-4 text-center">🔮 PREDICTIONS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="font-vt323 text-gray-500">Next Milestone: </span>
              <span className="font-vt323 text-cyan-300">{predictions.nextMilestone}</span>
            </div>
            <div>
              <span className="font-vt323 text-gray-500">ETA: </span>
              <span className="font-vt323 text-cyan-300">{predictions.estimatedTimeToMilestone}</span>
            </div>
            <div>
              <span className="font-vt323 text-gray-500">Trajectory: </span>
              <span className="font-vt323 text-cyan-300">{predictions.careerTrajectory}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-vt323 text-gray-500">Focus On: </span>
              <span className="font-vt323 text-cyan-300">{predictions.recommendedFocus}</span>
            </div>
            <div>
              <span className="font-vt323 text-gray-500">Growth Areas: </span>
              <span className="font-vt323 text-cyan-300">
                {predictions.potentialGrowthAreas.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fun Facts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-lg border border-purple-500/30 bg-purple-900/10"
      >
        <h3 className="font-vt323 text-xl text-purple-400 mb-4 text-center">🎲 FUN FACTS</h3>
        <ul className="space-y-2">
          {funFacts.map((fact, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="font-vt323 text-gray-300 flex items-start gap-2"
            >
              <span className="text-purple-400">▸</span>
              {fact}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
