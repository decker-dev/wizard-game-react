# 🧟 ZOMBIE APOCALYPSE SURVIVAL
### *A 2D zombie survival game with infinite waves*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/lautaro-rebillcoms-projects/v0-2-d-shooter-game)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 🎮 **About the Game**

**Zombie Apocalypse Survival** is a 2D zombie survival game developed during the **first Vibe Gaming Hackathon in LATAM** as part of Buenos Aires Tech Week. The objective is simple: survive as long as possible by eliminating infinite waves of zombies.

### 🏆 **Developed by:**
- **[Lauti](https://x.com/lautidev_)** - Vibe Developer
- **[Alejo](https://x.com/alejorrojass)** - Vibe Developer  
- **[Decker](https://x.com/0xDecker)** - Vibe Developer

---

## ✨ **Game Features**

### 🎯 **Gameplay**
- **Infinite waves** of zombies with progressive difficulty
- **Upgrade system** for weapons and health
- **Marketplace** between waves to improve your equipment
- **Intuitive controls** with keyboard and mouse
- **Different types of zombies** with unique abilities

### 🛠️ **Upgrade System**
- **Weapons**: 5 upgrade levels with special effects
  - Level 1: Faster shooting
  - Level 2: Double shot
  - Level 3: Larger projectiles
  - Level 4: Triple shot
  - Level 5: Quadruple shot with maximum power
- **Health**: Increase your maximum health and restore HP

### 🏅 **Leaderboard System**
- **Top 3** best scores
- **Complete history** of matches
- **Global statistics** with total games played
- **Real-time persistence** with Supabase

---

## 🎮 **How to Play**

### 🕹️ **Controls**
```
WASD / Arrow Keys  →  Player movement
Mouse             →  Aim
Left Click        →  Shoot
Spacebar          →  Automatic shooting in movement direction
ESC               →  Exit fullscreen
```

### 🎯 **Objectives**
1. **Eliminate zombies** to earn points and coins
2. **Survive waves** for as long as possible
3. **Use the marketplace** to upgrade your equipment
4. **Compete** for the best score on the leaderboard

---

## 🚀 **Technologies Used**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Static typing for better development
- **Tailwind CSS** - Utility-first styling
- **HTML5 Canvas** - 2D game rendering

### **Backend & Database**
- **Supabase** - Real-time PostgreSQL database
- **Row Level Security (RLS)** - Data security
- **Edge Functions** - Serverless functionality

### **Deployment & Analytics**
- **Vercel** - Automatic hosting and deployment
- **Vercel Analytics** - Performance metrics

### **Development Tools**
- **Bun** - Runtime and package manager
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 📦 **Installation and Development**

### **Prerequisites**
- **Node.js** 18+ or **Bun**
- **Git**
- **Supabase** account (for local development)

### **Local Setup**

1. **Clone the repository**
```bash
git clone https://github.com/your-username/zombie-apocalypse-survival.git
cd zombie-apocalypse-survival
```

2. **Install dependencies**
```bash
# With bun (recommended)
bun install

# Or with npm
npm install
```

3. **Set up environment variables**
```bash
# Create a .env.local file with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**
```sql
-- Run the SQL in your Supabase panel:
-- sql/create_game_stats_table.sql
```

5. **Start the development server**
```bash
bun dev
# or npm run dev
```

6. **Open your browser**
```
http://localhost:3001
```

---

## 🗄️ **Database Structure**

### **Table: `leaderboard`**
```sql
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name VARCHAR NOT NULL,
    score INTEGER DEFAULT 0,
    waves_survived INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Table: `game_stats`**
```sql
CREATE TABLE game_stats (
    id SERIAL PRIMARY KEY,
    stat_type VARCHAR(50) NOT NULL,
    total_games_played INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 **Project Structure**

```
📦 zombie-apocalypse-survival/
├── 📁 app/                  # Next.js App Router
│   ├── 📁 game/            # Game page
│   ├── 📁 credits/         # Credits page
│   └── page.tsx            # Main page
├── 📁 components/          # React Components
│   ├── GameScreen.tsx      # Main game screen
│   ├── GameCanvas.tsx      # Rendering canvas
│   ├── GameUI.tsx          # Game UI
│   ├── Leaderboard.tsx     # Leaderboard component
│   └── ...
├── 📁 hooks/               # Custom React Hooks
│   ├── useGameController.ts
│   ├── useLeaderboard.ts
│   └── ...
├── 📁 game/                # Game logic
│   ├── Player.ts           # Player system
│   ├── Zombies.ts          # Zombie system
│   ├── Collisions.ts       # Collision system
│   └── ...
├── 📁 utils/               # Utilities
├── 📁 types/               # TypeScript definitions
├── 📁 constants/           # Game constants
├── 📁 public/              # Static assets
│   ├── 📁 sprites/         # Character sprites
│   └── 📁 zombie/          # Zombie sprites
└── 📁 sql/                 # Database scripts
```

---

## 🚀 **Available Scripts**

```bash
# Development
bun dev              # Start development server on port 3001

# Production
bun build            # Build application for production
bun start            # Start production server

# Code quality
bun lint             # Run ESLint to check code
```

---

## 🌟 **Featured Technical Characteristics**

### **🎮 Game Engine**
- **Custom 2D Engine** built with HTML5 Canvas
- **60 FPS** optimized rendering loop
- **Pixel-perfect collision detection** 
- **Sprite animation system** for characters and enemies

### **🔊 Audio System**
- **Dynamic sound effects** for game actions
- **Ambient menu music** with volume control
- **Audio settings** persistent in localStorage

### **📱 Responsive Design**
- **Mobile detection** with automatic redirection
- **Fullscreen mode** for immersive experience
- **Complete keyboard navigation** in menus

### **⚡ Performance**
- **Optimized rendering** with object pooling
- **Efficient collision detection** using AABB
- **Memory management** to prevent leaks
- **60 FPS stable** on modern devices

---

## 🏆 **Game Jam Achievement**

This game was developed during the **first Vibe Gaming Hackathon in LATAM**, organized by [Paisanos.io](https://lu.ma/xqvznvg4?locale=es) as part of Buenos Aires Tech Week.

### **🎯 Hackathon Achievements:**
- ✅ **Complete game** developed in 1 day
- ✅ **Multiplayer leaderboard** with persistence
- ✅ **Complex upgrade system** balanced gameplay
- ✅ **Visual polish** with effects and animations
- ✅ **Full gameplay loop** from menu to game over

---

## 🤝 **Contributing**

Contributions are welcome! If you want to improve the game:

1. **Fork** the project
2. **Create** a branch for your feature (`git checkout -b feature/new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/new-feature`)
5. **Open** a Pull Request

---

## 📄 **License**

This project was developed during a Game Jam and is available for educational and demonstration purposes.

---

## 🔗 **Links**

- **🎮 Play Now**: [Zombie Apocalypse Survival](https://vercel.com/lautaro-rebillcoms-projects/v0-2-d-shooter-game)
- **🏆 Game Jam**: [Paisanos.io Event](https://lu.ma/xqvznvg4?locale=es)
- **🐦 Developers**: [Lauti](https://x.com/lautidev_) • [Alejo](https://x.com/alejorrojass) • [Decker](https://x.com/0xDecker)

---

<div align="center">

**Made with ❤️ in Buenos Aires using Next.js, TypeScript, and creativity**

*"Come code, design, share and learn with others who are as passionate as you"*

</div>
