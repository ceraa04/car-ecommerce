const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const carController = require("../public/controllers/indexController");
const passport = require("../routes/auth");
const session = require("express-session");
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

app.use(express.json());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


app.get("/", async (req, res) => {
  const allCars = await carController.getAllCars();
  const imgSliderCars = [];
  for (let i = 0; i < 4; i++) {
    imgSliderCars.push(allCars[i]);
  }
  res.render("index", {
    imgSliderCars: imgSliderCars,
    cars: allCars,
    popularCar: await carController.carOfTheWeek(),
    user: req.user
  });
});
app.get("/contact", async (req, res) => {
  res.render("contact", {
    cars: await carController.getAllCars()
  });
});
app.get("/about", async (req, res) => {
  res.render("about", {
    cars: await carController.getAllCars()
  });
});

app.get("/products", async (req, res) => {
  const sort = req.query.sort;
  const brand = req.query.brand;
  const price = req.query.price;
  if (sort == undefined && brand == undefined && price == undefined) {
    await carController.productsPageRender(req, res);
  } else {
    await carController.filterAndSortCars(req, res, sort, brand, price);
  }
});

app.post("/products", (req, res) => {
  const sort = req.body.sortMethod;
  const brand = req.body.checkboxBrand;
  const price = req.body.rangePriceFilter;
  let redirectUrl = "/products";
  if (sort) {
    redirectUrl += `?sort=${sort}`;
  }
  if (brand && brand.length > 0) {
    redirectUrl += `&brand=${brand}`;
  }
  if (price) {
    redirectUrl += `&price=${price}`;
  }
  res.redirect(redirectUrl);
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  await carController.singleCarPage(req, res, id);
});



// Funkcije koje su samo za admina (update, delete, create)
// 1. Create funkcije

// Za novi auto
app.get("/newCar", async (req, res) => {
  res.render("newCar", {
    brands: await carController.getAllBrands(),
    cars: await carController.getAllCars()
  });
});
app.post("/newCar", async (req, res) => {
  const { model, price, year, description, brand } = req.body;
  await carController.add_car(req, res, model, price, year, description, brand);
  res.redirect("/newCar");
});

// Za novi brend
app.get("/newBrand", async (req, res) => {
  res.render("newBrand", {
    cars: await carController.getAllCars()
  });
});

app.post("/newBrand", async (req, res) => {
  const { brand, founded, description, urlNewBrand } = req.body;
  if (brand) {
    await carController.add_brand(req, res, brand, founded, description, urlNewBrand);
    res.redirect("/newBrand");
  } else {
    console.log("Neispravne vrednosti za add brand!");
  }
});


// Update i delete funkcije
app.get("/editCars", async (req, res) => {
  const cars = await carController.getAllCars();
  const brands = await carController.getAllBrands();
  res.render("editCars", {
    cars: cars,
    brands: brands
  });
});
app.post("/editCars", async (req, res) => {
  const carIdD = req.body.carIdDelete;

  const { carBrand, carModel, carYear, carPrice, carIdEdit, carDescription } = req.body;
  if (carIdD) {
    await carController.deleteCar(req, res, carIdD);
  }
  else if (carBrand) {
    await carController.editCar(carIdEdit, carModel, carBrand, carPrice, carYear, carDescription);
  }
  res.redirect("/editCars");
});
app.get("/signin", (req, res) => {
  res.render("signIn");
});
app.post("/signin", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signin"
}));
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}); module.exports = app;
