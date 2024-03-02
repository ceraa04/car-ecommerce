const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");

router.get("/", async (req, res) => {
    const allCars = await carController.getAllCars();
    const imgSliderCars = [];
    for (let i = 0; i < 4; i++) {
        imgSliderCars.push(allCars[i]);
    }
    res.render("index", {
        imgSliderCars: imgSliderCars,
        cars: allCars,
        popularCar: await carController.carOfTheWeek(),
        user: req.user
    });
});


module.exports = router;