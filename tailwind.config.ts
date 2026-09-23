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
        cream: {
          DEFAULT: "#EEEBE7",
          50: "#FBFBF9",
          100: "#F7F5F3",
          200: "#EEEBE7",
          300: "#E3DFDA",
          400: "#D3CDC5",
          500: "#C0B8AD",
        },
        brand: {
          DEFAULT: "#352519",
          hover: "#251910",
          light: "#4B3728",
          variant: "#362519",
          muted: "rgba(53, 37, 25, 0.7)",
          subtle: "rgba(53, 37, 25, 0.08)",
          border: "rgba(53, 37, 25, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(53, 37, 25, 0.06), 0 2px 6px -1px rgba(53, 37, 25, 0.04)",
        "warm-lg": "0 12px 30px -4px rgba(53, 37, 25, 0.12), 0 4px 10px -2px rgba(53, 37, 25, 0.06)",
        "warm-hover": "0 14px 34px -4px rgba(53, 37, 25, 0.16), 0 6px 14px -2px rgba(53, 37, 25, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
