const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    description: {
        type: String
    },
    numberStock: {
        type: Number
    },
    year: {
        type: Number
    }
});

module.exports = mongoose.model("Car", carSchema);
