const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const carController = require("../controllers/indexController");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "..", "public")));

const mongoDB = "mongodb+srv://admin:adminHead@cluster0.ukavakh.mongodb.net/carShop?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoDB)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is live");
    });
  })
  .catch((err) => console.error(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/new", carController.add_car);
app.get("/", carController.cars_imgSlider, carController.carOfTheWeek);

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/products", (req, res) => {
  const sort = req.query.sort;
  const brand = req.query.brand;
  const price = req.query.price;
  if (sort == undefined && brand == undefined) {
    carController.getAllCars(req, res);
  } else {
    carController.filterAndSortCars(req, res, sort, brand, price);
  }
});

app.post("/products", (req, res) => {
  const sort = req.body.sortMethod;
  const brand = req.body.checkboxBrand;
  const price = parseInt(req.body.rangePriceFilter);
  console.log("Price u postu je " + price);
  let redirectUrl = "/products";
  if (sort) {
    redirectUrl += `?sort=${sort}`;
  }
  if (brand && brand.length > 0) {
    redirectUrl += `&brand=${brand}`;
  }
  if (price != 50) {
    redirectUrl += `&price=${price}`;
  }
  res.redirect(redirectUrl);
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  await carController.singleCarPage(req, res, id);
});

module.exports = app;
