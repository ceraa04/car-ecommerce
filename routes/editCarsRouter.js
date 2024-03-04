const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");

router.get("/", async (req, res) => {
    const brands = await carController.getAllBrands();
    res.render("editCars", {
        cars: res.locals.cars,
        brands: brands,
    });
});
router.post("/", async (req, res) => {
    const carIdD = req.body.carIdDelete;

    const { carBrand, carModel, carYear, carPrice, carIdEdit, carDescription } = req.body;
    if (carIdD) {
        await carController.deleteCar(req, res, carIdD);
    }
    else if (carBrand) {
        await carController.editCar(carIdEdit, carModel, carBrand, carPrice, carYear, carDescription);
    }
    res.redirect("/editCars");
});

module.exports = router;