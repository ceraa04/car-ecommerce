const Car = require("../models/Car");
const Brand = require("../models/Brand");
const dbItemsController = require("../controllers/getAllController");

// Renderovanje /products stranice
const productsPageRender = async () => {
    const maxP = await maxPrice();
    const allBrands = await dbItemsController.getAllBrands();
    try {
        // Pretvaram checkboxove iz niza objekata u niz stringova, koje posle koristim da cekiram sve brandove na /products url
        return {
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
// Izracunavanje najmanje i najvece cene od svih automobila koji prodju filter iz argumenata, 
// ako se ne ubaci nijedan argument, filter je prazan

const maxPrice = async (filter = {}) => {
    const cars = await Car.find(filter).sort({ price: -1 });
    if (cars.length > 0) {
        const biggestPrice = cars[0].price;
        return biggestPrice;
    }

};

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
    // u ovaj niz cu pakovati ID-jeve checkboxova kada prodju mapiranje 
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
    let products;
    if (checkboxesObjectBrand.length > 0) {
        products = await Car.find({ $and: [{ brand: { $in: checkboxesObjectBrand } }, { price: { $lte: targetPrice } }] }).populate("brand").sort(sortMethod);
    } else {
        products = await Car.find({ price: { $lte: targetPrice } }).populate("brand").sort(sortMethod);
    }
    try {
        const countDocuments = products.length;
        if (Object.keys(checkboxesObjectBrand).length === 0) {
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
        // Max i min price trebaju uvek da budu pocetni, a ne da se menjaju pri promeni filtera
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