/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: "#ec8b0d",
        grey: "#333",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
