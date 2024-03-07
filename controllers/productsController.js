const Car = require("../models/Car");
const Brand = require("../models/Brand");
const dbItemsController = require("../controllers/getAllController");

// Function returns all of required items for products view
const productsPageRender = async () => {
    const maxP = await maxPrice();
    const allBrands = await dbItemsController.getAllBrands();
    try {
        return {
            // SelectedOptions are empty, because this function is on /products, where user has not applied any sort or filter methdo
            selectedOptionFilter: "",
            selectedOptionSort: "",
            checkboxesChecked: allBrands,
            minPrice: await minPrice(),
            maxPrice: maxP,
            countDocuments: await Car.countDocuments(),
            carBrandsAll: allBrands,
            price: maxP
        };
    }
    catch (error) {
        console.log(error.message);
    }
};

// Functions for calculating min and max prices
const maxPrice = async (filter = {}) => {
    try {
        // Using aggregation for boosting perfomance, getting maxPrice from it
        const result = await Car.aggregate([
            { $match: filter },
            { $group: { _id: null, maxPrice: { $max: "$price" } } }
        ]);

        if (result.length > 0) {
            return result[0].maxPrice;
        } else {
            return null; // No documents found
        }
    } catch (error) {
        console.error("Error occurred while finding max price:", error);
        throw error;
    }
};
// Min price works the same way as maxPric
const minPrice = async (filter = {}) => {
    try {

        const result = await Car.aggregate([
            { $match: filter },
            { $group: { _id: null, minPrice: { $min: "$price" } } }
        ]);

        if (result.length > 0) {
            return result[0].    // Posto je brand prvobitno string, pomocu splita ga pretvaramo u array
                minPrice;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error occurred while finding min price:", error);
        throw error;
    }
};

// Handling filter and sort methods
const filterAndSortCars = async (req, res, sort, brand, price) => {
    // Brand is recieved as []
    if (brand) {
        brand = brand.split(",");
    }
    let sortMethod;
    // Using switch for defining sortMethod
    switch (sort) {
        case "ascendingPrice":
            sortMethod = { price: 1 };
            break;
        case "descendingPrice":
            sortMethod = { price: 1 };
            break;
        case "descendingYear":
            sortMethod = { year: -1 };
            break;
        case "ascendingYear":
            sortMethod = { year: 1 };
            break;
    }

    let checkboxesBrands = []; // Array in which ids of brands will be packed
    // If brand is array, use Promise.all with mapping for finding specific brand
    if (Array.isArray(brand)) {
        await Promise.all(brand.map(async (checkbox) => {
            const brand = await Brand.findOne({ name: checkbox });
            checkboxesBrands.push(brand._id);
        }));
    }
    // If brand is string
    else if (brand) {
        const brandResult = await Brand.findOne({ name: brand });
        checkboxesBrands.push(brandResult._id);
    }

    // If some brands were found, use them as filter later on, otherwise, use empty array, which will give no documents back 
    if (checkboxesBrands.length === 0) {
        return {
            products: [],
            selectedOptionSort: sort,
            maxPrice: await maxPrice(),
            minPrice: await minPrice(),
            checkboxesChecked: brand,
            countDocuments: 0,
            carBrandsAll: await dbItemsController.getAllBrands(),
            price: price
        };
    }
    // Calculating min and max price
    const minPriceRender = await minPrice();
    const maxPriceRender = await maxPrice();

    let targetPrice;
    // if max and min are found, which means that some documents were find, calculate targetPrice
    if (minPriceRender && maxPriceRender) {
        targetPrice = minPriceRender + (price / 100) * (maxPriceRender - minPriceRender);
    } else {
        targetPrice = 0;
    }

    const products = await Car.find({ $and: [{ brand: { $in: checkboxesBrands } }, { price: { $lte: targetPrice } }] }).populate("brand").sort(sortMethod);
    try {
        const countDocuments = products.length;
        return {
            products: products,
            selectedOptionSort: sort,
            maxPrice: maxPriceRender,
            minPrice: minPriceRender,
            checkboxesChecked: brand,
            countDocuments: countDocuments,
            carBrandsAll: await dbItemsController.getAllBrands(),
            price: price
        };
    } catch (error) {
        console.error("Error while filtering and sorting cars:", error.message);
    }
};

// Controller for individual car pages
const singleCarPage = async (req, res, id) => {
    try {
        const car = await Car.findOne({ _id: id }).populate("brand");
        if (car) {
            return car;
        } else {
            res.render("errorPage");
        }

    } catch (error) {
        console.error(error);
    }
};


module.exports = {
    filterAndSortCars,
    singleCarPage,
    productsPageRender
};