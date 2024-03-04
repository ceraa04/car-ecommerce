const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car"
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    shippingCity: {
        type: String,
        required: true
    },
    numberOfItems: {
        type: Number,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Order", orderSchema);
