const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");

router.get("/", async (req, res) => {
    res.render("newCar", {
        brands: await carController.getAllBrands(),
        cars: await carController.getAllCars(),
        user: req.user
    });
});
router.post("/", async (req, res) => {
    const { model, price, year, description, brand } = req.body;
    await carController.add_car(req, res, model, price, year, description, brand);
    res.redirect("/newCar");
});

module.exports = router;