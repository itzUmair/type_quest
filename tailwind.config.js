/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "clr-100": "#D5DFE5",
        "clr-400": "#FFCF00",
        "clr-600": "#40798C",
      },
    },
  },
  plugins: [],
};
