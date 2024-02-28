/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        primary: "#969799",
      },
      fontFamily: {
        bodyFont: ["Rubik"]
      },
      maxHeight: {
        index: "40rem"
      },
      width: {
        imgSlider: "50rem",
        newsLetter: "40rem",
        popularCar: "50rem",
        singleCarPage: "50rem",
        productsImg: "25rem",
      },
      height: {
        newsLetter: "30rem",
        imgSlider: "40rem",
        popularCar: "40rem",
        singleCarPage: "40rem",
        productsImg: "20rem"
      },
      margin: {
        profileMarginTop: "155px"
      }
    },
  },
  plugins: [],
};

