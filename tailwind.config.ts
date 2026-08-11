import type { Config } from "tailwindcss";

// This color palette is a direct port of the CSS variables used in the
// original static prototype (ledgr-platform-design.html), so the visual
// language stays identical as we move to Tailwind + shadcn/ui.
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "sans-serif"],
        mono: ["var(--font-plex-mono)", "SF Mono", "monospace"],
      },
      colors: {
        ink: {
          950: "#0B0F16",
          900: "#111722",
          800: "#1B2330",
          700: "#2B3648",
          500: "#5B6B84",
          400: "#8695AA",
          300: "#B4C0D1",
          200: "#D8DFE9",
          100: "#E9EDF3",
        },
        paper: "#FFFFFF",
        mist: { DEFAULT: "#F6F7FA", dark: "#F0F2F6" },
        line: { DEFAULT: "#E3E7EE", strong: "#D3D9E3" },
        brand: {
          900: "#0F2A4A",
          700: "#1B3F6B",
          600: "#234E85",
          500: "#2A5CA0",
          100: "#E8EEF6",
          50: "#F3F6FA",
        },
        gold: {
          700: "#8A6208",
          600: "#A8790E",
          500: "#C4901A",
          400: "#D9A93F",
          100: "#FBF1DC",
          50: "#FDF8EE",
        },
        green: {
          700: "#0B7A50",
          600: "#0E9F6E",
          100: "#DEF7EC",
          50: "#F0FBF6",
        },
        amber: {
          700: "#9A5B0A",
          600: "#D97706",
          100: "#FCEACC",
          50: "#FEF7EA",
        },
        red: {
          700: "#A31D1D",
          600: "#DC2626",
          100: "#FBDCDC",
          50: "#FEF2F2",
        },
        border: "#E3E7EE",
        input: "#D3D9E3",
        ring: "#2A5CA0",
        background: "#F6F7FA",
        foreground: "#111722",
        primary: { DEFAULT: "#0B0F16", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#FFFFFF", foreground: "#111722" },
        muted: { DEFAULT: "#F0F2F6", foreground: "#5B6B84" },
        accent: { DEFAULT: "#F3F6FA", foreground: "#0F2A4A" },
        destructive: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
        card: { DEFAULT: "#FFFFFF", foreground: "#111722" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#111722" },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        rest: "0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.03)",
        card: "0 2px 8px rgba(15,23,42,.05), 0 1px 2px rgba(15,23,42,.04)",
        hover: "0 8px 24px rgba(15,23,42,.08), 0 2px 6px rgba(15,23,42,.05)",
        pop: "0 20px 48px rgba(15,23,42,.14), 0 4px 12px rgba(15,23,42,.08)",
      },
      keyframes: {
        goldShift: {
          to: { backgroundPosition: "-200% center" },
        },
        skeletonShine: {
          "0%": { backgroundPosition: "100% 0" },
          "100%": { backgroundPosition: "0 0" },
        },
      },
      animation: {
        goldShift: "goldShift 3s linear infinite",
        skeletonShine: "skeletonShine 1.4s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
