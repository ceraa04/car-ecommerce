const express = require("express");
const router = express.Router();

const dbItemsController = require("../controllers/getAllController");
const adminController = require("../controllers/adminController");

router.get("/", async (req, res) => {
    const brands = await dbItemsController.getAllBrands();
    res.render("editCars", {
        brands: brands,
    });
});
// POST req is either for deleting or editing car
router.post("/", async (req, res) => {
    const carIdD = req.body.carIdDelete;

    const { carBrand, carModel, carYear, carPrice, carIdEdit, carDescription } = req.body;
    // If carIdD is undefined, it means that admin wants to edit car,
    // if it is not, delete car
    carIdD ? await adminController.deleteCar(req, res, carIdD) :
        await adminController.editCar(carIdEdit, carModel, carBrand, carPrice, carYear, carDescription);

    res.redirect("/editCars");
});

module.exports = router;