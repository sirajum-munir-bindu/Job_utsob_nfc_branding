import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0b0f19",
          navy: "#0d1527",
          card: "#131c31",
          border: "#1e293b",
          primary: "#0284c7",
          cyan: "#06b6d4",
          green: "#10b981",
          orange: "#f97316",
          red: "#ef4444",
          magenta: "#ec4899",
          yellow: "#eab308",
        },
        utsob: {
          green: "#008751",
          red: "#d32f2f",
          blue: "#0288d1",
          orange: "#f57c00",
          yellow: "#fbc02d",
          pink: "#c2185b",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'neon-gold': '0 0 35px -5px rgba(245, 158, 11, 0.45)',
        'card-3d': '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px 2px rgba(6, 182, 212, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
