const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");

router.get("/", async (req, res) => {
    res.render("newBrand", {
        cars: await carController.getAllCars(),
        user: req.user
    });
});

router.post("/", async (req, res) => {
    const { brand, founded, description, urlNewBrand } = req.body;
    if (brand) {
        await carController.add_brand(req, res, brand, founded, description, urlNewBrand);
        res.redirect("/newBrand");
    } else {
        console.log("Neispravne vrednosti za add brand!");
    }
});


module.exports = router;