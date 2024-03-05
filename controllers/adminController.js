const Car = require("../models/Car");
const Brand = require("../models/Brand");
const Order = require("../models/Order");
const User = require("../models/User");

const add_car = async (model, price, year, description, brandName) => {
    const brand = await Brand.findOne({ name: brandName });
    if (!brand) {
        throw new Error("Brand not found");
    }

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

// Funkcija za dodvanje branda u bazu
const add_brand = async (req, res, name, founded, description, url) => {
    try {
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

// Funkcija za brisanje auta iz DB
const deleteCar = async (req, res, carId) => {
    try {
        await Car.deleteOne({ _id: carId });
        console.log(`Model sa brojem ${carId} je izbrisan iz DB!`);
        return; // Resolve the promise
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to be caught in the calling function
    }
};

// Funkcija za editovanje auta iz DB
const editCar = async (carId, model, brandName, price, year, description) => {
    try {
        const brandId = await Brand.findOne({ name: brandName });
        await Car.updateOne(
            { _id: carId },
            { price: price, year: year, model: model, brand: brandId, description: description }
        );
    } catch (error) {
        console.error(error);
    }
};

// Funkcija za brisanje porudzbine iz DB
const deleteOrder = async (id) => {
    try {
        Order.deleteOne({ _id: id })
            .then(() => {
                console.log("Uspesno brisanje ordera!");
            });
    } catch (error) {
        console.log("greska pri brisanju ordera iz DB!");
    }
};


module.exports = {
    add_car,
    add_brand,
    deleteCar,
    editCar,
    deleteOrder
};