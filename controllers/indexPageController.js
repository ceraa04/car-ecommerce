const Car = require("../models/Car");
const Brand = require("../models/Brand");

const carOfTheWeek = async () => {
    try {
        const carsSorted = await Car.find().sort({ price: -1 }).populate("brand");
        const popularCar = carsSorted[0];
        return popularCar;

    } catch (error) {
        console.log(error.message);
    }
};

const cars_imgSlider = async () => {
    try {
        let imgSliderCars;
        const countDocuments = await Car.countDocuments();
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