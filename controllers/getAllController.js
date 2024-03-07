const Car = require("../models/Car");
const Brand = require("../models/Brand");
const Order = require("../models/Order");

// Controller for getting all brands, only getting name of them, for optimization
const getAllBrands = async () => {
    let brands = await Brand.find({}, { name: 1, _id: 0 });
    if (brands.length > 0) {
        brands = brands.map(brand => (
            brand = brand.name
        ));
        return brands;
    }
    // If there are no brands, return empty array
    return [];
};
// Getting all cars from DB
const getAllCars = async () => {
    try {
        const cars = await Car.find().populate("brand");
        return cars;
    }
    catch (error) {
        console.log(error);
    }
};
// Getting all orders from DB, by current user id
const getAllOrders = async (userId) => {
    let userQuery;
    if (userId) {
        userQuery = { user: userId };
    } else {
        userQuery = {};
    }
    // Populating user field and items field, in which i also populate brand field
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