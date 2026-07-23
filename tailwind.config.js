/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#FFF9FB",
        surface: "#FFFFFF",
        surfaceLight: "#FFF0F5",
        border: "#F0C9D5",
        gold: "#B85F6A",
        goldSoft: "#F2B6C7",
        rose: "#D96F8E",
        cream: "#55313B",
        muted: "#8D6670"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      borderRadius: {
        frame: "4px"
      }
    }
  },
  plugins: []
};
