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
    version: "v1.2.0",
    date: "2024-12-20",
    title: "Mystic Enhancements Update",
    description: "Major improvements to the magical combat system and new visual effects!",
    image: "/wizard/wizard-standing-down.png",
    isLatest: true,
    changes: [
      {
        category: "NEW",
        items: [
          "Added new spell casting animations",
          "Introduced crystal particle effects",
          "New magical sound effects for spells",
          "Enhanced creature AI behavior"
        ]
      },
      {
        category: "IMPROVED",
        items: [
          "Better collision detection system",
          "Optimized rendering performance",
          "Enhanced mobile controls responsiveness",
          "Improved leaderboard security"
        ]
      },
      {
        category: "FIXED",
        items: [
          "Fixed spell projectile collision bugs",
          "Resolved mobile touch input issues",
          "Fixed score submission validation",
          "Corrected creature spawn timing"
        ]
      },
      {
        category: "BALANCED",
        items: [
          "Adjusted creature health scaling",
          "Rebalanced spell upgrade costs",
          "Modified wave difficulty progression",
          "Tweaked crystal drop rates"
        ]
      }
    ]
  },
  {
    version: "v1.1.0",
    date: "2024-12-15",
    title: "Launch Day Fixes",
    description: "Critical fixes and improvements based on initial player feedback.",
    changes: [
      {
        category: "FIXED",
        items: [
          "Fixed game over screen not appearing",
          "Resolved audio playback issues",
          "Fixed marketplace upgrade calculations",
          "Corrected mobile viewport issues"
        ]
      },
      {
        category: "IMPROVED",
        items: [
          "Enhanced game performance on mobile devices",
          "Better error handling for score submissions",
          "Improved loading screen experience"
        ]
      }
    ]
  },
  {
    version: "v1.0.0",
    date: "2024-12-10",
    title: "Initial Release",
    description: "Welcome to Mystic Realm Defender! The magical survival adventure begins.",
    changes: [
      {
        category: "NEW",
        items: [
          "Complete 2D magical survival game",
          "Infinite wave progression system",
          "Spell upgrade marketplace",
          "Global leaderboard system",
          "Mobile-optimized controls",
          "Pixel art magical theme"
        ]
      }
    ]
  }
]; 