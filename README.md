# 🔮 MYSTIC REALM DEFENDER
### *A 2D magical survival game with infinite waves of mythological creatures*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://mystic.decker.sh)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 🎮 **About the Game**

**Mystic Realm Defender** is a 2D magical survival game developed during the **first Vibe Gaming Hackathon in LATAM** as part of Buenos Aires Tech Week. Control a powerful wizard and defend the mystical realm by surviving infinite waves of mythological creatures using powerful spells and magical abilities.

### 🏆 **Developed by:**
- **[Lauti](https://x.com/lautidev_)** - Vibe Developer
- **[Alejo](https://x.com/alejorrojass)** - Vibe Developer
- **[Decker](https://x.com/0xDecker)** - Vibe Developer

---

## ✨ **Game Features**

### 🎯 **Core Gameplay**
- **Infinite wave system** with exponential difficulty scaling every 10 waves
- **6 distinct creature types** including normal, caster, tank, speed, explosive, and boss enemies
- **Advanced AI pathfinding** with A* algorithm and collision avoidance
- **Progressive spell upgrade system** with 6 levels (0-5) of magical power
- **Health pack system** for survival strategy
- **Mobile-responsive** with virtual controls for touch devices

### 🪄 **Magic System**
- **Spell Levels (0-5)**: Each level enhances casting abilities
  - **Level 0**: Single projectile (250ms cooldown)
  - **Level 1**: Faster casting (200ms cooldown)
  - **Level 2**: Double projectile spread (180ms cooldown)
  - **Level 3**: Larger projectiles (160ms cooldown, 150% size)
  - **Level 4**: Triple projectile barrage (150ms cooldown)
  - **Level 5**: Quadruple spell storm (120ms cooldown, 200% size)

### 👹 **Enemy Variety**
- **Normal Creatures**: Basic pursuers (30 HP base, 3 crystals reward)
- **Caster Creatures**: Ranged spell attackers (50 HP base, 7 crystals reward)
- **Tank Creatures**: High HP, slow movement (120 HP base, 10 crystals reward)
- **Speed Creatures**: Fast but fragile (15 HP base, 5 crystals reward)
- **Explosive Creatures**: Explode on death (25 HP base, 8 crystals reward)
- **Boss Creatures**: Massive enemies every 5 waves (300 HP base, 50 crystals reward)

### 🏅 **Leaderboard System**
- **Top 3** highest scores from the greatest wizards
- **Complete history** of magical battles
- **Global statistics** with total realms defended
- **Real-time persistence** with Supabase magic

---

## 🎮 **How to Play**

### 🕹️ **Controls**
```
Desktop:
WASD / Arrow Keys  →  Wizard movement
Spacebar          →  Cast spells in movement direction
ESC               →  Exit fullscreen
F                 →  Toggle fullscreen

Mobile:
Virtual Joystick   →  Movement
Fire Button        →  Cast spells in movement direction
```

### 🎯 **Objectives**
1. **Survive infinite waves** of increasingly difficult mythological creatures
2. **Collect crystals** from defeated enemies to purchase upgrades
3. **Use the Arcane Shop** between waves to enhance spells and health
4. **Compete globally** for the highest score on the leaderboard
5. **Master the spell system** to achieve maximum magical power

---

## 🚀 **Technologies Used**

### **Frontend & Game Engine**
- **Next.js 15** - React framework with App Router architecture
- **TypeScript** - Full type safety across the entire codebase
- **HTML5 Canvas** - Custom 2D game engine with 60 FPS rendering
- **React 19** - Latest React with concurrent features
- **Tailwind CSS** - Utility-first styling with custom magical theme

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security (RLS)** - Secure data access controls
- **Edge Functions** - Serverless API endpoints for game logic

### **Development & Build Tools**
- **Bun** - Ultra-fast JavaScript runtime and package manager
- **Biome** - Fast linter and formatter (ESLint + Prettier alternative)
- **PostCSS** - CSS processing with plugins
- **Vercel Analytics** - Performance and usage tracking

### **Game Assets & Graphics**
- **Pixel art sprites** - Custom wizard, creature, and effect assets
- **Press Start 2P font** - Retro gaming typography
- **Custom particle systems** - Crystal collection and floating effects

---

## 📦 **Installation and Development**

### **Prerequisites**
- **Bun** (recommended) or **Node.js 18+**
- **Git**
- **Supabase** account for database functionality

### **Local Development Setup**

1. **Clone the repository**
```bash
git clone https://github.com/decker-dev/wizard-game-react
cd wizard-game-react
```

2. **Install dependencies**
```bash
# With Bun (recommended for speed)
bun install

# Or with npm
npm install
```

3. **Environment configuration**
```bash
# Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database setup**
```sql
-- Execute in Supabase SQL Editor:
-- sql/create_tables.sql contains all necessary table schemas
```

5. **Start development server**
```bash
bun dev
# Runs on http://localhost:3001
```

---

## 🗄️ **Database Architecture**

### **Leaderboard Table**
```sql
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name VARCHAR(50) NOT NULL,
    score INTEGER DEFAULT 0,
    waves_survived INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Game Statistics Table**
```sql
CREATE TABLE game_stats (
    id SERIAL PRIMARY KEY,
    stat_type VARCHAR(50) NOT NULL UNIQUE,
    total_games_played INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 **Project Architecture**

```
📦 mystic-realm-defender/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 game/              # Game page route (/game)
│   ├── 📁 credits/           # Credits page (/credits)
│   ├── 📁 settings/          # Settings page (/settings)
│   ├── 📁 api/               # API routes
│   │   └── validate-score/   # Score validation endpoint
│   ├── layout.tsx            # Root layout with fonts and analytics
│   ├── page.tsx              # Home page component
│   ├── globals.css           # Global styles and Tailwind base
│   ├── manifest.ts           # PWA manifest configuration
│   └── sitemap.ts            # SEO sitemap generation
├── 📁 components/            # React UI Components
│   ├── GameScreen.tsx        # Main game orchestration component
│   ├── GameCanvas.tsx        # Canvas rendering and game loop
│   ├── GameUI.tsx            # In-game interface (health, score, wave)
│   ├── Marketplace.tsx       # Upgrade shop between waves
│   ├── Leaderboard.tsx       # Score rankings display
│   ├── MobileControls.tsx    # Touch controls for mobile devices
│   ├── GameOverlay.tsx       # Game state overlays (pause, game over)
│   ├── ScoreSubmissionModal.tsx # Score submission and sharing
│   ├── HomeScreen.tsx        # Main menu and navigation
│   ├── LoadingScreen.tsx     # Asset loading screen
│   ├── ShareModal.tsx        # Social sharing functionality
│   ├── CoinParticles.tsx     # Crystal collection effects
│   ├── FloatingParticles.tsx # Background ambient effects
│   └── CoinIcon.tsx          # Crystal currency icon
├── 📁 hooks/                 # Custom React Hooks
│   ├── useGameController.ts  # Main game state orchestration
│   ├── useGameState.ts       # Game entity state management
│   ├── useAssetLoader.ts     # Sprite and texture loading
│   ├── useInputHandlers.ts   # Keyboard and mouse input
│   ├── useGameAudio.ts       # Sound effects and music system
│   ├── useLeaderboard.ts     # Score persistence and retrieval
│   └── useGameScreens.ts     # Screen state management
├── 📁 game/                  # Core Game Logic
│   ├── Player.ts             # Wizard character controller
│   ├── Creatures.ts          # Enemy AI and behavior systems
│   ├── Projectiles.ts        # Spell and magic bolt physics
│   ├── Collisions.ts         # AABB collision detection
│   └── Renderer.ts           # Canvas rendering engine
├── 📁 utils/                 # Utility Functions
│   ├── math.ts               # Vector mathematics and physics
│   ├── marketplace.ts        # Upgrade cost calculations
│   └── coinParticles.ts      # Particle effect systems
├── 📁 types/                 # TypeScript Definitions
│   └── game.ts               # Game entity interfaces and types
├── 📁 constants/             # Game Configuration
│   └── game.ts               # Balancing constants and settings
├── 📁 data/                  # Static Game Data
│   ├── obstacles.ts          # Map obstacle definitions
│   └── mapLayouts/           # Level layout configurations
├── 📁 lib/                   # External Integrations
│   ├── supabase.ts           # Database client configuration
│   └── metadata.ts           # SEO and PWA metadata
├── 📁 public/                # Static Assets
│   ├── 📁 wizard/            # Player character sprite sheets
│   ├── 📁 creature/          # Normal enemy sprites
│   ├── 📁 mage/              # Caster enemy sprites
│   ├── 📁 health/            # Health pack sprites
│   ├── 📁 explosive/         # Explosive creature sprites (WIP)
│   ├── floor-texture.png     # Game background texture
│   ├── og.png                # Social media preview image
│   └── favicon.ico           # Site favicon
├── 📁 sql/                   # Database Scripts
│   └── create_tables.sql     # Supabase table schemas
└── 📁 styles/                # Additional Stylesheets
```

---

## 🚀 **Available Scripts**

```bash
# Development
bun dev              # Start development server on port 3001
bun build            # Build optimized production bundle
bun start            # Start production server

# Code Quality
bun lint             # Run Next.js linting
```

---

## 🌟 **Technical Highlights**

### **🎮 Custom Game Engine**
- **60 FPS rendering** with requestAnimationFrame optimization
- **Object pooling** for projectiles to prevent memory leaks
- **Spatial partitioning** for efficient collision detection
- **Sprite animation system** with directional character movement
- **Camera system** with smooth player following and map boundaries

### **🧠 Advanced AI Systems**
- **A* pathfinding** for intelligent navigation around obstacles
- **Steering behaviors** including seek, flee, separation, and obstacle avoidance
- **Line of sight** optimization for performance
- **Behavioral patterns** unique to each creature type

### **📱 Mobile-First Design**
- **Responsive detection** with automatic mobile optimization
- **Virtual controls** with customizable joystick and fire button
- **Touch gesture** support for smooth mobile gameplay
- **Fullscreen API** integration for immersive experience

### **⚡ Performance Optimizations**
- **Efficient rendering** with dirty rectangle updates
- **Memory management** with proper cleanup cycles
- **Asset preloading** for smooth gameplay experience
- **Debounced input handling** for responsive controls

---

## 🏆 **Game Jam Achievement**

This project was developed during the **Vibe Gaming Hackathon LATAM**, part of Buenos Aires Tech Week 2024.

### **🎯 Hackathon Accomplishments:**
- ✅ **Complete game** with full gameplay loop
- ✅ **6 enemy types** with unique behaviors and AI
- ✅ **Progressive difficulty** system with infinite scaling
- ✅ **Real-time leaderboard** with global competition
- ✅ **Mobile compatibility** with touch controls
- ✅ **Polish and effects** including particle systems
- ✅ **Deployment** on production infrastructure

---

## 🤝 **Contributing**

We welcome contributions to enhance the mystical realm! Here's how to get involved:

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/enhanced-spells`)
3. **Implement** your changes with TypeScript
4. **Test** thoroughly on both desktop and mobile
5. **Add patch notes** for your changes (see Patch Notes Requirements below)
6. **Submit** a pull request with detailed description

### **📝 Patch Notes Requirements**
**All pull requests MUST include patch notes** describing what was added, modified, or improved:

1. **Update** `/data/patchNotes.ts` with your changes
2. **Follow the existing format** with proper categorization:
   - `NEW` ✨ - New features or content
   - `IMPROVED` ⚡ - Enhancements to existing features
   - `FIXED` 🔧 - Bug fixes and corrections
   - `BALANCED` ⚖️ - Game balance adjustments
3. **Include version number** following semantic versioning (e.g., v1.2.3)
4. **Write clear descriptions** of what changed and why
5. **Add your changes** to the top of the patch notes array

**Example patch note entry:**
```typescript
{
  version: "v1.3.0",
  title: "Enhanced Spell System",
  date: "2025-06-XX",
  description: "Major improvements to spell casting mechanics",
  changes: [
    {
      category: "NEW",
      items: [
        "Added spell combo system for advanced players",
        "New visual effects for level 5 spells"
      ]
    },
    {
      category: "IMPROVED", 
      items: [
        "Spell casting now feels more responsive",
        "Better projectile collision detection"
      ]
    }
  ]
}
```

### **Contribution Areas**
- 🎨 **New sprites** for explosive and speed creatures
- 🎵 **Audio system** enhancements and sound effects
- 🎮 **New creature types** with unique behaviors
- 📊 **Game balance** improvements and testing
- 🌐 **Accessibility** features and improvements

---

## 📄 **License**

This project is licensed under the **GNU General Public License v3.0** (GPL-3.0).

**Mystic Realm Defender** - A 2D magical survival game with infinite waves of mythological creatures  
Copyright (C) 2025 Lauti, Alejo, and Decker (Vibe Gaming Hackathon Team)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

For more details, see the [LICENSE](./LICENSE) file.

---

## 🔗 **Links & Resources**

- **🎮 Play the Game**: [mystic.decker.sh](https://mystic.decker.sh)
- **🏆 Hackathon Event**: [Paisanos.io Vibe Gaming](https://lu.ma/xqvznvg4?locale=es)
- **🐦 Developers**: 
  - [Lauti (@lautidev_)](https://x.com/lautidev_)
  - [Alejo (@alejorrojass)](https://x.com/alejorrojass)
  - [Decker (@0xDecker)](https://x.com/0xDecker)

---

<div align="center">

**Made with 🔮 magical code and ❤️ during Buenos Aires Tech Week**

*"Defend the mystical realm with the power of TypeScript and creativity"*

![Game Preview](https://mystic.decker.sh/og.png)

</div>
