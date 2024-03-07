const express = require("express");
const app = express();

const path = require("path");
// Defining static folder using express.static(); CSS,JS,images
app.use(express.static(path.join(__dirname, "..", "public")));

const mongoose = require("mongoose");
// Dotenv is for secret keys, i am using it for storing mongoose key to DB
require("dotenv").config();
// Requiring passport and packages for it
const passport = require("./controllers/authController");
const session = require("express-session");
const flash = require("connect-flash");

// Controllers
const dbItemsController = require("./controllers/getAllController");

// Routes
const authRouter = require("./routes/authRoutes");
const editCarsRouter = require("./routes/editCarsRouter");
const productsRouter = require("./routes/productsRouter");
const newCarRouter = require("./routes/newCarRouter");
const newBrandRouter = require("./routes/newBrandRouter");
const indexPageRouter = require("./routes/indexPageRouter");
const cartRouter = require("./routes/cartRouter");
const myOrdersRouter = require("./routes/myOrdersRouter");
const allOrdersRouter = require("./routes/allOrdersRouter");

// Seting view engine to ejs
app.set("view engine", "ejs");

// Getting mongoDB key from .env file
const mongoDB = process.env.DB_CONNECTION_STRING;

// Connecting to mongo db and then booting up a server at port 3000
mongoose.connect(mongoDB)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is live");
    });
  })
  .catch((err) => console.error(err));

// Middlewares 
app.use(flash());
app.use(express.json());
app.use(session({
  secret: "randomString",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
// Middleware for items that can be used in every view and route
app.use(async (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.cartItems = req.session.cartItems || [];
  res.locals.cars = await dbItemsController.getAllCars();
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

// *** Middlewares for handling routes

// Index page route
app.use("/", indexPageRouter);

// Contact page route
app.get("/contact", async (req, res) => {
  res.render("contact");
});

// About page route
app.get("/about", async (req, res) => {
  res.render("about");
});

//Products page route
app.use("/products", productsRouter);

// Cart page route
app.use("/cart", cartRouter);

// User's orders page
app.use("/myOrders", myOrdersRouter);

// *** Admin functions (CRUD)

// Adding documents to DB

// Adding new car to DB
app.use("/newCar", newCarRouter);
// Adding new brand to DB
app.use("/newBrand", newBrandRouter);

// PUT & DELETE route
app.use("/editCars", editCarsRouter);

// All orders page, where admin can see and handle orders from all users
app.use("/allOrders", allOrdersRouter);

// Authentication route
app.use("/", authRouter);

// Error page, if neither route is recognized, it means that it does not exist and 
// user is automaticaly redirected to error page
app.get("*", async (req, res) => {
  res.render("errorPage");
});

module.exports = app;
