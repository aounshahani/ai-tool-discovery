// tailwind.config.js

/** @type {import('tailwindcss').Config} */
// 

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#ff6b3b', // Base orange color
          dark: '#e05930',   // Slightly darker for hover states
          light: '#ffa07a',  // Light orange for gradients/accents
          fade: 'rgba(255, 107, 59, 0.1)', // Very light background/border accent
        },
        // Neutral colors (Black, Grey, White)
        'neutral': {
          900: '#1a1a1a', // Near-black for main text (DISCOVER) and Pro card background (used in code as #333)
          800: '#333333', // Dark text/Footer background (if you prefer slightly lighter than 900)
          600: '#666666', // Secondary text (descriptions)
          50: '#f8f8f8',  // Light background color (sections like Hero, Plans)
        },
        background: {
          DEFAULT: "#FFFFFF",   // page background
        }
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"], // matches clean modern UI
      },
    },
  },
  plugins: [],
}
