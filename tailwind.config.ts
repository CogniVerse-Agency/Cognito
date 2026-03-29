import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0C0C0A",
          surface: "#141412",
          surface2: "#1C1C19"
        },
        accent: {
          DEFAULT: "#C8FF3E",
          dim: "#9FC832",
          muted: "rgba(200,255,62,0.08)",
          border: "rgba(200,255,62,0.20)"
        },
        ink: {
          primary: "#F9F8F4",
          secondary: "#A09F98",
          tertiary: "#5C5C58"
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          hover: "rgba(255,255,255,0.15)",
          focus: "rgba(200,255,62,0.40)"
        },
        status: {
          success: "#00D4A0",
          error: "#FF5A3C",
          warning: "#F5A623",
          info: "#3B8BFF"
        },

        // Compatibilidade temporaria para os componentes atuais.
        brand: {
          purple: "#C8FF3E",
          purpleLight: "#E3FF8E",
          magenta: "#C8FF3E",
          cyan: "#C8FF3E"
        },
        text: {
          primary: "#F9F8F4",
          muted: "#A09F98"
        },
        success: "#00D4A0",
        warning: "#F5A623",
        danger: "#FF5A3C"
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        sans: ["DM Sans", "sans-serif"]
      },
      borderRadius: {
        card: "14px",
        input: "10px",
        pill: "9999px",
        xl: "14px"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(200,255,62,0.2), 0 12px 36px rgba(200,255,62,0.08)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #C8FF3E, #9FC832)"
      }
    }
  },
  plugins: []
};

export default config;
