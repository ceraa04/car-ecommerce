const express = require("express");
const router = express.Router();
// Controllers
const dbItemsController = require("../controllers/getAllController");
const productsController = require("../controllers/productsController");

const Car = require("../models/Car");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (req, res) => {
    const sort = req.query.sort;
    const brandFilter = req.query.brand;
    const priceFilter = req.query.price;
    if (sort == undefined && brandFilter == undefined && priceFilter == undefined) {
        const {
            selectedOptionFilter,
            selectedOptionSort,
            checkboxesChecked,
            minPrice,
            maxPrice,
            countDocuments,
            carBrandsAll,
            price } = await productsController.productsPageRender();
        res.render("products", {
            products: res.locals.cars,
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
            products,
            selectedOptionSort,
            maxPrice,
            minPrice,
            checkboxesChecked,
            countDocuments,
            carBrandsAll,
            price } = await productsController.filterAndSortCars(req, res, sort, brandFilter, priceFilter);
        res.render("products", {
            cars: res.locals.cars,
            products: products,
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
        // Ako auto sa tim id-jem nije pronadjen
        let orders = [];
        if (res.locals.currentUser) {
            orders = await dbItemsController.getAllOrders(res.locals.currentUser._id);
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
        const car = await productsController.singleCarPage(req, res, id);
        console.log(car);
        if (car) {
            res.render("itemPage", {
                cars: res.locals.cars,
                car: car,
                purchased: purchased
            });
        }
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