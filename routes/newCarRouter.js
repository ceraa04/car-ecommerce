const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");

router.get("/", async (req, res) => {
    res.render("newCar", {
        brands: await carController.getAllBrands()
    });
});
router.post("/", async (req, res) => {
    const { model, price, year, description, brand } = req.body;
    await carController.add_car(model, price, year, description, brand);
    res.redirect("/editCars");
});

module.exports = router;