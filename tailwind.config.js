/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      screens: {
        "xs": "320px"
      },
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
        imgSliderMd: "35rem",
        imgSliderSm: "30rem",
        imgSliderXs: "25rem",
        newsLetter: "40rem",
        popularCar: "50rem",
        singleCarPage: "50rem",
        productsImg: "25rem",
        editPageProducts: "80rem"
      },
      height: {
        newsLetter: "30rem",
        imgSlider: "40rem",
        imgSliderMd: "28rem",
        imgSliderSm: "25rem",
        imgSliderXs: "15rem",
        popularCar: "40rem",
        singleCarPage: "40rem",
        productsImg: "20rem",
        signUp: "40rem"
      },
      margin: {
        profileMarginTop: "155px"
      }
    },
  },
  plugins: [],
};

