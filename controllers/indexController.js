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

// Renderovanje products stranice kada je url /products
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find().populate("brand");
        res.render("products", {
            cars: cars,
            // Select option za sortiranje kada se stranica tek ucitava, kad i dalje nije POST method vec GET
            selectedOptionFilter: "",
            selectedOptionSort: "",
            checkboxesChecked: ["Audi", "BMW"],
            minPrice: await minPrice(),
            maxPrice: await maxPrice(),
            countDocuments: await Car.countDocuments(),
            // CarBrandAll koristim za ispisivanje checkboxova za filtriranje na products page
            carBrandsAll: await Brand.find({}, { name: 1, _id: 0 }),
            price: await maxPrice()
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

// Renderovanje slidera na index stranici
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

// Izracunavanje najvece cene od svih automobila koji prodju filter iz argumenata, ako se ne ubaci nijedan argument, filter je prazan
const maxPrice = async (filter = {}) => {
    const cars = await Car.find(filter).sort({ price: -1 });
    const biggestPrice = cars[0].price;
    return biggestPrice;
};

// Izracunavanje najmanje cene od svih automobila koji prodju filter iz argumenata, ako se ne ubaci nijedan argument, filter je prazan
const minPrice = async (filter = {}) => {
    const cars = await Car.find(filter).sort({ price: 1 });
    const biggestPrice = cars[0].price;
    return biggestPrice;
};

const filterAndSortCars = async (req, res, sort, brand, price) => {
    // Posto je brand prvobitno string, pomocu splita ga pretvaramo u array
    if (brand) {
        brand = brand.split(",");
    }
    let sortMethod;
    if (sort === "ascendingPrice") {
        sortMethod = { price: 1 };
    } else if (sort === "descendingPrice") {
        sortMethod = { price: -1 };
    } else if (sort === "descendingYear") {
        sortMethod = { year: -1 };
    } else if (sort === "ascendingYear") {
        sortMethod = { year: 1 };
    }
    // u ovaj niz cu pakovati ID-jeve checkboxova kada prodju findOne()
    let checkboxesBrandMethod = [];

    if (Array.isArray(brand)) {
        await Promise.all(brand.map(async (checkbox) => {
            const brand = await Brand.findOne({ name: checkbox });
            checkboxesBrandMethod.push(brand._id);
        }));
    }
    else if (brand) {
        const brandResult = await Brand.findOne({ name: brand });
        checkboxesBrandMethod.push(brandResult._id);
    }

    let checkboxesObjectBrand;
    if (checkboxesBrandMethod.length > 0) {
        checkboxesObjectBrand = { brand: checkboxesBrandMethod };
    } else {
        checkboxesObjectBrand = {};
    }

    // Izracunavanje targetPrice za sortiranje, trebaju mi funkcije za min i max price
    const minPriceRender = await minPrice();
    const maxPriceRender = await maxPrice();
    const targetPrice = minPriceRender + (price / 100) * (maxPriceRender - minPriceRender);

    Car.find({
        $and: [
            checkboxesObjectBrand,
            { price: { $lte: targetPrice } }
        ]
    })
        .populate("brand")
        .sort(sortMethod)
        .then(async (result) => {
            const countDocuments = result.length;
            if (Object.keys(checkboxesObjectBrand).length === 0) {
                return res.render("products", {
                    cars: [],
                    selectedOptionSort: sort,
                    maxPrice: 0,
                    minPrice: 0,
                    checkboxesChecked: brand,
                    countDocuments: 0,
                    carBrandsAll: await Brand.find({}, { name: 1, _id: 0 }),
                    price: 0
                });
            }
            // Max i min price trebaju uvek da budu pocetni, a ne da se menjaju pri promeni filtera
            res.render("products", {
                cars: result,
                selectedOptionSort: sort,
                maxPrice: maxPriceRender,
                minPrice: minPriceRender,
                checkboxesChecked: brand,
                countDocuments: countDocuments,
                carBrandsAll: await Brand.find({}, { name: 1, _id: 0 }),
                price: price
            });
        })
        .catch(err => {
            console.error(err);
        });
};

// Renderovanje itemPage stranice
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