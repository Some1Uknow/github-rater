"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";

import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { PowerLevelMeter } from "@/components/PowerLevelMeter";
import { ArchetypeCard } from "@/components/ArchetypeCard";
import { SkillRadar } from "@/components/SkillRadar";
import { BadgeShowcase } from "@/components/BadgeShowcase";
import { RoastPraisePanel } from "@/components/RoastPraisePanel";
import { StatsGrid } from "@/components/StatsGrid";
import { LanguageBar } from "@/components/LanguageBar";
import { VerdictPanel } from "@/components/VerdictPanel";
import { NeonText } from "@/components/NeonText";
import { SectionActions } from "@/components/SectionActions";

import { GitHubData, AnalysisResult } from "@/lib/types";

type LoadingPhase = "fetching" | "analyzing" | "generating" | "complete" | "error";

export default function ReportPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const [phase, setPhase] = useState<LoadingPhase>("fetching");
  const [error, setError] = useState<string | null>(null);
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    async function fetchAndAnalyze() {
      try {
        // Phase 1: Start fetching (Checking cache & GitHub)
        setPhase("fetching");

        // Use the unified endpoint that checks cache first
        const response = await fetch(`/api/rate/${username}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }

        const data = await response.json();

        // Update state with fetched data
        setGithubData(data.githubData);
        setAnalysis(data.analysis);

        // Visual pacing: Even if cached, show a brief "analyzing" phase for effect
        // If not cached (data.cached === false), the fetch took longer naturally
        setPhase("analyzing");
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Phase 3: Generate report
        setPhase("generating");
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Complete!
        setPhase("complete");

        // Trigger confetti for high power levels
        if (data.analysis.powerLevel.overall >= 5000) {
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#00ffff", "#ff00ff", "#ffd700"],
            });
          }, 500);
        }
      } catch (err) {
        console.error("Error during analysis:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setPhase("error");
      }
    }

    fetchAndAnalyze();
  }, [username]);

  const handleShare = async () => {
    const reportElement = document.getElementById("report-content");
    if (!reportElement) return;

    try {
      const dataUrl = await toPng(reportElement, {
        backgroundColor: "#0a0a0f",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `github-rater-${username}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error("Failed to generate image:", err);
    }
  };

  const handleSectionDownload = async (sectionId: string, sectionName: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    try {
      // Store original styles
      const originalStyle = sectionElement.getAttribute("style") || "";

      // Temporarily add styles for better image capture
      sectionElement.style.padding = "24px";
      sectionElement.style.backgroundColor = "#0a0a0f";
      sectionElement.style.borderRadius = "12px";

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 50));

      const dataUrl = await toPng(sectionElement, {
        backgroundColor: "#0a0a0f",
        pixelRatio: 2,
        cacheBust: true,
        style: {
          transform: "none",
        },
      });

      // Restore original styles
      if (originalStyle) {
        sectionElement.setAttribute("style", originalStyle);
      } else {
        sectionElement.removeAttribute("style");
      }

      // Create download link and trigger download
      const link = document.createElement("a");
      link.download = `${username}-${sectionName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error("Failed to generate section image:", err);
    }
  };

  const handleShareToX = (sectionName: string, sectionData?: string) => {
    const baseText = `Check out my GitHub ${sectionName}! 🚀`;
    const fullText = sectionData
      ? `${baseText}\n${sectionData}\n\nAnalyze your profile at`
      : `${baseText}\n\nAnalyze your profile at`;

    const url = `${window.location.origin}/report/${username}`;
    const tweetText = encodeURIComponent(`${fullText} ${url}`);

    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}`,
      "_blank",
      "width=550,height=420"
    );
  };

  const handleNewAnalysis = () => {
    router.push("/");
  };

  // Loading screen
  if (phase !== "complete" && phase !== "error") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
        <ScanlineOverlay />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="font-press-start text-3xl md:text-4xl text-cyan-400 mb-12 font-bold"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {phase === "fetching" && "FETCHING GITHUB DATA..."}
            {phase === "analyzing" && "ANALYZING PROFILE..."}
            {phase === "generating" && "GENERATING REPORT..."}
          </motion.div>

          {/* Loading bar */}
          <div className="w-80 md:w-96 h-6 bg-gray-900 border-2 border-cyan-500/50 rounded-sm overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-cyan-500"
              initial={{ width: "0%" }}
              animate={{
                width:
                  phase === "fetching"
                    ? "33%"
                    : phase === "analyzing"
                      ? "66%"
                      : "100%",
              }}
              transition={{ duration: 0.5 }}
              style={{ boxShadow: "0 0 10px #00ffff" }}
            />
          </div>

          {/* ASCII art */}
          <motion.pre
            className="font-mono text-green-500/50 text-xs mt-8"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {`
    ╔══════════════════════════════════╗
    ║  SCANNING: @${username.padEnd(20)}║
    ║  STATUS: ${phase.toUpperCase().padEnd(24)}║
    ╚══════════════════════════════════╝
            `}
          </motion.pre>
        </motion.div>
      </main>
    );
  }

  // Error screen
  if (phase === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
        <ScanlineOverlay />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-8xl md:text-9xl mb-8">💀</div>
          <h1 className="font-press-start text-3xl md:text-4xl text-red-500 mb-6 font-bold">ERROR</h1>
          <p className="font-vt323 text-2xl md:text-3xl text-gray-400 mb-12">{error}</p>
          <button
            onClick={handleNewAnalysis}
            className="font-vt323 text-2xl md:text-3xl px-8 py-4 bg-red-500/20 border-2 border-red-500 text-red-400 rounded hover:bg-red-500/30 transition-colors font-bold"
          >
            TRY AGAIN
          </button>
        </motion.div>
      </main>
    );
  }

  // Main report
  if (!analysis || !githubData) return null;

  const sections = [
    { id: "power", label: "POWER" },
    { id: "archetype", label: "CLASS" },
    { id: "skills", label: "SKILLS" },
    { id: "stats", label: "STATS" },
    { id: "badges", label: "BADGES" },
    { id: "roast", label: "ROAST" },
    { id: "verdict", label: "VERDICT" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] relative">
      <ScanlineOverlay />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b-2 border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleNewAnalysis}
            className="font-vt323 text-lg md:text-2xl text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
          >
            ← NEW SCAN
          </button>

          <div className="hidden md:flex gap-6">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(index);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`font-vt323 text-lg font-bold transition-colors ${activeSection === index ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Report Content */}
      <div id="report-content" className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-12 md:pt-16"
          >
            <NeonText color="cyan" className="font-press-start text-lg md:text-2xl mb-4 font-bold">
              ANALYSIS COMPLETE
            </NeonText>
            <h1 className="font-press-start text-2xl md:text-5xl text-white mb-4 font-bold">
              @{username}
            </h1>
            <p className="font-vt323 text-lg md:text-2xl text-gray-500">
              Analyzed on {new Date(analysis.meta.analyzedAt).toLocaleDateString()}
            </p>
          </motion.header>

          {/* Power Level Section */}
          <section id="power">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PowerLevelMeter
                  level={analysis.powerLevel.overall}
                  rank={analysis.powerLevel.rank}
                  title={analysis.powerLevel.title}
                />

                {/* Breakdown */}
                <div className="mt-8">
                  <SkillRadar
                    skills={analysis.powerLevel.breakdown}
                    title="POWER BREAKDOWN"
                  />
                </div>

                <SectionActions
                  sectionId="power"
                  sectionName="Power Level"
                  onDownload={handleSectionDownload}
                  onShareToX={handleShareToX}
                  shareData={`Power Level: ${analysis.powerLevel.overall} | Rank: ${analysis.powerLevel.rank} - ${analysis.powerLevel.title}`}
                />
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Archetype Section */}
          <section id="archetype">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div id="profile-card">
                <ArchetypeCard
                  archetype={analysis.archetype}
                  username={username}
                  avatarUrl={githubData.user.avatar_url}
                />
              </div>

              {/* Download/Share buttons for profile card */}
              <SectionActions
                sectionId="profile-card"
                sectionName="Profile Card"
                onDownload={handleSectionDownload}
                onShareToX={handleShareToX}
                shareData={`Check out my GitHub profile! 🔥 | @${username} | ${analysis.archetype.primary} - ${analysis.archetype.secondary}`}
              />

              {/* Personality traits */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="p-4 md:p-5 rounded border-2 border-purple-500/30 bg-purple-900/10 text-center">
                  <div className="font-vt323 text-gray-500 text-sm md:text-lg mb-2 font-bold">CODING STYLE</div>
                  <div className="font-vt323 text-purple-400 text-base md:text-xl font-bold">{analysis.personality.codingStyle}</div>
                </div>
                <div className="p-4 md:p-5 rounded border-2 border-pink-500/30 bg-pink-900/10 text-center">
                  <div className="font-vt323 text-gray-500 text-sm md:text-lg mb-2 font-bold">WORK PATTERN</div>
                  <div className="font-vt323 text-pink-400 text-base md:text-xl font-bold">{analysis.personality.workPattern}</div>
                </div>
                <div className="p-4 md:p-5 rounded border-2 border-cyan-500/30 bg-cyan-900/10 text-center">
                  <div className="font-vt323 text-gray-500 text-sm md:text-lg mb-2 font-bold">TEAM ROLE</div>
                  <div className="font-vt323 text-cyan-400 text-base md:text-xl font-bold">{analysis.personality.teamRole}</div>
                </div>
                <div className="p-4 md:p-5 rounded border-2 border-green-500/30 bg-green-900/10 text-center">
                  <div className="font-vt323 text-gray-500 text-sm md:text-lg mb-2 font-bold">MOTTO</div>
                  <div className="font-vt323 text-green-400 text-sm md:text-lg font-bold">{analysis.personality.motto}</div>
                </div>
              </div>

              <SectionActions
                sectionId="archetype"
                sectionName="Archetype"
                onDownload={handleSectionDownload}
                onShareToX={handleShareToX}
                shareData={`My GitHub Archetype: ${analysis.archetype.primary} | ${analysis.archetype.secondary}`}
              />
            </motion.div>
          </section>

          {/* Skills Section */}
          <section id="skills">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <LanguageBar languages={analysis.skills.languages} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SkillRadar skills={analysis.skills.domains} title="DOMAIN EXPERTISE" />
                <SkillRadar skills={analysis.skills.softSkills} title="SOFT SKILLS" />
              </div>
            </motion.div>
          </section>

          {/* Stats Section */}
          <section id="stats">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <StatsGrid
                title="REPOSITORY STATS"
                stats={[
                  { label: "Repositories", value: analysis.repositories.total, icon: "📦", color: "cyan" },
                  { label: "Total Stars", value: analysis.repositories.totalStars, icon: "⭐", color: "gold" },
                  { label: "Total Forks", value: analysis.repositories.totalForks, icon: "🍴", color: "green" },
                  { label: "Avg Stars/Repo", value: analysis.repositories.avgStarsPerRepo, icon: "📊", color: "purple" },
                  { label: "Followers", value: analysis.influence.followers, icon: "👥", color: "pink" },
                  { label: "Following", value: analysis.influence.following, icon: "👤", color: "cyan" },
                  { label: "Follower Ratio", value: analysis.influence.followerRatio, icon: "📈", color: "green" },
                  { label: "Viral Repos", value: analysis.influence.viralRepos, icon: "🔥", color: "gold" },
                ]}
              />

              {/* Most starred repo */}
              {analysis.repositories.mostStarred && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-8 p-6 rounded-lg border border-yellow-500/30 bg-yellow-900/10"
                >
                  <h4 className="font-vt323 text-yellow-400 text-lg mb-2">🏆 MOST STARRED REPO</h4>
                  <div className="font-press-start text-white text-sm mb-2">
                    {analysis.repositories.mostStarred.name}
                  </div>
                  <div className="font-vt323 text-gray-400 mb-2">
                    {analysis.repositories.mostStarred.description}
                  </div>
                  <div className="font-vt323 text-yellow-400">
                    ⭐ {analysis.repositories.mostStarred.stars.toLocaleString()} stars
                  </div>
                </motion.div>
              )}

              {/* Activity stats */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="p-4 md:p-5 rounded border-2 border-cyan-500/30 bg-cyan-900/10 text-center">
                  <div className="font-vt323 text-gray-500 text-sm md:text-lg mb-2 font-bold">MOST ACTIVE DAY</div>
                  <div className="font-vt323 text-cyan-400 text-base md:text-xl font-bold">{analysis.activity.mostActiveDay}</div>
                </div>
                <div className="p-4 md:p-5 rounded border-2 border-purple-500/30 bg-purple-900/10 text-center">
                  <div className="font-vt323 text-gray-500 text-sm md:text-lg mb-2 font-bold">NIGHT OWL SCORE</div>
                  <div className="font-vt323 text-purple-400 text-base md:text-xl font-bold">{analysis.activity.nightOwlScore}%</div>
                </div>
                <div className="p-4 md:p-5 rounded border-2 border-pink-500/30 bg-pink-900/10 text-center">
                  <div className="font-vt323 text-gray-500 text-sm md:text-lg mb-2 font-bold">BURNOUT RISK</div>
                  <div className="font-vt323 text-pink-400 text-base md:text-xl font-bold">{analysis.activity.burnoutRisk}</div>
                </div>
                <div className="p-4 md:p-5 rounded border-2 border-green-500/30 bg-green-900/10 text-center">
                  <div className="font-vt323 text-gray-500 text-sm md:text-lg mb-2 font-bold">PATTERN</div>
                  <div className="font-vt323 text-green-400 text-base md:text-xl font-bold">{analysis.activity.pattern.type}</div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Badges Section */}
          <section id="badges">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <BadgeShowcase badges={analysis.badges} />

              <SectionActions
                sectionId="badges"
                sectionName="Badges"
                onDownload={handleSectionDownload}
                onShareToX={handleShareToX}
                shareData={`Unlocked ${analysis.badges.length} GitHub achievements! 🏆`}
              />
            </motion.div>
          </section>

          {/* Roast/Praise Section */}
          <section id="roast">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <RoastPraisePanel data={analysis.ropiast} />

              <SectionActions
                sectionId="roast"
                sectionName="Roast/Praise"
                onDownload={handleSectionDownload}
                onShareToX={handleShareToX}
              />
            </motion.div>
          </section>

          {/* Verdict Section */}
          <section id="verdict">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <VerdictPanel
                verdict={analysis.verdict}
                comparisons={analysis.comparisons}
                predictions={analysis.predictions}
                funFacts={analysis.funFacts}
              />
            </motion.div>
          </section>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center pt-12 border-t-2 border-gray-800 mt-16"
          >
            <p className="font-vt323 text-xl md:text-2xl text-gray-600 mb-6">
              Generated by GitHub Rater • {new Date().toLocaleDateString()}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={handleShare}
                className="font-vt323 text-xl md:text-2xl px-8 py-4 bg-pink-500/20 border-2 border-pink-500 text-pink-400 rounded hover:bg-pink-500/30 transition-colors font-bold"
              >
                📸 DOWNLOAD REPORT
              </button>
              <button
                onClick={handleNewAnalysis}
                className="font-vt323 text-xl md:text-2xl px-8 py-4 bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors font-bold"
              >
                🔄 ANALYZE ANOTHER
              </button>
            </div>
          </motion.footer>
        </div>
      </div>
    </main>
  );
}
