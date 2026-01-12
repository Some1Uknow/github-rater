"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MatrixRain } from "@/components/MatrixRain";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { NeonText } from "@/components/NeonText";
import { useRouter } from "next/navigation";

interface LeaderboardEntry {
  username: string;
  powerLevel: number;
  rank: string;
  archetype: string;
  totalStars: number;
  followers: number;
  topLanguage: string;
  analyzedAt: string;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"powerLevel" | "stars" | "followers">("powerLevel");

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leaderboard?sortBy=${sortBy}&limit=50`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: string) => {
    if (rank.includes("Legendary") || rank.includes("Mythic")) return "text-yellow-400";
    if (rank.includes("Epic")) return "text-purple-400";
    if (rank.includes("Rare")) return "text-blue-400";
    if (rank.includes("Uncommon")) return "text-green-400";
    return "text-gray-400";
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <main className="relative min-h-screen p-6 md:p-8 overflow-hidden">
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
      <div className="relative z-10 max-w-7xl mx-auto pt-12 md:pt-16">
        {/* Navigation */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
          <button
            onClick={() => router.push("/")}
            className="font-vt323 text-xl md:text-2xl text-cyan-400 hover:text-cyan-300 transition-colors font-bold flex items-center gap-2"
          >
            <span>←</span> BACK TO HOME
          </button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16 pt-8"
        >
          <NeonText color="cyan" className="font-press-start text-4xl md:text-6xl mb-6 font-bold">
            LEADERBOARD
          </NeonText>
          <p className="font-vt323 text-2xl md:text-3xl text-gray-400">
            Top GitHub Developers Ranked by Power Level
          </p>
        </motion.div>

        {/* Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setSortBy("powerLevel")}
            className={`font-vt323 text-xl md:text-2xl px-6 py-3 rounded border-2 transition-all font-bold ${sortBy === "powerLevel"
                ? "bg-cyan-500/30 border-cyan-500 text-cyan-400"
                : "bg-cyan-500/10 border-cyan-500/30 text-gray-400 hover:border-cyan-500/50"
              }`}
          >
            ⚡ POWER LEVEL
          </button>
          <button
            onClick={() => setSortBy("stars")}
            className={`font-vt323 text-xl md:text-2xl px-6 py-3 rounded border-2 transition-all font-bold ${sortBy === "stars"
                ? "bg-yellow-500/30 border-yellow-500 text-yellow-400"
                : "bg-yellow-500/10 border-yellow-500/30 text-gray-400 hover:border-yellow-500/50"
              }`}
          >
            ⭐ STARS
          </button>
          <button
            onClick={() => setSortBy("followers")}
            className={`font-vt323 text-xl md:text-2xl px-6 py-3 rounded border-2 transition-all font-bold ${sortBy === "followers"
                ? "bg-pink-500/30 border-pink-500 text-pink-400"
                : "bg-pink-500/10 border-pink-500/30 text-gray-400 hover:border-pink-500/50"
              }`}
          >
            👥 FOLLOWERS
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="font-press-start text-2xl md:text-3xl text-cyan-400 mb-6 font-bold">
              LOADING...
            </div>
            <div className="w-64 h-4 bg-gray-900 border-2 border-cyan-500/50 rounded-sm overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-cyan-500"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">⚠️</div>
            <div className="font-press-start text-2xl md:text-3xl text-red-500 mb-4 font-bold">
              ERROR
            </div>
            <p className="font-vt323 text-xl md:text-2xl text-gray-400 mb-8">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="font-vt323 text-xl md:text-2xl px-8 py-4 bg-red-500/20 border-2 border-red-500 text-red-400 rounded hover:bg-red-500/30 transition-colors font-bold"
            >
              TRY AGAIN
            </button>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        {!loading && !error && leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/30 rounded-lg overflow-hidden"
          >
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cyan-900/20 border-b-2 border-cyan-500/30">
                  <tr>
                    <th className="font-vt323 text-xl text-cyan-400 px-6 py-4 text-left font-bold">RANK</th>
                    <th className="font-vt323 text-xl text-cyan-400 px-6 py-4 text-left font-bold">USERNAME</th>
                    <th className="font-vt323 text-xl text-cyan-400 px-6 py-4 text-center font-bold">POWER</th>
                    <th className="font-vt323 text-xl text-cyan-400 px-6 py-4 text-center font-bold">TIER</th>
                    <th className="font-vt323 text-xl text-cyan-400 px-6 py-4 text-center font-bold">ARCHETYPE</th>
                    <th className="font-vt323 text-xl text-cyan-400 px-6 py-4 text-center font-bold">⭐ STARS</th>
                    <th className="font-vt323 text-xl text-cyan-400 px-6 py-4 text-center font-bold">👥 FOLLOWERS</th>
                    <th className="font-vt323 text-xl text-cyan-400 px-6 py-4 text-center font-bold">LANGUAGE</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <motion.tr
                      key={entry.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => router.push(`/report/${entry.username}`)}
                      className="border-b border-cyan-500/10 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                    >
                      <td className="font-vt323 text-2xl text-white px-6 py-4 font-bold">
                        {getMedalEmoji(index)}
                      </td>
                      <td className="font-vt323 text-xl text-cyan-300 px-6 py-4 font-bold">
                        @{entry.username}
                      </td>
                      <td className="font-vt323 text-xl text-green-400 px-6 py-4 text-center font-bold">
                        {entry.powerLevel.toLocaleString()}
                      </td>
                      <td className={`font-vt323 text-lg px-6 py-4 text-center font-bold ${getRankColor(entry.rank)}`}>
                        {entry.rank}
                      </td>
                      <td className="font-vt323 text-lg text-purple-400 px-6 py-4 text-center font-bold">
                        {entry.archetype}
                      </td>
                      <td className="font-vt323 text-xl text-yellow-400 px-6 py-4 text-center font-bold">
                        {entry.totalStars.toLocaleString()}
                      </td>
                      <td className="font-vt323 text-xl text-pink-400 px-6 py-4 text-center font-bold">
                        {entry.followers.toLocaleString()}
                      </td>
                      <td className="font-vt323 text-lg text-blue-400 px-6 py-4 text-center font-bold">
                        {entry.topLanguage}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.username}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/report/${entry.username}`)}
                  className="bg-cyan-900/10 border-2 border-cyan-500/30 rounded-lg p-6 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-vt323 text-3xl text-white font-bold">
                      {getMedalEmoji(index)}
                    </div>
                    <div className="font-vt323 text-2xl text-cyan-300 font-bold">
                      @{entry.username}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-vt323 text-sm text-gray-500 font-bold">POWER</div>
                      <div className="font-vt323 text-2xl text-green-400 font-bold">
                        {entry.powerLevel.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="font-vt323 text-sm text-gray-500 font-bold">TIER</div>
                      <div className={`font-vt323 text-lg font-bold ${getRankColor(entry.rank)}`}>
                        {entry.rank}
                      </div>
                    </div>
                    <div>
                      <div className="font-vt323 text-sm text-gray-500 font-bold">⭐ STARS</div>
                      <div className="font-vt323 text-xl text-yellow-400 font-bold">
                        {entry.totalStars.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="font-vt323 text-sm text-gray-500 font-bold">👥 FOLLOWERS</div>
                      <div className="font-vt323 text-xl text-pink-400 font-bold">
                        {entry.followers.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">📊</div>
            <div className="font-press-start text-2xl md:text-3xl text-gray-400 mb-4 font-bold">
              NO DATA YET
            </div>
            <p className="font-vt323 text-xl md:text-2xl text-gray-500">
              Be the first to analyze your profile!
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
