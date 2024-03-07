const express = require("express");
const router = express.Router();

const dbItemsController = require("../controllers/getAllController");
const adminController = require("../controllers/adminController");


router.get("/", async (req, res) => {
    if (req.user && req.user.username === "admin") {
        res.render("allOrders", {
            orders: await dbItemsController.getAllOrders(),
        });
    } else {
        res.render("errorPage");
    }
});
router.post("/", async (req, res) => {
    const orderId = req.body.orderId;
    await adminController.deleteOrder(orderId);
    res.redirect("/allOrders");
});

module.exports = router;