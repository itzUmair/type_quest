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
        "clr-650": "#4a717d",
        "clr-690": "#436671",
        "clr-700": "#3c5c66",
      },
      spacing: {
        2560: "160rem",
        "60vh": "60vh",
      },
      fontSize: {
        "2xs": "0.6rem",
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
