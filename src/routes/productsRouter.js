const express = require("express");
const router = express.Router();
// Controllers
const dbItemsController = require("../controllers/getAllController");
const productsController = require("../controllers/productsController");

const Car = require("../models/Car");
// Import objectId for comparing later on
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (req, res) => {
    const sort = req.query.sort;
    const brandFilter = req.query.brand;
    const priceFilter = req.query.price;
    // If there is no sort and filter
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

    } else { // When there is either sort or filter
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
    // Add items to query(URL), so GET method can get values for sorting and filtering
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
        // If id from params is not valid ObjectId 
        if (!ObjectId.isValid(id)) {
            return res.render("errorPage");
        }
        let orders = [];
        if (res.locals.currentUser) {
            orders = await dbItemsController.getAllOrders(res.locals.currentUser._id);
        }
        // Checking if user already bought car that has that id, if he did, unable another order for that car
        const purchased = orders.some(order =>
            order.items.some(item => item._id.equals(id))
        );

        const car = await productsController.singleCarPage(req, res, id);
        if (car) {
            res.render("itemPage", {
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

        const car = await Car.findOne({ _id: id }).populate("brand");
        // Make an array for items in cart if there is not one already and push car in it
        req.session.cartItems = req.session.cartItems || [];
        req.session.cartItems.push(car);
        res.redirect("/cart");
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;