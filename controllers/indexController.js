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

const getAllCars = async (req, res) => {
    const countDocuments = await Car.countDocuments();
    try {
        const cars = await Car.find()
            .populate("brand");
        res.render("products", {
            cars: cars,
            // Select option za sortiranje kada se stranica tek ucitava, kad i dalje nije POST method vec GET
            selectedOptionFilter: "",
            selectedOptionSort: "",
            checkboxesChecked: ["Audi", "BMW"],
            minPrice: await minPrice(),
            maxPrice: await maxPrice(),
            countDocuments: countDocuments

        });
    }
    catch (error) {
        console.log(error.message);
    }
};

const add_car = (req, res) => {
    const newCar = new Car({
        model: "M5",
        price: 140000,
        category: "limo",
        brand: "65d89d530b4fff2c81525bc2",
        description: "The BMW M5 is an icon among enthusiasts, renowned for its fusion of track-ready performance and everyday usability. Its sleek exterior design hints at the power within, boasting aggressive lines, aerodynamic enhancements, and signature M badging. Under the hood lies a potent engine, typically a turbocharged inline-six, delivering exhilarating acceleration and a thrilling exhaust note. ",
        year: 2021
    });

    newCar.save()
        .then(savedCar => {
            console.log("New car with embedded brand information saved:", savedCar);
            res.redirect("/");
        })
        .catch(error => {
            console.error("Error saving car:", error);
        });

};
const cars_imgSlider = async (req, res) => {
    const popularCar = await carOfTheWeek();
    Car.find()
        .limit(4)
        .populate("brand")
        .then((result) => {
            res.render("index", {
                cars: result,
                popularCar: popularCar
            });
        })
        .catch((err) => console.error(err));

};

const maxPrice = async (filter = {}) => {
    const cars = await Car.find(filter).sort({ price: -1 });
    const biggestPrice = cars[0].price;
    return biggestPrice;
};
const minPrice = async (filter = {}) => {
    const cars = await Car.find(filter).sort({ price: 1 });
    const biggestPrice = cars[0].price;
    return biggestPrice;
};
const filterAndSortCars = async (req, res) => {
    const sortValue = req.body.sortMethod;
    const checkboxesBrand = req.body.checkboxBrand;

    let sortMethod;
    if (sortValue === "ascendingPrice") {
        sortMethod = { price: 1 };
    } else if (sortValue === "descendingPrice") {
        sortMethod = { price: -1 };
    } else if (sortValue === "descendingYear") {
        sortMethod = { year: -1 };
    } else if (sortValue === "ascendingYear") {
        sortMethod = { year: 1 };
    }

    let checkboxesBrandMethod = [];

    if (Array.isArray(checkboxesBrand)) {
        await Promise.all(checkboxesBrand.map(async (checkbox) => {
            const brand = await Brand.findOne({ name: checkbox });
            checkboxesBrandMethod.push(brand._id);
        }));
    }
    else if (checkboxesBrand) {
        const brand = await Brand.findOne({ name: checkboxesBrand });
        checkboxesBrandMethod.push(brand._id);
    }
    else {
        console.error("checkboxesBrand is not defined or is not an array");
    }

    let checkboxesObjectBrand;
    if (checkboxesBrandMethod.length > 0) {
        checkboxesObjectBrand = { brand: checkboxesBrandMethod };
    } else {
        checkboxesObjectBrand = {};
    }

    const countDocuments = await Car.countDocuments(checkboxesObjectBrand);

    Car.find(checkboxesObjectBrand)
        .populate("brand")
        .sort(sortMethod)
        .then(async (result) => {
            if (Object.keys(checkboxesObjectBrand).length === 0) {
                return res.render("products", {
                    cars: [],
                    selectedOptionSort: sortValue,
                    maxPrice: 0,
                    minPrice: 0,
                    checkboxesChecked: checkboxesBrand,
                    countDocuments: 0
                });
            }

            res.render("products", {
                cars: result,
                selectedOptionSort: sortValue,
                maxPrice: await maxPrice(checkboxesObjectBrand),
                minPrice: await minPrice(checkboxesObjectBrand),
                checkboxesChecked: checkboxesBrand,
                countDocuments: countDocuments
            });
        })
        .catch(err => {
            console.error(err);
        });
};

const singleCarPage = async (req, res, id) => {
    try {
        const car = await Car.findOne({ _id: id }).populate("brand");
        res.render("itemPage", { car: car });
    } catch (error) {
        console.error(error);
    }
};
module.exports = {
    cars_imgSlider,
    add_car,
    carOfTheWeek,
    singleCarPage,
    getAllCars,
    filterAndSortCars
};