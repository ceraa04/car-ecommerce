const express = require("express");
const router = express.Router();
const indexPageController = require("../controllers/indexPageController");

router.get("/", async (req, res) => {
    res.render("index", {
        imgSliderCars: await indexPageController.cars_imgSlider(),
        cars: res.locals.cars,
        popularCar: await indexPageController.carOfTheWeek(),
    });
});


module.exports = router;