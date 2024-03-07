const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
router.get("/", async (req, res) => {

    res.render("cart");
});

router.post("/", async (req, res) => {

    const carIdDelete = req.body.carIdDelete;
    console.log(req.body);
    // If carIdDelete is not undefined, it means the user has submitted the form for deleting car from cart
    if (carIdDelete) {
        req.session.cartItems = req.session.cartItems.filter(item => item._id !== carIdDelete);
        res.redirect("/cart");

        // Otherwise, user has clicked checkout, handle checkout, create new order 
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