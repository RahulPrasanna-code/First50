import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Theme Tokens
        canvas: {
          light: "#F8FAFC",
          dark: "#060C16",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0C1728",
        },
        subsurface: {
          light: "#F5F3FF",
          dark: "#070E1A",
        },
        hairline: {
          light: "#E0E7FF",
          dark: "#162844",
        },
        // Sealed Primary: Indigo (Light) / Arctic Cyan (Dark)
        brand: {
          cyan: "#06B6D4",
          indigo: "#4F46E5",
          violet: "#7C3AED",
          sky: "#38BDF8",
        },
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
