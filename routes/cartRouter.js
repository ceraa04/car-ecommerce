const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");
const Order = require("../models/Order");
router.get("/", async (req, res) => {

    res.render("cart", {
        cars: await carController.getAllCars(),
    });
});

router.post("/", async (req, res) => {
    const carId = req.body.carId;
    console.log(req.body);
    // Ako je brisanje iz korpe:
    if (carId) {
        req.session.cartItems = req.session.cartItems.filter(item => item._id !== carId);
        res.redirect("/cart");

        // Ako je checkout, odnosno kupovina auta:
    }
    else {
        const orderNumber = await Order.countDocuments() + Math.floor(Math.random() * 15000);
        const itemsId = [];
        for (const item of res.locals.cartItems) {
            itemsId.push(item._id);
        }
        const order = new Order({
            numberOfItems: res.locals.cartItems.length,
            user: res.locals.currentUser._id,
            orderNumber: orderNumber,
            totalPrice: res.locals.totalPrice,
            items: itemsId,
            createdAt: new Date(),
            delivered: false
        });
        order.save()
            .then(async () => {
                req.session.cartItems = [];
                res.redirect("/myOrders");
            })
            .catch(error => {
                console.error(error);
            });



    }
});

module.exports = router;