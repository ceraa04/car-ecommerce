const express = require("express");
const router = express.Router();

const dbItemsController = require("../controllers/getAllController");
const adminController = require("../controllers/adminController");

router.get("/", async (req, res) => {
    const brands = await dbItemsController.getAllBrands();
    res.render("editCars", {
        cars: res.locals.cars,
        brands: brands,
    });
});
router.post("/", async (req, res) => {
    const carIdD = req.body.carIdDelete;

    const { carBrand, carModel, carYear, carPrice, carIdEdit, carDescription } = req.body;
    if (carIdD) {
        await adminController.deleteCar(req, res, carIdD);
    }
    else if (carBrand) {
        await adminController.editCar(carIdEdit, carModel, carBrand, carPrice, carYear, carDescription);
    }
    res.redirect("/editCars");
});

module.exports = router;