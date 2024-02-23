const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        requried: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },
    description: {
        type: String
    },
    numberStock: {
        type: Number
    }
})


module.exports = mongoose.model('car', carSchema)