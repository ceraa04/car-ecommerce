const express = require("express");
const router = express.Router();
const carController = require("../public/controllers/indexController");

router.get("/", async (req, res) => {
    if (req.user && req.user.username !== "admin") {
        res.render("myOrders", {
            orders: await carController.getAllOrders(req.user._id),
            cars: await carController.getAllCars()
        });
    } else {
        res.render("errorPage", {
            cars: await carController.getAllCars()
        });
    }

});
router.post("/", async (req, res) => {
    const id = req.body.orderId;
    carController.deleteOrder(id);
    res.redirect("/myOrders");
});

module.exports = router;