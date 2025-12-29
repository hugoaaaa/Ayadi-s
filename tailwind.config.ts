import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#001B44",
        royal: "#0052CC",
        success: "#22C55E",
        bg: "#F9FAFB",
        line: "#E5E7EB",
      },
    },
  },
  plugins: [],
} satisfies Config;
