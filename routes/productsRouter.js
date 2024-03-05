const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");
const Car = require("../models/Car");
const ObjectId = require("mongoose").Types.ObjectId;

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
            price } = await carController.productsPageRender();
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
        const {
            cars,
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
    try {
        const id = req.params.id;
        // Ako objec
        if (!ObjectId.isValid(id)) {
            return res.render("errorPage");
        }
        const { cars, car } = await carController.singleCarPage(req, res, id);
        // Ako auto sa tim id-jem nije pronadjen
        let orders = [];
        if (res.locals.currentUser) {
            orders = await carController.getAllOrders(res.locals.currentUser._id);
        }
        let purchased = false;
        console.log("Ovo je id: " + id);
        orders.forEach(order => {
            for (item of order.items) {
                if (item._id.equals(id)) {
                    purchased = true;
                }
            }
        });
        res.render("itemPage", {
            car: car,
            cars: cars,
            purchased: purchased
        });
    }
    catch (error) {
        res.render("errorPage");
        console.log(error);
    }
});
router.post("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // Trazenje auta u DB
        const car = await Car.findOne({ _id: id }).populate("brand");
        // Pravljenje arraya cartItems
        req.session.cartItems = req.session.cartItems || [];
        req.session.cartItems.push(car);
        res.redirect("/cart");
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;