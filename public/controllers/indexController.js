const Car = require("../../models/Car");
const Brand = require("../../models/Brand");
const Order = require("../../models/Order");
const User = require("../../models/User");
const carOfTheWeek = async () => {
    try {
        const carsSorted = await Car.find().sort({ price: -1 }).populate("brand");
        const popularCar = carsSorted[0];
        return popularCar;

    } catch (error) {
        console.log(error.message);
    }
};
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
// Renderovanje products stranice kada je url /products
const productsPageRender = async () => {
    const maxP = await maxPrice();
    const allBrands = await getAllBrands();
    try {
        // Pretvaram checkboxove iz niza objekata u niz stringova, koje posle koristim da cekiram sve brandove na /products url
        return {
            cars: await getAllCars(),
            // Select option za sortiranje kada se stranica tek ucitava, kad i dalje nije POST method vec GET
            selectedOptionFilter: "",
            selectedOptionSort: "",
            checkboxesChecked: allBrands,
            minPrice: await minPrice(),
            maxPrice: maxP,
            countDocuments: await Car.countDocuments(),
            // CarBrandAll koristim za ispisivanje checkboxova za filtriranje na products page
            carBrandsAll: allBrands,
            price: maxP
        };
    }
    catch (error) {
        console.log(error.message);
    }
};

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
    catch (error) { console.log("greska!"); }

};
// Renderovanje slidera na index stranici
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

// Izracunavanje najvece cene od svih automobila koji prodju filter iz argumenata, ako se ne ubaci nijedan argument, filter je prazan
const maxPrice = async (filter = {}) => {
    const cars = await Car.find(filter).sort({ price: -1 });
    if (cars.length > 0) {
        const biggestPrice = cars[0].price;
        return biggestPrice;
    }

};

// Izracunavanje najmanje cene od svih automobila koji prodju filter iz argumenata, ako se ne ubaci nijedan argument, filter je prazan
const minPrice = async (filter = {}) => {
    const cars = await Car.find(filter).sort({ price: 1 });
    if (cars.length > 0) {
        const smallestPrice = cars[0].price;
        return smallestPrice;
    }

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
        checkboxesObjectBrand = checkboxesBrandMethod;
    } else {
        checkboxesObjectBrand = {};
    }

    // Izracunavanje targetPrice za sortiranje, trebaju mi funkcije za min i max price
    const minPriceRender = await minPrice();
    const maxPriceRender = await maxPrice();

    let targetPrice;
    // Ako su pronadjeni max i min price, odnosno ako cars collection nije prazan
    if (minPriceRender && maxPriceRender) {
        targetPrice = minPriceRender + (price / 100) * (maxPriceRender - minPriceRender);
    } else {
        targetPrice = 0;
    }
    let cars;
    if (checkboxesObjectBrand.length > 0) {
        cars = await Car.find({ $and: [{ brand: { $in: checkboxesObjectBrand } }, { price: { $lte: targetPrice } }] }).populate("brand").sort(sortMethod);
    } else {
        cars = await Car.find({ price: { $lte: targetPrice } }).populate("brand").sort(sortMethod);
    }
    try {
        const countDocuments = cars.length;
        if (Object.keys(checkboxesObjectBrand).length === 0) {
            return {
                cars: [],
                selectedOptionSort: sort,
                maxPrice: await maxPrice(),
                minPrice: await minPrice(),
                checkboxesChecked: brand,
                countDocuments: 0,
                carBrandsAll: await getAllBrands(),
                price: price
            };
        }
        // Max i min price trebaju uvek da budu pocetni, a ne da se menjaju pri promeni filtera
        return {
            cars: cars,
            selectedOptionSort: sort,
            maxPrice: maxPriceRender,
            minPrice: minPriceRender,
            checkboxesChecked: brand,
            countDocuments: countDocuments,
            carBrandsAll: await getAllBrands(),
            price: price
        };
    } catch (error) {

        if (error.name === "CastError") {
            console.error("Invalid value for price:", error.message);
        } else {
            console.error("Error:", error.message);
        }
    }
};

// Renderovanje itemPage stranice
const singleCarPage = async (req, res, id) => {
    try {
        const itemCar = await Car.findOne({ _id: id }).populate("brand");
        return {
            car: itemCar,
            cars: await getAllCars()
        };
    } catch (error) {
        console.error(error);
    }
};

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
    cars_imgSlider,
    carOfTheWeek,
    singleCarPage,
    getAllCars,
    productsPageRender,
    getAllBrands,
    filterAndSortCars,
    add_car,
    add_brand,
    deleteCar,
    editCar,
    getAllOrders,
    deleteOrder
};