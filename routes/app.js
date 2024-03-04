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
const newCarRouter = require("./newCar");
const newBrandRouter = require("./newBrand");
const indexPageRouter = require("./indexPageRouter");

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
  for (car of res.locals.cartItems) {
    res.locals.subtotal += car.price;
    res.locals.shipmentCost += car.price * 0.1;
    res.locals.salesTax += car.price * 0.065;
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


// Funkcije koje su samo za admina (update, delete, create)
// 1. Create funkcije

// Za novi auto
app.use("/newCar", newCarRouter);
// Za novi brend
app.use("/newBrand", newBrandRouter);


app.get("/cart", async (req, res) => {
  res.render("cart", {
    cars: await carController.getAllCars(),
  });
});

app.post("/cart", (req, res) => {
  const carId = req.body.carId;
  // Brisanje izabranog auta iz cartItemsa
  req.session.cartItems = req.session.cartItems.filter(item => item._id !== carId);
  res.redirect("/cart");
});
// Update i delete funkcije
app.use("/editCars", editCarsRouter);
// Autentikacija korisnika
app.use("/", authRouter);
app.get("*", async (req, res) => {
  res.render("errorPage", {
    cars: await carController.getAllCars()
  });
});

module.exports = app;
