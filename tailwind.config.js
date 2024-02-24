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
      },
      maxWidth: {
        imgSlider: "40rem"
      },
      height: {
        newsLetter: "30rem"
      },
      width: {
        newsLetter: "40rem"
      }
    },
  },
  plugins: [],
};

