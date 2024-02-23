/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        primary: "#969799"
      },
      fontFamily: {
        bodyFont: ["Rubik"]
      },
      maxHeight: {
        index: "40rem"
      }
    },
  },
  plugins: [],
};

