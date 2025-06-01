# 🔮 MYSTIC REALM DEFENDER
### *A 2D magical survival game with infinite waves of mythological creatures*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://mystic.decker.sh)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 🎮 **About the Game**

**Mystic Realm Defender** is a 2D magical survival game developed during the **first Vibe Gaming Hackathon in LATAM** as part of Buenos Aires Tech Week. Control a powerful wizard and defend the mystical realm by surviving infinite waves of mythological creatures using powerful spells and magical abilities.

### 🏆 **Developed by:**
- **[Lauti](https://x.com/lautidev_)** - Vibe Developer
- **[Alejo](https://x.com/alejorrojass)** - Vibe Developer  
- **[Decker](https://x.com/0xDecker)** - Vibe Developer

---

## ✨ **Game Features**

### 🎯 **Gameplay**
- **Infinite waves** of mythological creatures with progressive difficulty
- **Spell upgrade system** for magical abilities and mana
- **Arcane Shop** between waves to enhance your magical powers
- **Intuitive controls** with keyboard and spacebar spell casting
- **Different creature types** including normal beasts and magical casters

### 🪄 **Magic System**
- **Spell Power**: 5 upgrade levels with devastating effects
  - Level 1: Faster spell casting
  - Level 2: Double spell casting
  - Level 3: Larger magical projectiles
  - Level 4: Triple spell barrage
  - Level 5: Quadruple spell storm with maximum power
- **Mana Management**: Increase your maximum mana and magical endurance

### 🏅 **Leaderboard System**
- **Top 3** highest scores from the greatest wizards
- **Complete history** of magical battles
- **Global statistics** with total realms defended
- **Real-time persistence** with Supabase magic

---

## 🎮 **How to Play**

### 🕹️ **Controls**
```
WASD / Arrow Keys  →  Wizard movement
Spacebar          →  Cast spells in movement direction
ESC               →  Exit fullscreen
F                 →  Toggle fullscreen
```

### 🎯 **Objectives**
1. **Defeat creatures** to earn points and magical crystals
2. **Survive waves** for as long as possible in the mystical realm
3. **Use the Arcane Shop** to upgrade your magical abilities
4. **Compete** for the highest score among all wizards

---

## 🚀 **Technologies Used**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Static typing for magical code reliability
- **Tailwind CSS** - Utility-first styling with mystical themes
- **HTML5 Canvas** - 2D magical realm rendering

### **Backend & Database**
- **Supabase** - Real-time PostgreSQL database for wizard scores
- **Row Level Security (RLS)** - Magical data protection
- **Edge Functions** - Serverless spell processing

### **Deployment & Analytics**
- **Vercel** - Automatic hosting and mystical deployment
- **Vercel Analytics** - Magical performance metrics

### **Development Tools**
- **Bun** - Lightning-fast runtime and package manager
- **ESLint** - Code quality enchantments
- **PostCSS** - CSS magical processing

---

## 📦 **Installation and Development**

### **Prerequisites**
- **Node.js** 18+ or **Bun**
- **Git**
- **Supabase** account (for local realm development)

### **Local Setup**

1. **Clone the mystical repository**
```bash
git clone https://github.com/decker-dev/mystic-realm-defender
cd mystic-realm-defender
```

2. **Install magical dependencies**
```bash
# With bun (recommended for speed)
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

4. **Set up the magical database**
```sql
-- Run the SQL in your Supabase panel:
-- sql/create_game_stats_table.sql
```

5. **Start the development realm**
```bash
bun dev
# or npm run dev
```

6. **Open your mystical portal**
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
📦 mystic-realm-defender/
├── 📁 app/                  # Next.js App Router
│   ├── 📁 game/            # Game realm page
│   ├── 📁 credits/         # Credits page
│   └── page.tsx            # Main mystical portal
├── 📁 components/          # React Components
│   ├── GameScreen.tsx      # Main game realm screen
│   ├── GameCanvas.tsx      # Magical rendering canvas
│   ├── GameUI.tsx          # Wizard interface
│   ├── Marketplace.tsx     # Arcane shop component
│   ├── Leaderboard.tsx     # Wizard rankings
│   └── ...
├── 📁 hooks/               # Custom React Hooks
│   ├── useGameController.ts # Game orchestration magic
│   ├── useLeaderboard.ts   # Score persistence spells
│   └── ...
├── 📁 game/                # Core Game Logic
│   ├── Player.ts           # Wizard character system
│   ├── Creatures.ts        # Mythological creature system
│   ├── Collisions.ts       # Magical collision system
│   └── ...
├── 📁 utils/               # Magical Utilities
├── 📁 types/               # TypeScript spell definitions
├── 📁 constants/           # Magical game constants
├── 📁 public/              # Static mystical assets
│   ├── 📁 wizard/          # Wizard character sprites
│   ├── 📁 creature/        # Creature sprites
│   └── 📁 mage/            # Magical caster sprites
└── 📁 sql/                 # Database enchantments
```

---

## 🚀 **Available Scripts**

```bash
# Development
bun dev              # Start development realm on port 3001

# Production
bun build            # Build mystical application for production
bun start            # Start production magical server

```

---

## 🌟 **Featured Technical Characteristics**

### **🎮 Magical Game Engine**
- **Custom 2D Engine** built with HTML5 Canvas magic
- **60 FPS** optimized mystical rendering loop
- **Pixel-perfect collision detection** for precise spell impacts
- **Sprite animation system** for wizards and mythological creatures

### **🔊 Mystical Audio System**
- **Dynamic spell sound effects** for magical actions
- **Ambient mystical music** with volume enchantments
- **Audio settings** persistent in localStorage magic

### **📱 Responsive Mystical Design**
- **Mobile detection** with automatic portal redirection
- **Fullscreen mode** for immersive magical experience
- **Complete keyboard navigation** in mystical menus

### **⚡ Magical Performance**
- **Optimized rendering** with spell object pooling
- **Efficient collision detection** using mystical AABB
- **Memory management** to prevent magical leaks
- **60 FPS stable** on modern enchanted devices

---

## 🏆 **Game Jam Achievement**

This mystical game was developed during the **first Vibe Gaming Hackathon in LATAM**, organized by [Paisanos.io](https://lu.ma/xqvznvg4?locale=es) as part of Buenos Aires Tech Week.

### **🎯 Hackathon Magical Achievements:**
- ✅ **Complete mystical game** developed in 1 day
- ✅ **Wizard leaderboard** with magical persistence
- ✅ **Complex spell upgrade system** with balanced magical gameplay
- ✅ **Visual polish** with magical effects and animations
- ✅ **Full gameplay loop** from mystical menu to realm defense

---

## 🤝 **Contributing**

Contributions to the mystical realm are welcome! If you want to enhance the magical experience:

1. **Fork** the mystical project
2. **Create** a branch for your magical feature (`git checkout -b feature/new-spell`)
3. **Commit** your magical changes (`git commit -m 'Add new mystical feature'`)
4. **Push** to the enchanted branch (`git push origin feature/new-spell`)
5. **Open** a Mystical Pull Request

---

## 📄 **License**

This mystical project was developed during a Game Jam and is available for educational and demonstration purposes in the magical realm.

---

## 🔗 **Mystical Links**

- **🎮 Defend the Realm**: [Mystic Realm Defender](https://mystic.decker.sh)
- **🏆 Game Jam**: [Paisanos.io Event](https://lu.ma/xqvznvg4?locale=es)
- **🐦 Mystical Developers**: [Lauti](https://x.com/lautidev_) • [Alejo](https://x.com/alejorrojass) • [Decker](https://x.com/0xDecker)

---

<div align="center">

**Made with 🔮 mystical magic and ❤️ in Buenos Aires using Next.js, TypeScript, and pure creativity**

*"Come code, design, share and learn with others who are as passionate about magic as you"*

</div>
