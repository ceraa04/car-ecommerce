const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", async (req, res) => {
    res.render("newBrand");
});

router.post("/", async (req, res) => {
    const { brand, founded, description, urlNewBrand } = req.body;
    if (brand) {
        await adminController.add_brand(req, res, brand, founded, description, urlNewBrand);
        res.redirect("/newBrand");
    } else {
        console.log("Invalid values for brand model!");
    }
});


module.exports = router;