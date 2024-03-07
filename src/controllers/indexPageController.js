const Car = require("../models/Car");
// Brand is required because its needed for populating it's id 
const Brand = require("../models/Brand");

// Returning most expensive car as carOfTheWeek
const carOfTheWeek = async () => {
    try {
        const carsSorted = await Car.find().sort({ price: -1 }).populate("brand");
        const popularCar = carsSorted[0];
        return popularCar;

    } catch (error) {
        console.log(error.message);
    }
};

// Get cars for image slider
const cars_imgSlider = async () => {
    try {
        const countDocuments = await Car.countDocuments();
        let imgSliderCars;
        // If there are more than 4 documents in collection, we are limiting cars array to 4,
        // if not, limit is number of documents
        if (countDocuments < 4) {
            imgSliderCars = countDocuments;
        } else {
            imgSliderCars = 4;
        }
        const carsImgSlider = await Car.find().limit(imgSliderCars).populate("brand");
        return carsImgSlider;
    }
    catch (error) {
        console.log(error);
    }
};


module.exports = {
    carOfTheWeek,
    cars_imgSlider
};