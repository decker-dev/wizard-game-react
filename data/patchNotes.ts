export interface PatchNote {
  version: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  changes: {
    category: "NEW" | "IMPROVED" | "FIXED" | "BALANCED";
    items: string[];
  }[];
  isLatest?: boolean;
}

export const patchNotes: PatchNote[] = [
  {
    version: "v1.1.0",
    date: "2025-06-07",
    title: "Map System Update",
    description: "New dynamic map system! Experience different battlefield layouts that change automatically as you progress through the waves.",
    isLatest: true,
    changes: [
      {
        category: "NEW",
        items: [
          "🗺️ Dynamic map system - Maps change automatically during gameplay",
          "🏛️ Map 1 (Wave 1) - Strategic corner obstacles with central formations",
          "🌿 Map 2 (Wave 6) - Open battlefield with scattered large obstacles",
          "⚔️ Map 3 (Wave 11) - X-pattern layout with diagonal challenge zones",
          "🎯 Each map offers unique tactical challenges and strategies",
          "📐 Carefully designed obstacle layouts for balanced gameplay",
          "🛡️ Strategic positioning becomes more important with varied terrains"
        ]
      },
    ]
  },
  {
    version: "v1.0.0",
    date: "2025-06-01",
    title: "Initial Release - Mystic Realm Defender",
    description: "Welcome to Mystic Realm Defender! A complete 2D magical survival game where you defend the mystical realm against infinite waves of mythological creatures.",
    changes: [
      {
        category: "NEW",
        items: [
          "🧙‍♂️ Play as a powerful wizard with magical abilities",
          "🎯 Mouse-controlled spell casting system with directional aiming",
          "⚡ Mana-based magic system instead of traditional health",
          "🐉 Face waves of mythological creatures with increasing difficulty",
          "🔮 Battle against normal creatures and magical caster enemies",
          "💎 Collect crystals as currency from defeated enemies",
          "🛒 Magical marketplace for upgrading spells between waves",
          "📈 Progressive spell system with 6 levels (0-5) of power",
          "🎪 Multi-casting system - cast up to 4 spells simultaneously",
          "🌊 Infinite wave progression with exponential difficulty scaling",
          "🏆 Global leaderboard system with secure score validation",
          "🎮 Full mobile support with touch controls and virtual joystick",
          "🎨 Beautiful pixel art graphics with magical purple/blue theme",
          "🔊 Immersive sound effects for spells, creatures, and combat",
          "⚙️ Settings system for audio preferences",
          "📱 Responsive design that works on all devices",
          "🎯 Collision detection system for precise spell-creature interactions",
          "✨ Particle effects for crystal collection and magical atmosphere",
          "🎵 Background music and ambient magical sounds",
          "💾 Automatic game state management and progress tracking"
        ]
      },
      {
        category: "IMPROVED",
        items: [
          "🚀 60 FPS optimized rendering with HTML5 Canvas",
          "📊 Real-time leaderboard updates with Supabase integration",
          "🔒 Advanced anti-cheat system for score submissions",
          "📱 Mobile-first responsive design approach",
          "⚡ Efficient sprite animation system for all characters",
          "🎮 Smooth keyboard (WASD) and mouse controls for desktop",
          "📐 Pixel-perfect collision detection algorithms",
          "🎯 Intelligent enemy AI with varied movement patterns"
        ]
      }
    ]
  }
]; 