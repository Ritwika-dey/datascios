import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050507",
        surface: "#0c0c10",
        elevated: "#111116",
        card: "#16161c",
        cyan: { DEFAULT: "#00d4ff", dark: "#0099bb" },
        violet: { DEFAULT: "#7c3aed", dark: "#5b21b6" },
        emerald: { DEFAULT: "#10b981" },
        amber: { DEFAULT: "#f59e0b" },
        rose: { DEFAULT: "#f43f5e" },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease forwards',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
