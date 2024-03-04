/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        Spline: ["Spline Sans", "sans-serif"],
        Spline_Mono: ["Spline Sans Mono", "monospace"],
      },
    },
  },

  plugins: [],
};