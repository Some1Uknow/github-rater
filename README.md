# 🎮 GitHub Rater

> **Discover your developer power level!** A retro-futuristic GitHub profile analyzer that rates your coding prowess with AI-powered insights, roasts, and achievements.

![GitHub Rater](https://img.shields.io/badge/Power_Level-Over_9000-gold?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ Features

- 🔥 **Power Level Calculator** - Get your developer power level (0-10,000+)
- 🎭 **Developer Archetype** - Discover your coding personality
- 📊 **Skill Radar Charts** - Visualize your language proficiency & domain expertise
- 🏆 **Achievement Badges** - Unlock badges from Common to Mythic rarity
- 🤖 **AI-Powered Analysis** - Get personalized roasts, praise, and predictions
- 💾 **MongoDB Caching** - Fast repeat lookups (24-hour cache)
- 🎨 **Retro CRT UI** - Beautiful scanlines, neon glow, and Matrix rain effects

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/github-rater.git
cd github-rater
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
# Required for AI analysis (choose one - both have FREE tiers!)

# Option 1: Groq (RECOMMENDED - Very fast, generous free tier)
# Get your key at: https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key

# Option 2: Google Gemini (Also free)
# Get your key at: https://aistudio.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

# Optional: GitHub Token (increases API rate limit from 60 to 5000 req/hr)
# Get one at: https://github.com/settings/tokens
GITHUB_TOKEN=your_github_token

# Optional: MongoDB (for caching - prevents re-analyzing same user)
# Get a FREE cluster at: https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter a GitHub username!

## 🔑 Getting Free API Keys

### Groq (Recommended for AI)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Navigate to API Keys
4. Create a new key
5. Add to `.env.local` as `GROQ_API_KEY`

### Google Gemini (Alternative)
1. Go to [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Sign in with Google
3. Click "Create API Key"
4. Add to `.env.local` as `GOOGLE_GENERATIVE_AI_API_KEY`

### MongoDB Atlas (For Caching)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Get connection string
5. Add to `.env.local` as `MONGODB_URI`

## 📡 API Endpoints

### `GET /api/rate/[username]`
Complete analysis with caching. Returns GitHub data + AI analysis.

```bash
curl http://localhost:3000/api/rate/torvalds
```

### `GET /api/github/[username]`
Fetch raw GitHub data only.

### `POST /api/analyze`
Analyze provided GitHub data with AI.

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: Vercel AI SDK + Groq/Gemini
- **Database**: MongoDB (optional caching)
- **Fonts**: Press Start 2P, VT323

## 📊 Analysis Includes

| Section | Description |
|---------|-------------|
| Power Level | 0-10,000+ score with rank (F to SSS) |
| Archetype | Primary & secondary developer class |
| Skills | Language proficiency, domain expertise, soft skills |
| Stats | Repos, stars, forks, followers, viral repos |
| Badges | Achievement badges with rarity tiers |
| Roast/Praise | AI-generated personalized feedback |
| Verdict | Hire recommendation, collaboration score |
| Predictions | Career trajectory, next milestones |
| Fun Facts | Interesting tidbits about the profile |

## 🏆 Badge Rarities

- ⬜ **Common** - Everyone starts somewhere
- 🟢 **Uncommon** - Getting started
- 🔵 **Rare** - Standing out
- 🟣 **Epic** - Impressive achievements
- 🟠 **Legendary** - Elite status
- 🔴 **Mythic** - Top 0.1%

## 🖼️ Screenshots

The app features a beautiful retro CRT aesthetic with:
- Matrix rain background animation
- Scanline overlay effects
- Neon glow text
- Animated power bars
- Radar charts for skills
- Achievement badge showcase

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

PRs welcome! Please ensure:
1. TypeScript types are correct
2. Build passes (`npm run build`)
3. Code follows existing style

---

**Made with 💚 and lots of ☕**

*"Talk is cheap. Show me the code."* - Linus Torvalds
