const express = require("express");
const router = express.Router();
const carController = require("../controllers/indexController");

router.get("/", (req, res) => {
    const sort = req.query.sort;
    const brand = req.query.brand;
    const price = req.query.price;
    if (sort == undefined && brand == undefined) {
        carController.getAllCars(req, res);
    } else {
        carController.filterAndSortCars(req, res, sort, brand, price);
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    await carController.singleCarPage(req, res, id);
});


module.exports = router;