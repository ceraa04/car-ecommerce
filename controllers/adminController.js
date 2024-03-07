const Car = require("../models/Car");
const Brand = require("../models/Brand");
const Order = require("../models/Order");
// User is required for populating
const User = require("../models/User");

// Controller for adding car to DB
const add_car = async (model, price, year, description, brandName) => {
    const brand = await Brand.findOne({ name: brandName });
    if (!brand) {
        throw new Error("Brand not found");
    }
    // Saving new car to DB
    try {
        const newCar = new Car({
            model: model,
            price: price,
            brand: brand._id,
            description: description,
            year: year
        });
        newCar.save()
            .catch(error => {
                console.error("Error saving car:", error);
            });
    }
    catch (error) { console.log("greska!"); }

};

// Function for adding brand to DB
const add_brand = async (req, res, name, founded, description, url) => {
    try {
        // If brand is not already declared, new one is made and saved in DB
        const doesBrandExist = await Brand.findOne({ name: name });
        if (!doesBrandExist) {
            const newBrand = new Brand({
                name: name,
                madeIn: founded,
                description: description,
                url: url
            });
            newBrand.save();
        }
    }
    catch (error) { console.log(error); }

};

// Controller for deleting car from DB
const deleteCar = async (req, res, carId) => {
    try {
        await Car.deleteOne({ _id: carId });
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Controller for editing car that is already in DB
const editCar = async (carId, model, brandName, price, year, description) => {
    try {
        const brandId = await Brand.findOne({ name: brandName });
        // UpdateOne takes 2 args, first one is filter, second one is object of fields that are updated
        await Car.updateOne(
            { _id: carId },
            { price: price, year: year, model: model, brand: brandId, description: description }
        );
    } catch (error) {
        console.error(error);
    }
};

// Delete orders from DB
const deleteOrder = async (id) => {
    try {
        Order.deleteOne({ _id: id })
            .then(() => {
            });
    } catch (error) {
        console.log("Error while deleting order from DB!");
    }
};


module.exports = {
    add_car,
    add_brand,
    deleteCar,
    editCar,
    deleteOrder
};