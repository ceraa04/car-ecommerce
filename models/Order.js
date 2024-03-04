const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    numberOfItems: {
        type: Number,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true
    },
    delivered: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Order", orderSchema);
