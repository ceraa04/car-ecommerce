const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catgSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    catg_id: {
        type: Number,
        required: true
    },

})


module.exports = mongoose.model('categories', catgSchema)