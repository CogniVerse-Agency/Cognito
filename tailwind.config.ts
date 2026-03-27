import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          surface2: "var(--bg-surface2)"
        },
        border: "var(--border)",
        brand: {
          purple: "var(--purple)",
          purpleLight: "var(--purple-light)",
          magenta: "var(--magenta)",
          cyan: "var(--cyan)"
        },
        text: {
          primary: "var(--text-primary)",
          muted: "var(--text-muted)"
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139, 92, 246, 0.18), 0 12px 36px rgba(139, 92, 246, 0.16)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #8b5cf6, #d946ef)"
      },
      borderRadius: {
        xl: "12px"
      }
    }
  },
  plugins: []
};

export default config;
