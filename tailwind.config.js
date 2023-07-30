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
        "clr-690": "#436671",
      },
      spacing: {
        2560: "160rem",
        "60vh": "60vh",
      },
    },
    screens: {
      mobile: "0px",
      tablet: "768px",
      desktop: "1024px",
      ultra: "2560px",
    },
  },
  plugins: [],
};
