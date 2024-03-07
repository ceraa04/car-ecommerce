const express = require("express");
const router = express.Router();
const dbItemsController = require("../controllers/getAllController");
const adminController = require("../controllers/adminController");
router.get("/", async (req, res) => {
    if (req.user && req.user.username !== "admin") {
        res.render("myOrders", {
            orders: await dbItemsController.getAllOrders(req.user._id),
        });
    } else {
        res.render("errorPage");
    }

});
router.post("/", async (req, res) => {
    const id = req.body.orderId;
    await adminController.deleteOrder(id);
    res.redirect("/myOrders");
});

module.exports = router;