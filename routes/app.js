const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const carController = require("../public/controllers/indexController");
const passport = require("./auth");
const session = require("express-session");
const flash = require("connect-flash");
const authRouter = require("./authRoutes");
const editCarsRouter = require("./editCarsRouter");
const productsRouter = require("./productsRouter");
const newCarRouter = require("./newCar");
const newBrandRouter = require("./newBrand");
const indexPageRouter = require("./indexPageRouter");

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

app.use(flash());
app.use(express.json());
app.use(session({
  secret: "randomString",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


app.use("/", indexPageRouter);
app.get("/contact", async (req, res) => {
  res.render("contact", {
    cars: await carController.getAllCars(),
    user: req.user
  });
});
app.get("/about", async (req, res) => {
  res.render("about", {
    cars: await carController.getAllCars(),
    user: req.user
  });
});

app.use("/products", productsRouter);

// Funkcije koje su samo za admina (update, delete, create)
// 1. Create funkcije
// Za novi auto

app.use("/newCar", newCarRouter);
// Za novi brend
app.use("/newBrand", newBrandRouter);

// Update i delete funkcije
app.use("/editCars", editCarsRouter);
// Autentikacija korisnika
app.use("/", authRouter);
module.exports = app;
