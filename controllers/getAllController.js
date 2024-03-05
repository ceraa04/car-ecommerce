const Car = require("../models/Car");
const Brand = require("../models/Brand");
const Order = require("../models/Order");

const getAllBrands = async () => {
    let brands = await Brand.find({}, { name: 1, _id: 0 });
    if (brands.length > 0) {
        brands = brands.map(brand => (
            brand = brand.name
        ));
        return brands;
    }

};
const getAllCars = async () => {
    try {
        const cars = await Car.find().populate("brand");
        return cars;
    }
    catch (error) {
        console.log(error);
    }
};
const getAllOrders = async (userId) => {
    let userQuery;
    if (userId) {
        userQuery = { user: userId };
    } else {
        userQuery = {};
    }
    try {
        const orders = await Order.find(userQuery)
            .populate({
                path: "items",
                populate: {
                    path: "brand",
                    model: "Brand"
                }
            })
            .populate("user");
        return orders;
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    getAllBrands,
    getAllCars,
    getAllOrders
};