const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");

router.get("/", async (req, res) => {
    const sort = req.query.sort;
    const brandFilter = req.query.brand;
    const priceFilter = req.query.price;
    if (sort == undefined && brandFilter == undefined && priceFilter == undefined) {
        const {
            cars,
            selectedOptionFilter,
            selectedOptionSort,
            checkboxesChecked,
            minPrice,
            maxPrice,
            countDocuments,
            carBrandsAll,
            price
        } = await carController.productsPageRender();
        res.render("products", {
            cars: cars,
            selectedOptionFilter: selectedOptionFilter,
            selectedOptionSort: selectedOptionSort,
            checkboxesChecked: checkboxesChecked,
            minPrice: minPrice,
            maxPrice: maxPrice,
            countDocuments: countDocuments,
            carBrandsAll: carBrandsAll,
            price: price
        });

    } else {
        const { cars,
            selectedOptionSort,
            maxPrice,
            minPrice,
            checkboxesChecked,
            countDocuments,
            carBrandsAll,
            price } = await carController.filterAndSortCars(req, res, sort, brandFilter, priceFilter);
        res.render("products", {
            cars: cars,
            selectedOptionSort: selectedOptionSort,
            checkboxesChecked: checkboxesChecked,
            minPrice: minPrice,
            maxPrice: maxPrice,
            countDocuments: countDocuments,
            carBrandsAll: carBrandsAll,
            price: price
        });
    }
});

router.post("/", (req, res) => {
    const sort = req.body.sortMethod;
    const brand = req.body.checkboxBrand;
    const price = req.body.rangePriceFilter;
    let redirectUrl = "/products";
    if (sort) {
        redirectUrl += `?sort=${sort}`;
    }
    if (brand && brand.length > 0) {
        redirectUrl += `&brand=${brand}`;
    }
    if (price) {
        redirectUrl += `&price=${price}`;
    }
    res.redirect(redirectUrl);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const { cars, car } = await carController.singleCarPage(req, res, id);
    res.render("itemPage", {
        car: car,
        cars: cars,
    });
});


module.exports = router;