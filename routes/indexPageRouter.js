const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");

router.get("/", async (req, res) => {
    const imgSliderCars = await carController.cars_imgSlider();
    res.render("index", {
        imgSliderCars: imgSliderCars,
        cars: res.locals.cars,
        popularCar: await carController.carOfTheWeek(),
    });
});


module.exports = router;