import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // deep warm cosmic void
        void: {
          950: "#0a0608",
          900: "#0f0a0e",
          800: "#171019",
          700: "#211726",
          600: "#2e2034",
          500: "#3c2c44",
        },
        // joy / warmth / dopamine — amber-gold dawn
        dawn: {
          500: "#ff9e4f",
          400: "#ffb86b",
          300: "#ffd29a",
        },
        // love / connection / oxytocin — coral rose
        rose: {
          500: "#ff6b81",
          400: "#ff8c9e",
          300: "#ffb3bf",
        },
        // peace / flow / serotonin — soft aqua
        calm: {
          500: "#3dd6bd",
          400: "#6ee9d4",
          300: "#9af2e3",
        },
        // meaning / consciousness / transcendence — violet
        mind: {
          500: "#a87fff",
          400: "#c0a3ff",
          300: "#d8c6ff",
        },
        // warm bone text
        bone: {
          50: "#fdf6ef",
          100: "#f4e9dd",
          300: "#d9c4b8",
          500: "#a08a82",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        serif: ['"Spectral"', "ui-serif", "Georgia", "serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(255,158,79,0.45), 0 0 120px -40px rgba(255,107,129,0.30)",
        calmglow: "0 0 40px -8px rgba(61,214,189,0.45)",
        mindglow: "0 0 40px -8px rgba(168,127,255,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
