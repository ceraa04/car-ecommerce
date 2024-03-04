const express = require("express");
const app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "..", "public")));

const mongoose = require("mongoose");
require("dotenv").config();
const carController = require("../public/controllers/indexController");
const passport = require("./auth");
const session = require("express-session");
const flash = require("connect-flash");
// Routes
const authRouter = require("./authRoutes");
const editCarsRouter = require("./editCarsRouter");
const productsRouter = require("./productsRouter");
const newCarRouter = require("./newCarRouter");
const newBrandRouter = require("./newBrandRouter");
const indexPageRouter = require("./indexPageRouter");
const cartRouter = require("./cartRouter");
const myOrdersRouter = require("./myOrdersRouter");

app.set("view engine", "ejs");

const mongoDB = process.env.DB_CONNECTION_STRING;

mongoose.connect(mongoDB)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is live");
    });
  })
  .catch((err) => console.error(err));

app.use(flash());
app.use(express.json());
app.use(session({
  secret: "randomString",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
// Props koje se koriste u cart-u
app.use((req, res, next) => {
  res.locals.cartItems = req.session.cartItems || [];
  res.locals.subtotal = 0;
  res.locals.shipmentCost = 0;
  res.locals.salesTax = 0;
  res.locals.totalPrice = 0;
  for (car of res.locals.cartItems) {
    res.locals.subtotal += car.price;
    res.locals.shipmentCost += car.price * 0.1;
    res.locals.salesTax += car.price * 0.065;
    res.locals.totalPrice = res.locals.subtotal + res.locals.shipmentCost + res.locals.salesTax;
  }
  next();
});

app.use("/", indexPageRouter);
app.get("/contact", async (req, res) => {
  res.render("contact", {
    cars: await carController.getAllCars(),
  });
});
app.get("/about", async (req, res) => {
  res.render("about", {
    cars: await carController.getAllCars(),
  });
});

app.use("/products", productsRouter);
app.use("/cart", cartRouter);

// Funkcije koje su samo za admina (update, delete, create)
// 1. Create funkcije

// Za novi auto
app.use("/newCar", newCarRouter);
// Za novi brend
app.use("/newBrand", newBrandRouter);


// Update i delete funkcije
app.use("/editCars", editCarsRouter);

// Stranica za userove porudzbine
app.use("/myOrders", myOrdersRouter);

//Stranica za sve porudzbine, adminova
app.get("/allOrders", (req, res) => {
  res.render("allOrders",);
});

// Autentikacija korisnika
app.use("/", authRouter);
app.get("*", async (req, res) => {
  res.render("errorPage", {
    cars: await carController.getAllCars()
  });
});

module.exports = app;
